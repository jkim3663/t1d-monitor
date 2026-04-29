import { useQuery } from '@tanstack/react-query';
import { fhirR4 } from '@smile-cdr/fhirts';
import {
    getPatient,
    getGlucoseObservations,
    getA1CObservations,
    getMedicationRequests,
    getMedicationAdministrations,
} from '../../apis/patients';
import styles from './HomePage.module.scss';

const PATIENT_ID = 1000;

function getPatientName(patient: fhirR4.Patient): string {
    const name = patient.name?.at(0);
    if (!name) return 'Unknown';
    return [name.given?.at(0), name.family].filter(Boolean).join(' ');
}

function glucoseStatus(value: number): string {
    if (value < 70) return styles.low;
    if (value > 180) return styles.high;
    return styles.normal;
}

function a1cStatus(value: number): string {
    if (value < 7) return styles.normal;
    if (value < 9) return styles.high;
    return styles.low;
}

function a1cLabel(value: number): string {
    if (value < 7) return 'At target';
    if (value < 9) return 'Above target';
    return 'Poor control';
}

function medName(req: fhirR4.MedicationRequest): string {
    return (req as any).medicationCodeableConcept?.text ?? '—';
}

function adminMedName(admin: fhirR4.MedicationAdministration): string {
    return (admin as any).medicationCodeableConcept?.text ?? '—';
}

function HomePage() {
    const patientQ = useQuery({ queryKey: ['patient', PATIENT_ID], queryFn: () => getPatient(PATIENT_ID), retry: 2 });
    const glucoseQ = useQuery({ queryKey: ['glucose', PATIENT_ID], queryFn: () => getGlucoseObservations(PATIENT_ID), retry: 2 });
    const a1cQ     = useQuery({ queryKey: ['a1c', PATIENT_ID],     queryFn: () => getA1CObservations(PATIENT_ID),     retry: 2 });
    const medReqQ  = useQuery({ queryKey: ['medreq', PATIENT_ID],  queryFn: () => getMedicationRequests(PATIENT_ID),  retry: 2 });
    const medAdmQ  = useQuery({ queryKey: ['medadm', PATIENT_ID],  queryFn: () => getMedicationAdministrations(PATIENT_ID), retry: 2 });

    const allPending = [patientQ, glucoseQ, a1cQ, medReqQ, medAdmQ].some((q) => q.isPending);
    const anyError   = [patientQ, glucoseQ, a1cQ, medReqQ, medAdmQ].some((q) => q.isError);

    if (allPending) return <p>Loading...</p>;
    if (anyError)   return <p>Error loading data.</p>;

    const patient      = patientQ.data!;
    const glucoseObs   = (glucoseQ.data!.entry ?? []).map((e) => e.resource as fhirR4.Observation);
    const a1cObs       = (a1cQ.data!.entry ?? []).map((e) => e.resource as fhirR4.Observation);
    const medRequests  = (medReqQ.data!.entry ?? []).map((e) => e.resource as fhirR4.MedicationRequest);
    const medAdmins    = (medAdmQ.data!.entry ?? []).map((e) => e.resource as fhirR4.MedicationAdministration);

    return (
        <div className={styles.homeContainer}>

            {/* Patient Info */}
            <section className={styles.card}>
                <h2>Patient Info</h2>
                <table className={styles.infoTable}>
                    <tbody>
                        <tr><td>Name</td><td>{getPatientName(patient)}</td></tr>
                        <tr><td>DOB</td><td>{patient.birthDate}</td></tr>
                        <tr><td>Gender</td><td>{patient.gender}</td></tr>
                        <tr><td>ID</td><td>{patient.id}</td></tr>
                    </tbody>
                </table>
            </section>

            {/* A1C History */}
            <section className={styles.card}>
                <h2>HbA1c History</h2>
                <table className={styles.dataTable}>
                    <thead>
                        <tr><th>Date</th><th>HbA1c (%)</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                        {a1cObs.map((obs) => {
                            const value = obs.valueQuantity?.value ?? 0;
                            const dt = obs.effectiveDateTime
                                ? new Date(obs.effectiveDateTime).toLocaleDateString()
                                : '—';
                            return (
                                <tr key={obs.id}>
                                    <td>{dt}</td>
                                    <td>{value.toFixed(1)}</td>
                                    <td className={a1cStatus(value)}>{a1cLabel(value)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </section>

            {/* Insulin Prescriptions */}
            <section className={styles.card}>
                <h2>Active Insulin Prescriptions</h2>
                <table className={styles.dataTable}>
                    <thead>
                        <tr><th>Medication</th><th>Dose</th><th>Instructions</th></tr>
                    </thead>
                    <tbody>
                        {medRequests.map((req) => {
                            const dosage = req.dosageInstruction?.at(0);
                            const dose = dosage?.doseAndRate?.at(0)?.doseQuantity;
                            return (
                                <tr key={req.id}>
                                    <td>{medName(req)}</td>
                                    <td>{dose ? `${dose.value} ${dose.unit}` : '—'}</td>
                                    <td>{dosage?.text ?? '—'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </section>

            {/* Insulin Administration Log */}
            <section className={styles.card}>
                <h2>Insulin Administration Log</h2>
                <table className={styles.dataTable}>
                    <thead>
                        <tr><th>Date / Time</th><th>Medication</th><th>Dose</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                        {medAdmins.map((admin) => {
                            const dose = admin.dosage?.dose;
                            const dt = admin.effectiveDateTime
                                ? new Date(admin.effectiveDateTime).toLocaleString()
                                : '—';
                            const taken = admin.status === 'completed';
                            return (
                                <tr key={admin.id}>
                                    <td>{dt}</td>
                                    <td>{adminMedName(admin)}</td>
                                    <td>{dose ? `${dose.value} ${dose.unit}` : '—'}</td>
                                    <td className={taken ? styles.normal : styles.low}>
                                        {taken ? 'Taken' : 'Missed'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </section>

            {/* Glucose Readings */}
            <section className={styles.card}>
                <h2>Glucose Readings</h2>
                <table className={styles.dataTable}>
                    <thead>
                        <tr><th>Date / Time</th><th>Value (mg/dL)</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                        {glucoseObs.map((obs) => {
                            const value = obs.valueQuantity?.value ?? 0;
                            const dt = obs.effectiveDateTime
                                ? new Date(obs.effectiveDateTime).toLocaleString()
                                : '—';
                            return (
                                <tr key={obs.id}>
                                    <td>{dt}</td>
                                    <td>{value}</td>
                                    <td className={glucoseStatus(value)}>
                                        {value < 70 ? 'Low' : value > 180 ? 'High' : 'Normal'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </section>

        </div>
    );
}

export default HomePage;
