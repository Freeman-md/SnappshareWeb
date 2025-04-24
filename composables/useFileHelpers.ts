export const useFileHelpers = () => {
    const file = ref<{ raw: File; previewUrl: string } | null>(null)
    const store = useFileUploadsStore()

    const handleFileChange = (selected: File) => {
        file.value = {
            raw: selected,
            previewUrl: URL.createObjectURL(selected),
        }
    }

    const removeFile = () => {
        if (file.value?.previewUrl) URL.revokeObjectURL(file.value.previewUrl)
        file.value = null
    }

    const startFileUpload = () => {
        if (file.value?.raw) {
            store.startUpload(file.value.raw)

            file.value = null
        }
    }

    const getFileIcon = (mime: string) => {
        if (mime.includes('pdf')) return 'mdi:file-pdf-box'
        if (mime.includes('word') || mime.includes('doc')) return 'mdi:file-word-box'
        if (mime.includes('zip') || mime.includes('rar')) return 'mdi:archive'
        if (mime.includes('excel') || mime.includes('spreadsheet')) return 'mdi:file-excel-box'
        return 'lucide:file'
    }

    return {
        file,
        handleFileChange,
        removeFile,
        startFileUpload,
        getFileIcon
    }
}