const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

const app = express();
const secretKey = 'myToken'; // Replace with your secret key

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Fake user data
const users = [
    { id: 1, username: 'user1', password: '1234', name: 'User One' },
    { id: 2, username: 'user2', password: '1234', name: 'User Two' }
];

let refreshTokens = [];

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const accessToken = generateAccessToken(user);
        const refreshToken = jwt.sign({ id: user.id }, secretKey);
        refreshTokens.push(refreshToken);
        res.json({ accessToken, refreshToken });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Profile route - Accessible only with a valid token
app.get('/profile', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    res.json({ user });
});

// Logout route
app.post('/logout', (req, res) => {
    const { refreshToken } = req.body;
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    res.status(204).end();
});

// Token refresh route
app.post('/token', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token not provided' });
    }

    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json({ message: 'Invalid refresh token' });
    }

    jwt.verify(refreshToken, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }
        const accessToken = generateAccessToken({ id: user.id });
        res.json({ accessToken });
    });
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

function generateAccessToken(user) {
    return jwt.sign({ id: user.id }, secretKey, { expiresIn: '15m' });
}

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});