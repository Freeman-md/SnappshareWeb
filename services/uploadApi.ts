export async function getFileEntryById(fileId: string): Promise<FileEntry> {
  const config = useRuntimeConfig()
  return await $fetch<FileEntry>(`${config.public.apiBase}/file-entry/${fileId}`)
}

export async function createFileEntry(dto: CreateFileEntryDto): Promise<CreateFileEntryResponse> {
  const config = useRuntimeConfig()
  return await $fetch<CreateFileEntryResponse>(
    `${config.public.apiBase}/file-entry/create`,
    {
      method: 'POST',
      body: dto,
    }
  )
}

export async function uploadChunk(params: UploadChunkParams): Promise<UploadChunkResponse> {
  const config = useRuntimeConfig()
  const form = new FormData()
  form.append('chunkFile', params.chunkFile)
  form.append('chunkHash', params.chunkHash)
  form.append('chunkIndex', params.chunkIndex.toString())
  form.append('fileName', params.fileName)
  form.append('fileHash', params.fileHash)
  form.append('totalChunks', params.totalChunks.toString())

  return await $fetch<UploadChunkResponse>(
    `${config.public.apiBase}/file-entry/${params.fileId}/upload`,
    { method: 'POST', body: form }
  )
}

export async function finalizeUpload(fileId: string): Promise<UploadChunkResponse> {
  const config = useRuntimeConfig()
  return await $fetch<UploadChunkResponse>(
    `${config.public.apiBase}/file-entry/${fileId}/finalize`,
    { method: 'POST' }
  )
}
