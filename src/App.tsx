import React from 'react';
import CalendarCanvas from './components/CalendarCanvas';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Canvas Calendar System
        </h1>
        <CalendarCanvas />
      </div>
    </div>
  );
}

export default App;
