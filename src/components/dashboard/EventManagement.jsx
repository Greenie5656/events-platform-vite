import { useState } from "react";
import { db } from "../../firebase/config";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ToggleLeft, ToggleRight, Edit3, Trash2 } from "lucide-react";

function EventManagement({ event, onEventUpdated, onEventDeleted }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isTogglingStatus, setIsTogglingStatus] = useState(false);

    //toggle event active status
    const toggleEventStatus = async () => {
        try {
            setIsTogglingStatus(true);
            const eventRef = doc(db, "events", event.id);

            //toggle the isActive field
            await updateDoc(eventRef, {
                isActive: !event.isActive
            });

            //notify parent componenet to update its state
            onEventUpdated({
                ...event,
                isActive: !event.isActive
            });
        } catch (error) {
            console.error("Error toggling the event status:", error);
            alert("Failed to update event status");
        } finally {
            setIsTogglingStatus(false);
        }
    };

    //delete event
    const deleteEvent = async () => {
        //confirm before deletion
        if (!window.confirm("Are you sure you want to delete this event?")) {
            return;
        }

        try {
            setIsDeleting(true);
            await deleteDoc(doc(db, "events", event.id));
            onEventDeleted(event.id);
        } catch (error) {
            console.error("Error deleting event:", error);
            alert("Failed to delete event");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex items-center space-x-2 mt-2">
            <button
                onClick={toggleEventStatus}
                disabled={isTogglingStatus}
                className={`flex items-center px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    event.isActive 
                        ? 'bg-asparagus/20 text-asparagus hover:bg-asparagus/30' 
                        : 'bg-payne-gray/20 text-payne-gray hover:bg-payne-gray/30'
                }`}
            >
                {event.isActive ? (
                    <ToggleRight className="w-4 h-4 mr-1" />
                ) : (
                    <ToggleLeft className="w-4 h-4 mr-1" />
                )}
                {isTogglingStatus ? "Updating..." : event.isActive ? "Active" : "Inactive"}
            </button>

            <button
                onClick={() => window.location.href = `/edit-event/${event.id}`}
                className="flex items-center px-3 py-1 bg-gold/20 text-gold rounded-lg text-sm font-medium hover:bg-gold/30 transition-colors duration-200"
            >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
            </button>

            <button
                onClick={deleteEvent}
                disabled={isDeleting}
                className="flex items-center px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors duration-200"
            >
                <Trash2 className="w-4 h-4 mr-1" />
                {isDeleting ? "Deleting..." : "Delete"}
            </button>
        </div>
    );
}

export default EventManagement;