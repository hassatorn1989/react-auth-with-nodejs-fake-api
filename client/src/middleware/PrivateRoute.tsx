import Reac, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
function PrivateRoute() {
    const isAuthenticated = !!localStorage.getItem('accessToken');

    useEffect(() => {
        handleRefreshToken();
    }, [handleRefreshToken]);

    async function handleRefreshToken() {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken !== null){
            await fetch('http://localhost:3000/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refreshToken: localStorage.getItem('refreshToken')
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.accessToken) {
                        localStorage.setItem('accessToken', data.accessToken);
                    }
                })
                .catch(error => {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/';
                });
        }
    }

    return isAuthenticated ? (
        <Outlet />
    ) : (
        <Navigate to="/" replace />
    );
}
export default PrivateRoute;