export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  category: 'work' | 'personal' | 'reminder' | 'holiday';
  color: string;
  isReminder: boolean;
}

export interface CalendarDay {
  date: Date;
  events: CalendarEvent[];
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

export interface CalendarState {
  currentDate: Date;
  selectedDate: Date | null;
  events: CalendarEvent[];
  showEventModal: boolean;
  editingEvent: CalendarEvent | null;
}

export interface EventFormData {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  category: CalendarEvent['category'];
  isReminder: boolean;
}
