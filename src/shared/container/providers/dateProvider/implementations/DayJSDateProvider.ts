import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IDateProvider } from "../IDateProvider";
import dateFormat from '@config/dateFormat';

dayjs.extend(utc);

class DayJSDateProvider implements IDateProvider {
    formatDateCustom(date: Date): string {
        date = new Date(date);
        date.setDate(date.getDate() + 1);
        return date.toLocaleDateString("pt-BR");
    }

    addDays(days: number): string {
        return dayjs().add(days, 'day').format(dateFormat.format_dayjs);
    }
}

export { DayJSDateProvider }