import { useQuery } from '@tanstack/react-query';
import { fhirR4 } from '@smile-cdr/fhirts';
import { getMedicationRequests, getMedicationAdministrations } from '../../apis/patients';
import styles from './PrescriptionPage.module.scss';

const PATIENT_ID = 1000;

function medName(res: fhirR4.MedicationRequest | fhirR4.MedicationAdministration): string {
    return (res as any).medicationCodeableConcept?.text ?? '—';
}

function PrescriptionPage() {
    const medReqQ = useQuery({ queryKey: ['medreq', PATIENT_ID], queryFn: () => getMedicationRequests(PATIENT_ID), retry: 2 });
    const medAdmQ = useQuery({ queryKey: ['medadm', PATIENT_ID], queryFn: () => getMedicationAdministrations(PATIENT_ID), retry: 2 });

    if (medReqQ.isPending || medAdmQ.isPending) return <p>Loading...</p>;
    if (medReqQ.isError || medAdmQ.isError) return <p>Error loading data.</p>;

    const medRequests = (medReqQ.data.entry ?? []).map((e) => e.resource as fhirR4.MedicationRequest);
    const medAdmins  = (medAdmQ.data.entry ?? []).map((e) => e.resource as fhirR4.MedicationAdministration);

    return (
        <div className={styles.prescriptionContainer}>

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
                                    <td>{medName(admin)}</td>
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

        </div>
    );
}

export default PrescriptionPage;
