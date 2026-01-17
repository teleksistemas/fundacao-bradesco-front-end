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
        const rota = "https://area-teste-group-atende-be.nijpgo.easypanel.host/api/v1/login"
        console.log(rota)
        const { data } = await axios.post(
            rota,
            {},
            {
                headers: {
                    Authorization: "KgretqCgGW1YSlQzV9rGb3byMfR25ArWJ93LbzPvbdz22uFdtifd9RYXHkqiE",
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