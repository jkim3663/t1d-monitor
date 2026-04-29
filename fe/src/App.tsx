import { useEffect } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import styles from './App.module.scss';
import HomePage from './features/home/HomePage';
import Sidebar from './components/sidebar/sidebar';
import LoginPage from './features/login/LoginPage';
import ProtectedLayout from './protection';
import RegisterPage from './features/register/RegisterPage';
import PrescriptionPage from './features/prescription/PrescriptionPage';

function App() {

  useEffect(() => {
    console.log('current mode: ', import.meta.env.VITE_APP_ENV);
  }, []);

  function AppLayout() {
    return (
      <div className={styles.topContainer}>
        <div className={styles.sidebarParentContainer}>
          <Sidebar />
        </div>
        <div className={styles.mainContainer}>
          <Outlet />
        </div>
    </div>
    );
  }

  return (
    <Routes>
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route element={<ProtectedLayout />}>
        <Route element={<AppLayout />}>
          <Route path='/' element={<Navigate to='/home' replace />} />
          <Route path='/home' element={<HomePage />} />
          <Route path='/prescription' element={<PrescriptionPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
