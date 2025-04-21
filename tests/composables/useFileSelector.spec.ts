import type { vi } from "vitest";
import { beforeEach, describe, expect, it, vi as vitest } from "vitest";

describe('useFileSelector', () => {
    let mockClick: ReturnType<typeof vi.fn>
    let mockInput: HTMLInputElement

    beforeEach(() => {
        mockClick = vitest.fn()
        mockInput = document.createElement('input')
        mockInput.click = mockClick
        document.body.appendChild(mockInput)
    })

    it('triggers browseFiles and opens input', () => {
        const { fileInputRef, browseFiles } = useFileSelector(vitest.fn())
        fileInputRef.value = mockInput

        browseFiles()

        expect(mockClick).toHaveBeenCalled()
    })

    it('calls callback when file is selected', async () => {
        const mockFile = new File(['hello'], 'hello.txt', { type: 'text/plain' })
        const mockCallback = vitest.fn()

        const { fileInputRef, setupListeners } = useFileSelector(mockCallback)
        fileInputRef.value = mockInput
        setupListeners()

        const event = new Event('change')
        Object.defineProperty(mockInput, 'files', {
            value: [mockFile],
            writable: false,
        })

        mockInput.dispatchEvent(event)
        await nextTick()

        expect(mockCallback).toHaveBeenCalledWith(mockFile)
    })

    it('ignores empty selections', async () => {
        const mockCallback = vitest.fn()

        const { fileInputRef } = useFileSelector(mockCallback)
        fileInputRef.value = mockInput

        const event = new Event('change')
        Object.defineProperty(mockInput, 'files', {
            value: [],
            writable: false,
        })

        mockInput.dispatchEvent(event)
        await nextTick()

        expect(mockCallback).not.toHaveBeenCalled()
    })

})