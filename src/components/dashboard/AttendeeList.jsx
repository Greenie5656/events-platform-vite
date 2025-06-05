import { useState } from "react";
import { ChevronDown, Users } from "lucide-react";

function AttendeeList({ eventId, attendees = [] }) {
    const [isExpanded, setIsExpanded] = useState(false);

    //no attendees
    if(!attendees.length){
        return (
            <div className="text-sm text-payne-gray mt-2">
                No attendees yet
            </div>
        );
    }

    return (
        <div className="mt-2">
            <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-asparagus hover:text-gold hover:underline flex items-center transition-colors duration-200"
            >
            <Users className="w-4 h-4 mr-1" />
            {isExpanded ? "Hide" : "Show"} Attendees ({attendees.length})
            <ChevronDown className={`ml-1 w-3 h-3 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            {isExpanded && (
                <div className="mt-2 border border-payne-gray/30 rounded-lg p-3 bg-snow/50">
                    <h4 className="font-medium mb-2 text-gunmetal">Registered Attendees</h4>
                    <ul className="text-sm space-y-1">
                        {attendees.map((attendee, index) => (
                            <li key={index} className="flex justify-between">
                                <span>{attendee.userEmail}</span>
                                <span className="text-payne-gray">
                                    {attendee.registeredAt?.toDate().toLocaleDateString() || "Unknown Date"}
                                </span>
                            </li>
                        ))}
                    </ul>
                    </div>
            )}
        </div>
    );
}

export default AttendeeList;