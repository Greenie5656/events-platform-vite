import { useState } from "react";
import { db } from "../../firebase/config";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

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
            className={`px-3 py-1 rounded text-sm ${
          event.isActive 
            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
        >
            {isTogglingStatus ? "Updating..." : event.isActive? "Active" : "Inactive" }
        </button>

        <button
            onClick={() => window.location.href = `/edit-event/${event.id}`}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
            >
             Edit
        </button>

        <button
            onClick={deleteEvent}
            disabled={isDeleting}
            className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200">
                    {isDeleting ? "Deleting..." : "Delete"}
        </button>
        </div>
    );
}

export default EventManagement;