const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

// Signup
router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            fullName,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);

        res.status(500).send('Server error');
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update profile details (currently supports fullName)
router.put('/profile/:id', async (req, res) => {
    const { id } = req.params;
    const { fullName, image } = req.body || {};

    if (!fullName && !image) {
        return res.status(400).json({ msg: 'Nothing to update' });
    }

    const update = {};
    if (typeof fullName === 'string' && fullName.trim()) update.fullName = fullName.trim();
    if (typeof image === 'string') update.image = image; // expect base64 data URL

    try {
        const user = await User.findByIdAndUpdate(
            id,
            { $set: update },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        return res.json({ msg: 'Profile updated successfully', user });
    } catch (err) {
        console.error('Error updating profile:', err);
        return res.status(500).json({ msg: 'Server error' });
    }
});

// Get profile
router.get('/profile/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        return res.json(user);
    } catch (err) {
        console.error('Error fetching profile:', err);
        return res.status(500).json({ msg: 'Server error' });
    }
});


// Reset/Change Password
// Body: { currentPassword, newPassword }
router.put('/resetpassword/:id', async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ msg: 'currentPassword and newPassword are required' });
    }
    if (typeof newPassword !== 'string' || newPassword.length < 6) {
        return res.status(400).json({ msg: 'newPassword must be at least 6 characters' });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Current password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        return res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error('Error resetting password:', err);
        return res.status(500).json({ msg: 'Server error' });
    }
});



module.exports = router;