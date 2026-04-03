import { fhirR4 } from '@smile-cdr/fhirts';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { getPatient } from '../../apis/patients';
import styles from './HomePage.module.scss'

function HomePage() {
    const queryClient = new QueryClient();
    const { isPending, isError, data, error } = useQuery({
        queryKey: ['patient'],
        queryFn: () => {
            return getPatient(1000);
        },
        retry: 2
    });

    if (isPending) {
        return 'Data is loading';
    }

    if (isError) {
        return 'Error Loading';
    }

    function getName(): string {
        if (!data) {
            return 'no data';
        } else if (!data.name) {
            return 'no name object';
        } else if (data.name.length === 0) {
            return 'no name array';
        }
        let name: string = '';
        if (data.name.at(0)?.given?.at(0)) {
            name += data.name?.at(0)?.given?.at(0)?.trim();
        }
        if (data.name.at(0)?.family) {
            name += ` ${data.name.at(0)?.family?.trim()}`;
        }
        return name
    }

    return (
        <div className={styles.homeContainer}>
            <div>
                Welcome to home page
            </div>
            <div>
                This is temporary page
            </div>
            <div>
                id: { data.id }
            </div>
            <div>
                name: { getName() }
            </div>
        </div>
    )
}

export default HomePage;