<template>
  <main class="space-y-12">
    <section id="hero" class="mt-20 max-w-2xl mx-auto text-center space-y-4">
      <h1 class="text-4xl font-bold">Chunked File Uploader</h1>

      <p class="text-gray-500">Upload large files efficiently with automatic chunking and resume capability. Interrupted
        uploads can be resumed from where they left off.</p>
    </section>

    <section id="file-uploader" class="container mx-auto">
      <div
        class="border border-dashed border-gray-200 rounded-lg p-10 flex flex-col items-center justify-center space-y-5 text-center">
        <UIcon name="lucide:cloud-upload" size="36" class="text-gray-600" />

        <div v-if="!file" class="space-y-5">
          <h2 class="inline-block mt-4 text-xl">Upload Your Files</h2>
          <p class="max-w-md text-gray-500">Drag and drop your file here, or click to browse. File will be uploaded in
            chunks for better performance, and you can resume uploads if interrupted.</p>
        </div>

        <div v-else class="space-y-2 text-center">
          <p class="font-semibold text-lg">{{ file.raw.name }}</p>

          <img
            v-if="file.raw.type.startsWith('image/')" :src="file.previewUrl" alt="Preview"
            class="max-h-48 mx-auto rounded-md shadow" >

          <video
            v-else-if="file.raw.type.startsWith('video/')" :src="file.previewUrl" controls
            class="max-h-48 mx-auto rounded-md shadow" />

          <div v-else class="text-gray-500 italic">Preview not available</div>
        </div>

        <input id="file-upload" ref="fileUploadInput" type="file" name="file-upload" hidden>

        <button type="button" class="btn cursor-pointer" @click.prevent="browseFiles">Browse Files</button>
      </div>
    </section>

    <section id="files" class="space-y-6 container mx-auto mb-10">
      <h3 class="text-xl font-semibold ml-4 sm:ml-0">Files</h3>

      <div class="space-y-3">
        <div
v-for="(file, index) in files" :key="index"
          class="border border-gray-200 rounded-lg p-5 flex space-x-6 items-start w-full">
          <div class="flex-shrink-0 text-primary px-4 py-2">
            <UIcon v-if="file.fileExtension == 'mp4'" name="heroicons:video-camera" size="34" />
            <UIcon
v-else-if="file.fileExtension == 'jpg'" name="material-symbols:photo-camera-outline-rounded"
              size="34" />
            <UIcon v-else name="bitcoin-icons:file-outline" size="40" class="-ml-1.5" />
          </div>

          <div class="w-full space-y-1 text-gray-500">
            <div class="flex justify-between space-x-4 items-start">
              <p class="text-black font-medium">{{ file.fileName }}</p>

              <NuxtLink :to="`/files/${file.id}`">
                <UIcon name="lucide:external-link" size="20" class="text-green-500" />
              </NuxtLink>
            </div>

            <small>{{ file.fileSize }} MB</small>

            <div class="w-full h-1.5 rounded-full bg-green-500 mt-2" />

            <small class="capitalize">{{ file.status }}</small>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const files = reactive<Array<FileEntry>>([
  {
    id: 'yuhd&882',
    fileName: 'Code.mp4',
    fileExtension: 'mp4',
    status: 'completed',
    fileSize: 9
  },
  {
    id: 'yuhd&883',
    fileName: 'Image.jpg',
    fileExtension: 'jpg',
    status: 'pending',
    fileSize: 9
  },
  {
    id: 'yuhd&884',
    fileName: 'File.pdf',
    fileExtension: 'pdf',
    status: 'failed',
    fileSize: 9
  },
])

const fileUploadInput = ref<HTMLInputElement | null>(null);

const file = ref<{ raw: File; previewUrl: string } | null>(null);

const browseFiles = () => {
  fileUploadInput.value?.click();
}

onMounted(() => {
  if (fileUploadInput.value) {
    fileUploadInput.value.addEventListener('change', (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files?.length) {
        const selected = files[0];

        file.value = {
          raw: selected,
          previewUrl: URL.createObjectURL(selected)
        }
      }
    });
  }
})
</script>