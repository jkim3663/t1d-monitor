import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import styles from './App.module.scss';
import HomePage from './features/home/HomePage';
import Sidebar from './components/sidebar/sidebar';

function App() {

  useEffect(() => {
    console.log('current mode: ', import.meta.env.VITE_APP_ENV);
  }, []);

  return (
    <div className={styles.topContainer}>
      <div className={styles.sidebarParentContainer}>
        <Sidebar />
      </div>
      <div className={styles.mainContainer}>
        <Routes>
          <Route path='/' element={<Navigate to='/home'/>}></Route>
          <Route path='/home' element={<HomePage/>}></Route>
        </Routes>
      </div>
    </div>
  )
}

export default App
