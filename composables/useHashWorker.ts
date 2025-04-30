export const useHashWorker = () => {
    const computeHash = async (file: File): Promise<FileHashResult> => {
        return new Promise((resolve, reject) => {
            const worker = new Worker(
                new URL('@/workers/hash.worker.ts', import.meta.url),
                { type: 'module' }
            )

            worker.onmessage = (event) => {
                resolve(event.data)
                worker.terminate()
            }

            worker.onerror = (error) => {
                reject(error)
                worker.terminate()
            }

            worker.postMessage(file)
        })
    }

    return {
        computeHash
    }
}