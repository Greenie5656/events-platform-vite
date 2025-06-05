import EventCard from "./EventCard";
import { Loader2, AlertCircle, Calendar } from "lucide-react";

function EventList ({ events, loading, error }) {

    console.log("Events data:", events);
    
    if (loading) {
        return (<div className="text-center py-8 text-payne-gray flex items-center justify-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Loading events...
                </div>)
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-600 bg-red-50 border border-red-200 rounded-lg p-4 mx-auto max-w-md flex items-center justify-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Error loading events: { error }
            </div>
        );
    }

    if (!events || events.length === 0) {
        return (
            <div className="text-center py-8 text-payne-gray flex items-center justify-center">
                <Calendar className="w-5 h-5 mr-2" />
                No Events Found
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