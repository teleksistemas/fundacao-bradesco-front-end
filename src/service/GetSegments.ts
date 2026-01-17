import axios from "axios"

export async function GetSegments() {
    try {
        const apiUrl = import.meta.env.VITE_API_URL || "https://area-teste-group-atende-be.nijpgo.easypanel.host";
        console.log(apiUrl)
        const token = import.meta.env.VITE_TOKEN || "KgretqCgGW1YSlQzV9rGb3byMfR25ArWJ93LbzPvbdz22uFdtifd9RYXHkqiE";

        const token_acess = localStorage.getItem("token_access");
        const { data } = await axios.get(
            `${apiUrl}/api/v1/segments`,
            {
                headers: {
                    Authorization: token,
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