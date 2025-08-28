import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Plus, Edit, Trash2 } from 'lucide-react';
import { CalendarEvent } from '../types/calendar';
import { 
  getMonthDays, 
  isSameDay, 
  getMonthNames, 
  getWeekdays,
  formatTime 
} from '../utils/calendar';
import EventModal from './EventModal';

const CalendarCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const CELL_WIDTH = CANVAS_WIDTH / 7;
  const CELL_HEIGHT = (CANVAS_HEIGHT - 80) / 6;
  const HEADER_HEIGHT = 80;

  const monthNames = getMonthNames();
  const weekdays = getWeekdays();

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 绘制背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 绘制标题
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    const title = `${currentDate.getFullYear()}年 ${monthNames[currentDate.getMonth()]}`;
    ctx.fillText(title, CANVAS_WIDTH / 2, 35);

    // 绘制星期标题
    ctx.font = '16px Arial';
    ctx.fillStyle = '#6b7280';
    weekdays.forEach((day, index) => {
      const x = index * CELL_WIDTH + CELL_WIDTH / 2;
      const y = 65;
      ctx.fillText(day, x, y);
    });

    // 获取当月的所有日期
    const monthDays = getMonthDays(currentDate.getFullYear(), currentDate.getMonth());

    // 绘制日历网格和日期
    monthDays.forEach((calendarDay, index) => {
      const row = Math.floor(index / 7);
      const col = index % 7;
      const x = col * CELL_WIDTH;
      const y = HEADER_HEIGHT + row * CELL_HEIGHT;

      // 绘制单元格边框
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, CELL_WIDTH, CELL_HEIGHT);

      // 设置单元格背景色
      if (calendarDay.isToday) {
        ctx.fillStyle = '#dbeafe';
        ctx.fillRect(x + 1, y + 1, CELL_WIDTH - 2, CELL_HEIGHT - 2);
      } else if (selectedDate && isSameDay(calendarDay.date, selectedDate)) {
        ctx.fillStyle = '#bfdbfe';
        ctx.fillRect(x + 1, y + 1, CELL_WIDTH - 2, CELL_HEIGHT - 2);
      } else if (hoveredDay && isSameDay(calendarDay.date, hoveredDay)) {
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(x + 1, y + 1, CELL_WIDTH - 2, CELL_HEIGHT - 2);
      }

      // 绘制日期数字
      const dayNumber = calendarDay.date.getDate();
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      
      if (calendarDay.isCurrentMonth) {
        ctx.fillStyle = calendarDay.isToday ? '#1d4ed8' : '#374151';
      } else {
        ctx.fillStyle = '#d1d5db';
      }
      
      ctx.fillText(dayNumber.toString(), x + 8, y + 25);

      // 绘制事件
      const dayEvents = events.filter(event => isSameDay(event.date, calendarDay.date));
      dayEvents.forEach((event, eventIndex) => {
        if (eventIndex < 3) { // 最多显示3个事件
          const eventY = y + 35 + eventIndex * 18;
          const eventX = x + 5;
          const eventWidth = CELL_WIDTH - 10;

          // 绘制事件背景
          ctx.fillStyle = event.color;
          ctx.fillRect(eventX, eventY, eventWidth, 15);

          // 绘制事件文本
          ctx.fillStyle = '#ffffff';
          ctx.font = '12px Arial';
          ctx.textAlign = 'left';
          const truncatedTitle = event.title.length > 10 ? 
            event.title.substring(0, 10) + '...' : event.title;
          ctx.fillText(truncatedTitle, eventX + 4, eventY + 11);

          // 提醒图标
          if (event.isReminder) {
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(eventX + eventWidth - 8, eventY + 7, 3, 0, 2 * Math.PI);
            ctx.fill();
          }
        } else if (eventIndex === 3) {
          // 显示"更多"提示
          const moreY = y + 35 + 3 * 18;
          ctx.fillStyle = '#9ca3af';
          ctx.font = '12px Arial';
          ctx.fillText(`+${dayEvents.length - 3} more`, x + 5, moreY + 11);
        }
      });
    });
  }, [currentDate, events, selectedDate, hoveredDay, monthNames, weekdays]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // 检查点击是否在日历网格内
    if (y < HEADER_HEIGHT) return;

    const col = Math.floor(x / CELL_WIDTH);
    const row = Math.floor((y - HEADER_HEIGHT) / CELL_HEIGHT);
    const index = row * 7 + col;

    const monthDays = getMonthDays(currentDate.getFullYear(), currentDate.getMonth());
    if (index >= 0 && index < monthDays.length) {
      const clickedDay = monthDays[index];
      setSelectedDate(clickedDay.date);
    }
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (y < HEADER_HEIGHT) {
      setHoveredDay(null);
      return;
    }

    const col = Math.floor(x / CELL_WIDTH);
    const row = Math.floor((y - HEADER_HEIGHT) / CELL_HEIGHT);
    const index = row * 7 + col;

    const monthDays = getMonthDays(currentDate.getFullYear(), currentDate.getMonth());
    if (index >= 0 && index < monthDays.length) {
      setHoveredDay(monthDays[index].date);
    } else {
      setHoveredDay(null);
    }
  };

  const handleCanvasMouseLeave = () => {
    setHoveredDay(null);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleAddEvent = () => {
    if (!selectedDate) {
      setSelectedDate(new Date());
    }
    setEditingEvent(null);
    setShowEventModal(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedDate(event.date);
    setEditingEvent(event);
    setShowEventModal(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const handleSaveEvent = (event: CalendarEvent) => {
    setEvents(prev => {
      const existingIndex = prev.findIndex(e => e.id === event.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = event;
        return updated;
      } else {
        return [...prev, event];
      }
    });
  };

  const selectedDayEvents = selectedDate ? 
    events.filter(event => isSameDay(event.date, selectedDate)) : [];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      {/* 日历头部导航 */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 rounded-lg transition-colors hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>
        
        <h2 className="text-xl font-semibold text-gray-800">
          {currentDate.getFullYear()}年 {monthNames[currentDate.getMonth()]}
        </h2>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 rounded-lg transition-colors hover:bg-gray-100"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Canvas 日历 */}
      <div className="flex justify-center mb-6">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={handleCanvasMouseLeave}
          className="rounded-lg border border-gray-300 cursor-pointer"
        />
      </div>

      {/* 事件管理区域 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* 左侧：选中日期信息 */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              {selectedDate ? 
                `${selectedDate.getFullYear()}年${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日` : 
                '选择一个日期'
              }
            </h3>
            <button
              onClick={handleAddEvent}
              className="flex gap-2 items-center px-3 py-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
            >
              <Plus size={16} />
              添加事件
            </button>
          </div>

          {selectedDayEvents.length > 0 ? (
            <div className="overflow-y-auto space-y-2 max-h-64">
              {selectedDayEvents.map(event => (
                <div
                  key={event.id}
                  className="p-3 rounded-lg border transition-colors hover:bg-gray-50"
                  style={{ borderLeftColor: event.color, borderLeftWidth: '4px' }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{event.title}</h4>
                      <p className="mt-1 text-sm text-gray-600">
                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                      </p>
                      {event.description && (
                        <p className="mt-1 text-sm text-gray-500">{event.description}</p>
                      )}
                      <div className="flex gap-2 items-center mt-2">
                        <span className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full">
                          {getCategoryLabel(event.category)}
                        </span>
                        {event.isReminder && (
                          <span className="px-2 py-1 text-xs text-yellow-700 bg-yellow-100 rounded-full">
                            提醒
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="p-1 text-gray-500 transition-colors hover:text-blue-600"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-1 text-gray-500 transition-colors hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              {selectedDate ? '当天没有事件' : '选择一个日期查看事件'}
            </div>
          )}
        </div>

        {/* 右侧：即将到来的提醒 */}
        <div>
          <h3 className="mb-4 text-lg font-medium text-gray-800">即将到来的提醒</h3>
          {getUpcomingReminders().length > 0 ? (
            <div className="overflow-y-auto space-y-2 max-h-64">
              {getUpcomingReminders().map(event => (
                <div
                  key={event.id}
                  className="p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                >
                  <h4 className="font-medium text-gray-800">{event.title}</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {event.date.getMonth() + 1}月{event.date.getDate()}日 {formatTime(event.startTime)}
                  </p>
                  {event.description && (
                    <p className="mt-1 text-sm text-gray-500">{event.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              暂无即将到来的提醒
            </div>
          )}
        </div>
      </div>

      {/* 事件模态框 */}
      <EventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        onSave={handleSaveEvent}
        selectedDate={selectedDate}
        editingEvent={editingEvent}
      />
    </div>
  );

  function getCategoryLabel(category: CalendarEvent['category']): string {
    const labels = {
      work: '工作',
      personal: '个人',
      reminder: '提醒',
      holiday: '节日'
    };
    return labels[category];
  }

  function getUpcomingReminders(): CalendarEvent[] {
    const now = new Date();
    const futureEvents = events.filter(event => {
      const eventDateTime = new Date(event.date);
      const [hours, minutes] = event.startTime.split(':').map(Number);
      eventDateTime.setHours(hours, minutes);
      return eventDateTime > now && event.isReminder;
    });

    return futureEvents
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const [hoursA, minutesA] = a.startTime.split(':').map(Number);
        dateA.setHours(hoursA, minutesA);
        
        const dateB = new Date(b.date);
        const [hoursB, minutesB] = b.startTime.split(':').map(Number);
        dateB.setHours(hoursB, minutesB);
        
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5);
  }
};

export default CalendarCanvas;
