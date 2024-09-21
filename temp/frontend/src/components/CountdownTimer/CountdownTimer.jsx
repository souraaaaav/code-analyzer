import React, { useEffect, useState } from 'react';

function CountdownTimer({ endDate }) {
    const calculateTimeLeft = () => {
        const difference = +new Date(endDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const addLeadingZero = (value) => {
        return value < 10 ? `0${value}` : value;
    };

    return (
        <div className="time-countdown clearfix">
            <div className="counter-column">
                <div className="inner">
                    <span className="count">{addLeadingZero(timeLeft.days)}</span>Days
                </div>
            </div>
            <div className="counter-column">
                <div className="inner">
                    <span className="count">{addLeadingZero(timeLeft.hours)}</span>Hours
                </div>
            </div>
            <div className="counter-column">
                <div className="inner">
                    <span className="count">{addLeadingZero(timeLeft.minutes)}</span>Mins
                </div>
            </div>
            <div className="counter-column">
                <div className="inner">
                    <span className="count">{addLeadingZero(timeLeft.seconds)}</span>Secs
                </div>
            </div>
        </div>
    );
}

export default CountdownTimer;
