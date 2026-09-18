import { Router } from 'express';
import { HospitalController } from '../controllers/hospital.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// Protect all hospital resource routes with JWT authentication
router.use(authenticate);

router.get('/patients', HospitalController.getPatientRecords);
router.get('/overview', HospitalController.getHospitalOverview);

export default router;
