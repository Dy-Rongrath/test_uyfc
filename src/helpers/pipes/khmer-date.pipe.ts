import { Pipe, PipeTransform } from '@angular/core';
import { initializeMomentKhLocale } from 'helpers/shared/momentkh/locale/kh';
const khmerLocale = initializeMomentKhLocale();

@Pipe({
    name: 'khmerDate',
    standalone: true
})
export class KhmerDatePipe implements PipeTransform {
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

    private formatDate(date: Date, format: string): string {

        const year: string = date.getFullYear().toString();
        const month: number = date.getMonth() + 1;
        const day: string = date.getDate().toString().padStart(2, '0');

        const khmerYear = this.convertToKhmerNumeral(year);
        const khmerMonth = this.convertToKhmerMonth(month);
        const khmerDay = this.convertToKhmerNumeral(day);
        const khmerDayOfWeek = this.convertToKhmerDayOfWeek(date.getDay());

        switch (format) {
            case 'd':
            case 'D':
                return `ថ្ងៃទី${khmerDay}`;
            case 'dd':
            case 'DD':
                return `ថ្ងៃ${khmerDayOfWeek} ទី${khmerDay}`;

            case 'khDow':
                return `${khmerDayOfWeek}`;

            case 'khD':
                return `${khmerDay}`;

            case 'm':
            case 'M':
                return `ខែ${khmerMonth}`;

            case 'khM':
                return `${khmerMonth}`;

            case 'y':
            case 'Y':
                return `ឆ្នាំ${khmerYear}`;
            case 'd m':
            case 'D M':
                return `ថ្ងៃទី${khmerDay} ខែ${khmerMonth}`;
            case 'dd m':
            case 'DD M':
                return `ថ្ងៃ${khmerDayOfWeek} ទី${khmerDay} ខែ${khmerMonth}`;
            case 'd m y':
            case 'D M Y':
                return `${khmerDay} ${khmerMonth} ${khmerYear}`;
            case 'dd m y':
            case 'DD M Y':
                return `ថ្ងៃ${khmerDayOfWeek} ទី${khmerDay} ខែ${khmerMonth} ឆ្នាំ${khmerYear}`;
            case 'h:m':
            case 'H:m':
                return `${this.convertToKhmerTime(date, false)}`;
            case 'h:m:s':
            case 'H:M:S':
                return `${this.convertToKhmerTime(date, true)}`;
            case 'd m y h:m':
            case 'D M Y H:M':
                return `ថ្ងៃទី${khmerDay} ខែ${khmerMonth} ឆ្នាំ${khmerYear} ${this.convertToKhmerTime(date, false)}`;
            case 'd m y h:m:s':
            case 'D M Y H:M:S':
                return `ថ្ងៃទី${khmerDay} ខែ${khmerMonth} ឆ្នាំ${khmerYear} ${this.convertToKhmerTime(date, true)}`;
            case 'dd m y h:m':
            case 'DD M Y H:M':
                return `ថ្ងៃ${khmerDayOfWeek} ទី${khmerDay} ខែ${khmerMonth} ឆ្នាំ${khmerYear} ${this.convertToKhmerTime(date, false)}`;
            case 'dd m y h:m:s':
            case 'DD M Y H:M:S':
                return `ថ្ងៃ${khmerDayOfWeek} ទី${khmerDay} ខែ${khmerMonth} ឆ្នាំ${khmerYear} ${this.convertToKhmerTime(date, true)}`;
            default:
                return `ថ្ងៃទី${khmerDay} ខែ${khmerMonth} ឆ្នាំ${khmerYear}`;
        }
    }


    private convertToKhmerDayOfWeek(dayOfWeek: number): string {
        const khmerDaysOfWeek = [
            'អាទិត្យ',
            'ចន្ទ',
            'អង្គារ',
            'ពុធ',
            'ព្រហស',
            'សុក្រ',
            'សៅរ៍'
        ];
        return khmerDaysOfWeek[dayOfWeek];
    }

    private convertToKhmerNumeral(number: string): string {
        const khmerNumerals = {
            '0': '០',
            '1': '១',
            '2': '២',
            '3': '៣',
            '4': '៤',
            '5': '៥',
            '6': '៦',
            '7': '៧',
            '8': '៨',
            '9': '៩'
        };
        return number.split('').map(digit => khmerNumerals[digit]).join('');
    }

    private convertToKhmerMonth(month: number): string {
        const khmerMonths = {
            1: 'មករា',
            2: 'កុម្ភះ',
            3: 'មីនា',
            4: 'មេសា',
            5: 'ឧសភា',
            6: 'មិថុនា',
            7: 'កក្កដា',
            8: 'សីហា',
            9: 'កញ្ញា',
            10: 'តុលា',
            11: 'វិច្ឆិកា',
            12: 'ធ្នូ'
        };

        return khmerMonths[month] || '';
    }

    private convertToKhmerTime(date: Date, includeSeconds: boolean = true): string {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        if (hours > 12) {
            hours = hours - 12;
        }

        let khmerHours = this.convertToKhmerNumeral(hours.toString().padStart(2, '0'));
        const khmerMinutes = this.convertToKhmerNumeral(minutes.toString().padStart(2, '0'));
        const khmerSeconds = includeSeconds ? this.convertToKhmerNumeral(seconds.toString().padStart(2, '0')) : '';

        // Define the Khmer time periods
        const khmerPeriods = ['ព្រឹក', 'ល្ងាច'];

        // Determine the Khmer period based on the hour
        const periodIndex = Math.floor(date.getHours() / 4) % 2;

        const khmerPeriod = khmerPeriods[periodIndex];

        khmerHours = khmerHours === '០០' ? '១២' : khmerHours;

        if (includeSeconds) return `${khmerHours}ៈ${khmerMinutes}ៈ${khmerSeconds} ${khmerPeriod}`;

        return `${khmerHours}ៈ${khmerMinutes} ${khmerPeriod}`;
    }

}
