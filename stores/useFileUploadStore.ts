import { ExpiryDuration } from "~/types/expiry-duration"

export const useFileUploadsStore = defineStore('file-uploads', () => {
    const CHUNK_SIZE_IN_MB = 5
    const uploadJobs = reactive<UploadJob[]>([])
    const progressMap = ref<Record<string, number> | null>(null)
    const statusMap = ref<Record<string, JobStatus>>()

    const { computeHash } = useHashWorker()
    const { getJobByHash, saveJob, initChunkMap } = useIndexedDBStore()
    const { runUploadJob } = useUploadJobRunner()
    const toast = useToast()

    const initializeJob = (file: File): UploadJob => reactive({
        fileEntry: {
            fileName: file.name,
            fileSize: file.size,
            fileExtension: file.name.split('.').pop()?.toLowerCase() || '',
            lastModified: file.lastModified,
        },
        status: 'queued',
        progress: 0
    })


    const startUpload = async (file: File) => {
        if (!file) return

        console.log('Starting upload:', file.name)

        const job = initializeJob(file)
        uploadJobs.push(job)

        const { hash } = await computeHash(file)
        console.log('Hash generated:', hash)

        job.fileEntry.fileHash = hash
        job.status = 'hashing'

        const existingJob = await getJobByHash(hash)

        if (!existingJob) {
            const response = await createFileEntry(job)

            prepareUploadJob(job, response)
            
            await saveJob(job)
        } else {
            job.fileEntry.id = existingJob.fileEntry.id
            job.fileEntry.chunkMap = existingJob.fileEntry.chunkMap
            job.fileEntry.totalChunks = existingJob.fileEntry.totalChunks
            job.status = existingJob.status
            job.progress = existingJob.progress
        }

        runUploadJob(job, file)
    }

    const createFileEntry = async (job: UploadJob) => {
        const totalChunks = Math.ceil(job.fileEntry.fileSize! / (CHUNK_SIZE_IN_MB * 1024 * 1024))

        const fileEntry: FileEntry = {
            ...job.fileEntry,
            totalChunks,
            expiresIn: ExpiryDuration.OneMinute
        }

        try {
            const response = await $fetch<CreateFileEntryResponse>('http://localhost:5028/file-entry/create', {
                method: 'POST',
                body: fileEntry
            })

            console.log('File entry created:', response)

            return response
        } catch (error: any) {
            const responseData = error.response?._data

            if (responseData?.errors) {
                Object.keys(responseData.errors).forEach(key => {
                    const errorMessage = responseData.errors[key]

                    if (errorMessage?.[0]) {
                        toast.add({
                            title: 'Error',
                            description: errorMessage[0],
                            color: 'error'
                        })
                    }
                })
            } else {
                toast.add({
                    title: 'Error',
                    description: error.message || 'Unknown error occurred',
                    color: 'error'
                })
            }
            throw error
        }
    }

    const prepareUploadJob = (job: UploadJob, response: CreateFileEntryResponse) => {
        job.fileEntry.id = response.id
        job.fileEntry.totalChunks = response.totalChunks
        job.fileEntry.chunkMap = initChunkMap(response.totalChunks)
        job.status = 'uploading'
        job.progress = 0

        if (response.uploadedChunks) {
            response.uploadedChunks.forEach(idx => {
                if (job.fileEntry.chunkMap && job.fileEntry.chunkMap[idx]) {
                    job.fileEntry.chunkMap[idx].status = 'success'
                }
            })
        }
    }

    return {
        uploadJobs,
        progressMap,
        statusMap,
        startUpload
    }
})
