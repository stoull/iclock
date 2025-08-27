import { useState, useEffect, use } from "react";
import './DigitalClock.css';

import { t, tWithFallback, tOptional, tSmart } from '../assets/i18n/translationHelpers.js';

function DigitalClock({ fontSize }) {
    const [timeFontSize, setTimeFontSize] = useState(fontSize || '16rem');
    const [dotFontSize, setDotFontSize] = useState(fontSize || '16rem');
    const [meridiemFontSize, setMeridiemFontSize] = useState(fontSize || '16rem');
    const [dayFontSize, setDayFontSize] = useState(fontSize || '16rem');
    const [timeInfo, setTimeInfo] = useState({});

    useEffect(() => {
        // 当fontSize属性变化时，更新字体大小
        let newFontSize = fontSize || '16rem';
        let newFloat = parseFloat(newFontSize); 
        const dotSize = newFloat + 'rem';
        const meridiemSize = newFloat * 0.8 + 'rem';
        const daySize = newFloat *0.6 + 'rem';
        console.log('DigitalClock fontSize changed:', fontSize, newFontSize, dotSize, meridiemSize, daySize);
        setTimeFontSize(newFontSize);
        setDotFontSize(dotSize);
        setMeridiemFontSize(meridiemSize);
        setDayFontSize(daySize);
    }, [fontSize]);

    function updateTimeFontSize(newSize) {

    }

    useEffect(() => {
        const newInfo = formatTimeFormDate(new Date());
        setTimeInfo(newInfo);
        const intervalId = setInterval(() => {
            const newInfo = formatTimeFormDate(new Date());
            setTimeInfo( (prev) => ({
                ...prev,
                ...newInfo
            }));
        }, 60000); // 每60秒更新一次时间

        return () => clearInterval(intervalId); // 组件卸载时清除定时器
    },[]);

    function formatTimeFormDate(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const meridian = hours >= 12 ? 'PM' : 'AM';
        const dayOfWeek = date.getDay();
        const days = [t("date.日"), t("date.一"), t("date.二"), t("date.三"), t("date.四"), t("date.五"), t("date.六")];
        const dayOfWeekName = days[dayOfWeek];
        return {
            hours,
            minutes,
            seconds,
            meridian,
            dayOfWeekName
        }
    }


    return (
        <div className="digital-clock"> 
            <div style={{ fontSize: timeFontSize}}> {timeInfo.hours} </div>
            <div className="digital-clock-dot" style={{ fontSize: dotFontSize}}>:</div>
            <div style={{ fontSize: timeFontSize}}> {timeInfo.minutes} </div>
            {/* <div style={{ fontSize: meridiemFontSize}}> {timeInfo.meridian} </div> */}
            <div className="digital-clock-day" style={{ fontSize: dayFontSize}}> {timeInfo.dayOfWeekName} </div>
        </div>

    );
}

export default DigitalClock;