import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import { collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";
import EventForm from "../components/events/EventForm";
import EventManagement from "../components/dashboard/EventManagement";
import AttendeeList from "../components/dashboard/AttendeeList";
import { createEvent } from "../services/eventService";
import { Settings } from "lucide-react";

function Dashboard() {
    const { currentUser } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load staff's events
    const fetchEvents = async () => {
        try {
            setLoading(true);
            const q = query(
                collection(db, "events"),
                where("createdBy", "==", currentUser.uid),
                orderBy("date", "desc")
            );

            const querySnapshot = await getDocs(q);
            const eventsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setEvents(eventsList);
            setError(null);
        } catch(error) {
            console.error("Error fetching events:", error);
            setError("Failed to load events. Please try again");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchEvents();
        }
    }, [currentUser]);

    // Handler for creating new event with service function
    const handleCreateEvent = async (eventData) => {
        try {
            const result = await createEvent(eventData, currentUser.uid);

            if (result.success) {
                // Instead of manually updating state, refetch from Firestore
                // This ensures data consistency
                await fetchEvents();
            }

            return result;
        } catch (error) {
            console.error("Error creating event:", error);
            return { 
                success: false,
                error: "Failed to create event. Please try again"
            };
        } 
    };

    // Handler for updating event in local state when toggled
    const handleEventUpdated = (updatedEvent) => {
        setEvents(prevEvents =>
            prevEvents.map(event => 
                event.id === updatedEvent.id ? updatedEvent : event 
            )
        );
    };

    // Handler for removing event from local state when deleted
    const handleEventDeleted = (eventId) => {
        setEvents(prevEvents => 
            prevEvents.filter(event => event.id !== eventId)
        );
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6 text-gunmetal flex items-center">
                <Settings className="w-8 h-8 mr-3 text-asparagus" />
                Staff Dashboard
            </h1>

            <div className="bg-white border border-payne-gray/30 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gunmetal">Create New Event</h2>
                <EventForm onSubmit={handleCreateEvent} />
            </div>

            <div className="bg-white border border-payne-gray/30 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gunmetal">Your Events</h2>
                {loading && events.length === 0 ? (
                    <p className="text-payne-gray">Loading your Events...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : events.length === 0 ? (
                    <p className="text-payne-gray">You haven't created any events yet.</p>
                ) : (
                    <div className="space-y-6">
                        {events.map(event => (
                            <div key={event.id} className="border-b border-payne-gray/20 pb-6 last:border-b-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium text-lg text-gunmetal">
                                            {event.title}
                                        </h3>
                                        <p className="font-medium text-lg text-gunmetal">
                                            {event.date?.toDate().toLocaleDateString() || "No Date"} at {event.location}
                                        </p>
                                        <p className="text-sm mt-1">
                                            <span className="bg-asparagus/20 text-asparagus px-2 py-1 rounded-full text-xs font-medium">
                                                {event.category}
                                            </span>
                                            {event.capacity && (
                                                <span className="mml-2 text-payne-gray">
                                                    {event.attendees?.length || 0}/{event.capacity} registered
                                                </span>
                                            )}
                                        </p>

                                        <AttendeeList
                                            eventId={event.id}
                                            attendees={event.attendees || []}
                                        />
                                    </div>

                                    <EventManagement
                                        event={event}
                                        onEventUpdated={handleEventUpdated}
                                        onEventDeleted={handleEventDeleted}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;