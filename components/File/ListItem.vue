<template>
    <div
          class="border border-gray-200 rounded-lg p-5 flex space-x-6 items-start w-full"
        >
          <div class="flex-shrink-0 text-primary px-4 py-2">
            <UIcon
              v-if="file.fileExtension === 'mp4'"
              name="heroicons:video-camera"
              size="34"
            />
            <UIcon
              v-else-if="file.fileExtension === 'jpg'"
              name="material-symbols:photo-camera-outline-rounded"
              size="34"
            />
            <UIcon
              v-else
              name="bitcoin-icons:file-outline"
              size="40"
              class="-ml-1.5"
            />
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
</template>

<script setup lang="ts">
defineProps<{
  file: FileEntry
}>()
</script>