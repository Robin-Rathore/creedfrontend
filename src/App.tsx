import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryProvider } from './providers';

import {
  Home,
  EventCreation,
  EventManagement,
  EventDetails,
  Login,
  Messaging,
  Profile
} from './pages';

const App: React.FC = () => {
  return (
    <QueryProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/event/new" element={<EventCreation />} />
          <Route path="/event/management" element={<EventManagement />} />
          <Route path="/event/details" element={<EventDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </QueryProvider>
  );
};

export default App;
