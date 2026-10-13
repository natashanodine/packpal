import { useEffect, useRef } from 'react'

interface ConfirmDialogProps {
    title: string
    message: string
    confirmLabel?: string
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmDialog({
    title,
    message,
    confirmLabel = 'Delete',
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    const cancelRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        // Focus the safe option by default.
        cancelRef.current?.focus()
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel()
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onCancel])

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
            onClick={onCancel}
        >
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                aria-describedby="confirm-message"
                className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="confirm-title" className="text-lg font-semibold">
                    {title}
                </h2>
                <p id="confirm-message" className="mt-2 text-muted">
                    {message}
                </p>
                <div className="mt-6 flex gap-3">
                    <button
                        ref={cancelRef}
                        type="button"
                        onClick={onCancel}
                        className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-medium text-muted hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-primary"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onConfirm()
                            onCancel()
                        }}
                        className="flex-1 rounded-xl bg-coral px-4 py-3 font-medium text-white hover:bg-rose-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}