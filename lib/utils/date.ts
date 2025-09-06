import { format, formatDistanceToNow } from 'date-fns';
import { ta } from 'date-fns/locale';

export function formatDate(date: Date | string, locale: string = 'en'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (locale === 'ta') {
    return format(dateObj, 'dd MMMM yyyy', { locale: ta });
  }
  
  return format(dateObj, 'dd MMMM yyyy');
}

export function formatDateTime(date: Date | string, locale: string = 'en'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (locale === 'ta') {
    return format(dateObj, 'dd MMMM yyyy hh:mm a', { locale: ta });
  }
  
  return format(dateObj, 'dd MMMM yyyy hh:mm a');
}

export function formatTimeAgo(date: Date | string, locale: string = 'en'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (locale === 'ta') {
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: ta });
  }
  
  return formatDistanceToNow(dateObj, { addSuffix: true });
}