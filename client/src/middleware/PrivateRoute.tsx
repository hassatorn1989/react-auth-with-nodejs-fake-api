import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

// interface PrivateRouteProps {
//     path: string;
//     element: React.ReactNode;
// }

// const PrivateRoute: React.FC<PrivateRouteProps> = ({ path, element }) => {
//     const isAuthenticated = !!localStorage.getItem('token');

//     return isAuthenticated ? (
//         <Route path={path} element={element} />
//     ) : (
//         <Navigate to="/" replace />
//     );
// };

// export default PrivateRoute;


function PrivateRoute() {
    const isAuthenticated = !!localStorage.getItem('token');
    return isAuthenticated ? (
        <Outlet />
    ) : (
        <Navigate to="/" replace />
    );
}


export default PrivateRoute;