import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchEventById, updateEvent } from "../services/eventService";
import EventForm from "../components/events/EventForm";

function EditEvent() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect (() => {
        async function loadEvent() {
            try {
                const eventData = await fetchEventById(eventId);

                //check if current user is the creator of the event
                if (eventData.createdBy !== currentUser.uid){
                    setError("You do not have permission to edit this event");
                    return;
                }

                setEvent(eventData);
            } catch (error) {
                console.error("Error loading Event:", error);
                setError("Failed to load Event. Please try again");
            } finally {
                setLoading(false);
            }
        }

        if (currentUser && eventId) {
            loadEvent();
        }
    }, [eventId, currentUser]);

    const handleUpdateEvent = async (eventData) => {
        try {
            setLoading(true);
            const result = await updateEvent(eventId, eventData);

            if (result.success) {
                //navigate back to dashboard after successful update
                setTimeout(() => {
                    navigate("/dashboard");
                }, 2000)
            }

            return result;
        } catch (error) {
            return {
                success: false,
                error: "Failed to update event. Please try again"
            };
        } finally {
            setLoading(false);
        }
    };

    if(loading && !event) {
        return <div className="text-center py-8">Loading event data...</div>
    }

    if (error) {
        return (
            <div className="bg-red-100 text-red-700 p-4 rounded my-4">
                <p>{error}</p>
                <button
                    onClick={() => navigate("/dashboard")}
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Edit Event</h1>
                <button
                    onClick={() =>  navigate("/dashboard")}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                >
                    Cancel
                </button>
            </div>

            {event && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <EventForm
                     initialData={event}
                     onSubmit={handleUpdateEvent}
                     isEditing={true}
                />
                </div>
            )}
        </div>
    );

}

export default EditEvent;