interface ProgressBarProps {
    percent: number
    label?: string
}

export default function ProgressBar({ percent, label = 'Packing progress' }: ProgressBarProps) {
    const done = percent === 100
    return (
        <div
            role="progressbar"
            aria-label={label}
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
        >
            <div
                className={`h-full rounded-full transition-[width] duration-300 ${done ? 'bg-success' : 'bg-primary'}`}
                style={{ width: `${percent}%` }}
            />
        </div>
    )
}