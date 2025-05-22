import { useState } from "react";

function AttendeeList({ eventId, attendees = [] }) {
    const [isExpanded, setIsExpanded] = useState(false);

    //no attendees
    if(!attendees.length){
        return (
            <div className="text-sm text-gray-500 mt-2">
                No attendees yet
            </div>
        );
    }

    return (
        <div className="mt-2">
            <button
            onClick={()=> setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 hover:underline flex items-center">
                    {isExpanded? "Hide" : "Show"} Attendees ({attendees.length})
                    <svg 
                        className={`ml-1 transform ${isExpanded ? 'rotate-180' : ''}`} 
                        width="12" 
                        height="12" 
                        viewBox="0 0 12 12" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
            </button>

            {isExpanded && (
                <div className="mt-2 border rounded p-3 bg-gray-50">
                    <h4 className="font-medium mb-2">Registered Attendees</h4>
                    <ul className="text-sm space-y-1">
                        {attendees.map((attendee, index) => (
                            <li key={index} className="flex justify-between">
                                <span>{attendee.userEmail}</span>
                                <span className="text-gray-500">
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