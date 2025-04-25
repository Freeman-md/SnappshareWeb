import { del, entries, get, set } from 'idb-keyval'

export const useIndexedDBStore = () => {
    const toPersistedJob = (job: UploadJob): Omit<UploadJob, 'raw'> => {
        const { raw, ...safeJob } = job
        return safeJob
    }


    const getJobByHash = async (hash: string): Promise<UploadJob | null> => {
        const job = await get(hash) as UploadJob

        return job ?? null
    }

    const saveJob = async (job: UploadJob) => {
        if (job?.hash == null || job.hash.trim() === "") return

        const safeJob = toPersistedJob(job)
        await set(job.hash, safeJob)

        console.log(`Job with hash ${job.hash} set`)
    }

    const updateJobStatus = async (hash: string, status: FileUploadStatus) => {
        const job = await getJobByHash(hash)
        if (!job) return

        job.status = status
        await set(hash, toPersistedJob(job))
    }


    const markChunkStatus = async (hash: string, chunkIndex: number, status: ChunkStatus) => {
        const job = await getJobByHash(hash)
        if (!job || !job.chunkMap) return

        const chunk = job.chunkMap[chunkIndex]
        if (!chunk) return

        chunk.status = status
        chunk.lastTriedAt = Date.now()

        await set(hash, toPersistedJob(job))
    }

    const getUploadedChunkIndexes = async (hash: string): Promise<number[]> => {
        const job = await getJobByHash(hash)
        if (!job) throw Error("Job does not exist")

        const uploadedChunkIndexes = job.chunkMap
            ? Object.values(job.chunkMap).filter(chunk => chunk.status === 'success').map(chunk => chunk.index)
            : []

        return uploadedChunkIndexes
    }

    const getPendingChunkIndexes = async (hash: string): Promise<number[]> => {
        const job = await getJobByHash(hash)
        if (!job) throw Error("Job does not exist")

        const pendingChunks = job.chunkMap
            ? Object.values(job.chunkMap).filter(chunk => chunk.status === 'pending').map(chunk => chunk.index)
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