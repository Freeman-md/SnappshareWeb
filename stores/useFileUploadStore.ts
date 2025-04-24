export const useFileUploadsStore = defineStore('file-uploads', () => {
    const fileEntries = ref<UploadJob[]>([])
    const progressMap = ref<Record<string, number> | null>(null)
    const statusMap = ref<Record<string, FileUploadStatus>>()

    const startUpload = (file: File) => {
        if (!file) return

        console.log('Starting upload: ', file.name)
    }

    return {
        fileEntries,
        progressMap,
        statusMap,
        startUpload
    }
})