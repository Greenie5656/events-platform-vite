import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import { collection, addDoc, query, where , getDocs, orderBy } from "firebase/firestore";
import EventForm from "../components/events/EventForm";
import EventList from "../components/events/EventList"

function Dashboard() {
    const { currentUser } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState (true);
    const [error, setError] = useState(null);

    ///load staffs events
    useEffect(() => {
        async function fetchEvents() {
            try {
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
            } catch(error) {
                console.error("Error fetching events:", error);
                setError("Failed to load events. Please try again");
            } finally {
                setLoading(false);
            }
        } 

        if (currentUser){
            fetchEvents()
        }
    }, [currentUser]);


    ///Handler for creating new event

    const handleCreateEvent = async (eventData) => {
        try {
            setLoading(true);
            //add current date and user ID to event data
            const newEvent = {
                ...eventData,
                createdBy: currentUser.uid,
                createdAt: new Date(),
                attendees: []
            };

            //add to firestore
            const docRef = await addDoc(collection(db, "events"), newEvent);

            //add to local state
            setEvents(prevEvents => [
              {
                id: docRef.id,
                ...newEvent
              },
              ...prevEvents
            ]);

            return { success: true };
        } catch (error) {
            console.error("Error creating event:", error);
            return { 
                success: false,
                error: "Failed to create event. Please try again"
            };
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold mb-6">Staff Dashboard</h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
            <EventForm onSubmit={handleCreateEvent} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your Events</h2>
                <EventList events={events} loading={loading} error={error} />

        </div>
    </div>
    );
}

export default Dashboard;