import { finalizeUpload } from "~/services/uploadApi"

export const useUploadJobRunner = () => {
    const { uploadChunkItem } = useChunkUploader()
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
                const res = await uploadChunkItem(job, index, chunkBlob)

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

    const finalizeUploadJob = async (job: UploadJob) => {
        try {
            const response = await finalizeUpload(job.fileEntry.id!)

            if (response.status.toLowerCase() == 'complete') {
                job.status = 'done'
                job.fileEntry.fileUrl = response.fileUrl!
                await saveJob(job)

                console.log(`✅ Upload finalized for ${job.fileEntry.fileName}. File URL: ${job.fileEntry.fileUrl}`)
            }
        } catch (error: any) {
            job.status = 'failed'
            await saveJob(job)

            console.error(`❌ Failed to finalize upload for ${job.fileEntry.fileName}`, error)
        }
    }

    const runUploadJob = async (job: UploadJob, file: File) => {
        const pending = getPendingChunks(job)
        while (pending.length > 0) {
            const nextBatch = pending.splice(0, 3)
            await uploadChunkBatch(job, file, nextBatch)
        }

        console.log('✅ Chunks Upload complete for:', job.fileEntry.fileName)

        job.status = 'finalizing'

        finalizeUploadJob(job)
    }

    return {
        runUploadJob
    }
}
