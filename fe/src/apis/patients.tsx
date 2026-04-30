import { fhirR4 } from '@smile-cdr/fhirts';
import { api } from './api';

const patientPath: string = 'Patient';

export function getPatient(patientId: number): Promise<fhirR4.Patient> {
    const apiEndpoint: string = patientPath + `/patient-${patientId}`;
    return api.get(apiEndpoint).then((resp) => resp.json());
}

export function postPatient(requestBody: fhirR4.Patient): Promise<fhirR4.Patient> {
    const apiEndpoint: string = patientPath;
    return api.post(apiEndpoint, requestBody).then((resp) => resp.json());
}

export function getGlucoseObservations(patientId: number): Promise<fhirR4.Bundle> {
    const apiEndpoint = `Observation?subject=Patient/patient-${patientId}&code=2339-0&_sort=-date`;
    return api.get(apiEndpoint).then((resp) => resp.json());
}

export function getA1CObservations(patientId: number): Promise<fhirR4.Bundle> {
    const apiEndpoint = `Observation?subject=Patient/patient-${patientId}&code=4548-4&_sort=-date`;
    return api.get(apiEndpoint).then((resp) => resp.json());
}

export function getMedicationRequests(patientId: number): Promise<fhirR4.Bundle> {
    const apiEndpoint = `MedicationRequest?subject=Patient/patient-${patientId}&status=active`;
    return api.get(apiEndpoint).then((resp) => resp.json());
}

export function getMedicationAdministrations(patientId: number): Promise<fhirR4.Bundle> {
    const apiEndpoint = `MedicationAdministration?subject=Patient/patient-${patientId}&_sort=-effective-time`;
    return api.get(apiEndpoint).then((resp) => resp.json());
}

export function getCarePlan(patientId: number): Promise<fhirR4.Bundle> {
    const apiEndpoint = `CarePlan?subject=Patient/patient-${patientId}&status=active`;
    return api.get(apiEndpoint).then((resp) => resp.json());
}

export function getGoals(patientId: number): Promise<fhirR4.Bundle> {
    const apiEndpoint = `Goal?subject=Patient/patient-${patientId}`;
    return api.get(apiEndpoint).then((resp) => resp.json());
}