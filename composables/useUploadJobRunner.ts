export const useUploadJobRunner = () => {
    const { uploadChunk } = useChunkUploader()
    const { saveJob } = useIndexedDBStore()
    const CHUNK_SIZE = 5 * 1024 * 1024

    const sliceChunk = (file: File, index: number) => {
        const start = index * CHUNK_SIZE
        const end = Math.min(file.size, start + CHUNK_SIZE)
        return file.slice(start, end)
    }

    const getPendingChunks = (job: UploadJob) =>
        Object.values(job.fileEntry.chunkMap ?? {})
            .filter(chunk => chunk.status === 'pending')
            .map(chunk => chunk.index)

    const getChunkProgress = (job: UploadJob) =>
        Math.ceil(100 / Object.keys(job.fileEntry.chunkMap ?? {}).length)

    const uploadWithRetry = async (job: UploadJob, file: File, index: number) => {
        const progressPerChunk = getChunkProgress(job)

        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                const chunkBlob = sliceChunk(file, index)
                const res = await uploadChunk(job, index, chunkBlob)

                if (['success', 'skipped'].includes(res.status.toLowerCase())) {
                    job.fileEntry.chunkMap![index].status = 'success'
                    job.progress += progressPerChunk
                    await saveJob(job)
                    return
                }
            } catch {
                console.warn(`[Retry Attempt ${attempt}] Chunk ${index} failed for ${job.fileEntry.fileName}`)
            }
        }

        job.fileEntry.chunkMap![index].status = 'failed'
        await saveJob(job)
    }

    const uploadChunkBatch = async (job: UploadJob, file: File, chunkIndexes: number[]) => {
        await Promise.allSettled(
            chunkIndexes.map(index => uploadWithRetry(job, file, index))
        )
    }

    const runUploadJob = async (job: UploadJob, file: File) => {
        const pending = getPendingChunks(job)
        while (pending.length > 0) {
            const nextBatch = pending.splice(0, 3)
            await uploadChunkBatch(job, file, nextBatch)
        }

        console.log('✅ Chunks Upload complete for:', job.fileEntry.fileName)
    }

    return {
        runUploadJob
    }
}
