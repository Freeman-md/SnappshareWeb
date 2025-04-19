export {}

declare global {
    type FileEntryStatus = "pending" | "completed" | "failed"

    interface FileEntry {
        id: string
        fileName: string
        fileExtension: string
        status: FileEntryStatus,
        fileSize?: number,
        fileUrl?: string,
    }
}