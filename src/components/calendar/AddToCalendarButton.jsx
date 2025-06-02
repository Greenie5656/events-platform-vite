// components/calendar/AddToCalendarButton.jsx
import { useState } from 'react';
import calendarService from '../../services/calendarService';

function AddToCalendarButton({ event, disabled = false }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleAddToCalendar = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await calendarService.addEventToCalendar(event);
      
      if (result.success) {
        setSuccess(true);
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Calendar integration error:', error);
      setError('Failed to add event to calendar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 text-green-700 p-3 mb-4 rounded text-sm">
          ✅ Event successfully added to your Google Calendar!
        </div>
      )}
      
      <button
        onClick={handleAddToCalendar}
        disabled={disabled || loading}
        className={`
          flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium
          ${disabled 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
          }
          ${loading ? 'opacity-70' : ''}
        `}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Adding to Calendar...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Add to Google Calendar
          </>
        )}
      </button>
      
      <p className="text-xs text-gray-500 mt-2">
        You'll be prompted to sign in to Google if needed
      </p>
    </div>
  );
}

export default AddToCalendarButton;