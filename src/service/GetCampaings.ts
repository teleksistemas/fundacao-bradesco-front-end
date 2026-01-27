import axios from "axios"

export async function GetCampaings() {
    try {
        const token_acess = localStorage.getItem("token_access");
        const rota = import.meta.env.VITE_API_URL ?? "https://area-teste-group-atende-be.nijpgo.easypanel.host"
        console.log(`${rota}/api/v1/campaings`)
        const { data } = await axios.get(
            `${rota}/api/v1/campaings`,
            {
                headers: {
                    Authorization: "KgretqCgGW1YSlQzV9rGb3byMfR25ArWJ93LbzPvbdz22uFdtifd9RYXHkqiE",
                    token_acess
                }
            }
        );

        return data.data;
    } catch (e: any) {
        return []
    }
}