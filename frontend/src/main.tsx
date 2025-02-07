import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Login.tsx'
import { AuthProvider, UserProvider } from './AuthProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
            </Routes>
            <UserProvider>
                <Routes>
                    <Route path="/students" element={<App />}/>
                </Routes>
            </UserProvider>
        </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
