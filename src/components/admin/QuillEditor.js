'use client'
import { useEffect, useRef } from 'react'

export default function QuillEditor({ value, onChange }) {
    const editorRef = useRef(null)
    const quillRef = useRef(null)
    const isInitialized = useRef(false)

    useEffect(() => {
        if (isInitialized.current) return
        isInitialized.current = true

        const loadQuill = async () => {
            const Quill = (await import('quill')).default

            if (!editorRef.current || quillRef.current) return

            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                placeholder: 'Property ka detailed description yahan likhein...\n\nExample:\n• Plot ka area\n• Location advantages\n• Nearby amenities\n• Investment potential',
                modules: {
                    toolbar: [
                        [{ header: [2, 3, false] }],
                        ['bold', 'italic', 'underline'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['clean']
                    ]
                }
            })

            // Set initial value
            if (value) {
                quillRef.current.root.innerHTML = value
            }

            // Listen for changes
            quillRef.current.on('text-change', () => {
                const html = quillRef.current.root.innerHTML
                onChange(html === '<p><br></p>' ? '' : html)
            })
        }

        loadQuill()
    }, [])

    // Sync value from parent (e.g., on reset)
    useEffect(() => {
        if (quillRef.current && value === '') {
            quillRef.current.root.innerHTML = ''
        }
    }, [value])

    return (
        <>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/quill@2/dist/quill.snow.css" />
            <style>{`
                .ql-container { font-family: inherit; font-size: 1rem; border-radius: 0 0 6px 6px; min-height: 200px; }
                .ql-toolbar { border-radius: 6px 6px 0 0; background: #f8fafc; border-color: #e2e8f0 !important; }
                .ql-container { border-color: #e2e8f0 !important; }
                .ql-container.ql-snow:focus-within { border-color: #D4AF37 !important; box-shadow: 0 0 0 3px rgba(212,175,55,0.1); }
            `}</style>
            <div ref={editorRef} />
        </>
    )
}
