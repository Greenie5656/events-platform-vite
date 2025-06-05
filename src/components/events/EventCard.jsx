import { Calendar, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

function EventCard({ event }) {
  console.log("Event data in card:", event);

// Format date
const formatDate = (date) => {
  console.log("Date value:", date);
  console.log("Date type:", typeof date);
  
  // Check if date is undefined or null
  if (!date) {
    return "No Date";
  }
  
  try {
    // Explicitly check if it's a Firestore Timestamp and convert it
    if (date && date.seconds !== undefined && date.nanoseconds !== undefined) {
      // Convert Firestore timestamp to JavaScript Date
      const milliseconds = date.seconds * 1000 + date.nanoseconds / 1000000;
      const jsDate = new Date(milliseconds);
      
      console.log("Converted Firestore timestamp to:", jsDate);
      
      return jsDate.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } 
    // If it's already a Date object
    else if (date instanceof Date) {
      return date.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } 
    // Try to parse as string
    else {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        console.error("Invalid date:", date);
        return "Invalid Date";
      }
      return parsedDate.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  } catch (error) {
    console.error("Error formatting date:", error, date);
    return "Error with date";
  }
};

// Format time with the same explicit approach
const formatTime = (date) => {
  if (!date) {
    return "No Time";
  }
  
  try {
    // Explicitly check if it's a Firestore Timestamp and convert it
    if (date && date.seconds !== undefined && date.nanoseconds !== undefined) {
      // Convert Firestore timestamp to JavaScript Date
      const milliseconds = date.seconds * 1000 + date.nanoseconds / 1000000;
      const jsDate = new Date(milliseconds);
      
      return jsDate.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      });
    } 
    // If it's already a Date object
    else if (date instanceof Date) {
      return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      });
    } 
    // Try to parse as string
    else {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        console.error("Invalid time:", date);
        return "Invalid Time";
      }
      return parsedDate.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  } catch (error) {
    console.error("Error formatting time:", error, date);
    return "Error with time";
  }
};

  return (
    <div className="border border-payne-gray/30 rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl hover:border-asparagus/120 transition-all duration-300">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gunmetal">{event.title}</h3>
          <span className="bg-asparagus/20 text-asparagus text-xs px-2 py-1 rounded-full capitalize font-medium">
            {event.category}
          </span>
        </div>
        
        <div className="mt-3 text-payne-gray space-y-2">
          <div className="flex items-center">
             <Calendar className="w-4 h-4 mr-2 text-asparagus" />
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center mt-1">
              <Clock className="w-4 h-4 mr-2 text-asparagus" />
            <span>{formatTime(event.date)}</span>
          </div>
          
          <div className="flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-2 text-asparagus" />
            <span>{event.location}</span>
          </div>
        </div>
        
        <div className="mt-3 p-3 border border-payne-gray/20 rounded-md bg-snow/50">
          <p className="text-gunmetal line-clamp-3 leading-relaxed">{event.description}</p>
        </div>
        
        {event.capacity && (
          <div className="mt-2 text-sm text-payne-gray">
            Capacity: {event.capacity} attendees
          </div>
        )}
        
        <div className="mt-4 flex justify-end">
          <Link 
            to={`/event/${event.id}`}
            className="px-4 py-2 bg-asparagus text-snow rounded-lg hover:bg-gold transition-colors duration-200 text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventCard;