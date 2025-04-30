import { del, entries, get, set } from 'idb-keyval'

export const useIndexedDBStore = () => {
    const toPersistedJob = (job: UploadJob): UploadJob => {
        const plainJob: UploadJob = JSON.parse(JSON.stringify(job))

        return plainJob
      }

      
    const getJobByHash = async (hash: string): Promise<UploadJob | null> => {
        const job = await get(hash) as UploadJob

        return job ?? null
    }

    const saveJob = async (job: UploadJob) => {
        if (job?.fileEntry.fileHash == null || job.fileEntry.fileHash.trim() === "") return

        await set(job.fileEntry.fileHash, toPersistedJob(job))

        console.log(`Job with hash ${job.fileEntry.fileHash} set`)
    }

    const updateJobStatus = async (hash: string, status: FileUploadStatus) => {
        const job = await getJobByHash(hash)
        if (!job) return

        job.status = status
        await set(hash, job)
    }


    const markChunkStatus = async (hash: string, chunkIndex: number, status: ChunkStatus) => {
        const job = await getJobByHash(hash)
        if (!job || !job.fileEntry.chunkMap) return

        const chunk = job.fileEntry.chunkMap[chunkIndex]
        if (!chunk) return

        chunk.status = status
        chunk.lastTriedAt = Date.now()

        await set(hash, job)
    }

    const getUploadedChunkIndexes = async (hash: string): Promise<number[]> => {
        const job = await getJobByHash(hash)
        if (!job) throw Error("Job does not exist")

        const uploadedChunkIndexes = job.fileEntry.chunkMap
            ? Object.values(job.fileEntry.chunkMap).filter(chunk => chunk.status === 'success').map(chunk => chunk.index)
            : []

        return uploadedChunkIndexes
    }

    const getPendingChunkIndexes = async (hash: string): Promise<number[]> => {
        const job = await getJobByHash(hash)
        if (!job) throw Error("Job does not exist")

        const pendingChunks = job.fileEntry.chunkMap
            ? Object.values(job.fileEntry.chunkMap).filter(chunk => chunk.status === 'pending').map(chunk => chunk.index)
            : []

        return pendingChunks
    }

    const initChunkMap = (totalChunks: number): Record<number, ChunkMeta> => {
        const map: Record<number, ChunkMeta> = {}
        for (let i = 0; i < totalChunks; i++) {
            map[i] = { index: i, status: 'pending' }
        }
        return map
    }


    const deleteJob = async (hash: string) => {
        await del(hash)
    }

    const getAllJobs = async (): Promise<[string, UploadJob][]> => {
        return await entries()
    }

    return {
        getJobByHash,
        saveJob,
        updateJobStatus,
        markChunkStatus,
        getUploadedChunkIndexes,
        getPendingChunkIndexes,
        initChunkMap,
        deleteJob,
        getAllJobs,
    }
}