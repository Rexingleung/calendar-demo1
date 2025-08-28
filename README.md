# Canvas Calendar Demo

A modern calendar system built with React, TypeScript, and Tailwind CSS, featuring a Canvas-based rendering engine for smooth performance and interactive event management.

## Features

- 🎨 **Canvas-based Rendering**: Smooth, performant calendar visualization using HTML5 Canvas
- 📅 **Event Management**: Create, edit, and delete events with ease
- 🔔 **Reminders**: Set up reminder notifications for important events
- 🎯 **Category System**: Organize events by categories (Work, Personal, Reminder, Holiday)
- 🌈 **Color Coding**: Visual distinction between different event types
- 📱 **Responsive Design**: Works seamlessly across desktop and mobile devices
- 🇨🇳 **Chinese Localization**: Full Chinese language support

## Technology Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Canvas**: HTML5 Canvas API for calendar rendering

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Rexingleung/calendar-demo1.git
cd calendar-demo1
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Usage

### Basic Navigation
- Use the left and right arrow buttons to navigate between months
- Click on any date to select it and view its events
- Hover over dates to see visual feedback

### Event Management
- Click "添加事件" (Add Event) to create a new event
- Click the edit icon next to any event to modify it
- Click the delete icon to remove an event
- Set events as reminders to see them in the upcoming reminders section

### Event Categories
- **工作 (Work)**: Blue color coding for work-related events
- **个人 (Personal)**: Green color coding for personal events
- **提醒 (Reminder)**: Purple color coding for important reminders
- **节日 (Holiday)**: Yellow color coding for holidays and special occasions

## Project Structure

```
src/
├── components/
│   ├── CalendarCanvas.tsx    # Main calendar component with canvas rendering
│   └── EventModal.tsx        # Modal for creating/editing events
├── types/
│   └── calendar.ts           # TypeScript type definitions
├── utils/
│   └── calendar.ts           # Utility functions for date manipulation
├── App.tsx                   # Main application component
├── App.css                   # Application styles
├── index.css                 # Global styles with Tailwind imports
└── main.tsx                  # React application entry point
```

## Key Components

### CalendarCanvas
The main calendar component that renders the calendar using HTML5 Canvas. Features include:
- Interactive date selection
- Event visualization with color coding
- Mouse hover effects
- Month navigation
- Event management integration

### EventModal
A modal component for creating and editing events with:
- Form validation
- Time range selection
- Category selection
- Reminder toggle
- Chinese language interface

## Canvas Implementation Details

The calendar uses HTML5 Canvas for rendering, providing:
- **Performance**: Smooth rendering even with many events
- **Flexibility**: Custom drawing and styling capabilities
- **Interactivity**: Mouse click and hover detection
- **Visual Effects**: Custom colors, gradients, and animations

### Canvas Drawing Logic
- Grid-based layout with 7 columns (weekdays) and 6 rows
- Dynamic cell sizing based on canvas dimensions
- Event indicators with color coding and text truncation
- Today highlighting and selection states
- Hover effects for better user experience

## Data Management

Events are stored in React state using the following structure:
- **Event Storage**: Array of CalendarEvent objects
- **Date Selection**: Currently selected date state
- **Modal State**: Controls for event creation/editing modal
- **Local Storage**: Events persist across browser sessions (in a real implementation)

## Customization

### Adding New Event Categories
1. Update the `CalendarEvent['category']` type in `src/types/calendar.ts`
2. Add color mapping in `src/utils/calendar.ts`
3. Update category options in `EventModal.tsx`

### Styling Modifications
- Modify Tailwind classes in components for different appearance
- Adjust canvas drawing colors and dimensions in `CalendarCanvas.tsx`
- Update theme colors in `tailwind.config.js`

## Browser Compatibility

- Modern browsers with Canvas API support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers with touch support

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Future Enhancements

- [ ] Drag and drop event rescheduling
- [ ] Event recurrence patterns
- [ ] Calendar export/import functionality
- [ ] Multiple calendar view (week, day views)
- [ ] Real-time notifications for reminders
- [ ] Calendar sharing and collaboration
- [ ] Integration with external calendar services
- [ ] Dark mode support
- [ ] Accessibility improvements

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint checks

## Support

For questions or issues, please open an issue on the GitHub repository.
