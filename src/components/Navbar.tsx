import Logo from "@/assets/Fundacao.webp"
import { Send, Flag, LogOut } from 'lucide-react';

export default function Navbar() {

    const logout = () => {
        localStorage.removeItem("token_access");
    }

    return (
        <div className="fixed z-90 top-0 left-0 w-screen h-auto py-4! px-10! flex justify-between items-center bg-destructive shadow-xl">
            <div className="w-full h-full flex justify-start items-center bg-destructive">
                <img className="rounded-lg shadow-lg" width={200} src={Logo} alt="Logo Bradesco" />
            </div>
            <div className="w-full h-full flex justify-end items-center gap-10 px-10!">
                <a href="/dashboard" className="text-sm flex justify-center items-center text-white gap-2" >
                    <Send size={16} /> Disparos
                </a>
                <a href="/reports" className="text-sm flex justify-center items-center gap-2 text-white" >
                    <Flag size={16} /> Relatórios
                </a>
                <a href="/" onClick={() => logout()} className="text-sm flex justify-center items-center gap-2 text-white" >
                    <LogOut size={16} /> Sair
                </a>
            </div>
        </div>
    )
}