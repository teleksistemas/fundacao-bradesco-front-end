import axios from "axios"

export async function GetCampaings() {
    try {
        const apiUrl = import.meta.env.VITE_API_URL || "https://area-teste-group-atende-be.nijpgo.easypanel.host";
        console.log(apiUrl)
        const token = import.meta.env.VITE_TOKEN || "KgretqCgGW1YSlQzV9rGb3byMfR25ArWJ93LbzPvbdz22uFdtifd9RYXHkqiE";

        const token_acess = localStorage.getItem("token_access");
        const { data } = await axios.get(
            `${apiUrl}/api/v1/campaings`,
            {
                headers: {
                    Authorization: token,
                    token_acess
                }
            }
        );

        return data.data;
    } catch (e: any) {
        return []
    }
}