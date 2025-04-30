<template>
    <main class="py-10 space-y-8 mx-auto container">
        <button
            class="cursor-pointer flex space-x-2 items-center text-muted transition duration-100 hover:text-gray-900"
            @click="goBack">
            <UIcon name="mdi:arrow-left" size="20" />
            <span>Back to Files</span>
        </button>

        <FileDetailsSkeleton v-if="status === 'pending'" />

        <div v-else-if="status == 'error'" class="flex flex-col items-center justify-center space-y-4">
            <ClientOnly>
                <DotLottieVue style="height: 200px; width: 200px" autoplay loop
                src="https://lottie.host/f15e5963-2482-4d9f-a717-80f03743c386/IX6iMwWfsx.lottie" />
            </ClientOnly>

            <p>File not found.</p>
        </div>

        <div v-else-if="status == 'success' && file" :key="file.id"
            class="border border-gray-200 rounded-lg p-5 flex space-x-6 items-start w-full">
            <div class="flex-shrink-0 text-primary px-4 py-2">
                <UIcon v-if="file.fileExtension == 'mp4'" name="heroicons:video-camera" size="34" />
                <UIcon v-else-if="file.fileExtension == 'jpg'" name="material-symbols:photo-camera-outline-rounded"
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
                        <strong>Chunks</strong>: {{ uploadedChunksLength }} of {{ file.totalChunks }}
                    </small>
                    <small class="mr-4">
                        <strong>File Size</strong>:
                        {{ fileSizeInMb }} MB
                    </small>
                </div>

                <small class="text-black font-medium">Upload Progress</small>

                <UProgress v-model="uploadProgress" color="primary" :max="100" />

                <small class="capitalize">{{ file.status }}</small>

                <div class="flex flex-col space-y-2">
                    <label for="file-url" class="text-black font-medium">File URL</label>

                    <div class="w-full border rounded-lg border-gray-300 flex overflow-hidden">
                        <input id="fileUrl" type="text" name="fileUrl" :value="file.fileUrl" readonly
                            class="w-full px-4 text-black">

                        <a v-if="file.fileUrl" :href="file.fileUrl" class="btn rounded-none p-2 px-3">
                            <UIcon name="lucide:external-link" size="24" />
                        </a>
                    </div>
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
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

definePageMeta({
    layout: false,
})

const route = useRoute()
const router = useRouter()
const fileId = route.params.id as string

const goBack = () => router.push({ name: 'index' })

const { data: file, status } = await useFetch<FileEntry>(
    `http://localhost:5028/file-entry/${fileId}`,
)

console.log(file.value)

const fileSizeInMb = ((file.value?.fileSize ?? 0) / (1024 * 1024)).toFixed(2)

const uploadedChunksLength = computed(() => file.value?.uploadedChunks?.length)

const uploadProgress = computed(() => parseFloat((((uploadedChunksLength.value ?? 0) / (file.value?.totalChunks ?? 1)) * 100).toFixed(2)))
</script>