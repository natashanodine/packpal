import type { PackingItem, PackingList, Trip } from '../types';

const STORAGE_KEY = 'packpal_trips';
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const isString = (v: unknown): v is string => typeof v === 'string';
const isObject = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' && v !== null;

function parseItem(raw: unknown): PackingItem | null {
    if (!isObject(raw) || !isString(raw.id) || !isString(raw.name)) return null;
    return { id: raw.id, name: raw.name, isPacked: raw.isPacked === true };
}

function parseList(raw: unknown): PackingList | null {
    if (!isObject(raw) || !isString(raw.id) || !isString(raw.name)) return null;
    const items = Array.isArray(raw.items)
        ? raw.items.map(parseItem).filter((i): i is PackingItem => i !== null)
        : [];
    return { id: raw.id, name: raw.name, items };
}

function parseTrip(raw: unknown): Trip | null {
    if (
        !isObject(raw) ||
        !isString(raw.id) ||
        !isString(raw.name) ||
        !isString(raw.departureDate) ||
        !DATE_RE.test(raw.departureDate)
    ) {
        return null;
    }
    const lists = Array.isArray(raw.lists)
        ? raw.lists.map(parseList).filter((l): l is PackingList => l !== null)
        : [];
    return {
        id: raw.id,
        name: raw.name,
        departureDate: raw.departureDate,
        lists,
        createdAt: isString(raw.createdAt) ? raw.createdAt : new Date().toISOString(),
    };
}

/** Loads trips, skipping anything malformed. Never throws. */
export function loadTrips(): Trip[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed: unknown = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.map(parseTrip).filter((t): t is Trip => t !== null);
    } catch {
        return [];
    }
}

export function saveTrips(trips: Trip[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    } catch {
        // Storage full or blocked (e.g. private mode) — app keeps working in memory.
    }
}