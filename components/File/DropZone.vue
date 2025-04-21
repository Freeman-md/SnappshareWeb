<template>
    <section id="file-uploader" class="container mx-auto">
      <div
        ref="dropZoneRef"
        :class="[
          'border border-dashed rounded-lg p-10 flex flex-col items-center justify-center space-y-5 text-center transition-all duration-200',
          isOverDropZone ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-md' : 'border-gray-200'
        ]"
      >
        <UIcon name="lucide:cloud-upload" size="36" class="text-gray-600" />

        <div v-if="!file" class="space-y-5">
          <h2 class="text-xl font-medium">Upload Your Files</h2>
          <p class="max-w-md text-gray-500">
            Drag and drop your file here, or click to browse. File will be uploaded in chunks for better performance, and
            you can resume uploads if interrupted.
          </p>
        </div>

        <div v-else class="space-y-4 text-center">
          <div class="relative inline-block">
            <p class="font-semibold text-lg">{{ file.raw.name }}</p>
            <UButton
              color="error"
              :square="true"
              class="absolute -top-5 -right-5 cursor-pointer rounded-full"
              @click="removeFile"
            >
              <UIcon name="lucide:x" size="14" />
            </UButton>
          </div>

          <img
            v-if="file.raw.type.startsWith('image/')"
            :src="file.previewUrl"
            alt="Preview"
            class="max-h-48 mx-auto rounded-md shadow"
          >

          <video
            v-else-if="file.raw.type.startsWith('video/')"
            :src="file.previewUrl"
            controls
            class="max-h-48 mx-auto rounded-md shadow"
          />

          <div v-else class="flex flex-col items-center space-y-2">
            <UIcon :name="getFileIcon(file.raw.type)" size="40" class="text-gray-500" />
            <p class="text-sm text-gray-400">No preview available</p>
          </div>
        </div>

        <input id="file-upload" ref="fileInputRef" type="file" name="file-upload" hidden >

        <UButton
          v-if="!file"
          type="button"
          color="primary"
          label="Browse Files"
          @click="browseFiles"
        />
       <div v-else class="flex space-x-4 items-center">
        <UButton
          type="button"
          color="error"
          variant="outline"
          label="Remove File"
          @click="removeFile"
        />

        <UButton
          type="button"
          color="primary"
          label="Upload"
        />
       </div>
      </div>
    </section>
</template>

<script setup lang="ts">
const file = ref<{ raw: File; previewUrl: string } | null>(null)

const handleFile = (selected: File) => {
  file.value = {
    raw: selected,
    previewUrl: URL.createObjectURL(selected),
  }
}

const { dropZoneRef, isOverDropZone } = useFileDrop(handleFile)
const { fileInputRef, browseFiles } = useFileSelector(handleFile)

const removeFile = () => {
  if (file.value?.previewUrl) URL.revokeObjectURL(file.value.previewUrl)
  file.value = null
}

const getFileIcon = (mime: string) => {
  if (mime.includes('pdf')) return 'mdi:file-pdf-box'
  if (mime.includes('word') || mime.includes('doc')) return 'mdi:file-word-box'
  if (mime.includes('zip') || mime.includes('rar')) return 'mdi:archive'
  if (mime.includes('excel') || mime.includes('spreadsheet')) return 'mdi:file-excel-box'
  return 'lucide:file'
}

</script>