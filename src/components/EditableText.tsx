import { useEffect, useRef, useState } from 'react'

interface EditableTextProps {
    value: string
    label: string
    onSave: (value: string) => void
    onCancel: () => void
    className?: string
}

/** Inline text input: Enter or blur saves, Escape cancels, blank input is rejected. */
export default function EditableText({ value, label, onSave, onCancel, className = '' }: EditableTextProps) {
    const [draft, setDraft] = useState(value)
    const ref = useRef<HTMLInputElement>(null)

    useEffect(() => {
        ref.current?.focus()
        ref.current?.select()
    }, [])

    const commit = () => {
        const trimmed = draft.trim()
        if (trimmed && trimmed !== value) onSave(trimmed)
        else onCancel()
    }

    return (
        <input
            ref={ref}
            type="text"
            aria-label={label}
            value={draft}
            maxLength={60}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
                if (e.key === 'Enter') commit()
                if (e.key === 'Escape') onCancel()
            }}
            className={`w-full rounded-lg border border-primary bg-white px-2 py-1 outline-none ring-2 ring-primary/20 ${className}`}
        />
    )
}