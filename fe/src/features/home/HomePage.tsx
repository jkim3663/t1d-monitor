import { useQuery } from '@tanstack/react-query';
import { fhirR4 } from '@smile-cdr/fhirts';
import { getPatient, getGlucoseObservations } from '../../apis/patients';
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

function HomePage() {
    const patientQuery = useQuery({
        queryKey: ['patient', PATIENT_ID],
        queryFn: () => getPatient(PATIENT_ID),
        retry: 2,
    });

    const glucoseQuery = useQuery({
        queryKey: ['glucose', PATIENT_ID],
        queryFn: () => getGlucoseObservations(PATIENT_ID),
        retry: 2,
    });

    if (patientQuery.isPending || glucoseQuery.isPending) return <p>Loading...</p>;
    if (patientQuery.isError || glucoseQuery.isError) return <p>Error loading data.</p>;

    const patient = patientQuery.data;
    const observations = (glucoseQuery.data.entry ?? []).map(
        (e) => e.resource as fhirR4.Observation
    );

    return (
        <div className={styles.homeContainer}>
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

            <section className={styles.card}>
                <h2>Glucose Readings</h2>
                <table className={styles.glucoseTable}>
                    <thead>
                        <tr>
                            <th>Date / Time</th>
                            <th>Value (mg/dL)</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {observations.map((obs) => {
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
