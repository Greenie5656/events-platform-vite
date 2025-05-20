import EventCard from "./EventCard";

function EventList ({ events, loading, error }) {

    console.log("Events data:", events);
    
    if (loading) {
        return <div className="text-center py-8">Loading events...</div>
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-600">
                Error loading events: { error }
            </div>
        );
    }

    if (!events || events.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No Events Founds
            </div>
        );
    } 

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    );
}

export default EventList;