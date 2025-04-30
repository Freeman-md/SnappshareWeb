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
        const hash = job.fileEntry.fileHash?.trim()

        if (!hash) return false

        await set(hash, toPersistedJob(job))

        return true
    }

    const updateJobStatus = async (hash: string, status: JobStatus) => {
        const job = await getJobByHash(hash)

        if (job) {
            job.status = status
            await set(hash, job)
        }
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

    async function getChunkIndexesByStatus(
        hash: string,
        status: ChunkStatus
    ): Promise<number[]> {
        const job = await getJobByHash(hash)
        if (!job) throw new Error(`No job for hash ${hash}`)

        return Object
            .values(job.fileEntry.chunkMap ?? {})
            .filter(c => c.status === status)
            .map(c => c.index)
    }

    const getUploadedChunkIndexes = (hash: string) => getChunkIndexesByStatus(hash, "success")
    const getPendingChunkIndexes = (hash: string) => getChunkIndexesByStatus(hash, "pending")

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