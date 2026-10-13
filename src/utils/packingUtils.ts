import type { PackingList, Reminder, Trip } from '../types';
import { daysUntil } from './dateUtils';

export interface Progress {
    packed: number;
    total: number;
    /** 0–100, integer. 0 when there are no items. */
    percent: number;
}

function toProgress(packed: number, total: number): Progress {
    return { packed, total, percent: total === 0 ? 0 : Math.round((packed / total) * 100) };
}

export function getListProgress(list: PackingList): Progress {
    const packed = list.items.filter((i) => i.isPacked).length;
    return toProgress(packed, list.items.length);
}

export function getTripProgress(trip: Trip): Progress {
    let packed = 0;
    let total = 0;
    for (const list of trip.lists) {
        total += list.items.length;
        packed += list.items.filter((i) => i.isPacked).length;
    }
    return toProgress(packed, total);
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

/**
 * Reminder rules, checked in order:
 * 1. Past trip or zero items → none
 * 2. More than 3 days away → none
 * 3. Everything packed → green
 * 4. Departure day → coral
 * 5. 1–2 days away → orange
 * 6. Exactly 3 days away → blue
 */
export function getReminder(trip: Trip, now?: Date): Reminder | null {
    const days = daysUntil(trip.departureDate, now);
    const { packed, total } = getTripProgress(trip);
    const remaining = total - packed;

    if (days < 0 || total === 0 || days > 3) return null;

    if (remaining === 0) {
        return {
            tone: 'green',
            title: "You're all packed!",
            message: 'Have an amazing adventure!',
        };
    }
    if (days === 0) {
        return {
            tone: 'coral',
            title: "Today's the day!",
            message: `Don't forget your remaining ${plural(remaining, 'item')}.`,
        };
    }
    if (days <= 2) {
        return {
            tone: 'orange',
            title: 'Time to finish packing!',
            message: `You still have ${plural(remaining, 'item')} left to pack.`,
        };
    }
    return {
        tone: 'blue',
        title: 'Your trip is coming up!',
        message: "You're leaving in 3 days. It's a good time to start packing!",
    };
}

/** Upcoming trips soonest first, then past trips most recent first. */
export function sortTrips(trips: Trip[], now?: Date): Trip[] {
    const upcoming = trips
        .filter((t) => daysUntil(t.departureDate, now) >= 0)
        .sort((a, b) => a.departureDate.localeCompare(b.departureDate));
    const past = trips
        .filter((t) => daysUntil(t.departureDate, now) < 0)
        .sort((a, b) => b.departureDate.localeCompare(a.departureDate));
    return [...upcoming, ...past];
}

/** Trims and rejects blank/whitespace-only names. */
export function cleanName(value: string): string | null {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}