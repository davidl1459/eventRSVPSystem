import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminDashboard from './components/AdminDashboard';
import CreateEvent from './components/CreateEvent';
import AdminLogin from './components/AdminLogin';
import AttendanceList from './components/AttendanceList';
import RSVPForm from './components/RSVPForm'

import { EventProvider } from './context/EventContext';

function App() {
  return (
    <EventProvider>
      <Router>
        <Routes>
          <Route path="/rsvp" element ={<RSVPForm />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/create" element={<CreateEvent />} />
          <Route path="/attendance" element={<AttendanceList />} />
        </Routes>
      </Router>
    </EventProvider>
  );
}

export default App;
