import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.js';

interface PatientRecord {
  id: string;
  patientName: string;
  age: number;
  condition: string;
  doctorAssigned: string;
  roomNumber: string;
}

const SAMPLE_RECORDS: PatientRecord[] = [
  {
    id: 'rec_101',
    patientName: 'Jane Doe',
    age: 34,
    condition: 'Acute Appendicitis - Post-Op Recovery',
    doctorAssigned: 'Dr. Sarah Smith',
    roomNumber: '302-B',
  },
  {
    id: 'rec_102',
    patientName: 'John Appleseed',
    age: 48,
    condition: 'Type 2 Diabetes - Routine Monitoring',
    doctorAssigned: 'Dr. Robert Chen',
    roomNumber: '115-A',
  },
  {
    id: 'rec_103',
    patientName: 'Alice Johnson',
    age: 29,
    condition: 'Fractured Fibula - Orthopedic Care',
    doctorAssigned: 'Dr. Emily Watson',
    roomNumber: '204-C',
  },
];

export class HospitalController {
  // Protected route - only accessible by authenticated users
  static async getPatientRecords(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.status(200).json({
        status: 'success',
        message: `Welcome, ${req.user?.email}! Here are the protected hospital patient records.`,
        requestedBy: req.user,
        data: {
          total: SAMPLE_RECORDS.length,
          records: SAMPLE_RECORDS,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Protected route - get hospital statistics
  static async getHospitalOverview(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.status(200).json({
        status: 'success',
        data: {
          hospitalName: 'General Care Medical Center',
          occupiedBeds: 142,
          availableBeds: 58,
          activeDoctors: 24,
          emergencyWaitTimeMinutes: 12,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
