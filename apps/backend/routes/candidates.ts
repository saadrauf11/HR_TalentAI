import { Router, Request, Response, NextFunction } from 'express';
import { sequelize } from '../models';
import { DataTypes } from 'sequelize';
import multer from 'multer';
import Joi from 'joi';
import fs from 'fs';
import path from 'path';

const Candidate = sequelize.define('Candidate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tenantId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads/cvs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed.'));
    }
  },
});

// Define the validation schema using Joi
const candidateSchema = Joi.object({
  tenantId: Joi.string().optional(),
  name: Joi.any(), // Temporarily allow any value for `name`
  email: Joi.string().email().required(),
  phone: Joi.string().optional().pattern(/^[0-9]+$/),
});

const router = Router();

router.get('/', async (req, res) => {
  const candidates = await Candidate.findAll();
  res.json(candidates);
});

router.post(
  '/',
  (req: Request, res: Response, next: NextFunction) => {
    upload.single('cv')(req, res, (err) => {
      if (err instanceof multer.MulterError || err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  async (req: Request, res: Response) => {
    console.log('Request Body:', req.body); // Log request body
    console.log('Uploaded File:', req.file); // Log uploaded file details

    const { error } = candidateSchema.validate(req.body, { abortEarly: false });
    if (error) {
      console.error('Validation Errors:', error.details); // Log validation errors
      return res.status(400).json({
        errors: error.details.map((err: Joi.ValidationErrorItem) => ({ field: err.context?.key, message: err.message })),
      });
    }

    try {
      const { tenantId, name, email, phone } = req.body;
      const cvPath = req.file ? req.file.path : null;

      const candidate = await Candidate.create({
        tenantId,
        name,
        email,
        phone,
        cvPath,
      });

      res.status(201).json(candidate);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }
);

router.put(
  '/:id',
  (req: Request, res: Response, next: NextFunction) => {
    upload.single('cv')(req, res, (err) => {
      if (err instanceof multer.MulterError || err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  async (req: Request, res: Response) => {
    console.log('PUT Request Body:', req.body); // Log request body
    console.log('Uploaded File:', req.file); // Log uploaded file details

    const { error } = candidateSchema.validate(req.body, { abortEarly: false });
    if (error) {
      console.error('Validation Errors:', error.details); // Log validation errors
      return res.status(400).json({
        errors: error.details.map((err: Joi.ValidationErrorItem) => ({ field: err.context?.key, message: err.message })),
      });
    }

    try {
      const { id } = req.params;
      const { tenantId, name, email, phone } = req.body;
      const cvPath = req.file ? req.file.path : null;

      const candidate = await Candidate.findByPk(id);
      if (!candidate) {
        return res.status(404).json({ error: 'Candidate not found' });
      }

      await candidate.update({
        tenantId,
        name,
        email,
        phone,
        cvPath,
      });

      res.json(candidate);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }
);

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findByPk(id);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    await candidate.destroy();
    res.status(204).send();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
});

export default router;
