<template>
    <div
          class="border border-gray-200 rounded-lg p-5 flex space-x-6 items-start w-full"
        >
          <div class="flex-shrink-0 text-primary px-4 py-2">
            <UIcon
              v-if="uploadJob.fileEntry.fileExtension === 'mp4'"
              name="heroicons:video-camera"
              size="34"
              data-testid="video-icon"
            />
            <UIcon
              v-else-if="['jpg', 'png', 'jpeg'].includes(uploadJob.fileEntry.fileExtension)"
              name="material-symbols:photo-camera-outline-rounded"
              size="34"
              data-testid="image-icon"
            />
            <UIcon
              v-else
              name="bitcoin-icons:file-outline"
              size="40"
              data-testid="file-icon"
            />

          </div>

          <div class="w-full space-y-1 text-gray-500">
            <div class="flex justify-between space-x-4 items-start">
              <p class="text-black font-medium">{{ uploadJob.fileEntry.fileName }}</p>
              <NuxtLink :to="`/files/${uploadJob.fileEntry.id}`">
                <UIcon name="lucide:external-link" size="20" class="text-green-500" />
              </NuxtLink>
            </div>
            <small>{{ fileSizeInMb }} MB</small>
            <UProgress v-model="jobProgress" color="primary" :max="100" />
            <small :class="['capitalize', getStatusColor(uploadJob.status)]">{{ uploadJob.status }}</small>
          </div>
        </div>
</template>

<script setup lang="ts">
const { uploadJob } = defineProps<{
  uploadJob: UploadJob
}>()

const fileSizeInMb = ((uploadJob.fileEntry.fileSize ?? 0) / (1024 * 1024)).toFixed(2)

const jobProgress = computed(() => uploadJob.progress > 100 ? 100 : uploadJob.progress)

const getStatusColor = (status: JobStatus) => {
  switch (status) {
    case 'queued':
      return 'text-gray-500';
    case 'hashing':
      return 'text-yellow-500';
    case 'uploading':
      return 'text-primary';
    case 'finalizing':
      return 'text-green-400';
    case 'done':
      return 'text-green-600';
    case 'failed':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
}
</script>