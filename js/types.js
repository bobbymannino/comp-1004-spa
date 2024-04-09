/**
 * A single calendar event
 * @typedef {{
 * id: string
 * priority: 0 | 1 | 2 | 3,
 * title: string,
 * description: string,
 * hue: number,
 * begin: string,
 * end: string
 * }} CalendarEvent
 */

/**
 * Represents the entire calendar data.
 * @typedef {{ events: CalendarEvent[] }} CalendarData
 */
