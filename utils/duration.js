import { intervalToDuration, formatDuration } from 'date-fns';

export const duration = (start, end) => {
  if (!start || !end) {
    return '';
  }
  return formatDuration(intervalToDuration({ start: new Date(start), end: new Date(end) }))
          .replace(' days', 'd')
          .replace(' day', 'd')
          .replace(' hours', 'h')
          .replace(' hour', 'h')
          .replace(' minutes', 'm')
          .replace(' minute', 'm')
          .replace(' seconds', 's')
          .replace(' second', 's')
}

export default duration;