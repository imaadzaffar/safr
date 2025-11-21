import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
    value: string;
    onChange: (date: string) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(() => {
        const date = value ? new Date(value) : new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1);
    });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0, width: 0 });

    const selectedDate = value ? new Date(value) : null;

    // Update button position when opening
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const isMobile = window.innerWidth < 768;

            // On mobile, position above the button; on desktop, below
            const topPosition = isMobile
                ? rect.top + window.scrollY - 320 // 320px is approximate calendar height
                : rect.bottom + window.scrollY + 8;

            setButtonPosition({
                top: topPosition,
                left: isMobile ? 16 : rect.left + window.scrollX,
                width: rect.width
            });
        }
    }, [isOpen]);

    const daysInMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
    ).getDate();

    const firstDayOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
    ).getDay();

    const monthNames = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
    ];

    const handleDateClick = (day: number) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        onChange(date.toISOString().split('T')[0]);
        setIsOpen(false);
    };

    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const formatDisplayDate = (dateStr: string) => {
        if (!dateStr) return 'select date';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30 text-white text-left"
            >
                {formatDisplayDate(value)}
            </button>

            {isOpen && createPortal(
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-20"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Calendar Popup */}
                    <div
                        className="fixed z-30 w-[calc(100vw-2rem)] md:w-72 bg-gray-800 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl p-4"
                        style={{
                            top: `${buttonPosition.top}px`,
                            left: `${buttonPosition.left}px`,
                        }}
                    >
                        {/* Month Navigation */}
                        <div className="flex items-center justify-between mb-4">
                            <button
                                type="button"
                                onClick={goToPreviousMonth}
                                className="p-1 hover:bg-white/10 rounded transition-colors"
                            >
                                <ChevronLeft size={20} className="text-white" />
                            </button>
                            <span className="text-white font-bold">
                                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </span>
                            <button
                                type="button"
                                onClick={goToNextMonth}
                                className="p-1 hover:bg-white/10 rounded transition-colors"
                            >
                                <ChevronRight size={20} className="text-white" />
                            </button>
                        </div>

                        {/* Day Headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                <div key={i} className="text-center text-xs text-white/50 font-bold">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Days */}
                        <div className="grid grid-cols-7 gap-1">
                            {/* Empty cells for days before month starts */}
                            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                <div key={`empty-${i}`} />
                            ))}

                            {/* Days of the month */}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                const isSelected = selectedDate &&
                                    date.getFullYear() === selectedDate.getFullYear() &&
                                    date.getMonth() === selectedDate.getMonth() &&
                                    date.getDate() === selectedDate.getDate();
                                const isToday = new Date().toDateString() === date.toDateString();

                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => handleDateClick(day)}
                                        className={`
                                            aspect-square flex items-center justify-center rounded text-sm
                                            transition-colors
                                            ${isSelected
                                                ? 'bg-white/30 text-white font-bold'
                                                : isToday
                                                    ? 'bg-white/10 text-white'
                                                    : 'text-white/70 hover:bg-white/10'
                                            }
                                        `}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </>,
                document.body
            )}
        </div>
    );
};
