import { initializeMomentKhLocale } from "./locale/kh";
import { momentkhConstant } from './constants';
import { getSoriyatraLerngSak } from "./getSoriyatraLerngSak";

const khmerLocale       = initializeMomentKhLocale();
// Call the function to get the object
const constants         = momentkhConstant();
// Now you can access the exported objects
const lunarMonths       = constants.LunarMonths;
const solarMonth        = constants.SolarMonth;
const moonStatus        = constants.MoonStatus;
const khNewYearMoments  = constants.khNewYearMoments;

export const momentKhmer = (Moment: any) => {
    Moment.khNewYearMoments = khNewYearMoments;

    /**
     * Bodithey: បូតិថី
     * Bodithey determines if a given beYear is a leap-month year. Given year target year in Buddhist Era
     * @return Number (0-29)
     */
    const getBodithey = (beYear: number): number => {
        const ahk = getAharkun(beYear);
        const avml = Math.floor((11 * ahk + 25) / 692);
        const m = avml + ahk + 29;
        return (m % 30);
    }

    /**
     * Avoman: អាវមាន
     * Avoman determines if a given year is a leap-day year. Given a year in Buddhist Era as denoted as adYear
     * @param beYear (0 - 691)
     */
    const getAvoman = (beYear: number): number => {
        const ahk = getAharkun(beYear);
        const avm = (11 * ahk + 25) % 692;
        return avm;
    }

    /**
     * Aharkun: អាហារគុណ ឬ ហារគុណ
     * Aharkun is used for Avoman and Bodithey calculation below. Given adYear as a target year in Buddhist Era
     * @param beYear
     * @returns {number}
     */
    const getAharkun = (beYear: number): number => {
        const t = beYear * 292207 + 499;
        const ahk = Math.floor(t / 800) + 4;
        return ahk;
    }

    /**
     * Kromathupul
     * @param beYear
     * @returns {number} (1-800)
     */
    const kromthupul = (beYear: number): number => {
        const ah = getAharkunMod(beYear);
        const krom = 800 - ah;
        return krom;
    }

    /**
     * isKhmerSolarLeap
     * @param beYear
     * @returns {number}
     */
    const isKhmerSolarLeap = (beYear: number): number => {
        const krom = kromthupul(beYear);
        return krom <= 207 ? 1 : 0;
    }

    /**
     * getAkhakunMod
     * @param beYear
     * @returns {number}
     */
    const getAharkunMod = (beYear: number): number => {
        const t = beYear * 292207 + 499;
        const ahkmod = t % 800;
        return ahkmod;
    }

    /**
     * * Regular if year has 30 day
     * * leap month if year has 13 months
     * * leap day if Jesth month of the year has 1 extra day
     * * leap day and month: both of them
     * @param beYear
     * @returns {number} return 0:regular, 1:leap month, 2:leap day, 3:leap day and month
     */
    const getBoditheyLeap = (beYear: number): number => {
        let result = 0;
        let avoman = getAvoman(beYear);
        let bodithey = getBodithey(beYear);

        // check bodithey leap month
        let boditheyLeap = 0;
        if (bodithey >= 25 || bodithey <= 5) {
            boditheyLeap = 1;
        }
        // check for avoman leap-day based on gregorian leap
        let avomanLeap = 0;
        if (isKhmerSolarLeap(beYear)) {
            if (avoman <= 126)
                avomanLeap = 1;
        } else {
            if (avoman <= 137) {
                // check for avoman case 137/0, 137 must be normal year (p.26)
                if (getAvoman(beYear + 1) === 0) {
                    avomanLeap = 0;
                } else {
                    avomanLeap = 1;
                }
            }
        }

        // case of 25/5 consecutively
        // only bodithey 5 can be leap-month, so set bodithey 25 to none
        if (bodithey === 25) {
            let nextBodithey = getBodithey(beYear + 1);
            if (nextBodithey === 5) {
                boditheyLeap = 0;
            }
        }

        // case of 24/6 consecutively, 24 must be leap-month
        if (bodithey == 24) {
            let nextBodithey = getBodithey(beYear + 1);
            if (nextBodithey == 6) {
                boditheyLeap = 1;
            }
        }

        // format leap result (0:regular, 1:month, 2:day, 3:both)
        if (boditheyLeap === 1 && avomanLeap === 1) {
            result = 3;
        } else if (boditheyLeap === 1) {
            result = 1;
        } else if (avomanLeap === 1) {
            result = 2;
        } else {
            result = 0;
        }

        return result;
    }

    // return 0:regular, 1:leap month, 2:leap day (no leap month and day together)
    /**
     * bodithey leap can be both leap-day and leap-month but following the khmer calendar rule, they can't be together on the same year, so leap day must be delayed to next year
     * @param beYear
     * @returns {number}
     */
    const getProtetinLeap = (beYear: number): number => {
        const b = getBoditheyLeap(beYear);
        if (b === 3) {
            return 1;
        }
        if (b === 2 || b === 1) {
            return b;
        }
        // case of previous year is 3
        if (getBoditheyLeap(beYear - 1) === 3) {
            return 2;
        }
        // normal case
        return 0;
    }

    /**
     * Maximum number of day in Khmer Month
     * @param beMonth
     * @param beYear
     * @returns {number}
     */
    const getNumberOfDayInKhmerMonth = (beMonth: number, beYear: number): 29 | 30 => {
        if (beMonth === lunarMonths['ជេស្ឋ'] && isKhmerLeapDay(beYear)) {
            return 30;
        }
        if (beMonth === lunarMonths['បឋមាសាឍ'] || beMonth === lunarMonths['ទុតិយាសាឍ']) {
            return 30;
        }
        // មិគសិរ : 29 , បុស្ស : 30 , មាឃ : 29 .. 30 .. 29 ..30 .....
        return beMonth % 2 === 0 ? 29 : 30;
    }

    /**
     * Get number of day in Khmer year
     * @param beYear
     * @returns {number}
     */
    const getNumerOfDayInKhmerYear = (beYear: number): 384 | 355 | 354 => {
        if (isKhmerLeapMonth(beYear)) {
            return 384;
        } else if (isKhmerLeapDay(beYear)) {
            return 355;
        } else {
            return 354;
        }
    }

    /**
     * A year with an extra month is called Adhikameas (អធិកមាស). This year has 384 days.
     * @param beYear
     * @returns {boolean}
     */
    const isKhmerLeapMonth = (beYear: number): boolean => {
        return getProtetinLeap(beYear) === 1
    }

    /**
     * A year with an extra day is called Chhantrea Thimeas (ចន្ទ្រាធិមាស) or Adhikavereak (អធិកវារៈ). This year has 355 days.
     * @param beYear
     * @returns {boolean}
     */
    const isKhmerLeapDay = (beYear: number): boolean => {
        return getProtetinLeap(beYear) === 2
    }

    /**
     * រកថ្ងៃវិសាខបូជា
     * ថ្ងៃដាច់ឆ្នាំពុទ្ធសករាជ
     */
    const getVisakhaBochea = (gregorianYear: any) => {
        const date = Moment('1/1/' + gregorianYear, 'D/M/YYYY')
        for (let i = 0; i < 365; i++) {
            const lunarDate = findLunarDate(date);
            if (lunarDate.month == lunarMonths['ពិសាខ'] && lunarDate.day == 14) {
                return date
            }
            date.add(1, 'day')
        }
        throw 'Cannot find Visakhabochea day. Please report this bug.';
    }

    /**
     * Buddhist Era
     * ថ្ងៃឆ្លងឆ្នាំ គឺ ១ រោច ខែពិសាខ
     * @ref http://news.sabay.com.kh/article/1039620
     * @summary: ឯកឧត្តម សេង សុមុនី អ្នកនាំពាក្យ​ក្រ​សួង​ធម្មការ និង​សាសនា​ឲ្យ​Sabay ដឹង​ថា​នៅ​ប្រ​ទេស​កម្ពុជា​ការ​ឆ្លង​ចូល​ពុទ្ធសករាជថ្មី​គឺ​កំណត់​យក​នៅ​ថ្ងៃព្រះ​ពុទ្ធយាងចូល​និព្វាន ពោល​គឺ​នៅ​ថ្ងៃ​១រោច ខែពិសាខ។
     * @param moment
     * @returns {*}
     */
    const getBEYear = (moment: any): any => {
        if (moment.diff(getVisakhaBochea(moment.year())) > 0) {
            return moment.year() + 544;
        } else {
            return moment.year() + 543;
        }
    }

    /**
     * Due to recursive problem, I need to calculate the BE based on new year's day
     * This won't be displayed on final result, it is used to find number of day in year,
     * It won't affect the result because on ខែចេត្រ និង ខែពិសាខ, number of days is the same every year
     * ពីព្រោះចូលឆ្នាំតែងតែចំខែចេត្រ​ ឬ ពិសាខ
     * @param moment
     * @returns {*}
     */
    const getMaybeBEYear = (moment: any): any => {
        if (moment.month() + 1 <= solarMonth['មេសា'] + 1) {
            return moment.year() + 543;
        } else {
            return moment.year() + 544;
        }
    }

    /**
     * Jolak Sakaraj
     * @param beYear
     * @returns {number}
     */
    const getJolakSakarajYear = (moment: any): number => {
        const gregorianYear = moment.year();
        const newYearMoment = getKhNewYearMoment(gregorianYear);
        if (moment.diff(newYearMoment) < 0) {
            return gregorianYear + 543 - 1182
        } else {
            return gregorianYear + 544 - 1182
        }
    }

    /**
     * ១កើត ៤កើត ២រោច ១៤រោច ...
     * @param day 1-30
     * @returns {{count: number, moonStatus: number}}
     */
    const getKhmerLunarDay = (day: number): { count: number, moonStatus: number } => {
        return {
            count: (day % 15) + 1,
            moonStatus: day > 14 ? moonStatus['រោច'] : moonStatus['កើត']
        }
    }

    /**
     * Turn be year to animal year
     * @param beYear
     * @returns {number}
     */
    const getAnimalYear = (moment: any): number => {
        const gregorianYear = moment.year();
        const newYearMoment = getKhNewYearMoment(gregorianYear);
        if (moment.diff(newYearMoment) < 0) {
            return (gregorianYear + 543 + 4) % 12
        } else {
            return (gregorianYear + 544 + 4) % 12
        }
    }

    /**
     * Khmer date format handler
     * @param day
     * @param month
     * @param moment
     * @param format
     * @returns {*}
     */
    const formatKhmerDate = ({ day, month, moment }, format: string): any => {
        if (format === null || format === undefined) {
            // Default date format
            const dayOfWeek = moment.day();
            const moonDay = getKhmerLunarDay(day);
            const beYear = getBEYear(moment);
            const animalYear = getAnimalYear(moment);
            const eraYear = getJolakSakarajYear(moment) % 10;
            return khmerLocale.postformat(`ថ្ងៃ${khmerLocale.weekdays[dayOfWeek]} ${moonDay.count}${khmerLocale.moonStatus[moonDay.moonStatus]} ខែ${khmerLocale.lunarMonths[month]} ឆ្នាំ${khmerLocale.animalYear[animalYear]} ${khmerLocale.eraYear[eraYear]} ព.ស.${beYear}`);
        } else if (typeof format === 'string') {
            // Follow the format
            let formatRule = {
                'W': () => { // Day of week
                    const dayOfWeek = moment.day();
                    return khmerLocale.weekdays[dayOfWeek]
                },
                'w': () => { // Day of week
                    const dayOfWeek = moment.day();
                    return khmerLocale.weekdaysShort[dayOfWeek]
                },
                'd': () => { // no determine digit
                    const moonDay = getKhmerLunarDay(day);
                    return moonDay.count;
                },
                'D': () => { // minimum 2 digits
                    const moonDay = getKhmerLunarDay(day);
                    return ('' + moonDay.count).length === 1 ? '0' + moonDay.count : moonDay.count;
                },
                'n': () => {
                    const moonDay = getKhmerLunarDay(day);
                    return khmerLocale.moonStatusShort[moonDay.moonStatus]
                },
                'N': () => {
                    const moonDay = getKhmerLunarDay(day);
                    return khmerLocale.moonStatus[moonDay.moonStatus]
                },
                'o': () => {
                    return khmerLocale.moonDays[day];
                },
                'm': () => {
                    return khmerLocale.lunarMonths[month];
                },
                'M': () => {
                    return khmerLocale.months[moment.month()];
                },
                'a': () => {
                    const animalYear = getAnimalYear(moment);
                    return khmerLocale.animalYear[animalYear];
                },
                'e': () => {
                    const eraYear = getJolakSakarajYear(moment) % 10;
                    return khmerLocale.eraYear[eraYear];
                },
                'b': () => {
                    return getBEYear(moment);
                },
                'c': () => {
                    return moment.year();
                },
                'j': () => {
                    return getJolakSakarajYear(moment);
                }
            }

            return khmerLocale.postformat(format.replace(new RegExp(Object.keys(formatRule).join('|'), 'g'), function (matched) {
                return formatRule[matched]();
            }));

        }
        throw Error(format + ' is not a valid date format.');
    }

    /**
     * Next month of the month
     */
    const nextMonthOf = (khmerMonth: number, BEYear: number) => {
        switch (khmerMonth) {
            case lunarMonths['មិគសិរ']:
                return lunarMonths['បុស្ស'];
            case lunarMonths['បុស្ស']:
                return lunarMonths['មាឃ'];
            case lunarMonths['មាឃ']:
                return lunarMonths['ផល្គុន'];
            case lunarMonths['ផល្គុន']:
                return lunarMonths['ចេត្រ'];
            case lunarMonths['ចេត្រ']:
                return lunarMonths['ពិសាខ'];
            case lunarMonths['ពិសាខ']:
                return lunarMonths['ជេស្ឋ'];
            case lunarMonths['ជេស្ឋ']: {
                if (isKhmerLeapMonth(BEYear)) {
                    return lunarMonths['បឋមាសាឍ']
                } else {
                    return lunarMonths['អាសាឍ']
                }
            }
            case lunarMonths['អាសាឍ']:
                return lunarMonths['ស្រាពណ៍'];
            case lunarMonths['ស្រាពណ៍']:
                return lunarMonths['ភទ្របទ'];
            case lunarMonths['ភទ្របទ']:
                return lunarMonths['អស្សុជ'];
            case lunarMonths['អស្សុជ']:
                return lunarMonths['កក្ដិក'];
            case lunarMonths['កក្ដិក']:
                return lunarMonths['មិគសិរ'];
            case lunarMonths['បឋមាសាឍ']:
                return lunarMonths['ទុតិយាសាឍ'];
            case lunarMonths['ទុតិយាសាឍ']:
                return lunarMonths['ស្រាពណ៍'];
            default:
                throw Error('Plugin is facing wrong calculation (Invalid month)');
        }
    }

    const getKhNewYearMoment = (gregorianYear: any) => {
        if (Moment.khNewYearMoments[gregorianYear] !== undefined) {
            // console.log('cache')
            return Moment(Moment.khNewYearMoments[gregorianYear], 'DD-MM-YYYY H:m')
        } else {

            // ពីគ្រិស្ដសករាជ ទៅ ចុល្លសករាជ
            let jsYear = (gregorianYear + 544) - 1182;
            let info = getSoriyatraLerngSak(jsYear);
            // ចំនួនថ្ងៃចូលឆ្នាំ
            let numberNewYearDay: number;
            if (info.newYearsDaySotins[0].angsar === 0) { // ថ្ងៃ ខែ ឆ្នាំ ម៉ោង និង នាទី ចូលឆ្នាំ
                // ចូលឆ្នាំ ៤ ថ្ងៃ
                numberNewYearDay = 4;
                // return Moment(`13-04-${gregorianYear} ${info.timeOfNewYear.hour}:${info.timeOfNewYear.minute}`, 'DD-MM-YYYY H:m')
            } else {
                // ចូលឆ្នាំ ៣ ថ្ងៃ
                numberNewYearDay = 3;
                // return Moment(`14-04-${gregorianYear} ${info.timeOfNewYear.hour}:${info.timeOfNewYear.minute}`, 'DD-MM-YYYY H:m')
            }
            let epochLerngSak = Moment(`17-04-${gregorianYear} ${info.timeOfNewYear.hour}:${info.timeOfNewYear.minute}`, 'DD-MM-YYYY H:m')
            let khEpoch = findLunarDate(epochLerngSak)
            let diffFromEpoch = (((khEpoch.month - 4) * 30) + khEpoch.day) -
                (((info.lunarDateLerngSak.month - 4) * 30) + info.lunarDateLerngSak.day)
            let result = epochLerngSak.subtract(diffFromEpoch + numberNewYearDay - 1, 'day')
            // Caching
            Moment.khNewYearMoments[gregorianYear] = result.format('DD-MM-YYYY H:m')
            return result
        }
    }

    /**
     * Calculate date from momoentjs to Khmer date
     * @param target : Moment
     * @returns {{day: number, month: *, epochMoved: (*|moment.Moment)}}
     */
    const findLunarDate = (target: any): { day: number; month: number; epochMoved: any } => {
        /**
         * Epoch Date: January 1, 1900
         */
        let epochMoment = Moment('1/1/1900', 'D/M/YYYY')
        let khmerMonth = lunarMonths['បុស្ស'];
        let khmerDay = 0; // 0 - 29 ១កើត ... ១៥កើត ១រោច ...១៤រោច (១៥រោច)

        let differentFromEpoch = target.diff(epochMoment)

        // Find nearest year epoch
        if (differentFromEpoch > 0) {
            while (Moment.duration(target.diff(epochMoment), 'milliseconds').asDays() > getNumerOfDayInKhmerYear(getMaybeBEYear(epochMoment.clone().add(1, 'year')))) {
                epochMoment.add(getNumerOfDayInKhmerYear(getMaybeBEYear(epochMoment.clone().add(1, 'year'))), 'day')
            }
        } else {
            do {
                epochMoment.subtract(getNumerOfDayInKhmerYear(getMaybeBEYear(epochMoment)), 'day')
            } while (Moment.duration(epochMoment.diff(target), 'milliseconds').asDays() > 0)
        }

        // Move epoch month
        while (Moment.duration(target.diff(epochMoment), 'milliseconds').asDays() > getNumberOfDayInKhmerMonth(khmerMonth, getMaybeBEYear(epochMoment))) {
            epochMoment.add(getNumberOfDayInKhmerMonth(khmerMonth, getMaybeBEYear(epochMoment)), 'day');
            khmerMonth = nextMonthOf(khmerMonth, getMaybeBEYear(epochMoment))
        }

        khmerDay += Math.floor(Moment.duration(target.diff(epochMoment), 'milliseconds').asDays());

        /**
         * Fix result display 15 រោច ខែ ជេស្ឋ នៅថ្ងៃ ១ កើតខែបឋមាសាធ
         * ករណី ខែជេស្ឋមានតែ ២៩ ថ្ងៃ តែលទ្ធផលបង្ហាញ ១៥រោច ខែជេស្ឋ
         */
        const totalDaysOfTheMonth = getNumberOfDayInKhmerMonth(khmerMonth, getMaybeBEYear(target))
        if (totalDaysOfTheMonth <= khmerDay) {
            khmerDay = khmerDay % totalDaysOfTheMonth
            khmerMonth = nextMonthOf(khmerMonth, getMaybeBEYear(epochMoment))
        }

        epochMoment.add(Moment.duration(target.diff(epochMoment), 'milliseconds').asDays(), 'day');

        return {
            day: khmerDay,
            month: khmerMonth,
            epochMoved: epochMoment
        }
    }

    /**
     * Return khmer lunar date
     * @param format String (wanted format)
     * @return String
     * @or @param Array (wanted field) [ថ្ងៃ ថ្ងៃទី កើត/រោច ខែចន្ទគតិ ខែសុរិយគតិ ឆ្នាំសត្វ ឆ្នាំស័ក ពស គស ចស មស សីល]
     * @return Object
     */
    const toLunarDate = function (format: string) {
        const target = this.clone();
        const result = findLunarDate(target);
        return formatKhmerDate({
            day: result.day,
            month: result.month,
            moment: target,
        }, format);
    };

    const khDay = function () {
        const result = findLunarDate(this.clone());
        return result.day;
    };

    const khMonth = function () {
        const result = findLunarDate(this.clone());
        return result.month;
    };

    const khYear = function () {
        return getBEYear(this.clone());
    };

    //​ អនុញ្ញាតឲ្យប្រើប្រាស់ចំនួន៤
    Moment.fn.toLunarDate   = toLunarDate;
    Moment.fn.khDay         = khDay;
    Moment.fn.khMonth       = khMonth;
    Moment.fn.khYear        = khYear;

    return Moment;
}
