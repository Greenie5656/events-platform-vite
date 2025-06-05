// components/calendar/AddToCalendarButton.jsx
import { useState } from 'react';
import { Calendar, Check, AlertCircle } from 'lucide-react';
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
      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 mb-4 rounded-lg text-sm flex items-start">
          <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Success State */}
      {success && (
        <div className="bg-asparagus/10 border border-asparagus/20 text-asparagus p-3 mb-4 rounded-lg text-sm flex items-start">
          <Check className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
          <span>Event successfully added to your Google Calendar!</span>
        </div>
      )}
      
      {/* Main Button */}
      <button
        onClick={handleAddToCalendar}
        disabled={disabled || loading}
        className={`
          flex items-center justify-center w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
          ${disabled 
            ? 'bg-payne-gray/30 text-payne-gray cursor-not-allowed' 
            : 'bg-asparagus text-snow hover:bg-asparagus/90 focus:outline-none focus:ring-2 focus:ring-asparagus focus:ring-offset-2 active:bg-asparagus/80'
          }
          ${loading ? 'opacity-70 cursor-wait' : ''}
        `}
        aria-label={loading ? 'Adding event to calendar' : 'Add event to Google Calendar'}
      >
        {loading ? (
          <>
            <svg 
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-snow" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Adding to Calendar...
          </>
        ) : (
          <>
            <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
            Add to Google Calendar
          </>
        )}
      </button>
      
      {/* Helper Text */}
      <p className="text-xs text-payne-gray mt-2 text-center">
        You'll be prompted to sign in to Google if needed
      </p>
    </div>
  );
}

export default AddToCalendarButton;