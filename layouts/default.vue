<template>
    <div>
        <header class="bg-white">
            <div class="container mx-auto px-4 py-8">
                <nav class="flex items-center justify-center text-center">
                    <h1 class="flex items-center space-x-3">
                        <div class="bg-primary text-white rounded-xl w-10 h-10 flex items-center justify-center">
                            <UIcon name="ic:outline-file-upload" size="28" />
                        </div>
                        <span class="text-2xl font-medium text-gray-900">Chunkify</span>
                    </h1>
                </nav>
            </div>
        </header>

        <slot />

        <footer class="container mx-auto text-center py-4 border-t border-gray-200 text-gray;500">
            SnappShare &copy; {{ year }}. Built by <NuxtLink to="https://freemanmadudili.com" external class="text-green-500">Freemancodz</NuxtLink>
        </footer>
    </div>
</template>

<script setup lang="ts">
const year = (new Date()).getFullYear();
</script>