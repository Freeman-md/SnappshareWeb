<template>
    <div
          class="border border-gray-200 rounded-lg p-5 flex space-x-6 items-start w-full"
        >
          <div class="flex-shrink-0 text-primary px-4 py-2">
            <UIcon
              v-if="fileEntry.fileExtension === 'mp4'"
              name="heroicons:video-camera"
              size="34"
              data-testid="video-icon"
            />
            <UIcon
              v-else-if="['jpg', 'png', 'jpeg'].includes(fileEntry.fileExtension)"
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
              <p class="text-black font-medium">{{ fileEntry.fileName }}</p>
              <NuxtLink :to="`/files/${fileEntry.id}`">
                <UIcon name="lucide:external-link" size="20" class="text-green-500" />
              </NuxtLink>
            </div>
            <small>{{ fileEntry.fileSize }} MB</small>
            <div class="w-full h-1.5 rounded-full bg-green-500 mt-2" />
            <small class="capitalize">{{ fileEntry.status }}</small>
          </div>
        </div>
</template>

<script setup lang="ts">
defineProps<{
  fileEntry: UploadJob
}>()
</script>