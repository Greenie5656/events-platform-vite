// services/calendarService.js
class CalendarService {
  constructor() {
    this.accessToken = null;
    this.isInitialized = false;
  }

  // Initialize Google Identity Services
  async initializeGoogleAPI() {
    if (this.isInitialized) return true;

    try {
      // Load Google Identity Services
      await this.loadGoogleIdentityScript();

      // Initialize Google Identity Services
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: this.handleCredentialResponse.bind(this)
      });

      console.log('Google Identity Services initialized successfully');
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing Google Identity Services:', error);
      throw new Error(`Failed to initialize Google Calendar API: ${error.message}`);
    }
  }

  // Load Google Identity Services script
  loadGoogleIdentityScript() {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.google?.accounts?.id) {
        console.log('Google Identity Services already loaded');
        resolve();
        return;
      }

      console.log('Loading Google Identity Services...');
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Google Identity Services loaded successfully');
        resolve();
      };
      
      script.onerror = (error) => {
        console.error('Failed to load Google Identity Services:', error);
        reject(new Error('Failed to load Google Identity Services'));
      };
      
      document.head.appendChild(script);
    });
  }

  // Handle credential response (not used for calendar, but required)
  handleCredentialResponse(response) {
    console.log('Credential response received:', response);
  }

  // Get access token for Calendar API
  async getAccessToken() {
    return new Promise((resolve, reject) => {
      window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/calendar.events',
        callback: (response) => {
          if (response.error) {
            console.error('Token error:', response.error);
            reject(new Error(response.error));
            return;
          }
          console.log('Access token received:', response.access_token);
          this.accessToken = response.access_token;
          resolve(response.access_token);
        }
      }).requestAccessToken();
    });
  }

  // Add event to Google Calendar using REST API
  async addEventToCalendar(eventData) {
    try {
      console.log('Starting to add event to calendar...', eventData);

      // Initialize if needed
      if (!this.isInitialized) {
        console.log('Initializing Google Identity Services...');
        await this.initializeGoogleAPI();
      }

      // Get access token
      console.log('Getting access token...');
      const accessToken = await this.getAccessToken();

      // Format the event for Google Calendar
      const calendarEvent = this.formatEventForGoogle(eventData);
      console.log('Formatted calendar event:', calendarEvent);

      // Create the event using REST API
      console.log('Creating event via REST API...');
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(calendarEvent)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Calendar API error: ${errorData.error?.message || response.statusText}`);
      }

      const result = await response.json();
      console.log('Event created successfully:', result);

      return {
        success: true,
        eventId: result.id,
        eventUrl: result.htmlLink
      };
    } catch (error) {
      console.error('Error adding event to calendar:', error);
      return {
        success: false,
        error: error.message || 'Failed to add event to calendar'
      };
    }
  }

  // Format event data for Google Calendar API
  formatEventForGoogle(eventData) {
    // Convert event date to proper format
    let eventDate;
    if (eventData.date && typeof eventData.date.toDate === 'function') {
      eventDate = eventData.date.toDate();
    } else if (eventData.date instanceof Date) {
      eventDate = eventData.date;
    } else {
      eventDate = new Date(eventData.date);
    }

    // Calculate end time (assume 2 hours if not specified)
    const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);

    const formattedEvent = {
      summary: eventData.title,
      location: eventData.location,
      description: `${eventData.description}\n\nCategory: ${eventData.category}`,
      start: {
        dateTime: eventDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 }
        ]
      }
    };

    console.log('Event formatted for Google Calendar:', formattedEvent);
    return formattedEvent;
  }
}

// Create singleton instance
const calendarService = new CalendarService();
export default calendarService;