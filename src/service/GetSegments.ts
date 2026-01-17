import axios from "axios"

export async function GetSegments() {
    try {
        const token_acess = localStorage.getItem("token_access");
        const { data } = await axios.get(
            `https://area-teste-group-atende-be.nijpgo.easypanel.host/api/v1/segments`,
            {
                headers: {
                    Authorization: "KgretqCgGW1YSlQzV9rGb3byMfR25ArWJ93LbzPvbdz22uFdtifd9RYXHkqiE",
                    token_acess
                }
            }
        );

        return data;
    } catch (e: any) {
        return {
            success: false,
            message: "Erro interno no serviço de coletar os seguimentos da escola",
            data: []
        }
    }
}