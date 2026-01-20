import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import { GetSegments } from "@/service/GetSegments"
import type { ResultGetSegments, Segments, School } from "@/service/interfaces/ResultGetSegments.interface"
import toast from "react-hot-toast"

interface Props {
    setClasse: (classe: School) => void;
}

export default function SelectClasseAndSegmentsNewTarget({ setClasse }: Props) {
    const [segments, setSegments] = useState<Segments[]>([])
    const [classes, setClasses] = useState<School[]>([]);
    const [segmentoSelecionado, setSegmentoSelecionado] = useState<string>("")

    function handleSelectCodeSegment(value: string) {
        if (segments.length > 0) {
            const templateSelecionado = segments.filter(t => t.segmentCode === value);
            setSegmentoSelecionado(value)
            templateSelecionado.map((c) => {
                setClasses(c.classes)
            })
        }
    }

    function handleSelectClasse(value: string) {
        const result = classes.find((c) => c.description == value)
        if (result) {
            setClasse(result)
        }
    }

    useEffect(() => {
        ChamarGetSegments()
    }, [])

    useEffect(() => {
        if (segments.length > 0 && segments.length == 1) {
            handleSelectCodeSegment(segments[0].segmentCode)
        }
    }, [segments])

    async function ChamarGetSegments() {
        try {
            const result: ResultGetSegments = await GetSegments()
            const dados = Array.isArray(result.data) ? result.data : [result.data]
            setSegments(dados)
        } catch {
            toast.error("Não conseguimos puxar seus segmentos")
        }
    }

    return (
        <div className="flex flex-col gap-3">
            <Select value={segmentoSelecionado} onValueChange={handleSelectCodeSegment}>
                <SelectTrigger className="min-w-full max-w-full p-2! text-base!">
                    <SelectValue placeholder="Selecione um template" />
                </SelectTrigger>

                <SelectContent className="min-w-45 p-4!">
                    <SelectGroup>
                        <SelectLabel className="text-base! text-white bg-destructive p-1! text-center! rounded-2xl mb-2!">
                            Lista dos segmentos encontrado
                        </SelectLabel>

                        {segments.map(se => (
                            <SelectItem key={se.segmentCode} value={se.segmentCode}>
                                {se.segmentCode}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Select onValueChange={handleSelectClasse}>
                <SelectTrigger className="min-w-full max-w-full p-2! text-base!">
                    <SelectValue placeholder="Selecione um template" />
                </SelectTrigger>

                <SelectContent className="min-w-45 p-4!">
                    <SelectGroup>
                        <SelectLabel className="text-base! text-white bg-destructive p-1! text-center! rounded-2xl mb-2!">
                            Lista das classses encontradas
                        </SelectLabel>

                        {classes.map(se => (
                            <SelectItem key={se.description} value={se.description}>
                                {se.description}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}