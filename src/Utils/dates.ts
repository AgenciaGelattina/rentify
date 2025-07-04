import { AlertColor } from '@mui/material';
import { DATE_FORMAT } from '@src/Constants';
import { format, intervalToDuration, Duration, isBefore, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { isNotNil } from 'ramda';

export type TDate = string | number | Date;

export const strToDate = (strDate: string): Date => {
    return new Date(strDate);
}

export const formatDate = (date: TDate, outFormat: string = DATE_FORMAT.MYSQL): string => {
    if(isNotNil(date)) {
        return format(new Date(date), outFormat, { locale: es });
    };
    return "Error de formato.";
}

export const getOnlyDate = (date: Date) => {
    return format(date, DATE_FORMAT.MYSQL);
}

export const diffDates = (start: TDate, end: TDate): Duration => {
    return intervalToDuration({ start: new Date(start), end: new Date(end) });
};

export const dateIsExpired = (date: TDate, ): boolean => {
    return isBefore(date, new Date());
};

// AlertColor By Date (incomplete)
export const getColorByDateStatus = (date: TDate): AlertColor => {
    const diff = diffDates(date, new Date());
    console.log('DIFFF->', date, new Date(), diff);

    return "success";
};