import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Tag, Bell } from 'lucide-react';
import { CalendarEvent, EventFormData } from '../types/calendar';
import { generateId, isValidTimeFormat, compareTime } from '../utils/calendar';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  selectedDate: Date | null;
  editingEvent: CalendarEvent | null;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  editingEvent
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    startTime: '09:00',
    endTime: '10:00',
    category: 'personal',
    isReminder: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title,
        description: editingEvent.description,
        startTime: editingEvent.startTime,
        endTime: editingEvent.endTime,
        category: editingEvent.category,
        isReminder: editingEvent.isReminder
      });
    } else {
      setFormData({
        title: '',
        description: '',
        startTime: '09:00',
        endTime: '10:00',
        category: 'personal',
        isReminder: false
      });
    }
    setErrors({});
  }, [editingEvent, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '请输入事件标题';
    }

    if (!isValidTimeFormat(formData.startTime)) {
      newErrors.startTime = '请输入有效的开始时间 (HH:MM)';
    }

    if (!isValidTimeFormat(formData.endTime)) {
      newErrors.endTime = '请输入有效的结束时间 (HH:MM)';
    }

    if (formData.startTime && formData.endTime && 
        compareTime(formData.startTime, formData.endTime) >= 0) {
      newErrors.endTime = '结束时间必须晚于开始时间';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !selectedDate) return;

    const event: CalendarEvent = {
      id: editingEvent?.id || generateId(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      date: selectedDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      category: formData.category,
      color: getCategoryColor(formData.category),
      isReminder: formData.isReminder
    };

    onSave(event);
    onClose();
  };

  const getCategoryColor = (category: CalendarEvent['category']): string => {
    const colors = {
      work: '#3b82f6',
      personal: '#10b981',
      reminder: '#8b5cf6',
      holiday: '#f59e0b'
    };
    return colors[category];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingEvent ? '编辑事件' : '新增事件'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-2" />
              事件标题 *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="输入事件标题"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              事件描述
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="输入事件描述"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock size={16} className="inline mr-2" />
                开始时间 *
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.startTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock size={16} className="inline mr-2" />
                结束时间 *
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.endTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag size={16} className="inline mr-2" />
              事件分类
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as CalendarEvent['category'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="personal">个人</option>
              <option value="work">工作</option>
              <option value="reminder">提醒</option>
              <option value="holiday">节日</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="reminder"
              checked={formData.isReminder}
              onChange={(e) => setFormData({ ...formData, isReminder: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="reminder" className="ml-2 text-sm text-gray-700 flex items-center">
              <Bell size={16} className="mr-1" />
              设置为提醒事项
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingEvent ? '更新' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
