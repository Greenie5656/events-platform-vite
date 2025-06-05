// components/events/EventForm.jsx
import { useState, useEffect } from "react";

function EventForm({ onSubmit, initialData, isEditing = false }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [capacity, setCapacity] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const categoryOptions = [
    { value: "general", label: "General" },
    { value: "workshop", label: "Workshop" },
    { value: "meetup", label: "Meetup" },
    { value: "seminar", label: "Seminar" },
    { value: "social", label: "Social" }
  ];

  //if initialData is provided, populate the form for editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      
      // Format date and time from timestamp
      if (initialData.date) {
        const eventDate = initialData.date.toDate ? initialData.date.toDate() : new Date(initialData.date);
        setDate(eventDate.toISOString().split('T')[0]);
        
        // Format time as HH:MM
        const hours = eventDate.getHours().toString().padStart(2, '0');
        const minutes = eventDate.getMinutes().toString().padStart(2, '0');
        setTime(`${hours}:${minutes}`);
      }
      
      setLocation(initialData.location || "");
      setDescription(initialData.description || "");
      setCategory(initialData.category || "general");
      setCapacity(initialData.capacity ? initialData.capacity.toString() : "");
      setIsActive(initialData.isActive !== undefined ? initialData.isActive : true);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    
    // Basic validation
    if (!title || !date || !time || !location || !description) {
      setError("All fields are required");
      setLoading(false);
      return;
    }
    
    // Create event object
    const eventData = {
      title,
      date: new Date(`${date}T${time}`),
      location,
      description,
      category,
      capacity: capacity ? parseInt(capacity) : null,
      isActive: isActive
    };
    
    // Call the onSubmit handler from parent
    const result = await onSubmit(eventData);
    
    setLoading(false);
    
    if (result.success) {
      // if not editng reest from
      if(!isEditing) {
      setTitle("");
      setDate("");
      setTime("");
      setLocation("");
      setDescription("");
      setCategory("general");
      setCapacity("");
      setSuccess(true);
      setIsActive(true);
      }

      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || "Failed to create event");
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 mb-4 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-asparagus/10 border border-asparagus/30 text-asparagus p-3 mb-4 rounded-lg">
          Event {isEditing ? "updated" : " created"} successfully!
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1 text-sm font-medium text-gunmetal mb-1">
            Event Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-payne-gray/40 rounded-lg px-3 py-2 focus:border-asparagus focus:outline-none focus:ring-1 focus:ring-asparagus transition-colors duration-200"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="blocblock mb-1 text-sm font-medium text-gunmetal mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-payne-gray/40 rounded-lg px-3 py-2 focus:border-asparagus focus:outline-none focus:ring-1 focus:ring-asparagus transition-colors duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="time" className="block mb-1 text-sm font-medium text-gunmetal">
              Time
            </label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border border-payne-gray/40 rounded-lg px-3 py-2 focus:border-asparagus focus:outline-none focus:ring-1 focus:ring-asparagus transition-colors duration-200"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="location" className="block mb-1 text-sm font-medium text-gunmetal">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-payne-gray/40 rounded-lg px-3 py-2 focus:border-asparagus focus:outline-none focus:ring-1 focus:ring-asparagus transition-colors duration-200"
            required
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block mb-1 text-sm font-medium text-gunmetal">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-payne-gray/40 rounded-lg px-3 py-2 focus:border-asparagus focus:outline-none focus:ring-1 focus:ring-asparagus transition-colors duration-200"
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="capacity" className="block mb-1 text-sm font-medium text-gunmetal">
            Capacity (optional)
          </label>
          <input
            type="number"
            id="capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full border border-payne-gray/40 rounded-lg px-3 py-2 focus:border-asparagus focus:outline-none focus:ring-1 focus:ring-asparagus transition-colors duration-200"
            min="1"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block mb-1 text-sm font-medium text-gunmetal">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-payne-gray/40 rounded-lg px-3 py-2 focus:border-asparagus focus:outline-none focus:ring-1 focus:ring-asparagus transition-colors duration-200"
            rows="4"
            required
          ></textarea>
        </div>

        {isEditing && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="mr-2 text-asparagus focus:ring-asparagus"
            />
            <label htmlFor="isActive" className="text-sm text-gunmetal">
              Event Active (visible to users)
            </label>
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-asparagus text-snow py-3 rounded-lg font-medium transition-colors duration-200 ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-gold"
          }`}
        >
          {loading
           ? (isEditing ? "Updating Event..." : "Creating Event...")
           : (isEditing ? "Update Event" : "Create Event")}
        </button>
      </form>
    </div>
  );
}

export default EventForm;