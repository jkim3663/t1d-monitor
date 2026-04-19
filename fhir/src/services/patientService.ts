import { api } from './api';

export const getPatient = (id: string) => {
  return api.get(`Patient/${id}`);
};

export const createPatient = (body: any) => {
  return api.post('Patient', body);
};