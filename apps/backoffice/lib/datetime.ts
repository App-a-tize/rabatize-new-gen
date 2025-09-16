export function formatDate(value: string): string {
  const formatter = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  return formatter.format(new Date(value));
}

export function formatRelative(value: string): string {
  const now = Date.now();
  const target = new Date(value).getTime();
  const diff = target - now;

  const thresholds: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 1000 * 60 * 60 * 24 * 365],
    ['month', (1000 * 60 * 60 * 24 * 365) / 12],
    ['week', 1000 * 60 * 60 * 24 * 7],
    ['day', 1000 * 60 * 60 * 24],
    ['hour', 1000 * 60 * 60],
    ['minute', 1000 * 60],
    ['second', 1000]
  ];

  const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });

  for (const [unit, ms] of thresholds) {
    if (Math.abs(diff) >= ms || unit === 'second') {
      const value = Math.round(diff / ms);
      return rtf.format(value, unit);
    }
  }

  return rtf.format(0, 'second');
}
