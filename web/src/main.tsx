import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from './context/ThemeContext.tsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <GoogleOAuthProvider clientId='779413582050-oo2bgbb10937557053094is1s94lqk1l.apps.googleusercontent.com'>
            <App/>
            </GoogleOAuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
  </StrictMode>,
)
