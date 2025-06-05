import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EventList from "../components/events/EventList";
import EventFilters from "../components/events/EventFilters";
import { fetchAllEvents, fetchFilteredEvents } from "../services/eventService";
import { Calendar } from "lucide-react";

function Home() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilters, setActiveFilters] = useState({
        category: "all",
        startDate: null,
        endDate: null
    });
    const [activeSort, setActiveSort] = useState({
        field: "date",
        direction: "asc"
    });

    // categories for filter dropdown 
    const categories = [
        { value: "general", label: "General" },
        { value: "workshop", label: "Workshop" },
        { value: "meetup", label: "Meetup" },
        { value: "seminar", label: "Seminar" },
        { value: "social", label: "Social" }
    ];

    
useEffect(() => {
    const fetchEvents = async () => {
        setLoading(true);
        setError(null);

        try {
            // If there are active filters, use the filtered fetch
            if (activeFilters.category !== "all" || activeFilters.startDate || activeFilters.endDate) {
                // Add onlyActive: true to the filters
                const filtersWithActive = {
                    ...activeFilters,
                    onlyActive: true
                };
                
                console.log("Fetching filtered events with:", filtersWithActive, activeSort);
                const filteredEvents = await fetchFilteredEvents(filtersWithActive, activeSort);
                setEvents(filteredEvents);
            } else {
                // Or just get all ACTIVE events with the current sort
                console.log("Fetching all active events with sort:", activeSort);
                // Add onlyActive: true as a filter here too
                const allEvents = await fetchFilteredEvents({ onlyActive: true }, activeSort);

                // Apply client side sorting if needed
                const sortedEvents = sortEvents(allEvents, activeSort);
                setEvents(sortedEvents);
            }
        } catch (error) {
            console.error("Error loading events: ", error);
            setError("Failed to load events. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    fetchEvents();
}, [activeFilters, activeSort]);

    // Load events when filters or sort options change
    const loadEvents = async () => {
        setLoading(true);
        setError(null);

        try {
            // If there are active filters, use the filtered fetch
            if (activeFilters.category !== "all" || activeFilters.startDate || activeFilters.endDate) {
                const filteredEvents = await fetchFilteredEvents(activeFilters, activeSort);
                setEvents(filteredEvents);
            } else {
                // Or just get all events with the current sort
                const allEvents = await fetchAllEvents();

                // Apply client side sorting if needed
                const sortedEvents = sortEvents(allEvents, activeSort);
                setEvents(sortedEvents);
            }
        } catch (error) {
            console.error("Error loading events: ", error);
            setError("Failed to load events. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle filter changes
    const handleFilterChange = (filters) => {
        setActiveFilters(filters);
   
    };

    // Handle sort changes
    const handleSortChange = (sort) => {
        setActiveSort(sort);

    };

    // Client side sorting function
const sortEvents = (eventsToSort, sort) => {
    console.log("Sorting events client-side:", sort);
    
    return [...eventsToSort].sort((a, b) => {
        if (sort.field === "date") {
            // Handle Firestore Timestamp objects
            let dateA, dateB;
            
            // Convert Firestore Timestamp to milliseconds
            if (a.date && a.date.seconds !== undefined) {
                dateA = a.date.seconds * 1000 + a.date.nanoseconds / 1000000;
            } else {
                dateA = new Date(a.date).getTime();
            }
            
            if (b.date && b.date.seconds !== undefined) {
                dateB = b.date.seconds * 1000 + b.date.nanoseconds / 1000000;
            } else {
                dateB = new Date(b.date).getTime();
            }
            
            return sort.direction === "asc" ? dateA - dateB : dateB - dateA;
        } else if (sort.field === "title") {
            return sort.direction === "asc"
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title);
        }
        return 0;
    });
};
    return (
            

        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gunmetal flex items-center">
                    <Calendar className="w-8 h-8 mr-3 text-asparagus" />Community Events</h1>
            </div>

            <p className="mb-6 text-payne-gray">
                Browse and discover upcoming events in our community. Filter by category or date to find events that interest you.
            </p>

            <EventFilters
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                categories={categories}
            />

            <EventList
                events={events}
                loading={loading}
                error={error}
            />
        </div>
    );
}

export default Home;