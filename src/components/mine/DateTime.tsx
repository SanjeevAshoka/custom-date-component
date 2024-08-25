import React, { useEffect, useState, ChangeEvent } from 'react';
import './DateTime.css';
import { DaysSectionDataModel, dateRangeSelectedByUser, formatDate, getDayNames, getDaysSectionData, getMonth, getYearList, handleNextLastCustomDate, isWeekend, updateDaysSectionDataOnSelection } from './utils';


const DateTime: React.FC = () => {
    const [selectingYear, setSelectingYear] = useState<boolean>(false);
    const [currYear, setCurrentYear] = useState(new Date().getFullYear());
    const [yearsArr, setYearsArr] = useState<[] | number[]>([]);
    const [month, setMonth] = useState<number>(new Date().getMonth());
    const [selectedStartDate, setSelectedStartDate] = useState<Date>();
    const [selectedEndDate, setSelectedEndDate] = useState<string>('No Consecutive Dates Selected');
    const [daysSectionData, setDaysSectionData] = useState<DaysSectionDataModel[] | []>([]);
    const [lastInputValue, setLastInputValue] = useState<string>('');
    const [nextInputValue, setNextInputValue] = useState<string>('');
    const [showWarn, setShowWarn] = useState<string>('');
    const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

    const handleResize = () => {
        setScreenWidth(window.innerWidth);
    };
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleSelectingYear = () => {
        setSelectingYear(() => !selectingYear);
    }
    useEffect(() => {
        setYearsArr(() => getYearList(currYear));
    }, [currYear]);
    useEffect(() => {
        setDaysSectionData(() => getDaysSectionData(currYear, month));
    }, [currYear, month])
    const handleListBtnClick = (increment: boolean) => {
        if (increment) {
            setYearsArr(getYearList(yearsArr[yearsArr.length - 1], true, false));
        }
        else {
            setYearsArr(getYearList(yearsArr[0], false, true));
        }
    }

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
    useEffect(() => {
        const result = dateRangeSelectedByUser(daysSectionData);
        if (result?.rangeSelected) {
            setSelectedStartDate(() => result.startEndDate[0]);
            setSelectedEndDate(() => formatDate(result.startEndDate[1]))
        } else {
            setSelectedStartDate(() => undefined);
            setSelectedEndDate(() => 'No Consecutive Dates Selected');
        }
    }, [daysSectionData]);

    const handleDayClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, currentMonthYear: string) => {
        const target = event.target as HTMLElement;
        if (target.classList.contains('dayelse') || target.classList.contains('defaultCursor')) {
            const dayElement = target.closest('.dayItem');
            if (dayElement) {
                const dateText = dayElement.textContent;
                if (dateText) {
                    const day = parseInt(dateText || '', 10);
                    setDaysSectionData((daysSectionData) => updateDaysSectionDataOnSelection(day, currentMonthYear, daysSectionData));
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
        <div className='root'>
            {showWarn && showWarn.length > 0 && <span className='warning'>{showWarn}</span>}
            <div className="yearsAndMonth">
                <div className="yearSection">
                    <div><span>Year: </span></div>
                    <div><button className='btn' onClick={() => handleYearInc(false)}>-</button></div>
                    <div className="selectedYear" onClick={handleSelectingYear}>
                        <p>{currYear}</p>
                        <span className='arrowIcons'>
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
                    <div><span>Month: </span></div>
                    <div className='select-container '>
                        <select
                            value={month}
                            onChange={(e) => setMonth(Number(e.target.value))}

                        >
                            {Array.from({ length: 12 }, (_, i) => i).map((m) => (
                                <option key={m} value={m}>
                                    {new Date(0, m).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="startDateSection">
                <div className='startDatePara'>
                    <p className="startEndPara">Your Start Date:</p><span className='dateRes'>{formatDate(selectedStartDate)}</span>
                </div>
                <div className='startDatePara'>
                    <p className="startEndPara">Your End Date: </p><span className='dateRes'>{selectedEndDate}</span>
                </div>
            </div>
            <div className="monthUiSection">
                <div className='monthContentSection'>
                    {daysSectionData?.length > 0 && daysSectionData.map((item: DaysSectionDataModel, ind: number) => (
                        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }} key={ind}>
                            <div className='monthHeader'><span>{item.monthYear}</span></div>
                            <div
                                className='weekDaySection'>
                                {getDayNames().map((dayName) => (
                                    <div key={dayName} style={{ padding: '10px', textAlign: 'center' }}>
                                        {dayName}
                                    </div>
                                ))}
                            </div>
                            <div className="daysSection">
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }} onClick={(e) => handleDayClick(e, item.monthYear)}>
                                    {item?.daysArray.map((day: { date: Date | null; selected: boolean; }, index: number) => (
                                        <div
                                            className={`dayItem ${day.date && isWeekend(day.date) ? '' : 'dayelse'} ${day.date ? 'defaultCursor' : ''} ${day.selected ? 'selectedColor' : ''} ${day.date && formatDate(day.date) === formatDate(new Date()) ? 'todaysDate' : ''}`}
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
                    <header className='monthHeader headerEnd'>Select by Entering Value</header>
                    <div className="endDateSection">
                        <div className='endSectionBtnAndInput'>
                            <div className="content">
                                <span>Last</span>
                                <input type="text" value={lastInputValue} name='lastInput' onChange={handleCustomDaysSelected} />
                                <span>Days</span>
                            </div>

                            <div className='btnHolder'>
                                <button className='btn' onClick={() => handleCustomSubmit('last')}>Submit</button>
                            </div>

                        </div>
                        <div className='endSectionBtnAndInput'>
                            <div className="content">
                                <p>Next</p>
                                <input type="text" value={nextInputValue} name='nextInput' onChange={handleCustomDaysSelected} />
                                <p>Days</p>
                            </div>
                            <div className='btnHolder'>
                                <button className='btn' onClick={() => handleCustomSubmit('next')}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="selectedDateList">
                    <div><span className='selectedDateListHeader'>Selected Dates</span></div>
                    <div className='selectedDatesListItems'>
                        {
                            daysSectionData?.length > 0 && daysSectionData.map((item: DaysSectionDataModel) =>
                                item.daysArray.map((date: { date: Date | null; selected: boolean }, indDate: number) =>
                                    date.selected && date?.date ? <span className='dateItem' key={indDate}>{formatDate(date.date)}</span> : false
                                )
                            )
                        }
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DateTime;
