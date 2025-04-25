export const useFileUploadsStore = defineStore('file-uploads', () => {
    const fileEntries = reactive<UploadJob[]>([])
    const progressMap = ref<Record<string, number> | null>(null)
    const statusMap = ref<Record<string, FileUploadStatus>>()

    const { computeHash } = useUploadWorker()

    const createFileEntry = (file: File): UploadJob => ({
        id: '',
        fileName: file.name,
        fileSize: file.size,
        raw: file,
        fileExtension: file.name.split('.').pop()?.toLowerCase() || '',
        status: 'queued',
        progress: 0
    })

    const startUpload = async (file: File) => {
        if (!file) return

        console.log('Starting upload: ', file.name)

        const fileEntry = createFileEntry(file)
        fileEntries.push(fileEntry)

        const { hash } = await computeHash(file)
        console.log('Hash generated:', hash)
    }

    return {
        fileEntries,
        progressMap,
        statusMap,
        startUpload
    }
})