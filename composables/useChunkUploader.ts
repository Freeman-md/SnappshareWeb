import { uploadChunk } from "~/services/uploadApi"

export const useChunkUploader = () => {
    const { computeHash } = useHashWorker()

    const uploadChunkItem = async (job: UploadJob, chunkIndex: number, chunkBlob: Blob) : Promise<UploadChunkResponse> => {
        const chunkHash = (await computeHash(new File([chunkBlob], 'chunk'))).toString()

        const formData = new FormData()

        formData.append('chunkFile', chunkBlob)
        formData.append('chunkHash', chunkHash)
        formData.append('chunkIndex', chunkIndex.toString())
        formData.append('fileName', job.fileEntry.fileName!)
        formData.append('fileHash', job.fileEntry.fileHash!)
        formData.append('totalChunks', job.fileEntry.totalChunks?.toString() || '')

        return await uploadChunk({
            fileId:       job.fileEntry.id!,
            fileName:     job.fileEntry.fileName!,
            fileHash:     job.fileEntry.fileHash!,
            chunkIndex:   chunkIndex,
            totalChunks:  job.fileEntry.totalChunks!,
            chunkFile:    chunkBlob,
            chunkHash:    chunkHash
          })
    }

    return {
        uploadChunkItem
    }
}
