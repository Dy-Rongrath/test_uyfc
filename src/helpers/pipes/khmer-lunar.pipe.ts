import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
import { momentKhmer } from 'helpers/shared/momentkh/momentkh';
const momentKh = momentKhmer(moment);

@Pipe({
    name: 'khmerLunar',
    standalone: true
})
export class KhmerLunarPipe implements PipeTransform {
    transform(value: string | Date, format: string = 'default'): string {
        if (!value) {
            return '';
        }

        if (typeof value === 'string') {
            const date = this.parseDateString(value);
            return this.formatDate(date, format);
        } else if (value instanceof Date) {
            return this.formatDate(value, format);
        }

        return '';
    }

    private parseDateString(dateString: string): Date {
        try {
            return new Date(dateString);
        } catch (error) {
            return new Date();
        }
    }

    private formatDate(date: Date, _format: string): string {
        return this.getKhmerMoonPhase(date);
    }

    private getKhmerMoonPhase(date: Date): string {
        let today = momentKh(date);
        return today.toLunarDate()
    }
}
