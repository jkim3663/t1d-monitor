
import { NavLink } from 'react-router-dom';
import styles from './sidebar.module.scss';

function Sidebar() {
    return (
        <div className={styles.sidebarChildContainer}>
            <div className={styles.appTitle}>
                Type 1 diabetes monitor
            </div>
            <nav className={styles.navBar}>
                <NavLink to="/home">
                    Dashboard
                </NavLink>
                <NavLink to="/prescription">
                    Prescription Status
                </NavLink>
            </nav>
        </div>
    );
}

export default Sidebar;