export const useFileUploadsStore = defineStore('file-uploads', () => {
    const fileEntries = reactive<UploadJob[]>([])
    const progressMap = ref<Record<string, number> | null>(null)
    const statusMap = ref<Record<string, FileUploadStatus>>()

    const createFileEntry = (file: File): UploadJob => ({
        id: '',
        fileName: file.name,
        fileSize: file.size,
        raw: file,
        fileExtension: file.name.split('.').pop()?.toLowerCase() || '',
        status: 'queued',
        progress: 0
    })

    const startUpload = (file: File) => {
        if (!file) return

        const fileEntry = createFileEntry(file)
        fileEntries.push(fileEntry)

        console.log('Starting upload: ', file.name)
    }

    return {
        fileEntries,
        progressMap,
        statusMap,
        startUpload
    }
})