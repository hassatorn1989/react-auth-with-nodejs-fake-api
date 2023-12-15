import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
    name: string;
    username: string;
}

const ProfilePage: React.FC = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/';
        } else {
            fetch('http://localhost:3000/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then((data: { user: UserData }) => {
                    setUserData(data.user);
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Authentication failed. Please login again.');
                    window.location.href = '/';
                });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div>
            <h1>Welcome to your Profile</h1>
            {userData && (
                <div>
                    <p>Name: {userData.name}</p>
                    <p>Username: {userData.username}</p>
                </div>
            )}

            <button onClick={handleLogout}>Logout</button>

        </div>
    );
};

export default ProfilePage;
