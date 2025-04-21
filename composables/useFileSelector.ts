export function useFileSelector(onSelect: (file: File) => void) {
    const fileInputRef = ref<HTMLInputElement | null>(null)
  
    const browseFiles = () => {
      fileInputRef.value?.click()
    }

    const setupListeners = () => {
      fileInputRef.value?.addEventListener('change', (e) => {
        const files = (e.target as HTMLInputElement).files
        if (!files?.length) return
        onSelect(files[0])
      })
    }
  
    return {
      fileInputRef,
      browseFiles,
      setupListeners
    }
  }
  