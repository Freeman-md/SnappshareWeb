import type { ExpiryDuration } from "./expiry-duration"

export { }

declare global {
    type FileEntryStatus = "pending" | "completed" | "failed"
    type JobStatus = 'queued' | 'hashing' | 'uploading' | 'finalizing' | 'done' | 'failed'
    type ChunkStatus = 'pending' | 'success' | 'failed'

    interface FetchError extends Error {
        statusCode?: number
        statusMessage?: string
        data?: object
        response?: {
          _data: object
        }
    }
      
    type FileEntry = {
        id?: string
        fileName: string
        fileHash?: string
        fileExtension: string
        status?: FileEntryStatus,
        fileSize?: number,
        fileUrl?: string,
        totalChunks?: number
        uploadedChunks?: number[]
        expiresIn?: ExpiryDuration
        lastModified?: number
        chunkMap?: Record<number, ChunkMeta>
    }

    type ChunkMeta = {
        index: number
        status: ChunkStatus
        lastTriedAt?: number
        error?: string
    }

    type UploadJob = {
        fileEntry: FileEntry,
        status: JobStatus
        progress: number
        error?: string
    }

    type FileHashResult = {
        hash: string
        fileName: string
        fileSize: number
    }

    type CreateFileEntryResponse = {
        id: string
        fileName: string
        fileExtension: string | null
        fileSize: number
        fileHash: string
        totalChunks: number
        uploadedChunks: number[]
        chunks: object[]
        createdAt: string
        updatedAt: string
        expiresIn: string
        fileUrl: string | null
        isLocked: boolean
        isLockExpired: boolean
        lockedAt: string | null
        status: string
      }   
      
      interface CreateFileEntryDto {
        fileName: string
        fileHash: string
        fileSize: number
        totalChunks: number
        expiresIn: number
      }
      
      interface UploadChunkParams {
        fileId: string
        fileName: string
        fileHash: string
        chunkIndex: number
        totalChunks: number
        chunkFile: Blob
        chunkHash: string
      }
      
    interface UploadChunkResponse {
        status: 'Success'|'Skipped'|'Complete'
        uploadedChunks?: number[]
        fileUrl?: string
        message: string
      }
}