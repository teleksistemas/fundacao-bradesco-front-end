import axios from "axios"

export async function GetAudiemce(idCampanha: string) {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const token = import.meta.env.VITE_TOKEN;

        const token_acess = localStorage.getItem("token_access");
        const { data } = await axios.get(
            `${apiUrl}/api/v1/audience?idCamapnha=${idCampanha}`,
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