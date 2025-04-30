import { defineStore } from 'pinia'
import { createFileEntry } from '~/services/uploadApi'
import { useHashWorker } from '~/composables/useHashWorker'
import { useIndexedDBStore } from '~/composables/useIndexedDBStore'
import { useUploadJobRunner } from '~/composables/useUploadJobRunner'
import { ExpiryDuration } from '~/types/expiry-duration'

export const useFileUploadsStore = defineStore('file-uploads', () => {
    const CHUNK_SIZE = 5 * 1024 * 1024 // 5 MB
    const uploadJobs = reactive<UploadJob[]>([])

    const { computeHash } = useHashWorker()
    const { getJobByHash, saveJob, initChunkMap } = useIndexedDBStore()
    const { runUploadJob } = useUploadJobRunner()
    const toast = useToast()


    const createUploadJob = (file: File): UploadJob => reactive({
        fileEntry: {
            fileName: file.name,
            fileSize: file.size,
            fileExtension: file.name.split('.').pop()?.toLowerCase() || '',
            lastModified: file.lastModified,
        },
        status: 'queued',
        progress: 0,
    })

    const buildFileEntryDto = (job: UploadJob): CreateFileEntryDto => {
        const totalChunks = Math.ceil((job.fileEntry.fileSize ?? 0) / CHUNK_SIZE)
        job.fileEntry.totalChunks = totalChunks

        return {
            fileName: job.fileEntry.fileName!,
            fileHash: job.fileEntry.fileHash!,
            fileSize: job.fileEntry.fileSize!,
            totalChunks,
            expiresIn: ExpiryDuration.OneMinute,
        }
    }

    const integrateCreateFileEntryResponse = (job: UploadJob, res: CreateFileEntryResponse) => {
        job.fileEntry.id = res.id
        job.fileEntry.totalChunks = res.totalChunks
        job.fileEntry.chunkMap = initChunkMap(res.totalChunks)
        job.status = 'uploading'
        job.progress = 0

        if (typeof res.uploadedChunks == 'object') {
            res.uploadedChunks?.forEach(idx => {
                job.fileEntry.chunkMap![idx].status = 'success'
            })
        }
    }

    const notifyFileEntryError = (err: unknown) => {
        const responseData = (err as any)?.response?._data

        if (responseData?.errors) {
            const messages = Object.values(responseData.errors).flat()
            for (const message of messages) {
                toast.add({
                    title: 'Upload Error',
                    description: message as string,
                    color: 'error',
                })
            }
        } else {
            toast.add({
                title: 'Upload Error',
                description: (err as Error)?.message ?? 'Unknown error occurred',
                color: 'error',
            })
        }
    }

    // ——— Action: Start Upload ———

    const startUpload = async (file: File) => {
        if (!file) return

        const job = createUploadJob(file)
        uploadJobs.push(job)

        job.status = 'hashing'
        const { hash } = await computeHash(file)
        job.fileEntry.fileHash = hash

        const existingJob = await getJobByHash(hash)

        if (existingJob) {
            Object.assign(job.fileEntry, {
                id: existingJob.fileEntry.id,
                chunkMap: existingJob.fileEntry.chunkMap,
                totalChunks: existingJob.fileEntry.totalChunks,
            })

            job.status = existingJob.status
            job.progress = existingJob.progress
        } else {
            try {
                const dto = buildFileEntryDto(job)

                const response = await createFileEntry(dto)

                integrateCreateFileEntryResponse(job, response)

                await saveJob(job)
            } catch (err) {
                notifyFileEntryError(err)
                return
            }
        }

        runUploadJob(job, file)
    }

    return {
        uploadJobs,
        startUpload,
    }
})
