import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from"./pages/Signup";
import Dashboard from "./pages/Dashboard";
import EventDetail from "./pages/EventDetail";
import EditEvent from "./pages/EditEvent";

// protected route component
function ProtectedRoute( { children, requiredRole }) {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!currentUser) return <Navigate to="/login" />;

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
}

function App() {
  return  (
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element= {<Home />} />
              <Route path="/login" element= {<Login />} />
              <Route path="/signup" element= {<Signup />} />
              <Route path="/event/:eventId" element= {<EventDetail />} />
              <Route path="/dashboard" element= {
                <ProtectedRoute requiredRole="staff">
                <Dashboard />
                </ProtectedRoute>
              }
              />
              <Route path="/edit-event/:eventId" element= {
                <ProtectedRoute>
                  <EditEvent />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>

      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;