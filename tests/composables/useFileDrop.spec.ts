import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock('@vueuse/core', () => {
    return {
        useDropZone: vi.fn()
    }
})

const useDropZoneMock = (await import('@vueuse/core')).useDropZone as ReturnType<typeof vi.fn>

describe('useFileDrop', () => {
    let mockCallback: ReturnType<typeof vi.fn>
    let mockDropFn: (files: File[] | null) => void
    const mockIsOver = ref(false)

    beforeEach(() => {
        mockCallback = vi.fn()

        mockDropFn = () => {}
        mockIsOver.value = false

        useDropZoneMock.mockImplementation((_ref, options) => {
            mockDropFn = options?.onDrop as typeof mockDropFn

            return { isOverDropZone: mockIsOver }
        })
    })

    it('calls callback when file is dropped', async () => {
        const mockFile = new File(['hello'], 'hello.txt', { type: 'text/plain' })

        useFileDrop(mockCallback)
        mockDropFn([mockFile])

        expect(mockCallback).toHaveBeenCalledWith(mockFile)
    })

    it('does not call callback with no files', () => {
        useFileDrop(mockCallback)
        mockDropFn([])

        expect(mockCallback).not.toHaveBeenCalled()
    })

    it('exposes isOverDropZone state', () => {
        const { isOverDropZone } = useFileDrop(mockCallback)

        mockIsOver.value = true

        expect(isOverDropZone.value).toBeTruthy()
    })
})