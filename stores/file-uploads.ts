import { createFileEntry, getFileEntryById } from "~/services/uploadApi"
import { ExpiryDuration } from "~/types/expiry-duration"

export const useFileUploadsStore = defineStore('file-uploads', () => {
    const CHUNK_SIZE = 5 * 1024 * 1024 // 5 MB
    const uploadJobs = reactive<UploadJob[]>([])

    const { computeHash } = useHashWorker()
    const { getJobByHash, getAllJobs, saveJob, initChunkMap, deleteJob } = useIndexedDB()
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
            expiresIn: ExpiryDuration.OneDay,
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
        const responseData = (err as { response?: { _data?: { errors?: Record<string, string[]> } } })?.response?._data

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
      
        const { hash } = await computeHash(file)
      
        let job = uploadJobs.find(j => j.fileEntry.fileHash === hash)
      
        if (job) {
          toast.add({
            description: `📦 Reusing existing job for hash ${hash}`,
            color: 'info',
          })
        } else {
          job = createUploadJob(file)
          job.fileEntry.fileHash = hash
          job.status = 'hashing'
          uploadJobs.unshift(job)
        }
      
        const existingJob = await getJobByHash(hash)
      
        if (existingJob) {
          try {
            const remoteFile = await getFileEntryById(existingJob.fileEntry.id!)
      
            const now = new Date()
            const expiresAt = new Date(remoteFile.expiresAt ?? 0)
      
            const hasExpired = expiresAt.getTime() < now.getTime()
            const isComplete = remoteFile.status?.toLowerCase() === 'complete'
      
            if (hasExpired && isComplete) {
              await deleteJob(hash)
      
              // Restart fresh
              const dto = buildFileEntryDto(job)
              const response = await createFileEntry(dto)
      
              integrateCreateFileEntryResponse(job, response)
              await saveJob(job)
            }
          } catch (err) {
            notifyFileEntryError(err)
            return
          }
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
      

    const loadPersistedJobs = async () => {
        const all = await getAllJobs()

        const statusOrder: Record<JobStatus, number> = {
            queued: 0,
            hashing: 1,
            uploading: 2,
            finalizing: 3,
            failed: 4,
            done: 5 // done always last
        }

        const sortedJobs = all
            .map(([_, job]) => job)
            .sort((a, b) => {
                const statusDiff = statusOrder[a.status] - statusOrder[b.status]
                if (statusDiff !== 0) return statusDiff
                return a.progress - b.progress // sort by progress if same status
            })

        sortedJobs.forEach(job => {
            uploadJobs.push(reactive(job))
        })

        toast.add({
            title: 'Restored Jobs',
            description: `🔁 Restored ${sortedJobs.length} persisted jobs`,
            color: 'success'
        })
    }

    return {
        uploadJobs,
        startUpload,
        loadPersistedJobs
    }
})
