export {}

declare global {
    type FileEntryStatus = "pending" | "completed" | "failed"
    type FileUploadStatus = 'queued' | 'hashing' | 'uploading' | 'finalizing' | 'done' | 'failed'

    interface FileEntry {
        id: string
        fileName: string
        fileExtension: string
        status: FileEntryStatus,
        fileSize?: number,
        fileUrl?: string,
    }

    interface UploadJob {
        id: string
        fileName: string
        fileSize: string
        raw: File
        fileExtension: string
        hash: string
        totalChunks: number
        uploadedChunks: number[]
        status: FileUploadStatus
        progress: number
        error?: string
    }
}