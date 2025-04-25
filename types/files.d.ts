export {}

declare global {
    type FileEntryStatus = "pending" | "completed" | "failed"
    type FileUploadStatus = 'queued' | 'hashing' | 'uploading' | 'finalizing' | 'done' | 'failed'
    type ChunkStatus = 'pending' | 'success' | 'failed'


    interface FileEntry {
        id: string
        fileName: string
        fileExtension: string
        status: FileEntryStatus,
        fileSize?: number,
        fileUrl?: string,
    }

    interface ChunkMeta {
        index: number
        status: ChunkStatus
        lastTriedAt?: number
        error?: string
      }

    interface UploadJob {
        id?: string
        fileName: string
        fileSize: number
        lastModified: number
        raw: File
        fileExtension: string
        hash?: string
        totalChunks?: number
        chunkMap?: Record<number, ChunkMeta>
        status: FileUploadStatus
        progress: number
        error?: string
    }

    type FileHashResult = {
        hash: string
        fileName: string
        fileSize: number
    }
}