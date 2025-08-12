const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../model/user');

const router = express.Router();

// Health check (optional)
router.get('/health', (_req, res) => res.json({ ok: true }));

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

