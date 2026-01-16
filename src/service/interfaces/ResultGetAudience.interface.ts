export interface ResultGetAudinece {
    success: boolean,
    message: string,
    data: Audience[]
}

export interface Audience {
    "id_cache_audiencia": number,
    "id_campanha": string,
    "id_juncao": string,
    "identidade_destino": string,
    "msisdn": string,
    "status": string,
    "codigo_motivo": number,
    "descricao_motivo": string,
    "processada_em": string,
    "recebida_em": null,
    "lida_em": null,
    "final": false,
    "nome_aluno": string,
    "nome_responsavel": string,
    "nome_escola": string,
    "nome_turma": string,
    "criado_em": string,
    "atualizado_em": string
}