import { useQuery } from '@tanstack/react-query';
import { fhirR4 } from '@smile-cdr/fhirts';
import {
    getPatient,
    getGlucoseObservations,
    getA1CObservations,
    getCarePlan,
    getGoals,
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

function HomePage() {
    const patientQ  = useQuery({ queryKey: ['patient',  PATIENT_ID], queryFn: () => getPatient(PATIENT_ID),            retry: 2 });
    const glucoseQ  = useQuery({ queryKey: ['glucose',  PATIENT_ID], queryFn: () => getGlucoseObservations(PATIENT_ID), retry: 2 });
    const a1cQ      = useQuery({ queryKey: ['a1c',      PATIENT_ID], queryFn: () => getA1CObservations(PATIENT_ID),     retry: 2 });
    const carePlanQ = useQuery({ queryKey: ['careplan', PATIENT_ID], queryFn: () => getCarePlan(PATIENT_ID),            retry: 2 });
    const goalsQ    = useQuery({ queryKey: ['goals',    PATIENT_ID], queryFn: () => getGoals(PATIENT_ID),               retry: 2 });

    const allPending = [patientQ, glucoseQ, a1cQ, carePlanQ, goalsQ].some((q) => q.isPending);
    const anyError   = [patientQ, glucoseQ, a1cQ, carePlanQ, goalsQ].some((q) => q.isError);

    if (allPending) return <p>Loading...</p>;
    if (anyError)   return <p>Error loading data.</p>;

    const patient    = patientQ.data!;
    const glucoseObs = (glucoseQ.data!.entry ?? []).map((e) => e.resource as fhirR4.Observation);
    const a1cObs     = (a1cQ.data!.entry ?? []).map((e) => e.resource as fhirR4.Observation);
    const carePlan   = (carePlanQ.data!.entry ?? []).at(0)?.resource as fhirR4.CarePlan | undefined;
    const goals      = (goalsQ.data!.entry ?? []).map((e) => e.resource as fhirR4.Goal);

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

            {/* Care Plan */}
            {carePlan && (
                <section className={styles.card}>
                    <h2>{carePlan.title ?? 'Diabetes Care Plan'}</h2>
                    <p className={styles.planMeta}>
                        {String(carePlan.period?.start ?? '')} — {String(carePlan.period?.end ?? '')}
                    </p>

                    <h3>Goals</h3>
                    <ul className={styles.goalList}>
                        {goals.map((g) => (
                            <li key={g.id}>
                                <span>{g.description?.text}</span>
                                <span className={styles.goalBadge}>{g.achievementStatus?.text}</span>
                            </li>
                        ))}
                    </ul>

                    <h3>Activities</h3>
                    <table className={styles.dataTable}>
                        <thead>
                            <tr><th>Activity</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            {(carePlan.activity ?? []).map((a, i) => (
                                <tr key={i}>
                                    <td>{a.detail?.description ?? '—'}</td>
                                    <td className={styles.goalBadge}>{a.detail?.status ?? '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

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
