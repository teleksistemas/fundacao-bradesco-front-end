import axios from "axios";


interface ResultApiACess {
    success: boolean
    data: DadosUser | any | null
    menssage: string
    token_access: string
}

interface DadosUser {
    Nome: string,
    Escola: string,
    Juncao: string,
    Perfil: string
}

export async function AuthAcess(token_fb: string) {
    try {
        const apiUrl = import.meta.env.VITE_API_URL || "https://area-teste-group-atende-be.nijpgo.easypanel.host";
        const token = import.meta.env.VITE_TOKEN || "KgretqCgGW1YSlQzV9rGb3byMfR25ArWJ93LbzPvbdz22uFdtifd9RYXHkqiE";
        console.log(token)
        console.log(apiUrl)

        const { data } = await axios.post(
            `${apiUrl}/api/v1/login`,
            {},
            {
                headers: {
                    Authorization: token,
                    token_fb: token_fb
                }
            }
        );

        console.log(data)

        const dados: ResultApiACess = data
        if (data.data.Nome) {
            localStorage.setItem("nome_user", data.data.Nome);
            localStorage.setItem("escola_user", data.data.Escola);
        }

        if (dados.token_access) {
            localStorage.setItem("token_access", dados.token_access);
            return true;
        };
        return false;
    } catch (e: any) {
        return false;
    }
}