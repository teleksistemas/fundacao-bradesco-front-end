import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
    let acesso = false;
    const validacaoDeAcesso = localStorage.getItem("token_access");
    
    if (validacaoDeAcesso) {
        acesso = true;
    }
    
    return acesso ? <Outlet /> : <Navigate to="/" />;
};