<template>
  <main class="space-y-12">
    <!-- Hero -->
    <section id="hero" class="mt-20 max-w-2xl mx-auto text-center space-y-4">
      <h1 class="text-4xl font-bold">Chunked File Uploader</h1>
      <p class="text-gray-500">
        Upload large files efficiently with automatic chunking and resume capability.
        Interrupted uploads can be resumed from where they left off.
      </p>
    </section>

    <FileDropZone />

    <!-- Uploaded Files -->
    <section id="files" class="space-y-6 container mx-auto mb-10">
      <h3 class="text-xl font-semibold ml-4 sm:ml-0">Files</h3>

      <div class="space-y-3">
        <FileListItem
          v-for="(fileEntry, index) in fileEntries"
          :key="index"
          :file="fileEntry"
          class="border border-gray-200 rounded-lg p-5 flex space-x-6 items-start w-full"
        />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const fileEntries = reactive<Array<FileEntry>>([
  {
    id: 'yuhd&882',
    fileName: 'Code.mp4',
    fileExtension: 'mp4',
    status: 'completed',
    fileSize: 9,
  },
  {
    id: 'yuhd&883',
    fileName: 'Image.jpg',
    fileExtension: 'jpg',
    status: 'pending',
    fileSize: 9,
  },
  {
    id: 'yuhd&884',
    fileName: 'File.pdf',
    fileExtension: 'pdf',
    status: 'failed',
    fileSize: 9,
  },
])
</script>