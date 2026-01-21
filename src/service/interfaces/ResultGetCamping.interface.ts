export interface ResultGetCampaing {
    success: boolean,
    message: string,
    data: Campaings[]
}

export interface Campaings {
    id_campanha: string,
    id_juncao: string,
    id_escola: number,
    nome_campanha: string,
    modelo_mensagem: string,
    data_envio: Date,
    total_audiencia: number,
    qtd_recebidas: number,
    qtd_lidas: number,
    qtd_falhas: number,
    finalizada: false,
    ultima_verificacao: Date,
    criado_em: Date,
    atualizado_em: Date,
    name_user?: string,
    template_modelo?: string
}