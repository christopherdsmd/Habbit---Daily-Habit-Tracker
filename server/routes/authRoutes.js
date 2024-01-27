const express = require('express');
const router = express.Router();
const cors = require('cors')
const jwt = require('jsonwebtoken');
const { test,registerUser,loginUser, getProfile, addHabit, getHabits, deleteHabit } = require('../controllers/authController')
const { User } = require('../models/user.js');

//login/register routes
//middleware
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173'
    })
)



router.get('/', test)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile', getProfile)


//habit routes 
router.post('/add-habit', addHabit)

router.delete('/delete-habit/:habitId/:userEmail', async (req, res) => {
    const { habitId, userId } = req.params;

    try {
        // Now you can use habitId and userId in your logic
        const result = await deleteHabit(habitId, userId);
        res.json(result);
    } catch (error) {
        console.error('Error handling delete request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.get('/habits', async (req, res) => {
    try {
        const token = req.cookies.token;
        
        // Ensure that the token is present
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: Missing token' });
        }

        // Decode the token to get user ID
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;

        const habits = await getHabits(userId);
        res.json(habits);
    } catch (error) {
        console.error('Error fetching habits:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router 