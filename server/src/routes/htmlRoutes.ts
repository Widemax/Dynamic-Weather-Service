import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router, Request, Response } from 'express';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve index.html for all routes not caught by API routes
router.get('*', (_req: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

export default router;
