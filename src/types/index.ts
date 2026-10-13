export interface PackingItem {
  id: string;
  name: string;
  isPacked: boolean;
}

export interface PackingList {
  id: string;
  name: string;
  items: PackingItem[];
}

export interface Trip {
  id: string;
  name: string;
  /** Local calendar date, YYYY-MM-DD */
  departureDate: string;
  lists: PackingList[];
  createdAt: string;
}

export type ReminderTone = 'blue' | 'orange' | 'coral' | 'green';

export interface Reminder {
  tone: ReminderTone;
  title: string;
  message: string;
}