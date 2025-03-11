
import './App.css'
import AppRouter from './Routes/index'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'

function App() {

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}

export default App
