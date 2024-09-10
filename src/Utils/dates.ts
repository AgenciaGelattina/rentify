import { DATE_FORMAT } from '@src/Constants';
import { format, intervalToDuration, Duration, isDate } from 'date-fns';
import { es } from 'date-fns/locale';
import { isNotNil } from 'ramda';

export const strToDate = (strDate: string): Date => {
    return new Date(strDate);
}

export const formatDate = (date: string | number | Date, outFormat: string = DATE_FORMAT.MYSQL): string => {
    if(isNotNil(date)) {
        return format(new Date(date), outFormat, { locale: es });
    }
    return "Fecha Inválida";
}

export const diffDates = (start: string | number | Date, end: string | number | Date): Duration => {
    return intervalToDuration({ start: new Date(start), end: new Date(end) });
}