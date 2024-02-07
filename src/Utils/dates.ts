import { DATE_FORMAT } from '@src/Constants';
import { format, intervalToDuration, Duration, isDate } from 'date-fns';
import { es } from 'date-fns/locale';

export const strToDate = (strDate: string): Date => {
    return new Date(strDate);
}

export const formatDate = (date: string | number | Date, outFormat: string = DATE_FORMAT.MYSQL): string => {
    return format(new Date(date), outFormat, { locale: es });
}

export const diffDates = (start: string | number | Date, end: string | number | Date): Duration => {
    return intervalToDuration({ start: new Date(start), end: new Date(end) });
}