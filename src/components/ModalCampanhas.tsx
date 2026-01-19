"use client"

import { GetCampaings } from "@/service/GetCampaings"
import { GetAudiemce } from "@/service/GetAudiemce"
import type { Audience } from "@/service/interfaces/ResultGetAudience.interface"
import type { Campaings } from "@/service/interfaces/ResultGetCamping.interface"
import { useEffect, useState, useMemo } from "react"
import toast from "react-hot-toast"
import { LoaderCircle, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { GetTempletes } from "@/service/GetTempletes";
import type { ResultGetTempletes, TemplateWhatsapp } from "@/service/interfaces/ResultGetTempletes.interface"
import imagem from "@/assets/fundo-zap.jpg"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function ModalCampanhas() {
    const [campanhas, setCampanhas] = useState<Campaings[]>([])
    const [audiences, setAudiences] = useState<Audience[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingAudience, setLoadingAudience] = useState(true)
    const [filterName, setFilterName] = useState("")
    const [filterDateStart, setFilterDateStart] = useState("")
    const [filterDateEnd, setFilterDateEnd] = useState("")
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(5)
    const [filterModelo, setFilterModelo] = useState("")
    const [templetes, setTempletes] = useState<TemplateWhatsapp[]>([]);

    useEffect(() => {
        ChamarConexaoGetTempletes();
    }, []);

    const ChamarConexaoGetTempletes = async () => {
        try {
            const result: ResultGetTempletes = await GetTempletes();
            setTempletes(result.data);
        } catch (e: any) {
            toast.error("Não foi possivel carregar os templates");
        }
    };

    useEffect(() => {
        getCampanhas()
    }, [])

    useEffect(() => {
        setPage(1)
    }, [filterName, filterDateStart, filterDateEnd, filterModelo, perPage])


    const getCampanhas = async () => {
        try {
            const result: Campaings[] = await GetCampaings()
            setCampanhas(result)
        } catch (e) {
            toast.error("Houve um erro durante a consulta de campanhas")
        } finally {
            setLoading(false)
        }
    }

    const modelosUnicos = useMemo(() => {
        return Array.from(
            new Set(campanhas.map(c => c.modelo_mensagem).filter(Boolean))
        )
    }, [campanhas])


    const campanhasFiltradas = useMemo(() => {
        return campanhas.filter((campanha) => {
            const matchName =
                filterName === "" ||
                campanha.nome_campanha.toLowerCase().includes(filterName.toLowerCase())

            const dataEnvio = new Date(campanha.data_envio)
            const matchDateStart =
                filterDateStart === "" || dataEnvio >= new Date(filterDateStart)
            const matchDateEnd =
                filterDateEnd === "" || dataEnvio <= new Date(filterDateEnd + "T23:59:59")

            const matchModelo =
                filterModelo === "" || campanha.modelo_mensagem === filterModelo

            return matchName && matchDateStart && matchDateEnd && matchModelo
        })
    }, [campanhas, filterName, filterDateStart, filterDateEnd, filterModelo])



    const totalPages = Math.ceil(campanhasFiltradas.length / perPage)

    const campanhasPaginadas = useMemo(() => {
        const start = (page - 1) * perPage
        const end = start + perPage
        return campanhasFiltradas.slice(start, end)
    }, [campanhasFiltradas, page, perPage])

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="flex flex-col items-center gap-2">
                    <LoaderCircle className="animate-spin w-8 h-8 text-primary" />
                    <span className="text-sm text-muted-foreground">Carregando campanhas...</span>
                </div>
            </div>
        )
    }

    const handleStartDateChange = (value: string) => {
        // Se não tem data final ainda, aceita direto
        if (!filterDateEnd) {
            setFilterDateStart(value);
            return;
        }

        // Regra: inicial NÃO pode ser maior que final
        if (value <= filterDateEnd) {
            setFilterDateStart(value);
        } else {
            toast.error("A data inicial não pode ser maior que a data final.");
        }
    };

    const handleEndDateChange = (value: string) => {
        // Se não tem data inicial ainda, aceita direto
        if (!filterDateStart) {
            setFilterDateEnd(value);
            return;
        }

        // Regra: final NÃO pode ser menor que inicial
        if (value >= filterDateStart) {
            setFilterDateEnd(value);
        } else {
            toast.error("A data final não pode ser menor que a data inicial.");
        }
    };


    const filterBodyMessage = (name: string) => {
        const resultFilter = templetes.find((t) => t.name == name);
        let messageText = "Não foi possivel econtrar o modelo de mensagem"
        if (resultFilter?.components && resultFilter.components.length > 0) {
            const bodyMessage = resultFilter.components[0];

            if (bodyMessage.type == "BODY") {
                messageText = bodyMessage.text
            }
        }

        const textFormated = renderFormattedText(messageText)
        return textFormated;
    }

    const renderFormattedText = (text: string) => {
        return text.split("\\n").map((line, index) => {
            // Substitui **texto** por <strong>texto</strong>
            const parts = line.split(/(\*\*.*?\*\*)/g)

            return (
                <span key={index}>
                    {parts.map((part, i) => {
                        if (part.startsWith("**") && part.endsWith("**")) {
                            return (
                                <strong key={i}>
                                    {part.replace(/\*\*/g, "")}
                                </strong>
                            )
                        }
                        return part
                    })}

                    {index < text.split("\\n").length - 1 && <br />}
                </span>
            )
        })
    }


    return (
        <div className="w-full  space-y-4!">
            <div className="bg-card rounded-lg border border-border p-4! shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium text-foreground">Filtros</h3>
                </div>
                <div className=" grid grid-cols-1! md:grid-cols-4! gap-3!">
                    <div className="space-y-1.5!">
                        <label htmlFor="filter-name" className="text-xs font-medium text-muted-foreground">
                            Nome da Campanha
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="filter-name"
                                type="text"
                                placeholder="Buscar por nome..."
                                value={filterName}
                                onChange={(e) => setFilterName(e.target.value)}
                                className="pl-9!"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="filter-date-start" className="text-xs font-medium text-muted-foreground">
                            Data Inicial
                        </label>
                        <Input
                            id="filter-date-start"
                            type="date"
                            value={filterDateStart}
                            onChange={(e) => handleStartDateChange(e.target.value)}
                            className="p-2!"
                        />

                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="filter-date-end" className="text-xs font-medium text-muted-foreground">
                            Data Final
                        </label>
                        <Input
                            id="filter-date-end"
                            type="date"
                            value={filterDateEnd}
                            onChange={(e) => handleEndDateChange(e.target.value)}
                            className="p-2!"
                        />

                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="filter-date-end" className="text-xs font-medium text-muted-foreground">
                            Modelos de mensagens (HSM)
                        </label>
                        <Select value={filterModelo} onValueChange={setFilterModelo}>
                            <SelectTrigger className="w-full p-2!">
                                <SelectValue placeholder="Modelo HSM" />
                            </SelectTrigger>

                            <SelectContent className="p-2!">
                                <SelectGroup className="gap-4!">
                                    <SelectLabel>Modelos</SelectLabel>

                                    {modelosUnicos.map((modelo) => (
                                        <SelectItem key={modelo} value={modelo}>
                                            {modelo}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {(filterName || filterDateStart || filterDateEnd || filterModelo) && (
                    <div className="mt-3! flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                            {campanhasPaginadas.length}{" "}
                            {campanhasPaginadas.length === 1 ? "campanha encontrada" : "campanhas encontradas"}
                        </p>
                        <button
                            onClick={() => {
                                setFilterName("")
                                setFilterDateStart("")
                                setFilterDateEnd("")
                                setFilterModelo("")
                            }}
                            className="text-xs text-primary hover:underline"
                        >
                            Limpar filtros
                        </button>
                    </div>
                )}
            </div>

            {campanhasPaginadas.length === 0 ? (
                <div className="bg-card rounded-lg border border-border p-8! text-center shadow-lg">
                    <p className="text-sm text-muted-foreground">
                        {campanhas.length === 0 ? "Nenhuma campanha encontrada" : "Nenhuma campanha corresponde aos filtros"}
                    </p>
                </div>
            ) : (

                <div className="">
                    <div className="mb-5! w-full bg-white p-2! shadow-lg rounded-md flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                            Página {page} de {totalPages || 1} • {campanhasFiltradas.length} campanhas no total
                        </span>
                        <div>
                            <div className="flex items-center gap-2!">
                                <button onClick={() => setPage(1)} disabled={page === 1} className="px-3! py-1! border rounded text-xs disabled:opacity-40">
                                    «
                                </button>
                                <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="px-3! py-1! border rounded text-xs disabled:opacity-40">
                                    ‹
                                </button>
                                <span className="text-xs px-2!">{page}</span>
                                <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages} className="px-3! py-1! border rounded text-xs disabled:opacity-40">
                                    ›
                                </button>
                                <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-3! py-1! border rounded text-xs disabled:opacity-40">
                                    »
                                </button>

                                <select
                                    value={perPage}
                                    onChange={(e) => setPerPage(Number(e.target.value))}
                                    className="ml-2! border rounded px-2! py-1! text-xs"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                        </div>

                    </div>

                    {/* <div className="bg-card rounded-t-lg border border-border border-b-0 px-4! py-3! hidden md:block">
                        <div className="grid grid-cols-6 gap-2! text-xs font-medium text-muted-foreground">
                            <div className="col-span-2">Nome da Campanha</div>
                            <div className="text-center">Data de Envio</div>
                            <div className="text-center">Audiência</div>
                            <div className="text-center">Entregues</div>
                            <div className="text-center">Lidas</div>
                        </div>
                    </div> */}

                    <Accordion type="single" collapsible className="w-full border border-border rounded-lg py-2! px-2! bg-white">
                        {campanhasPaginadas.map((c, index) => (
                            <AccordionItem
                                key={c.id_campanha ?? index}
                                value={`campanha-${index}`}
                                className="bg-card border shadow-lg border-border mb-2! rounded-lg overflow-hidden last:mb-0!"
                            >
                                <AccordionTrigger
                                    onClick={async () => {
                                        setLoadingAudience(true)
                                        const result: Audience[] = await GetAudiemce(c.id_campanha)
                                        setAudiences(result)
                                        setLoadingAudience(false)
                                    }}
                                    className="px-4! py-3! hover:bg-accent transition-colors"
                                >
                                    <div className="w-full h-full gap-1! flex justify-start items-start">
                                        <div className="w-auto h-full p-2! flex flex-col justify-start items-center gap-2">
                                            <div className="w-full">
                                                <Popover>
                                                    <PopoverTrigger
                                                        onClick={(e) => e.stopPropagation()}
                                                        onPointerDown={(e) => e.stopPropagation()}
                                                        onKeyDown={(e) => e.stopPropagation()}
                                                        className="flex gap-1 items-center justify-center cursor-pointer"
                                                    >Modelo de mensagem (HSM): <span className="font-bold ml-1!">{c.modelo_mensagem}</span></PopoverTrigger>
                                                    <PopoverContent>
                                                        <div
                                                            className="w-full h-auto p-2! bg-center bg-cover rounded-lg"
                                                            style={{ backgroundImage: `url("${imagem}")` }}
                                                        >
                                                            <div className="w-full p-3! bg-white/90 rounded-lg shadow-md text-sm">{filterBodyMessage(c.modelo_mensagem)}</div>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                                <h1>Usuario que fez disparo: <span className="font-bold">{c.name_user}</span></h1>
                                                <h1>Data e hora de envio: <span className="font-bold">{new Date(c.data_envio).toLocaleString("pt-BR", {
                                                    dateStyle: "short",
                                                    timeStyle: "short"
                                                })}</span></h1>
                                            </div>
                                            <div className="flex justify-start items-start gap-1 w-full">
                                                {c.total_audiencia ? <span className="text-sm! font-normal text-gray-800 bg-gray-200 px-2! py-1! rounded-lg">{c.total_audiencia} Total de contatos</span> : <span></span>}
                                                {c.qtd_recebidas ? <span className="text-sm ml-1! font-normal text-blue-800 bg-blue-200 px-2! py-1! rounded-lg">{c.qtd_recebidas} que recebeu a mensagem</span> : <span></span>}
                                                {c.qtd_lidas ? <span className="text-sm ml-1! font-normal text-green-800 bg-green-200 px-2! py-1! rounded-lg">{c.qtd_lidas} que abriu a mensagem</span> : <span></span>}
                                                {c.qtd_falhas ? <span className="text-sm ml-1! font-normal text-red-800 bg-red-200 px-2! py-1! rounded-lg">{c.qtd_falhas} teve falha ao disparar</span> : <span></span>}
                                            </div>
                                        </div>
                                    </div>
                                </AccordionTrigger>

                                <AccordionContent className="px-4! pb-4! bg-muted/30 w-full">
                                    {loadingAudience ? (
                                        <div className="flex justify-center items-center py-8!">
                                            <div className="flex flex-col items-center gap-2!">
                                                <LoaderCircle className="animate-spin w-6 h-6 text-primary" />
                                                <span className="text-xs text-muted-foreground">Carregando audiências...</span>
                                            </div>
                                        </div>
                                    ) : audiences.length === 0 ? (
                                        <p className="text-sm text-muted-foreground text-center py-4!">Nenhuma audiência encontrada</p>
                                    ) : (
                                        <div className="space-y-2 mt-2! w-full">

                                            <Table className="w-full bg-accent p-2! rounded-lg! border">
                                                <TableHeader className="flex pt-2!">
                                                    <TableRow className="w-full! flex justify-center! items-center! ">
                                                        <TableHead className="w-full! text-center!">Status</TableHead>
                                                        <TableHead className="w-full! text-center!">Telefone</TableHead>
                                                        <TableHead className="w-full! text-center!">Responsável</TableHead>
                                                        <TableHead className="w-full! text-center!">Aluno</TableHead>
                                                        <TableHead className="w-full! text-center!">Turma</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody className="w-full">
                                                    {audiences.map((a, idx) => (
                                                        <TableRow className="flex py-2!" key={idx}>
                                                            <TableCell className="w-full text-center!">
                                                                <span
                                                                    className={`inline-flex items-center px-2! text-center! py-0.5! rounded-full text-sm font-base ${a.status === "RECEIVED"
                                                                        ? "bg-blue-100 text-blue-800"
                                                                        : a.status === "READ"
                                                                            ? "bg-green-100 text-green-800"
                                                                            : a.status === "FAILED"
                                                                                ? "bg-red-100 text-red-800"
                                                                                : a.status == "PENDENTE" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"
                                                                        }`}
                                                                >
                                                                    {a.status == "FAILED" ? (
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <span>{a.status} - ${a.codigo_motivo}</span>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent className="p-2!">
                                                                                <p>{a.descricao_motivo}</p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    ) : a.status}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="w-full! text-center!">{a.msisdn}</TableCell>
                                                            <TableCell className="w-full! text-center!">{a.nome_responsavel}</TableCell>
                                                            <TableCell className="w-full! text-center!">{a.nome_aluno}</TableCell>
                                                            <TableCell className="w-full! text-center!">{a.nome_turma}</TableCell>
                                                        </TableRow>
                                                    ))}

                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>


                </div>
            )}
        </div>
    )
}
