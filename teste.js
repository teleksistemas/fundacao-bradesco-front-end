
function run(bodyColetarDados) {
    try {
        bodyColetarDados = JSON.parse(bodyColetarDados)

        const listaAssuntos = bodyColetarDados.students || []

        const body = listaAssuntos.reduce((acc, aluno, index) => {

            const nomeFormatado = (aluno.name || "")
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                .join(" ")
                .slice(0, 24)

            acc[index + 1] = {
                ATIVO: "Y",
                CONTEUDO: nomeFormatado,
                IDASSUNTO: aluno.rm || index + 1,
                DESCRICAO: aluno.description || "",
                ACEITA: `${nomeFormatado},${index + 1}`
            }

            return acc
        }, {})

        return {
            header: "Selecione o aluno:",
            body
        }

    } catch (e) {
        return "false"
    }
}


const bobodyColetarDados = {
    "Erro": null,
    "assuntos": [
        {
            "AssuntoId": 3,
            "Assunto": "Campanha"
        },
        {
            "AssuntoId": 2,
            "Assunto": "Entregas"
        },
        {
            "AssuntoId": 1,
            "Assunto": "Pedidos"
        }
    ]
}