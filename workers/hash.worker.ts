self.onmessage = async (event: MessageEvent<File>) => {
    const file: File = event.data
    const buffer = await file.arrayBuffer()

    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)

    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    const result: FileHashResult = {
        hash: hashHex,
        fileName: file.name,
        fileSize: file.size
    }
    
    self.postMessage(result)
}