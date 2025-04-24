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
        <div v-if="fileEntries.length <= 0" class="flex flex-col items-center justify-center space-y-4">
            <DotLottieVue style="height: 200px; width: 200px" autoplay loop src="https://lottie.host/598db9fd-d177-48cc-bfe0-94c479217a2f/aHLNfxG65c.lottie" />

            <p>No files uploaded yet. Please upload a file to see the process.</p>
        </div>
        <template v-else>
          <FileListItem
          v-for="(fileEntry, index) in fileEntries"
          :key="index"
          :file-entry="fileEntry"
          class="border border-gray-200 rounded-lg p-5 flex space-x-6 items-start w-full"
        />
        </template>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'


const store = useFileUploadsStore()
const { fileEntries } = storeToRefs(store)
</script>