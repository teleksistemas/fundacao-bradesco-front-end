import type { TemplateWhatsapp } from "@/service/interfaces/ResultGetTempletes.interface";
import type { Target } from "@/service/interfaces/Targets.interface";
import toast from "react-hot-toast";
import axios from "axios";

export async function ModelarEnvioDeDisparo(listaDeTargets: Target[], templete: TemplateWhatsapp | null, listaDeVariaveis: string[], modeloMensagem: string) {
    try {
        if (!templete) {
            toast.error("Necessario ter um templete selecionado")
            return;
        }

        if (listaDeTargets.length == 0) {
            toast.error("Necessario ter targets selecionado")
            return;
        }
        const token_acess = localStorage.getItem("token_access");
        const nome_user = localStorage.getItem("nome_user");

        const bodyToSendCampaing = {
            "contatosToDisparo": listaDeTargets,
            "components": {
                "qtdDeVariaveis": listaDeVariaveis.length,
                "camposDeUtilização": listaDeVariaveis
            },
            "nameTamplate": templete.name,
            "token_acess": token_acess,
            "usuario_name": nome_user ?? "Usuario não indentificado",
            "templateModelo": modeloMensagem
        }



        const apiUrl = import.meta.env.VITE_API_URL;
        const token = import.meta.env.VITE_TOKEN;
        const { data } = await axios.post(`${apiUrl}/api/v1/campaign`,
            bodyToSendCampaing,
            {
                headers: {
                    Authorization: token,
                    token_acess: token_acess
                }
            }
        )
        toast.success(data.message);

    } catch (e) {
        toast.error("Tivemos um erro interno no nosso sistema")
    }
}