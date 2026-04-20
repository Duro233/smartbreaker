import { Router } from 'express';

const router = Router();

// GET current settings for a user
router.get('/:userId', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const user = await db.collection('users').findOne({ _id: req.params.userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      name: user.name,
      email: user.email,
      notifications: user.notifications ?? {
        emailAlerts: true,
        tripAlerts: true,
        offlineAlerts: false,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PATCH — save updated settings
router.patch('/:userId', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { name, email, notifications } = req.body;

    await db.collection('users').updateOne(
      { _id: req.params.userId },
      { $set: { name, email, notifications } }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

export default router;
