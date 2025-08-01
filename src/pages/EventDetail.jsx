import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchEventsById } from "../services/eventService";
import { registerForEvent, cancelRegistration, checkRegistrationStatus } from "../services/registrationService";
import { useAuth } from "../context/AuthContext";
import AddToCalendarButton from "../components/calendar/AddToCalendarButton";
import { ArrowLeft } from "lucide-react";

function EventDetail() {
    const { eventId } = useParams()
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser, userRole } = useAuth();
    const [registrationStatus, setRegistrationStatus] = useState({
      isRegistered : false,
      isFull: false,
      attendeeCount: 0,
      capacity: null,
      attendees: []
    });
    const [registrationLoading, setRegistrationLoading] = useState(false)
    const [registrationError, setRegistrationError] = useState(null)
    const [registrationSuccess, setRegistrationSuccess] = useState(false)


    useEffect (() => {
        async function getEventDetails() {
            try {
                setLoading(true);
                const eventData = await fetchEventsById(eventId);
                setEvent(eventData)

                if (currentUser) {
                  const status = await checkRegistrationStatus(eventId, currentUser.uid);
                  setRegistrationStatus(status)
                }
            } catch (error) {
                console.error("error:", error);
                setError(error.message || "Failed to load event details");
            } finally {
                setLoading(false);
            }
        }

        getEventDetails()
    }, [eventId, currentUser]);

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

const handleRegister = async () => {
  if (!currentUser) {
    //redirect to login or show message
    setRegistrationError("Please log in to register for this event");
    return;
  }

  setRegistrationLoading(true);
  setRegistrationError(null);
  setRegistrationSuccess(false);

  const result = await registerForEvent (eventId, currentUser.uid, currentUser.email);

  if (result.success) {
    setRegistrationSuccess(true);
    //update registration status
    const status = await checkRegistrationStatus(eventId, currentUser.uid)
    setRegistrationStatus(status);

    //hide success message after 3 seconds
    setTimeout(() =>setRegistrationSuccess(false), 3000);
  } else {
    setRegistrationError(result.error);
  }

  setRegistrationLoading(false);

};

const handleCancelRegistration = async () => {
  setRegistrationLoading(true)
  setRegistrationError(null);

  const result = await cancelRegistration(eventId, currentUser.uid);

  if (result.success) {
    //update registration status
    const status = await checkRegistrationStatus(eventId, currentUser.uid);
    setRegistrationStatus(status);
  } else {
    setRegistrationError(result.error);
  }

  setRegistrationLoading(false);
} ;

// Format date
const formatDate = (date) => {
  let eventDate;
  
  // Handle Firestore Timestamp objects
  if (date && typeof date.toDate === 'function') {
    // This is a Firestore Timestamp
    eventDate = date.toDate();
  } else if (date instanceof Date) {
    // Already a Date object
    eventDate = date;
  } else if (date) {
    // Try to parse string or other format
    try {
      eventDate = new Date(date);
    } catch (e) {
      console.error("Invalid date format:", date);
      return "Invalid Date";
    }
  } else {
    return "No Date";
  }
  
  return eventDate.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format time with the same approach
const formatTime = (date) => {
  let eventDate;
  
  // Handle Firestore Timestamp objects
  if (date && typeof date.toDate === 'function') {
    eventDate = date.toDate();
  } else if (date instanceof Date) {
    eventDate = date;
  } else if (date) {
    try {
      eventDate = new Date(date);
    } catch (e) {
      console.error("Invalid date format:", date);
      return "Invalid Time";
    }
  } else {
    return "No Time";
  }
  
  return eventDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });
};

  return (
    <div>
      <div className="mb-6">
        <Link to="/" className="text-asparagus hover:text-gold hover:underline flex items-center transition-colors duration-200">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Events
        </Link>
      </div>
      
      <div className="bg-white border border-payne-gray/30 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gunmetal">{event.title}</h1>
          <span className="bg-asparagus/20 text-asparagus px-3 py-1 rounded-full capitalize font-medium">
            {event.category}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-medium mb-2 text-gunmetal">Date & Time</h3>
            <p className="text-payne-gray">{formatDate(event.date)}</p>
            <p className="text-payne-gray">{formatTime(event.date)}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2 text-gunmetal">Location</h3>
            <p className="text-payne-gray">{event.location}</p>
          </div>
          
          <div>
              <h3 className="text-lg font-medium mb-2 text-gunmetal">Capacity</h3>
              <p className="text-payne-gray">
                  {event.capacity ? (
                      <>
                          {registrationStatus.attendeeCount} / {event.capacity} attendees
                          {registrationStatus.isFull && (
                              <span className="ml-2 text-red-500">(Full)</span>
                          )}
                      </>
                  ) : (
                      'Unlimited'
                  )}
              </p>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
        </div>
       
        <div>
              {registrationError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 mb-4 rounded-l">
                      {registrationError}
                  </div>
              )}
              
              {registrationSuccess && (
                  <div className="bg-asparagus/10 border border-asparagus/30 text-asparagus p-3 mb-4 rounded-lg">
                      You have successfully registered for this event!
                  </div>
              )}
              
              <div className="flex justify-center mt-8">
                  {!currentUser ? (
                      <div className="text-center">
                          <p className="mb-4 text-gray-600">Please log in to register for this event</p>
                          <Link to="/login" className="px-6 py-3 bg-asparagus text-snow rounded-lg hover:bg-gold transition-colors duration-200">
                              Log In
                          </Link>
                      </div>
                  ) : userRole === "member" ? (
                      registrationStatus.isRegistered ? (
                        <div>
                            <button 
                                onClick={handleCancelRegistration}
                                disabled={registrationLoading}
                                className="px-6 py-3 bg-asparagus text-snow rounded-lg hover:bg-gold disabled:opacity-50 transition-colors duration-200"
                            >
                                {registrationLoading ? "Processing..." : "Cancel Registration"}
                            </button>
                            
                            {/* Add to Calendar button - only show for registered users */}
                            <AddToCalendarButton 
                                event={event} 
                                disabled={false}
                            />
                        </div>
                    ) : (
                                              <button 
                              onClick={handleRegister}
                              disabled={registrationLoading || registrationStatus.isFull}
                              className="px-6 py-3 bg-asparagus text-snow rounded-lg hover:bg-gold disabled:opacity-50 disabled:bg-payne-gray/30 disabled:text-payne-gray transition-colors duration-200"
                          >
                              {registrationLoading ? "Processing..." : registrationStatus.isFull ? "Event Full" : "Register for Event"}
                          </button>
                      )
                  ) : (
                      // For staff members, show the attendee list
                      <div className="w-full">
                          <h3 className="text-lg font-medium mb-4">Registered Attendees</h3>
                          {registrationStatus.attendees.length === 0 ? (
                              <p className="text-gray-600">No attendees registered yet</p>
                          ) : (
                              <div className="bg-snow/50 border border-payne-gray/30 p-4 rounded-lg">
                                  <p className="mb-2 text-gray-700">Total: {registrationStatus.attendees.length}</p>
                                  <ul className="space-y-2">
                                      {registrationStatus.attendees.map((attendee, index) => (
                                          <li key={index} className="text-gray-700">
                                              {attendee.userEmail}
                                          </li>
                                      ))}
                                  </ul>
                              </div>
                          )}
                      </div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );

}

export default EventDetail;