import CalendarCanvas from './components/CalendarCanvas';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-center text-gray-800">
          Canvas Calendar System
        </h1>
        <CalendarCanvas />
      </div>
    </div>
  );
}

export default App;
