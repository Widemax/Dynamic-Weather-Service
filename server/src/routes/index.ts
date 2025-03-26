import { Router } from 'express';
import weatherRoutes from './api/weatherRoutes.js';
import htmlRoutes from './htmlRoutes.js';

const router = Router();

// Mount weather routes under /api/weather
router.use('/api/weather', weatherRoutes);

// Mount HTML routes for all other paths
router.use(htmlRoutes);

export default router;
