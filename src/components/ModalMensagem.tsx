
import type { TemplateWhatsapp } from "@/service/interfaces/ResultGetTempletes.interface"
import imagem from "@/assets/fundo-zap.jpg"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Props {
    template: TemplateWhatsapp | null
    setListaDeVariaveis: (variaveis: string[]) => void;
    setVariblesCompleted: (completed: boolean) => void;
}

interface VariableField {
    placeholder: string // {{1}}, {{nome_consultor}}, etc
    value: string
    useCustomInput: boolean
}

export default function ModalMensagem(props: Props) {
    const [variables, setVariables] = useState<VariableField[]>([])

    useEffect(() => {
        const variaveisMapeadas = variables.map((v) => v.value);
        const existeAlgumaVazia = variaveisMapeadas.filter((v) => v == "");
        if (existeAlgumaVazia.length == 0 && props.template) {
            props.setListaDeVariaveis(variaveisMapeadas);
            props.setVariblesCompleted(true);
        }
    }, [variables])

    useEffect(() => {
        if (props.template) {
            const bodyComponent = props.template.components.find((comp) => comp.type === "BODY")
            if (bodyComponent?.text) {
                const regex = /\{\{([^}]+)\}\}/g
                const matches = [...bodyComponent.text.matchAll(regex)]

                const extractedVars = matches.map((match) => ({
                    placeholder: match[1],
                    value: "",
                    useCustomInput: false,
                }))

                setVariables(extractedVars)
            }
        }
    }, [props.template])

    const formatMessage = () => {
        const bodyComponent = props.template?.components.find((comp) => comp.type === "BODY")
        if (!bodyComponent?.text) return ""

        let formattedText = bodyComponent.text

        const valoresNormais: Record<string, string> = {
            "name": "Nome do responsavel",
            "student.rm": "RM do aluno",
            "student.name": "Nome do aluno",
            "student.email": "E-mail do aluno",
            "student.description": "Turma do aluno"
        }

        variables.forEach((variable) => {

            const placeholder = `{{${variable.placeholder}}}`
            const displayValue = `${valoresNormais[`${variable.value}`] ?? variable.value}` || `[${variable.placeholder}]`
         
            formattedText = formattedText.replace(placeholder, `**${displayValue}**`)
        })

        return formattedText
    }

    const renderFormattedText = () => {
        const text = formatMessage()

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


    const updateVariable = (index: number, value: string) => {
        setVariables((prev) => prev.map((v, i) => (i === index ? { ...v, value } : v)))
    }

    const toggleCustomInput = (index: number) => {
        setVariables((prev) =>
            prev.map((v, i) => (i === index ? { ...v, useCustomInput: !v.useCustomInput, value: "" } : v)),
        )
    }



    return (
        <div className="w-full! h-alto">
            {/* Preview da mensagem */}
            <div
                className="w-full max-w-100 h-auto p-4! bg-center bg-cover rounded-lg"
                style={{ backgroundImage: `url("${imagem}")` }}
            >
                <div className="w-full p-5! bg-white/90 rounded-lg shadow-md whitespace-pre-wrap text-sm">{renderFormattedText()}</div>
            </div>

            {/* Campos de variáveis */}
            {variables.length > 0 && (
                <div className="space-y-3 p-4! bg-gray-50 rounded-lg mt-3! shadow-md">
                    <h3 className="font-semibold text-gray-700">Variáveis da Mensagem</h3>

                    {variables.map((variable, index) => (
                        <div key={index} className="space-y-2 h-auto">
                            <div className="flex items-center justify-between my-2!">
                                <Label className="text-sm font-medium text-gray-700">{variable.placeholder}</Label>
                                <Label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <Checkbox checked={variable.useCustomInput} onCheckedChange={() => toggleCustomInput(index)} />
                                    Campo livre
                                </Label>
                            </div>

                            {variable.useCustomInput ? (
                                <Input
                                    type="text"
                                    className="p-2!"
                                    value={variable.value}
                                    onChange={(e: { target: { value: string } }) => updateVariable(index, e.target.value)}
                                    placeholder={`Digite ${variable.placeholder}`}
                                />
                            ) : (
                                <Select value={variable.value} onValueChange={(value) => updateVariable(index, value)}>
                                    <SelectTrigger className="w-full p-2!">
                                        <SelectValue placeholder="Selecione uma opção" />
                                    </SelectTrigger>
                                    <SelectContent className="p-2!">
                                        <SelectItem className="p-1!" key={"name"} value={"name"}>
                                            Nome do responsavel
                                        </SelectItem>
                                        <SelectItem className="p-1!" key={"student.rm"} value={"student.rm"}>
                                            RM do aluno
                                        </SelectItem>
                                        <SelectItem className="p-1!" key={"student.name"} value={"student.name"}>
                                            Nome do aluno
                                        </SelectItem>
                                        <SelectItem className="p-1!" key={"student.email"} value={"student.email"}>
                                            E-mail do aluno
                                        </SelectItem>
                                        <SelectItem className="p-1!" key={"student.description"} value={"student.description"}>
                                            Turma e serie do aluno
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="w-full mt-4! text-center! bg-gray-50 shadow-md rounded-lg flex justify-center">
                <p className="text-xs w-full p-2!">
                    Idioma: {props.template?.language ?? "N/A"}
                </p>

            </div>
        </div>
    )
}
