import { fhirR4 } from '@smile-cdr/fhirts';
import { api } from './api';

const patientPath: string = 'Patient';

export function getPatient(patientId: number): Promise<fhirR4.Patient> {
    const apiEndpoint: string = patientPath + `/${patientId}`;
    return api.get(apiEndpoint).then((resp) => resp.json());
}

export function postPatient(requestBody: fhirR4.Patient): Promise<fhirR4.Patient> {
    const apiEndpoint: string = patientPath;
    return api.post(apiEndpoint, requestBody).then((resp) => resp.json());
}