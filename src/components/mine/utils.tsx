export interface DaysSectionDataModel {
    monthYear: string;
    daysArray: { date: Date | null; selected: boolean; }[];
};

export const getYearList = (currentYear: number, listNext: boolean = false, listprev: boolean = false): number[] => {
    const yearList: number[] = [];
    let endDate;
    let start;
    if (listNext) {
        start = currentYear + 1;
        endDate = currentYear + 21;

    } else if (listprev) {
        endDate = currentYear;
        start = currentYear - 20;
    }
    else {
        endDate = currentYear + 10;
        start = currentYear - 10;
    }
    while (start < endDate) {
        yearList.push(start);
        start++;
    }

    return yearList;
}

export const getDayNames = (): string[] => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const getDaysInMonth = (year: number, month: number) => {
    const days: Date[] = [];
    const date = new Date(year, month, 1);
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
};
export const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

export const isWeekday = (date: Date) => !isWeekend(date);

export const createDateFromDayAndMonthYear = (day: number, monthYearString: string): Date => {
    const [monthName, year] = monthYearString.split(', ');
    const tempDate = new Date(Date.parse(monthName + " 1, " + year));
    const month = tempDate.getMonth();
    const yearNumber = parseInt(year, 10);
    return new Date(yearNumber, month, day);
}

export const formatDate = (date: Date | undefined): string => {
    if (typeof date === 'undefined') {
        return 'No Consecutive Dates Selected';
    }
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const monthName = monthNames[monthIndex];

    return `${day} ${monthName}, ${year}`;
};

export const getMonth = (year: number, month: number, next: boolean = true): { year: number; month: number } => {
    let resultMonth = month;
    let resultYear = year;

    if (next) {
        resultMonth += 1;
        if (resultMonth > 11) {
            resultMonth = 0;
            resultYear += 1;
        }
    } else {
        resultMonth -= 1;
        if (resultMonth < 0) {
            resultMonth = 11;
            resultYear -= 1;
        }
    }

    return { year: resultYear, month: resultMonth };
};

const transformDaysArray = (days: (Date | null)[]): { date: Date | null; selected: boolean; }[] => {
    return days.map(day => ({
        date: day,
        selected: false
    }));
};

export const getDaysSectionData = (currYear: number, month: number): DaysSectionDataModel[] => {
    const days = getDaysInMonth(currYear, month);
    const firstDayOfMonth = new Date(currYear, month, 1).getDay();
    const currMonthName = new Date(currYear, month).toLocaleString('default', { month: 'long' });
    const currMonthDaysArray = transformDaysArray([...Array.from({ length: (firstDayOfMonth + 6) % 7 }, () => null), ...days] as (Date | null)[]);
    let nextMonth = month + 1;
    let nextYear = currYear;

    if (nextMonth > 11) {
        nextMonth = 0;
        nextYear += 1;
    }
    const firstDayOfNextMonth = new Date(nextYear, nextMonth, 1).getDay();
    const nextMonthdays = getDaysInMonth(nextYear, nextMonth);
    const nextMonthName = new Date(nextYear, nextMonth).toLocaleString('default', { month: 'long' });
    const nextMonthDaysArray = transformDaysArray([...Array.from({ length: (firstDayOfNextMonth + 6) % 7 }, () => null), ...nextMonthdays] as (Date | null)[]);
    return [{ monthYear: `${currMonthName}, ${currYear}`, daysArray: currMonthDaysArray },
    { monthYear: `${nextMonthName}, ${nextYear}`, daysArray: nextMonthDaysArray },
    ]
};

export const updateDaysSectionDataOnSelection = (dayOfMonth: number, yearMonth: string, daysSectionData: DaysSectionDataModel[]) => {

    const [monthName, yearStr] = yearMonth.split(',').map(part => part.trim());
    const year = parseInt(yearStr, 10);
    console.log("monthName", monthName);
    const updateSection = (section: DaysSectionDataModel): DaysSectionDataModel => {
        if (section.monthYear !== yearMonth) {
            return section;
        }

        const updatedDaysArray = section.daysArray.map((dayItem: {
            date: Date | null;
            selected: boolean;
        }) => {
            if (dayItem.date && dayItem.date.getDate() === dayOfMonth) {
                return { ...dayItem, selected: !dayItem.selected };
            }
            return dayItem;
        });

        return { ...section, daysArray: updatedDaysArray };
    };

    if (isNaN(year) || isNaN(dayOfMonth) || dayOfMonth < 1 || dayOfMonth > 31) {
        console.error("Invalid input parameters.");
        return daysSectionData;
    }
    if (!Array.isArray(daysSectionData)) {
        console.error("Invalid daysSectionData array.");
        return daysSectionData;
    }

    return daysSectionData.map(updateSection);
}

