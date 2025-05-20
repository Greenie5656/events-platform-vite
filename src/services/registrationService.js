import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";


//register user for an event
export const registerForEvent = async (eventId, userId, userEmail) => {
    try {
        // First, check if the event has capacity limits
        const eventRef = doc(db, "events", eventId);
        const eventSnap = await getDoc(eventRef);

        if (!eventSnap.exists()) {
            throw new Error("Event not found")
        }

        const eventData = eventSnap.data();

        //check if user is already registered
        if (eventData.attendees && eventData.attendees.some(a => a.userId === userId)) {
            throw new Error("You are already registered for this event");
        }

        //check if event has reached capacity
        if (eventData.capacity && eventData.attendees && eventData.attendees.length >= eventData.capacity) {
            throw new Error("This event has reached its capacity");
        }

        //Register the user
        await updateDoc(eventRef, {
            attendees: arrayUnion({
                userId,
                userEmail,
                registeredAt: new Date()
            })
        });

        return { success: true };
    } catch (error){
        console.error("Error registering email:", error);
        return {
            success: false,
            error: error.message || "Failed to register for event"
        };
    }
};


///cancel registration for an event
export const cancelRegistration = async (eventId, userId) => {
    try {
        //get current registrations to find the one to remove
        const eventRef = doc(db, "events", eventId);
        const eventSnap = await getDoc(eventRef);

        if(!eventSnap.exists()) {
            throw new Error("Event not found");
        }

        const eventData = eventSnap.data();

        //find the users registration
        const userRegistration = eventData.attendees.find(a => a.userId === userId);

        if(!userRegistration) {
            throw new Error("You are not registered for this event");
        }

        ///remove the registration
        await updateDoc(eventRef, {
            attendees: arrayRemove(userRegistration)
        });

        return { success: true };
    } catch (error){
        console.error("Error cancelling registration:", error);
        return {
            success: false,
            error: error.message || "Failed to cancel registration"
        };
    }
};


//check if user is registered for an event
export const checkRegistrationStatus = async (eventId, userId) => {
    try {
        const eventRef = doc(db, "events", eventId);
        const eventSnap = await getDoc(eventRef)

        if(!eventSnap.exists()) {
            throw new Error ("Event not found")
        }

        const eventData = eventSnap.data();

        ///check if attendees array exist and user is in it
        return {
            isRegistered: eventData.attendees && eventData.attendees.some(a => a.userId === userId),
            isFull: eventData.capacity && eventData.attendees && eventData.attendees.length >= eventData.capacity,
            attendeeCount: eventData.attendees ? eventData.attendees.length : 0,
            capacity: eventData.capacity || null,
            attendees: eventData.attendees || []
        };
    } catch (error) {
        console.error("Error checking registration status:", error);
        throw error;
    }
};