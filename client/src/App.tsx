import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import PrivateRoute from './middleware/PrivateRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route exact path='/' element={<PrivateRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;


// function Layout() {
//   return (
//     <div>
//       <h1>Layout</h1>
//       <Outlet />
//     </div>
//   );
// }