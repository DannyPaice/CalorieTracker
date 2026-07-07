/**
 * Returns today's date at midnight UTC.
 * Prisma's @db.Date column stores only YYYY-MM-DD, so the time component is discarded.
 * We normalise to midnight to keep queries predictable.
 */
export function todayDate(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}