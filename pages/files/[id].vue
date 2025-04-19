<template>
    <main class="py-10 space-y-8 mx-auto container">
        <button
class="cursor-pointer flex space-x-2 items-center text-muted transition duration-100 hover:text-gray-900"
            @click="goBack">
            <UIcon name="mdi:arrow-left" size="20" />
            <span>Back to Files</span>
        </button>

        <div :key="file.id" class="border border-gray-200 rounded-lg p-5 flex space-x-6 items-start w-full">
            <div class="flex-shrink-0 text-primary px-4 py-2">
                <UIcon v-if="file.fileExtension == 'mp4'" name="heroicons:video-camera" size="34" />
                <UIcon
v-else-if="file.fileExtension == 'jpg'" name="material-symbols:photo-camera-outline-rounded"
                    size="34" />
                <UIcon v-else name="bitcoin-icons:file-outline" size="40" class="-ml-1.5" />
            </div>

            <div class="w-full flex flex-col space-y-2 text-gray-500">
                <div class="flex justify-between space-x-4 items-start">
                    <p class="text-black font-medium">{{ file.fileName }}</p>
                </div>

                <div class="flex flex-wrap mb-6">
                    <small class="mr-4">
                        <strong>Status</strong>:
                        <span class="text-green-500 capitalize">{{ file.status
                        }}</span>
                    </small>
                    <small class="mr-4">
                        <strong>Chunks</strong>: 9 of 9
                    </small>
                    <small class="mr-4">
                        <strong>File Size</strong>:
                        {{ file.fileSize }} MB
                    </small>
                </div>

                <small class="text-black font-medium">Upload Progress</small>

                <div class="w-full h-1.5 rounded-full bg-primary mt-1" />

                <small class="capitalize">{{ file.status }}</small>

                <div class="flex flex-col space-y-2">
                    <label for="file-url" class="text-black font-medium">File URL</label>

                    <div class="w-full border rounded-lg border-gray-300 flex overflow-hidden">
                        <input
id="fileUrl" type="text" name="fileUrl" :value="file.fileUrl" readonly
                            class="w-full px-4 text-black">

                        <NuxtLink class="btn rounded-none p-2 px-3">
                            <UIcon name="lucide:external-link" size="24" />
                        </NuxtLink>
                    </div>
                    <small>Note: This is a mock URL.</small>
                </div>
            </div>
        </div>

        <div class="flex justify-center w-full">
            <button class="btn inline-flex items-center space-x-2  cursor-pointer" @click="goBack">
            <UIcon name="mdi:arrow-left" size="20" />
            <span>Back to Files</span>
        </button>
        </div>
    </main>
</template>

<script setup lang="ts">
definePageMeta({
    layout: false
})

const router = useRouter()

const file = ref<FileEntry>({
    id: 'yuhd&882',
    fileName: 'Code.mp4',
    fileExtension: 'mp4',
    status: 'completed',
    fileSize: 9,
    fileUrl: "https://example.com/files/Code.mp4"
})

const goBack = () => router.back()
</script>