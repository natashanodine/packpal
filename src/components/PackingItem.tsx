import { useState } from 'react'
import { Check, Pencil, X } from 'lucide-react'
import type { PackingItem as Item } from '../types'
import EditableText from './EditableText'

interface PackingItemProps {
  item: Item
  onToggle: () => void
  onRename: (name: string) => void
  onDelete: () => void
}

export default function PackingItem({ item, onToggle, onRename, onDelete }: PackingItemProps) {
  const [editing, setEditing] = useState(false)
  const checkboxId = `item-${item.id}`

  return (
    <li className="group flex min-h-11 items-center gap-3 rounded-lg px-2 hover:bg-slate-50">
      <input
        id={checkboxId}
        type="checkbox"
        checked={item.isPacked}
        onChange={onToggle}
        className="peer sr-only"
      />
      <label
        htmlFor={checkboxId}
        className={`flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40 ${
          item.isPacked ? 'border-success bg-success text-white' : 'border-slate-300 bg-white hover:border-primary'
        }`}
      >
        {item.isPacked && <Check size={16} strokeWidth={3} aria-hidden />}
        <span className="sr-only">
          Mark {item.name} as {item.isPacked ? 'not packed' : 'packed'}
        </span>
      </label>

      <div className="min-w-0 flex-1">
        {editing ? (
          <EditableText
            value={item.name}
            label="Item name"
            onSave={(name) => {
              onRename(name)
              setEditing(false)
            }}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <span
            className={`block truncate ${item.isPacked ? 'text-muted line-through' : ''}`}
            onDoubleClick={() => setEditing(true)}
          >
            {item.name}
          </span>
        )}
      </div>

      {!editing && (
        <div className="flex shrink-0 gap-1 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label={`Rename ${item.name}`}
            className="rounded-md p-2 text-muted hover:bg-slate-100 hover:text-ink focus-visible:outline-2 focus-visible:outline-primary"
          >
            <Pencil size={15} aria-hidden />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${item.name}`}
            className="rounded-md p-2 text-muted hover:bg-coral/10 hover:text-coral focus-visible:outline-2 focus-visible:outline-coral"
          >
            <X size={15} aria-hidden />
          </button>
        </div>
      )}
    </li>
  )
}