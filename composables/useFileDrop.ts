import { useDropZone } from '@vueuse/core'

export const useFileDrop = (onDropFile: (file: File) => void) => {
  const dropZoneRef = ref<HTMLElement | null>(null)

  const onDrop = (files: File[] | null) => {
    if (!files?.length) return
    onDropFile(files[0])
  }

  const { isOverDropZone } = useDropZone(dropZoneRef, {
    onDrop,
    preventDefaultForUnhandled: false,
  })

  return {
    dropZoneRef,
    isOverDropZone,
  }
}
