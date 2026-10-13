import { AlarmClock, CalendarClock, CheckCircle2, Luggage } from 'lucide-react'
import type { Reminder, ReminderTone } from '../types'

const styles: Record<ReminderTone, { box: string; icon: typeof Luggage }> = {
  blue: { box: 'border-sky/40 bg-sky/10 text-blue-900', icon: CalendarClock },
  orange: { box: 'border-orange-300 bg-orange-50 text-orange-900', icon: AlarmClock },
  coral: { box: 'border-coral/50 bg-coral/10 text-rose-900', icon: Luggage },
  green: { box: 'border-success/40 bg-success/10 text-green-900', icon: CheckCircle2 },
}

interface ReminderBannerProps {
  reminder: Reminder
  actionLabel?: string
  onAction?: () => void
  compact?: boolean
}

export default function ReminderBanner({
  reminder,
  actionLabel,
  onAction,
  compact = false,
}: ReminderBannerProps) {
  const { box, icon: Icon } = styles[reminder.tone]
  return (
    <div
      role="status"
      className={`flex items-start gap-3 rounded-xl border ${box} ${compact ? 'p-3 text-sm' : 'p-4'}`}
    >
      <Icon size={compact ? 18 : 22} aria-hidden className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{reminder.title}</p>
        <p className="opacity-90">{reminder.message}</p>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 self-center rounded-lg bg-white/70 px-3 py-1.5 text-sm font-medium hover:bg-white focus-visible:outline-2 focus-visible:outline-current"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

