import { CalendarEvent, CalendarDay } from '../types/calendar';

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const formatTime = (time: string): string => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const getMonthDays = (year: number, month: number): CalendarDay[] => {
  const days: CalendarDay[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  
  // 调整到周一开始
  const dayOfWeek = (firstDay.getDay() + 6) % 7;
  startDate.setDate(startDate.getDate() - dayOfWeek);

  // 生成42天的网格 (6周)
  for (let i = 0; i < 42; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    const isCurrentMonth = currentDate.getMonth() === month;
    const isToday = isSameDay(currentDate, new Date());

    days.push({
      date: currentDate,
      events: [],
      isCurrentMonth,
      isToday,
      isSelected: false
    });
  }

  return days;
};

export const getEventColor = (category: CalendarEvent['category']): string => {
  const colors = {
    work: '#3b82f6', // blue
    personal: '#10b981', // green
    reminder: '#8b5cf6', // purple
    holiday: '#f59e0b' // yellow
  };
  return colors[category];
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

export const getWeekdays = (): string[] => {
  return ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
};

export const getMonthNames = (): string[] => {
  return [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];
};

export const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

export const compareTime = (time1: string, time2: string): number => {
  const [h1, m1] = time1.split(':').map(Number);
  const [h2, m2] = time2.split(':').map(Number);
  
  const minutes1 = h1 * 60 + m1;
  const minutes2 = h2 * 60 + m2;
  
  return minutes1 - minutes2;
};
