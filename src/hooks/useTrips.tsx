import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { PackingItem, PackingList, Trip } from '../types';
import { loadTrips, saveTrips } from '../utils/storage';
import { cleanName, sortTrips } from '../utils/packingUtils';

interface TripsContextValue {
  trips: Trip[];
  getTrip: (tripId: string) => Trip | undefined;
  addTrip: (name: string, departureDate: string) => Trip | null;
  updateTrip: (tripId: string, name: string, departureDate: string) => void;
  deleteTrip: (tripId: string) => void;
  addList: (tripId: string, name: string) => void;
  renameList: (tripId: string, listId: string, name: string) => void;
  deleteList: (tripId: string, listId: string) => void;
  addItem: (tripId: string, listId: string, name: string) => void;
  renameItem: (tripId: string, listId: string, itemId: string, name: string) => void;
  toggleItem: (tripId: string, listId: string, itemId: string) => void;
  deleteItem: (tripId: string, listId: string, itemId: string) => void;
}

const TripsContext = createContext<TripsContextValue | null>(null);

export function TripsProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>(loadTrips);

  // Persist after every mutation.
  useEffect(() => {
    saveTrips(trips);
  }, [trips]);

  // Small helpers so each action only describes what changes.
  const mapTrip = useCallback((tripId: string, fn: (t: Trip) => Trip) => {
    setTrips((prev) => prev.map((t) => (t.id === tripId ? fn(t) : t)));
  }, []);

  const mapList = useCallback(
    (tripId: string, listId: string, fn: (l: PackingList) => PackingList) => {
      mapTrip(tripId, (t) => ({
        ...t,
        lists: t.lists.map((l) => (l.id === listId ? fn(l) : l)),
      }));
    },
    [mapTrip],
  );

  const mapItem = useCallback(
    (tripId: string, listId: string, itemId: string, fn: (i: PackingItem) => PackingItem) => {
      mapList(tripId, listId, (l) => ({
        ...l,
        items: l.items.map((i) => (i.id === itemId ? fn(i) : i)),
      }));
    },
    [mapList],
  );

  const value = useMemo<TripsContextValue>(
    () => ({
      trips: sortTrips(trips),

      getTrip: (tripId) => trips.find((t) => t.id === tripId),

      addTrip: (name, departureDate) => {
        const clean = cleanName(name);
        if (!clean || !departureDate) return null;
        const trip: Trip = {
          id: crypto.randomUUID(),
          name: clean,
          departureDate,
          lists: [],
          createdAt: new Date().toISOString(),
        };
        setTrips((prev) => [...prev, trip]);
        return trip;
      },

      updateTrip: (tripId, name, departureDate) => {
        const clean = cleanName(name);
        if (!clean || !departureDate) return;
        mapTrip(tripId, (t) => ({ ...t, name: clean, departureDate }));
      },

      // Lists and items live inside the trip, so they go with it.
      deleteTrip: (tripId) => setTrips((prev) => prev.filter((t) => t.id !== tripId)),

      addList: (tripId, name) => {
        const clean = cleanName(name);
        if (!clean) return;
        mapTrip(tripId, (t) => ({
          ...t,
          lists: [...t.lists, { id: crypto.randomUUID(), name: clean, items: [] }],
        }));
      },

      renameList: (tripId, listId, name) => {
        const clean = cleanName(name);
        if (!clean) return;
        mapList(tripId, listId, (l) => ({ ...l, name: clean }));
      },

      deleteList: (tripId, listId) =>
        mapTrip(tripId, (t) => ({ ...t, lists: t.lists.filter((l) => l.id !== listId) })),

      addItem: (tripId, listId, name) => {
        const clean = cleanName(name);
        if (!clean) return;
        mapList(tripId, listId, (l) => ({
          ...l,
          items: [...l.items, { id: crypto.randomUUID(), name: clean, isPacked: false }],
        }));
      },

      renameItem: (tripId, listId, itemId, name) => {
        const clean = cleanName(name);
        if (!clean) return;
        mapItem(tripId, listId, itemId, (i) => ({ ...i, name: clean }));
      },

      toggleItem: (tripId, listId, itemId) =>
        mapItem(tripId, listId, itemId, (i) => ({ ...i, isPacked: !i.isPacked })),

      deleteItem: (tripId, listId, itemId) =>
        mapList(tripId, listId, (l) => ({
          ...l,
          items: l.items.filter((i) => i.id !== itemId),
        })),


    }),
    [trips, mapTrip, mapList, mapItem],
  );

  return <TripsContext.Provider value={value}>{children}</TripsContext.Provider>;
}

export function useTrips(): TripsContextValue {
  const ctx = useContext(TripsContext);
  if (!ctx) throw new Error('useTrips must be used inside <TripsProvider>');
  return ctx;
}

