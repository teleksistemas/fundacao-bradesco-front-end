import axios from "axios"

export async function GetAudiemce(idCampanha: string) {
    try {
        const token_acess = localStorage.getItem("token_access");
        const { data } = await axios.get(
            `https://area-teste-group-atende-be.nijpgo.easypanel.host/api/v1/audience?idCamapnha=${idCampanha}`,
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