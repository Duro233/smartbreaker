import { Router } from 'express';
import { getUser } from '../../functions/user_functions/user_functions.js';

const router = Router();

// GET current settings
router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await getUser(token);
    if (!user) return res.status(401).json({ error: 'AUTH_FAILED' });

    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
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
router.patch('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await getUser(token);
    if (!user) return res.status(401).json({ error: 'AUTH_FAILED' });

    const { firstName, lastName, email, notifications } = req.body;

    if (firstName) user.firstName = firstName;
    if (lastName)  user.lastName  = lastName;
    if (email)     user.email     = email;
    if (notifications) user.notifications = notifications;

    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

export default router;    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

export default router;
