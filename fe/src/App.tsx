import { useEffect } from 'react'
import './App.css'

function App() {

  useEffect(() => {
    console.log('current mode: ', import.meta.env.MODE)
  }, []);

  return (
    <>
      <div>
        hi
      </div>
    </>
  )
}

export default App
