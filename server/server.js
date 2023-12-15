const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add this line

const app = express();
const secretKey = 'your_secret_key'; // Replace with your secret key

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Fake user data
const users = [
    { id: 1, username: 'user1', password: 'password1', name: 'User One' },
    { id: 2, username: 'user2', password: 'password2', name: 'User Two' }
];

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const token = jwt.sign({ username: user.username, id: user.id }, secretKey, { expiresIn: '1h' });
        res.json({ 
            token
         });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Token not provided' });
    }

    jwt.verify(token.replace('Bearer ', ''), secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        req.decoded = decoded;
        next();
    });
};

// Refresh token route
app.post('/token', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    if (!refreshTokens.includes(token)) {
        return res.status(403).json({ message: 'Invalid token' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }

        const newToken = jwt.sign({ username: decoded.username, id: decoded.id }, secretKey, { expiresIn: '1h' });
        res.json({ token: newToken });
    });
});

// Profile route - Accessible only with a valid token
app.get('/profile', verifyToken, (req, res) => {
    const user = users.find(u => u.id === req.decoded.id);
    res.json({ user });
});

// Logout route
app.post('/logout', (req, res) => {
    const { refreshToken } = req.body;
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    res.status(204).end();
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});