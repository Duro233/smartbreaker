import mongoose from 'mongoose';
import { Router } from 'express';

import { setUpDatabaseConnection } from './functions/db_connections/db_access.js';
import userRoutes from './routes/users_routes/users_routes.js';
import dataRoutes from './routes/data_routes/data_routes.js';
import settingsRoutes from './routes/settings_routes/settings_routes.js';

export function setApp(app, client)
{	
	const router = Router();
	app.use('/api', router);

	
	router.use('/users', userRoutes);
	router.use('/data', dataRoutes);
	router.use('/settings', settingsRoutes);


	const database_connections = setUpDatabaseConnection(client, mongoose);

	/*app.post('/api/data', (req, res) => {
		console.log('Received data from ESP32:', req.body);
		res.status(200).json({ message: 'Data received successfully!' });
	});*/
}
