import { momentkhConstant } from "./constants";
const constants = momentkhConstant();

export const getSoriyatraLerngSak = (jsYear: number) => {
    return (function (jsYear) {

        const LunarMonths = constants.LunarMonths;

        /**
         * គណនា ហារគុន Kromathopol អវមាន និង បូតិថី
         * @param jsYear
         * @returns {{bodithey: number, avaman: number, kromathopol: number, harkun: number}}
         */
        const getInfo = (jsYear: number): { harkun: number; kromathopol: number; avaman: number; bodithey: number; } => {
            let h = 292207 * jsYear + 373;
            let harkun = Math.floor(h / 800) + 1;
            let kromathopol = 800 - (h % 800);
            let a = 11 * harkun + 650;
            let avaman = a % 692;
            let bodithey = (harkun + Math.floor((a / 692))) % 30;
            return { harkun, kromathopol, avaman, bodithey }
        }

        const info: { harkun: number; kromathopol: number; avaman: number; bodithey: number; } = getInfo(jsYear);

        /**
         * ឆ្នាំចុល្លសករាជដែលមាន៣៦៦ថ្ងៃ
         * @param jsYear
         * @returns {boolean}
         */
        const getHas366day = (jsYear: number): boolean => {
            const infoOfYear: { harkun: number; kromathopol: number; avaman: number; bodithey: number; } = getInfo(jsYear);
            return infoOfYear.kromathopol <= 207;
        }

        /**
         * រកឆ្នាំអធិកមាស
         * @param jsYear
         * @returns {boolean}
         */
        const getIsAthikameas = (jsYear: number): boolean => {
            const infoOfYear = getInfo(jsYear);
            const infoOfNextYear = getInfo(jsYear + 1);
            return (!(infoOfYear.bodithey === 25 && infoOfNextYear.bodithey === 5) &&
                (infoOfYear.bodithey > 24 ||
                    infoOfYear.bodithey < 6 ||
                    (infoOfYear.bodithey === 24 &&
                        infoOfNextYear.bodithey === 6
                    )
                )
            );
        }

        /**
         * រកឆ្នាំចន្ទ្រាធិមាស
         * @param jsYear
         * @returns {boolean}
         */
        const getIsChantreathimeas = (jsYear: number): boolean => {
            const infoOfYear = getInfo(jsYear);
            const infoOfNextYear = getInfo(jsYear + 1);
            const infoOfPreviousYear = getInfo(jsYear - 1);
            const has366day = getHas366day(jsYear);
            return ((has366day && infoOfYear.avaman < 127) ||
                (!(infoOfYear.avaman === 137 &&
                    infoOfNextYear.avaman === 0) &&
                    ((!has366day &&
                        infoOfYear.avaman < 138) ||
                        (infoOfPreviousYear.avaman === 137 &&
                            infoOfYear.avaman === 0
                        )
                    )
                )
            );
        }

        let has366day = getHas366day(jsYear);
        let isAthikameas = getIsAthikameas(jsYear)
        let isChantreathimeas = getIsChantreathimeas(jsYear)

        /**
         * ឆែកមើលថាជាឆ្នាំដែលខែជេស្ឋមាន៣០ថ្ងៃឬទេ
         * @type {boolean}
         */
        const jesthHas30: boolean = ((): boolean => {
            let tmp = isChantreathimeas;
            if (isAthikameas && isChantreathimeas) {
                tmp = false;
            }
            if (!isChantreathimeas && getIsAthikameas(jsYear - 1) && getIsChantreathimeas(jsYear - 1)) {
                tmp = true;
            }
            return tmp;
        })();

        /**
         * រកមើលថាតើថ្ងៃឡើងស័កចំថ្ងៃអ្វី
         * @type {number}
         */
        let dayLerngSak: number = (info.harkun - 2) % 7;

        /**
         * គណនារកថ្ងៃឡើងស័ក
         * @type {{month, day}}
         */
        const lunarDateLerngSak: { day: number, month: number } = (() => {
            let bodithey = info.bodithey;
            if (getIsAthikameas(jsYear - 1) && getIsChantreathimeas(jsYear - 1)) {
                bodithey = (bodithey + 1) % 30;
            }
            return {
                day: bodithey >= 6 ? bodithey - 1 : bodithey,
                month: bodithey >= 6 ? LunarMonths['ចេត្រ'] : LunarMonths['ពិសាខ']
            };
        })();

        const getSunInfo = (sotin: number) => { // សុទិន
            const infoOfPreviousYear = getInfo(jsYear - 1);
            // ១ រាសី = ៣០ អង្សា
            // ១ អង្សា = ៦០ លិប្ដា
            const sunAverageAsLibda = (() => {
                // មធ្យមព្រះអាទិត្យ គិតជាលិប្ដា
                const r2 = 800 * sotin + infoOfPreviousYear.kromathopol;
                const reasey = Math.floor(r2 / 24350); // រាសី
                const r3 = r2 % 24350;
                const angsar = Math.floor(r3 / 811);   // អង្សា
                const r4 = r3 % 811;
                const l1 = Math.floor(r4 / 14);
                const libda = l1 - 3; // លិប្ដា
                return (30 * 60 * reasey) + (60 * angsar) + libda;
            })();

            const leftOver = (() => {
                const s1 = (30 * 60 * 2) + (60 * 20);
                let leftOver = sunAverageAsLibda - s1; // មធ្យមព្រះអាទិត្យ - R2.A20.L0
                if (sunAverageAsLibda < s1) { // បើតូចជាង ខ្ចី ១២ រាសី
                    leftOver += (30 * 60 * 12);
                }
                return leftOver;
            })();

            const kaen = (() => {
                return Math.floor(leftOver / (30 * 60));
            })();

            const lastLeftOver = (() => {
                let rs = -1;
                if ([0, 1, 2].includes(kaen)) {
                    rs = kaen;
                } else if ([3, 4, 5].includes(kaen)) {
                    rs = (30 * 60 * 6) - leftOver; // R6.A0.L0 - leftover
                } else if ([6, 7, 8].includes(kaen)) {
                    rs = leftOver - (30 * 60 * 6); // leftover - R6.A0.L0
                } else if ([9, 10, 11].includes(kaen)) {
                    rs = (30 * 60 * 11) + (60 * 29) + 60 - leftOver; // R11.A29.L60 - leftover
                }
                return {
                    reasey: Math.floor(rs / (30 * 60)),
                    angsar: Math.floor((rs % (30 * 60)) / 60),
                    libda: rs % 60,
                };
            })();

            const [khan, pouichalip] = (() => { // ខណ្ឌ និង pouichalip
                if (lastLeftOver.angsar >= 15) {
                    return [
                        2 * lastLeftOver.reasey + 1,
                        60 * (lastLeftOver.angsar - 15) + lastLeftOver.libda,
                    ];
                } else {
                    return [
                        2 * lastLeftOver.reasey,
                        60 * lastLeftOver.angsar + lastLeftOver.libda,
                    ];
                }
            })();

            const phol = (() => { // phol
                const chhayaSun = (khan: number) => {
                    const multiplicities = [35, 32, 27, 22, 13, 5];
                    const chhayas = [0, 35, 67, 94, 116, 129];

                    switch (khan) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                            return {
                                multiplicity: multiplicities[khan],
                                chhaya: chhayas[khan],
                            };
                        default:
                            return {
                                chhaya: 134,
                            };
                    }
                };

                const val = chhayaSun(khan);
                const q = Math.floor((pouichalip * val.multiplicity) / 900);

                return {
                    reasey: 0,
                    angsar: Math.floor((q + val.chhaya) / 60),
                    libda: (q + val.chhaya) % 60,
                };
            })();

            const sunInaugurationAsLibda = (() => { // សម្ពោធព្រះអាទិត្យ
                const pholAsLibda = (30 * 60 * phol.reasey) + (60 * phol.angsar) + phol.libda;
                return kaen <= 5
                    ? sunAverageAsLibda - pholAsLibda
                    : sunAverageAsLibda + pholAsLibda;
            })();

            return {
                sunAverageAsLibda,
                khan,
                pouichalip,
                phol,
                sunInaugurationAsLibda,
            };
        };


        const newYearsDaySotins = (() => { // ចំនួនថ្ងៃវ័នបត
            const sotins = getHas366day(jsYear - 1) ? [363, 364, 365, 366] : [362, 363, 364, 365]; // សុទិន
            return sotins.map(sotin => {
                const sunInfo = getSunInfo(sotin);
                return {
                    sotin,
                    reasey: Math.floor(sunInfo.sunInaugurationAsLibda / (30 * 60)),
                    // អង្សាស្មើសូន្យ គីជាថ្ងៃចូលឆ្នាំ, មួយ ឬ ពីរ ថ្ងៃបន្ទាប់ជាថ្ងៃវ័នបត ហើយ ថ្ងៃចុងក្រោយគីឡើងស័ក
                    angsar: Math.floor((sunInfo.sunInaugurationAsLibda % (30 * 60)) / (60)),
                    libda: sunInfo.sunInaugurationAsLibda % 60,
                };
            });
        })();


        const timeOfNewYear = (() => {
            const sotinNewYear = newYearsDaySotins.filter(sotin => sotin.angsar === 0);
            if (sotinNewYear.length > 0) {
                const libda = sotinNewYear[0].libda; // ២៤ ម៉ោង មាន ៦០លិប្ដា
                const minutes = (24 * 60) - (libda * 24);
                return {
                    hour: Math.floor(minutes / 60),
                    minute: minutes % 60,
                };
            } else {
                throw Error('Plugin is facing wrong calculation on new year\'s hour. No sotin with angsar = 0');
            }
        })();


        return {
            harkun: info.harkun,
            kromathopol: info.kromathopol,
            avaman: info.avaman,
            bodithey: info.bodithey,
            has366day,          // សុរិយគតិខ្មែរ
            isAthikameas,       // 13 months
            isChantreathimeas,  // 30ថ្ងៃនៅខែជេស្ឋ
            jesthHas30,         // ខែជេស្ឋមាន៣០ថ្ងៃ
            dayLerngSak,        // ថ្ងៃឡើងស័ក ច័ន្ទ អង្គារ ...
            lunarDateLerngSak,  // ថ្ងៃទី ខែ ឡើងស័ក
            newYearsDaySotins,  // សុទិនសម្រាប់គណនាថ្ងៃចូលឆ្នាំ ថ្ងៃវ័នបត និង ថ្ងៃឡើងស័ក
            timeOfNewYear       // ម៉ោងទេវតាចុះ
        }
    })(jsYear);
}