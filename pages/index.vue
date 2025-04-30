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

    <DropZone />

    <!-- Uploaded Files -->
    <section id="files" class="space-y-6 container mx-auto mb-10">
      <h3 class="text-xl font-semibold ml-4 sm:ml-0">Files</h3>

      <div class="space-y-3">
        <div v-if="uploadJobs.length <= 0" class="flex flex-col items-center justify-center space-y-4">
          <ClientOnly>
            <DotLottieVue style="height: 200px; width: 200px" autoplay loop
              src="https://lottie.host/f15e5963-2482-4d9f-a717-80f03743c386/IX6iMwWfsx.lottie" />
          </ClientOnly>

          <p>No files uploaded yet. Please upload a file to see the process.</p>
        </div>
        <template v-else>
          <UploadJob v-for="(uploadJob, index) in uploadJobs" :key="index" :upload-job="uploadJob"
            class="border border-gray-200 rounded-lg p-5 flex space-x-6 items-start w-full" />
        </template>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'


const store = useFileUploadsStore()
const { uploadJobs } = storeToRefs(store)
</script>