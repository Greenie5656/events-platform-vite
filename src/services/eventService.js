import { collection, getDocs, query, orderBy, where, doc, getDoc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase/config";

// Function for fetching a single event by ID
// Export with BOTH names to ensure compatibility with any import
export const fetchEventById = async (eventId) => {
  try {
    const eventRef = doc(db, "events", eventId);
    const eventSnap = await getDoc(eventRef);

    if (eventSnap.exists()){
      return {
        id: eventSnap.id,
        ...eventSnap.data()
      };
    } else {
      throw new Error("Event not found");
    }
  } catch (error){
    console.error("Error fetching event:", error);
    throw error;
  }
};

// Alias for backward compatibility
export const fetchEventsById = fetchEventById;

// Fetch all public events
export const fetchAllEvents = async () => {
  try {
    // Default to ordering by date descending (newest first)
    const q = query(
      collection(db, "events"),
      orderBy("date", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

// Fetch filtered events
export const fetchFilteredEvents = async (filters = {}, sort = { field: "date", direction: "desc" }) => {

  
  try {
    // Start building the query
    let eventQuery = collection(db, "events");
    let constraints = [];
    
    // Add category filter if provided
    if (filters.category && filters.category !== "all") {
      constraints.push(where("category", "==", filters.category));
    }
    
    // Add date range filter if provided
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      startDate.setHours(0, 0, 0, 0);
      constraints.push(where("date", ">=", startDate));
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      constraints.push(where("date", "<=", endDate));
    }


    //Filter by active status (for public view)
    if (filters.onlyActive) {
      constraints.push(where("isActive","==", true))
    }
    
    // Add sorting
    constraints.push(orderBy(sort.field, sort.direction));
    
    // Create the query with all constraints
    const q = query(eventQuery, ...constraints);
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching filtered events:", error);
    throw error;
  }
};

//Update an existing event
export const updateEvent = async (eventId, eventData) => {
  try {
    const eventRef= doc(db, "events", eventId);
    await updateDoc(eventRef, eventData);
    return { success: true };
  } catch (error) {
    console.error("Error updating Event:", error);
    return {
      success: false,
      error: error.message || "Failed to update Event"
    };
  }
};

//delete an event
export const deleteEvent = async (eventId) => {
  try {
    await deleteDoc(doc(db, "events", eventId));
    return { success : true };
  } catch (error) {
    console.error("Error deleting event:", error);
    return {
      success: false,
      error: error.message || "Failed to delete event" 
    };
  }
};

//create a new event
export const createEvent = async (eventData, userId) => {
  try {
    //set default isActive to be true for new events
    const newEvent = {
      ...eventData,
      createdBy: userId,
      createdAt: new Date(),
      attendees: [],
      isActive: true
    };

    const docRef = await addDoc(collection(db, "events"), newEvent);
    return {
      success: true,
      eventId: docRef.id
    };
  } catch (error) {
    console.error("Error creating Event:", error);
    return {
      success: false,
      error: error.message || "Failed to create event"
    };
  }
};