/**
 * Zod validation schemas for the medical platform
 * Robust validation of input data
 */

import { z } from 'zod';

// Schéma d'authentification - Login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must contain at least 6 characters'),
});

// Schéma d'authentification - Inscription
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must contain at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(6, 'Password must contain at least 6 characters'),
  confirmPassword: z.string(),
  userType: z.enum(['patient', 'doctor'], {
    errorMap: () => ({ message: 'User type must be patient or doctor' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Patient profile schema
export const patientProfileSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  bloodType: z.string().optional(),
  emergencyContact: z.string().optional(),
});

// Doctor profile schema
export const doctorProfileSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  specialty: z.string().min(2, 'Specialty is required'),
  experience: z.string().optional(),
  languages: z.array(z.string()).optional(),
});

// Appointment schema
export const appointmentSchema = z.object({
  doctorId: z.number().int().positive('Doctor ID must be positive'),
  patientId: z.number().int().positive('Patient ID must be positive'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  type: z.enum(['video', 'in-person'], {
    errorMap: () => ({ message: 'Type must be video or in-person' }),
  }),
  reason: z.string().min(5, 'Reason must contain at least 5 characters').max(500),
});

// Patient data schema for ML
export const patientDataSchema = z.object({
  age: z.number().int().min(0).max(120, 'Invalid age (0-120)'),
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({ message: 'Gender must be male or female' }),
  }),
  bmi: z.number().min(10).max(50).optional(),
  smoker: z.boolean().optional(),
  alcohol: z.boolean().optional(),
  diabetes_family: z.boolean().optional(),
  heart_disease_family: z.boolean().optional(),
  cancer_family: z.boolean().optional(),
  blood_pressure: z.string().regex(/^\d{2,3}\/\d{2,3}$/, 'Invalid blood pressure format (ex: 120/80)').optional(),
  cholesterol: z.number().min(100).max(400).optional(),
  exercise_hours: z.number().min(0).max(168).optional(),
  diet_quality: z.enum(['excellent', 'good', 'average', 'poor']).optional(),
  stress_level: z.enum(['low', 'medium', 'high']).optional(),
  sleep_hours: z.number().min(0).max(24).optional(),
  pollution_exposure: z.enum(['low', 'medium', 'high']).optional(),
  radiation_exposure: z.boolean().optional(),
});

// Message schema
export const messageSchema = z.object({
  senderId: z.number().int().positive(),
  receiverId: z.number().int().positive(),
  content: z.string().min(1, 'Message cannot be empty').max(5000),
});

// Medical record schema
export const medicalRecordSchema = z.object({
  patientId: z.number().int().positive(),
  doctorId: z.number().int().positive(),
  diagnosis: z.string().min(5, 'Le diagnostic doit contenir au moins 5 caractères'),
  treatment: z.string().min(5, 'Le traitement doit contenir au moins 5 caractères'),
  notes: z.string().max(2000).optional(),
  medications: z.array(z.string()).optional(),
});

// Health metrics schema
export const healthMetricsSchema = z.object({
  patientId: z.number().int().positive(),
  weight: z.number().min(20).max(300).optional(),
  height: z.number().min(50).max(250).optional(),
  blood_pressure_systolic: z.number().min(70).max(200).optional(),
  blood_pressure_diastolic: z.number().min(40).max(130).optional(),
  heart_rate: z.number().min(40).max(200).optional(),
  temperature: z.number().min(35).max(42).optional(),
  blood_sugar: z.number().min(50).max(400).optional(),
});

// Helper function to validate data
export function validateSchema(schema, data) {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const errors = result.error.errors && result.error.errors.length > 0 
      ? result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }))
      : [{ field: 'general', message: 'Validation failed' }];
    return { success: false, errors };
  }
  
  return { success: true, data: result.data };
}
