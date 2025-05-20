import { collection, getDocs, query, orderBy, where, doc, getDoc } from "firebase/firestore";
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

  console.log("Sort options:", sort); // Debug log
  
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