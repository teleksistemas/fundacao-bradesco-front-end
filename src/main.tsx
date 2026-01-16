import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import MainRoutes from "@/routes/routes"
import ReactDOM from 'react-dom/client'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div id="app">
      <BrowserRouter>
        <MainRoutes />
        <Toaster position="top-center" />
      </BrowserRouter>
    </div>
  </StrictMode>
);
