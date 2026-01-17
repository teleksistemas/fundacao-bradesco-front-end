import axios from "axios"

export async function GetTempletes() {
    try {
        const token_acess = localStorage.getItem("token_access");
        const { data } = await axios.get(
            `https://area-teste-group-atende-be.nijpgo.easypanel.host/api/v1/templetes`,
            {
                headers: {
                    Authorization: "KgretqCgGW1YSlQzV9rGb3byMfR25ArWJ93LbzPvbdz22uFdtifd9RYXHkqiE",
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