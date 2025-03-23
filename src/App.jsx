import { Toaster } from 'react-hot-toast'
import './App.css'
import AppRouter from './Routes/index'
import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </>
  )
}

export default App
