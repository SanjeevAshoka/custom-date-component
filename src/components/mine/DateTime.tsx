import React, { useEffect, useState, ChangeEvent } from 'react';
import './DateTime.css';
import { DaysSectionDataModel, createDateFromDayAndMonthYear, dateRangeSelectedByUser, formatDate, getDaysSectionData, getMonth, getYearList, handleNextLastCustomDate, isWeekend, toLocaleMonthYear, updateDaysSectionDataOnSelection } from './utils';
import { useAppContext } from '../../Context/Context';


const DateTime: React.FC = () => {
    const { data, languageUpdate } = useAppContext();
    const [selectingYear, setSelectingYear] = useState<boolean>(false);
    const [currYear, setCurrentYear] = useState(new Date().getFullYear());
    const [yearsArr, setYearsArr] = useState<[] | number[]>([]);
    const [month, setMonth] = useState<number>(new Date().getMonth());
    const [selectedStartDate, setSelectedStartDate] = useState<Date>();
    const [daysSectionData, setDaysSectionData] = useState<DaysSectionDataModel[] | []>([]);
    const [lastInputValue, setLastInputValue] = useState<string>('');
    const [nextInputValue, setNextInputValue] = useState<string>('');
    const [showWarn, setShowWarn] = useState<string>('');
    const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
    const [showIcon, setShowIcon] = useState(false);
    const [selectedEndDate, setSelectedEndDate] = useState<Date>();


    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        setYearsArr(() => getYearList(currYear));
    }, [currYear]);

    useEffect(() => {
        setDaysSectionData(() => getDaysSectionData(currYear, month));
    }, [currYear, month]);


    useEffect(() => {
        const result = dateRangeSelectedByUser(daysSectionData);
        if (result?.rangeSelected) {
            setSelectedStartDate(() => result.startEndDate[0]);
            setSelectedEndDate(() => result.startEndDate[1]);
        } else {
            setSelectedStartDate(() => undefined);
            setSelectedEndDate(() => undefined);
        }
    }, [daysSectionData]);

    const handleSelectingYear = () => {
        setSelectingYear(() => !selectingYear);
    }

    const handleResize = () => {
        setScreenWidth(window.innerWidth);
        setShowIcon(window.innerWidth < 750);
    };

    const handleListBtnClick = (increment: boolean) => {
        if (increment) {
            setYearsArr(getYearList(yearsArr[yearsArr.length - 1], true, false));
        }
        else {
            setYearsArr(getYearList(yearsArr[0], false, true));
        }
    };

    const handleYearSelected = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        if (target.tagName === 'SPAN') {
            const clickedYear = target.textContent;
            if (clickedYear) {
                setCurrentYear(() => parseInt(clickedYear));
            }
        }
        setSelectingYear(() => !selectingYear);
    }

    const handleYearInc = (increment: boolean) => {
        if (increment) { setCurrentYear((curr) => curr + 1); }
        else { setCurrentYear((curr) => curr - 1); }
    }

    const LeftRightIconClick = (increment: boolean) => {
        const result: { year: number; month: number } = getMonth(currYear, month, increment);
        if (result.year !== currYear) {
            setCurrentYear(() => result.year);
        }
        setMonth(result.month);
    }

    const handleDayClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, currentMonthYear: string) => {
        const target = event.target as HTMLElement;
        if (target.classList.contains('dayelse') || target.classList.contains('defaultCursor')) {
            const dayElement = target.closest('.dayItem');
            if (dayElement) {
                const dateText = dayElement.textContent;
                if (dateText) {
                    const day = parseInt(dateText || '', 10);
                    if (!isWeekend(createDateFromDayAndMonthYear(day, currentMonthYear))) {
                        setDaysSectionData((daysSectionData) => updateDaysSectionDataOnSelection(day, currentMonthYear, daysSectionData));
                    }
                }
            }
        }
    };

    const handleCustomDaysSelected = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        if (name === 'lastInput') {
            setLastInputValue(() => value);
        } else if (name === 'nextInput') {
            setNextInputValue(() => value);
        }
    };

    const handleCustomSubmit = (lastNextCustom: string) => {
        const parsedVal = lastNextCustom === 'last' ? parseInt(lastInputValue) : parseInt(nextInputValue);
        if (isNaN(parsedVal)) {
            setShowWarn('Please Provide Valid Input');
            setTimeout(() => setShowWarn(''), 4000);
        } else {
            if (parsedVal > 20 || parsedVal < 1) {
                setShowWarn('Please Provide Value in Range of 2 to 20');
                setTimeout(() => setShowWarn(''), 4000);
            } else {
                if (lastNextCustom === 'last' && selectedStartDate) {
                    setDaysSectionData(handleNextLastCustomDate(daysSectionData, true, parsedVal, selectedStartDate));
                }
                else if (lastNextCustom === 'next' && selectedStartDate) {
                    setDaysSectionData(handleNextLastCustomDate(daysSectionData, false, parsedVal, selectedStartDate));

                }
            }

        }
    }

    return (
        <>
            <div className="locale__section">
                {data?.langData?.languageOptions && data.langData.languageOptions.map(
                    (languageItem: any) => (<span key={languageItem.languageText} className={`child ${data?.currLang === languageItem.languageText ? '' : 'lighten'}`} onClick={() => languageUpdate(languageItem.languageText)}
                    >{showIcon ? languageItem.flag : languageItem.languageText + "-" + languageItem.flag}</span>))}
            </div>
            <h1 className='appHeader'>{data?.langData?.appHeader}</h1>
            <div className='root'>
                {showWarn && showWarn.length > 0 && <span className='warning'>{showWarn}</span>}
                <div className="yearsAndMonth">
                    <div className="yearSection">
                        <div><span><strong className='textOfApp'>{data?.langData.yearText} : </strong></span></div>
                        <div><button className='btn' onClick={() => handleYearInc(false)}>-</button></div>
                        <div className="selectedYear" >
                            <p onClick={handleSelectingYear}>{currYear}</p>
                            <span onClick={handleSelectingYear} className='arrowIcons'>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    className={`dropdown-icon ${selectingYear && screenWidth > 650 ? 'rotate-down' : 'rotate-right'}`}
                                >
                                    <path d="M10 17l5-5-5-5v10z" />
                                </svg>
                            </span>
                            {selectingYear && <div className="yearsList">
                                <div className='listBtn'><button className='btnList' onClick={() => handleListBtnClick(false)}>-</button></div>
                                <div className="listContainer" onClick={handleYearSelected}>
                                    {
                                        yearsArr.map((item: number, ind: number) => <span key={ind} className={`yearItem ${currYear === item ? 'selectedYear' : ''}`}>{item}</span>)
                                    }
                                </div>
                                <div className='listBtn'><button className='btnList' onClick={() => handleListBtnClick(true)}>+</button></div>
                            </div>}
                        </div>
                        <div><button className='btn' onClick={() => handleYearInc(true)}>+</button></div>
                    </div>
                    <div className='monthSection'>
                        <div><span><strong className='textOfApp'>{data?.langData.monthText} : </strong></span></div>
                        <div className='select-container '>
                            <select
                                value={month}
                                onChange={(e) => setMonth(Number(e.target.value))}

                            >
                                {Array.from({ length: 12 }, (_, i) => i).map((m) => (
                                    <option key={m} value={m}>
                                        {data?.langData?.monthsArray[m]}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="startDateSection">
                    <div className='startDatePara'>
                        <p className="startEndPara">{data?.langData?.userStartDateText}</p><span className='dateRes'>{formatDate(selectedStartDate) === 'No Consecutive Dates Selected' ? data.langData.noConsecutiveText : formatDate(selectedStartDate, data?.langData?.monthsArray)}</span>
                    </div>
                    <div className='startDatePara'>
                        <p className="startEndPara">{data.langData.userEndDateText}</p><span className='dateRes'>{formatDate(selectedEndDate) === 'No Consecutive Dates Selected' ? data.langData.noConsecutiveText : formatDate(selectedEndDate, data?.langData?.monthsArray)}</span>
                    </div>
                </div>
                <div className="monthUiSection">
                    <div className='monthContentSection'>
                        {daysSectionData?.length > 0 && daysSectionData.map((item: DaysSectionDataModel, ind: number) => (
                            <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }} key={ind}>
                                <div className='monthHeader'><span>{toLocaleMonthYear(item.monthYear, data?.langData?.monthsArray)}</span></div>
                                <div
                                    className='weekDaySection'>
                                    {data?.langData?.weekDays.map((dayName: string) => (
                                        <div key={dayName} style={{ padding: '10px', textAlign: 'center' }}>
                                            {dayName}
                                        </div>
                                    ))}
                                </div>
                                <div className="daysSection">
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }} onClick={(e) => handleDayClick(e, item.monthYear)}>
                                        {item?.daysArray.map((day: { date: Date | null; selected: boolean; }, index: number) => (
                                            <div
                                                className={`dayItem ${day.date && isWeekend(day.date) ? '' : 'dayelse'} ${day.date ? 'defaultCursor' : ''} ${day.date && day.selected && !isWeekend(day.date) ? 'selectedColor' : ''} ${day.date && formatDate(day.date) === formatDate(new Date()) ? 'todaysDate' : ''}`}
                                                key={index}
                                            >
                                                {day?.date ? day.date.getDate() : ''}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        ))}
                    </div>
                    <div className='iconsLeftRight'>
                        <span onClick={() => LeftRightIconClick(false)}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox='0 0 24 24'
                                width="44"
                                height="44"
                                fill='rgba(22, 22, 22, 0.5)'
                                className='arrowIconsLeftRight'
                            >
                                <path d='M15 19l-7-7 7-7v14z' />
                            </svg>
                        </span>
                        <span onClick={() => LeftRightIconClick(true)}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox='0 -2 24 24'
                                width="44"
                                height="44"
                                fill='rgba(22, 22, 22, 0.5)'
                                className='arrowIconsLeftRight'
                            >
                                <path d='M10 17l7-7-7-7v10z' />
                            </svg>
                        </span>
                    </div>
                    <div className="startEndDate">
                        <header className='monthHeader headerEnd'>{data?.langData?.nextLastHeaderText}</header>
                        <div className="endDateSection">
                            <div className='endSectionBtnAndInput'>
                                <div className="content">
                                    <span><strong className='textOfApp'>{data?.langData?.lastText}</strong></span>
                                    <input type="text" value={lastInputValue} name='lastInput' onChange={handleCustomDaysSelected} />
                                    <span><strong className='textOfApp'>{data?.langData?.daysText}</strong></span>
                                </div>

                                <div className='btnHolder'>
                                    <button className='btn' onClick={() => handleCustomSubmit('last')}>{data?.langData?.submitBtnText}</button>
                                </div>

                            </div>
                            <div className='endSectionBtnAndInput'>
                                <div className="content">
                                    <span><strong className='textOfApp'>{data?.langData?.nextText}</strong></span>
                                    <input type="text" value={nextInputValue} name='nextInput' onChange={handleCustomDaysSelected} />
                                    <span><strong className='textOfApp'>{data?.langData?.daysText}</strong></span>
                                </div>
                                <div className='btnHolder'>
                                    <button className='btn' onClick={() => handleCustomSubmit('next')}>{data?.langData?.submitBtnText}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="selectedDateList">
                        <div className='selectedDateListHeaderParent'><span className='selectedDateListHeader'>{data?.langData?.selectedDatesHeader}</span></div>
                        <div className='selectedDatesListItems'>
                            {
                                daysSectionData?.length > 0 && daysSectionData.map((item: DaysSectionDataModel) =>
                                    item.daysArray.map((date: { date: Date | null; selected: boolean }, indDate: number) =>
                                        date.selected && date?.date ? <span className='dateItem' key={indDate}>{formatDate(date.date, data?.langData?.monthsArray)}</span> : false
                                    )
                                )
                            }
                        </div>
                    </div>
                </div>

            </div>
        </>

    );
};

export default DateTime;
