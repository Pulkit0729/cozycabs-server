export function getFormattedDate(i: number) {
  const date = new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000);
  return new Date(date.toISOString().split('T')[0]);
}
