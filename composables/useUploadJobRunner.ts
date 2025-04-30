import { finalizeUpload as apiFinalizeUpload, uploadChunk as apiUploadChunk } from '~/services/uploadApi'

export const useUploadJobRunner = () => {
  const CHUNK_SIZE = 5 * 1024 * 1024 // 5 MB
  const { computeHash } = useHashWorker()
  const { saveJob } = useIndexedDBStore()

  /** Slice out a single chunk by index */
  const sliceChunk = (file: File, index: number): Blob => {
    const start = index * CHUNK_SIZE
    const end   = Math.min(file.size, start + CHUNK_SIZE)
    return file.slice(start, end)
  }

  /** Pending chunk indexes from the job’s chunkMap */
  const getPendingIndexes = (job: UploadJob): number[] =>
    Object.values(job.fileEntry.chunkMap ?? {})
      .filter(c => c.status === 'pending')
      .map(c => c.index)

  /** How much percent each chunk contributes */
  const perChunkProgress = (job: UploadJob): number =>
    Math.ceil(100 / (job.fileEntry.totalChunks! || 1))

  /**
   * Upload one chunk, retry up to 3 times, update status+progress, persist each change.
   */
  const uploadWithRetry = async (job: UploadJob, file: File, index: number) => {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        // 1. slice, 2. hash, 3. API call
        const blob = sliceChunk(file, index)

        const { hash: chunkHash } = await computeHash(
          new File([blob], `${job.fileEntry.fileName}.part${index}`)
        )

        const res = await apiUploadChunk({
          fileId:       job.fileEntry.id!,
          fileName:     job.fileEntry.fileName!,
          fileHash:     job.fileEntry.fileHash!,
          chunkIndex:   index,
          totalChunks:  job.fileEntry.totalChunks!,
          chunkFile:    blob,
          chunkHash,
        })

        if (['success','skipped'].includes(res.status.toLowerCase())) {
          job.fileEntry.chunkMap![index].status = 'success'
          job.progress += perChunkProgress(job)
          await saveJob(job)
          return
        }
      } catch (err) {
        console.warn(`Retry ${attempt} failed for chunk ${index}:`, err)
      }
    }

    // all retries exhausted
    job.fileEntry.chunkMap![index].status = 'failed'
    await saveJob(job)
  }

  /**
   * Fire chunk uploads in batches of up to `batchSize` parallel tasks.
   */
  const uploadInBatches = async (job: UploadJob, file: File, batchSize = 3) => {
    const pending = getPendingIndexes(job)

    for (let i = 0; i < pending.length; i += batchSize) {
      const batch = pending.slice(i, i + batchSize)
      
      await Promise.all(batch.map(idx => uploadWithRetry(job, file, idx)))
    }
  }

  /**
   * Once chunks done, call finalize and persist the final URL or error.
   */
  const finalizeJob = async (job: UploadJob) => {
    try {
      const resp = await apiFinalizeUpload(job.fileEntry.id!)

      if (resp.status.toLowerCase() === 'complete') {
        job.status = 'done'
        job.fileEntry.fileUrl = resp.fileUrl!
        await saveJob(job)

        console.log(`✅ Finalized: ${job.fileEntry.fileName}`)
      } else {
        throw new Error(`Finalize returned ${resp.status}`)
      }
    } catch (err) {
      job.status = 'failed'
      await saveJob(job)

      console.error(`❌ Finalize failed for ${job.fileEntry.fileName}`, err)
    }
  }

  /**
   * Orchestrator: batch‐upload → finalize.
   */
  const runUploadJob = async (job: UploadJob, file: File) => {
    job.status = 'uploading'
    await saveJob(job)

    if (getPendingIndexes(job).length > 0) {
      await uploadInBatches(job, file)
      console.log('✅ All chunks uploaded for', job.fileEntry.fileName)
    }

    job.status = 'finalizing'
    await saveJob(job)

    await finalizeJob(job)
  }

  return { runUploadJob }
}
