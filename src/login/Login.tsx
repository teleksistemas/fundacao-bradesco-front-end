import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import LogoMarca from "@/assets/Fundacao.webp";
import { AuthAcess } from "@/service/AuthAcess";
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toastShown = useRef(false);

  const validarAcesso = async (tk: string) => {
    const resultAcess: boolean = await AuthAcess(tk);
    if (resultAcess) {
      navigate("/dashboard");
      return;
    }

    toast.error("Não foi possivel fazer o login no momento!")
  }

  useEffect(() => {
    if (toastShown.current) return;

    const tk = searchParams.get("tk");

    if (!tk) {
      toastShown.current = true;
      toast.error("Necessário ser funcionário da Fundação Bradesco para ter acesso!");
    } else {
      validarAcesso(tk);
    }
  }, [searchParams]);

  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center">
      <div className="w-auto h-auto p-5! flex items-center justify-center flex-col shadow-md rounded-2xl bg-card">
        <img src={LogoMarca} alt="Fundação Bradesco" className="" />
        <h1>Seja bem vindo ao sistema de disparo de mensagem da Fundação Bradesco</h1>
      </div>
    </div>
  );
}

