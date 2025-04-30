export const useChunkUploader = () => {
    const { computeHash } = useHashWorker()

    const uploadChunk = async (job: UploadJob, chunkIndex: number, chunkBlob: Blob) : Promise<CreateFileEntryResponse> => {
        const chunkHash = (await computeHash(new File([chunkBlob], 'chunk'))).toString()

        const formData = new FormData()

        formData.append('chunkFile', chunkBlob)
        formData.append('chunkHash', chunkHash)
        formData.append('chunkIndex', chunkIndex.toString())
        formData.append('fileName', job.fileEntry.fileName!)
        formData.append('fileHash', job.fileEntry.fileHash!)
        formData.append('totalChunks', job.fileEntry.totalChunks?.toString() || '')

        return await $fetch(`http://localhost:5028/file-entry/${job.fileEntry.id}/upload`, {
            method: 'POST',
            body: formData
        })
    }

    return {
        uploadChunk
    }
}
