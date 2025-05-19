// components/events/EventCard.jsx
function EventCard({ event }) {
  // Format date
  const formatDate = (date) => {
    const eventDate = date instanceof Date ? date : new Date(date);
    return eventDate.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format time
  const formatTime = (date) => {
    const eventDate = date instanceof Date ? date : new Date(date);
    return eventDate.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-md bg-white">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded capitalize">
            {event.category}
          </span>
        </div>
        
        <div className="mt-2 text-gray-600">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center mt-1">
            <svg className="w-4 h-4 mr-1" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{formatTime(event.date)}</span>
          </div>
          
          <div className="flex items-center mt-1">
            <svg className="w-4 h-4 mr-1" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span>{event.location}</span>
          </div>
        </div>
        
        <div className="mt-3">
          <p className="text-gray-700 line-clamp-3">{event.description}</p>
        </div>
        
        {event.capacity && (
          <div className="mt-2 text-sm text-gray-500">
            Capacity: {event.capacity} attendees
          </div>
        )}
      </div>
    </div>
  );
}

export default EventCard;