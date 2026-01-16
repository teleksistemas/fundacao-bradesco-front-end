import axios from "axios"

export async function GetTempletes() {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const token = import.meta.env.VITE_TOKEN;

        const token_acess = localStorage.getItem("token_access");
        const { data } = await axios.get(
            `${apiUrl}/api/v1/templetes`,
            {
                headers: {
                    Authorization: token,
                    token_acess: token_acess
                }
            }
        );

        return data;
    } catch (e: any) {
        return {
            success: false,
            message: "Erro interno no serviço de coletar os templetes",
            data: []
        }
    }
}