import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchEventsById } from "../services/eventService";

function EventDetail() {
    const { id } = useParams()
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect (() => {
        async function getEventDetails() {
            try {
                setLoading(true);
                const eventData = await fetchEventsById(id);
                setEvent(eventData)
            } catch (error) {
                console.error("error:", error);
                setError(error.message || "Failed to load event details");
            } finally {
                setLoading(false);
            }
        }

        getEventDetails()
    }, [id]);

     if (loading) {
    return <div className="text-center py-8">Loading event details...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <Link to="/" className="text-blue-500 hover:underline">
          Back to Events
        </Link>
      </div>
    );
  }

  // Format date and time
  const formatDate = (date) => {
    const eventDate = date instanceof Date ? date : new Date(date);
    return eventDate.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatTime = (date) => {
    const eventDate = date instanceof Date ? date : new Date(date);
    return eventDate.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="mb-6">
        <Link to="/" className="text-blue-500 hover:underline flex items-center">
          <svg className="w-4 h-4 mr-1" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Events
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{event.title}</h1>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full capitalize">
            {event.category}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Date & Time</h3>
            <p className="text-gray-700">{formatDate(event.date)}</p>
            <p className="text-gray-700">{formatTime(event.date)}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Location</h3>
            <p className="text-gray-700">{event.location}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Capacity</h3>
            <p className="text-gray-700">
              {event.capacity ? `${event.capacity} attendees` : 'Unlimited'}
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
        </div>
        
        {/* Registration button - will be implemented in Session 5 */}
        <div className="flex justify-center mt-8">
          <button 
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            disabled={true}
          >
            Registration coming in Session 5
          </button>
        </div>
      </div>
    </div>
  );

}

export default EventDetail;