export const dateRangeSelectedByUser = (daysSectionData: DaysSectionDataModel[]): { rangeSelected: boolean, startEndDate: Date[] | [] } => {
    const selectedDates = daysSectionData.flatMap(section =>
        section.daysArray
            .filter(day => day?.selected && day.date && isWeekday(day.date))
            .map(day => day.date!)
    );

    if (selectedDates.length === 0) {
        return { rangeSelected: false, startEndDate: [] };
    }

    selectedDates.sort((a, b) => a.getTime() - b.getTime());

    const startEndDate = [selectedDates[0], selectedDates[0]];
    let isConsecutive = true;

    for (let i = 1; i < selectedDates.length; i++) {
        const prevDate = selectedDates[i - 1];
        const currentDate = selectedDates[i];

        const dayDifference = (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

        if (dayDifference === 1 || dayDifference === 3) {
            startEndDate[1] = currentDate;
        } else {
            isConsecutive = false;
            break;
        }
    }
    return { rangeSelected: isConsecutive, startEndDate: isConsecutive ? startEndDate : [] };
}

const getNWeekdaysDate = (currentDate: Date, n: number, shouldForward: boolean): Date => {
    if (n <= 0) {
        throw new Error('The number of weekdays must be a positive integer.');
    }

    const resultDate = new Date(currentDate);
    let weekdaysCount = 0;

    while (weekdaysCount < n) {
        resultDate.setDate(resultDate.getDate() + (shouldForward ? 1 : -1));
        if (!isWeekend(resultDate)) {
            weekdaysCount++;
        }
    }
    return resultDate;
};

const updateSelectedDays = (daysSectionData: DaysSectionDataModel[], days: number, startingDate: Date): DaysSectionDataModel[] => {

    const findDateIndex = (daysArray: { date: Date | null; selected: boolean; }[], date: Date): number => {
        return daysArray.findIndex(d => d.date && d.date.getTime() === date.getTime());
    };

    const startMonthYear = `${startingDate.toLocaleString('default', { month: 'long' })}, ${startingDate.getFullYear()}`;

    const section = daysSectionData.find(d => d.monthYear === startMonthYear);
    if (!section) {
        throw new Error(`No data found for ${startMonthYear}.`);
    }

    const startIndex = findDateIndex(section.daysArray, startingDate);
    if (startIndex === -1) {
        throw new Error('Starting date not found in daysSectionData.');
    }

    let daysToSelect = days;
    let index = startIndex;

    while (daysToSelect > 0 && index < section.daysArray.length) {
        const currentDay = section.daysArray[index];
        if (currentDay.date && !isWeekend(currentDay.date)) {
            currentDay.selected = true;
            daysToSelect--;
        }
        index++;
    }

    if (daysToSelect > 0) {

        const nextSection = daysSectionData.find(d => d.monthYear !== startMonthYear);
        if (nextSection) {
            index = 0;

            while (daysToSelect > 0 && index < nextSection.daysArray.length) {
                const currentDay = nextSection.daysArray[index];
                if (currentDay.date && !isWeekend(currentDay.date)) {
                    currentDay.selected = true;
                    daysToSelect--;
                }
                index++;
            }
        }
    }
    return daysSectionData;
}

export const handleNextLastCustomDate = (daysSectionData: DaysSectionDataModel[], goLast: boolean, days: number, selectedDate: Date) => {
    const lk: Date = getNWeekdaysDate(selectedDate, days, !goLast);

    const currentData = daysSectionData.find(data => data.daysArray.some(day => day?.selected));
    if (!currentData) {
        console.log('No current selection found.');
    }

    let updatedDaysSectionData: DaysSectionDataModel[];
    if (goLast) {
        updatedDaysSectionData = updateSelectedDays(getDaysSectionData(lk.getFullYear(), lk.getMonth()), days + 1, lk);

    } else {
        updatedDaysSectionData = updateSelectedDays(getDaysSectionData(selectedDate.getFullYear(), selectedDate.getMonth()), days + 1, selectedDate);
    }


    return updatedDaysSectionData;
};
