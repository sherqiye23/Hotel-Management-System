import React, { useState, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isDateInRange = (date: Date, start: Date, end: Date): boolean => {
  const time = date.getTime();
  return time >= start.getTime() && time <= end.getTime();
};

interface HotelReservationCalendarProps {
  onReservationConfirm: (startDate: Date, endDate: Date) => void;
  reservedRooms: string[]
}

export const ReservationCalendar: React.FC<HotelReservationCalendarProps> = ({
  onReservationConfirm,
  reservedRooms
}) => {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  
  const tomorrow = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return d;
  }, [today]);

  const [selectedStart, setSelectedStart] = useState<Date | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const bookedDateSet = useMemo(() => new Set(reservedRooms), []);

  const getDaysInMonth = useCallback(() => {
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const days: Date[] = [];

    const startDayIndex = firstDayOfMonth.getDay();
    for (let i = startDayIndex; i > 0; i--) {
      const prevDay = new Date(firstDayOfMonth);
      prevDay.setDate(firstDayOfMonth.getDate() - i);
      days.push(prevDay);
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
    }

    while (days.length % 7 !== 0 || days.length < 42) {
      const nextDay = new Date(days[days.length - 1]);
      nextDay.setDate(nextDay.getDate() + 1);
      days.push(nextDay);
    }

    return days;
  }, [currentMonth]);


  const handleDayClick = (date: Date) => {
    const dateString = formatDate(date);

    if (bookedDateSet.has(dateString) || date.getTime() < tomorrow.getTime()) {
      return; 
    }

    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(date);
      setSelectedEnd(null);
    } else {
      let start = selectedStart;
      let end = date;
      
      if (start.getTime() > end.getTime()) {
          [start, end] = [end, start]; 
      }

      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 1) { 
        setSelectedStart(date);
        setSelectedEnd(null);
        return;
      }

      let hasOverlap = false;
      let tempDate = new Date(start);
      while (tempDate.getTime() < end.getTime()) {
        const checkString = formatDate(tempDate);
        if (bookedDateSet.has(checkString)) {
          hasOverlap = true;
          break;
        }
        tempDate.setDate(tempDate.getDate() + 1);
      }

      if (hasOverlap) {
        toast.error("Selection failed: Your range includes a day that is already booked. Please select again.");
        setSelectedStart(date); 
        setSelectedEnd(null);
      } else {
        if (date.getTime() > selectedStart.getTime()) {
            setSelectedEnd(date);
        } else {
            setSelectedStart(date);
            setSelectedEnd(selectedStart);
        }
      }
    }
  };


  const getDayClass = (date: Date): string => {
    const dateString = formatDate(date);
    let classes = '';

    if (bookedDateSet.has(dateString)) {
      return ' bg-red-100 text-gray-400 line-through cursor-not-allowed';
    }
    if (date.getTime() < tomorrow.getTime()) { 
      return ' bg-gray-100 text-gray-300 cursor-not-allowed';
    }

    classes += ' hover:bg-cyan-100 cursor-pointer'; 
    
    const isStart = selectedStart && dateString === formatDate(selectedStart);
    const isEnd = selectedEnd && dateString === formatDate(selectedEnd);
    const isInRange = selectedStart && selectedEnd && isDateInRange(date, selectedStart, selectedEnd);

    if (isInRange) {
      classes += ' bg-cyan-200 text-gray-800';
    }

    if (isStart) {
      classes += ' bg-cyan-600 text-white font-semibold rounded-l-lg';
    }

    if (isEnd) {
      classes += ' bg-cyan-600 text-white font-semibold rounded-r-lg';
    }
    
    if (isStart && !selectedEnd) {
      classes += ' bg-cyan-600 text-white font-semibold rounded-lg';
    }

    return classes;
  };

  const handleConfirm = () => {
    if (selectedStart && selectedEnd) {
      const diffTime = Math.abs(selectedEnd.getTime() - selectedStart.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 1) { 
        onReservationConfirm(selectedStart, selectedEnd);
      } else {
        toast.error("Please select a range of at least two consecutive days (one night).");
      }
    } else {
      toast.error("Please select both a check-in and check-out date.");
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const daysInMonth = getDaysInMonth();
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });


  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={prevMonth} 
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full cursor-pointer"
        >
          &lt;
        </button>
        <h2 className="text-xl font-semibold text-gray-800">{monthName}</h2>
        <button 
          onClick={nextMonth} 
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full cursor-pointer"
        >
          &gt;
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="font-bold text-gray-500 py-2">
            {day}
          </div>
        ))}

        {daysInMonth.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
          const dayClasses = getDayClass(date);

          return (
            <div
              key={index}
              className={`p-2 transition-colors duration-100 ${dayClasses} 
                          ${isCurrentMonth ? 'text-gray-900' : 'text-gray-300 pointer-events-none'}`}
              onClick={() => isCurrentMonth && handleDayClick(date)}
              role="button"
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>

      <div className="selection-summary mt-6 p-4 bg-lime-50 rounded-lg border border-lime-200 text-sm">
        <p className="text-gray-700">
          Check-in: <span className="font-bold text-cyan-700">{selectedStart ? formatDate(selectedStart) : 'N/A'}</span>
        </p>
        <p className="text-gray-700">
          Check-out: <span className="font-bold text-cyan-700">{selectedEnd ? formatDate(selectedEnd) : 'N/A'}</span>
        </p>
      </div>

      <button 
        className={`w-full p-3 mt-4 text-white font-semibold rounded-lg transition-colors cursor-pointer text-sm ${
          selectedStart && selectedEnd ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'
        }`}
        onClick={handleConfirm}
        disabled={!(selectedStart && selectedEnd)}
      >
        Confirm Reservation (2 Days Minimum)
      </button>
      
      <div className="mt-4 pt-4 border-t border-gray-100 text-xs flex justify-around text-gray-600">
        <span className="flex items-center">
          <span className="w-3 h-3 bg-red-100 rounded-sm mr-1"></span> Booked
        </span>
        <span className="flex items-center">
          <span className="w-3 h-3 bg-cyan-200 rounded-sm mr-1"></span> In Range
        </span>
        <span className="flex items-center">
          <span className="w-3 h-3 bg-cyan-600 rounded-sm mr-1"></span> Check-in/out
        </span>
        <span className="flex items-center">
          <span className="w-3 h-3 bg-gray-100 rounded-sm mr-1"></span> Past/Today
        </span>
      </div>
    </div>
  );
};