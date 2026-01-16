/*===================
Components e services
===================*/
import SelectTemplete from "@/components/SelectTempletes";
import SelectSegmantsAndClasses from "@/components/SelectSegmantsAndClasses";
import Navbar from "@/components/Navbar";
import ModalMensagem from "@/components/ModalMensagem"
import ModalTargetsAdicionais from "@/components/ModalTargetsAdicionais"
import { Separator } from "@/components/ui/separator"

/*===================
Hooks e interfaces
===================*/
import { useState, useEffect } from "react";
import type { TemplateWhatsapp } from "@/service/interfaces/ResultGetTempletes.interface";
import type { Target } from "@/service/interfaces/Targets.interface";
import { Button } from "@/components/ui/button";
import { ModelarEnvioDeDisparo } from "@/service/ModelarEnvioDeDisparo";


export default function Dashboard() {
    const [template, setTemplate] = useState<TemplateWhatsapp | null>(null)
    const [targets, setTargets] = useState<Target[]>([]);
    const [targetsAdicionais, setTargetsAdicionais] = useState<Target[]>([])
    const [listaDeVariaveis, setListaDeVariaveis] = useState<string[]>([]);
    const [variblesCompleted, setVariblesCompleted] = useState<boolean>(false);
    const [buttonSendIsVisible, setButtonSendIsVisible] = useState<boolean>(false);

    useEffect(() => {
        if ([...targets, ...targetsAdicionais].length > 0 && variblesCompleted == true) {
            setButtonSendIsVisible(true);
        }
    }, [variblesCompleted, targets, targetsAdicionais]);

    return (
        <section className="w-full h-full-screen">

            <div className="w-full! h-auto! relative! flex justify-center! items-center">
                <Navbar />
            </div>

            <main className="w-full min-h-full! flex justify-between items-top mt-20! px-10! py-5! gap-4">
                <div className="w-auto h-auto p-4! gap-3 rounded-md bg-white! shadow-xl flex justify-start items-center text-center flex-col">
                    <h1 className="text-base text-destructive font-bold">Configuração de disparos</h1>
                    <span className="w-full text-center flex items-center justify-center text-sm">Quantidades de contatos selecionado para disparo {[...targets, ...targetsAdicionais].length}</span>
                    <Separator orientation="horizontal" />
                    <SelectTemplete setTemplateDefinido={(dadosTemplateSelecionado: TemplateWhatsapp) => setTemplate(dadosTemplateSelecionado)} />
                    <ModalMensagem setListaDeVariaveis={(lista: string[]) => (setListaDeVariaveis(lista))} setVariblesCompleted={(completed: boolean) => (setVariblesCompleted(completed))} template={template} />
                    <Separator orientation="horizontal" className="mt-2!" />
                    <div className="w-full h-full flex justify-center items-start">
                        <Button
                            disabled={!buttonSendIsVisible}
                            onClick={() => { ModelarEnvioDeDisparo([...targets, ...targetsAdicionais], template, listaDeVariaveis) }}
                            className="p-2! bg-destructive! hover:bg-destructive/70! cursor-pointer shadow-lg">
                            Disparar mensagens
                        </Button>
                    </div>
                </div>
                <div className="w-full min-h-full! rounded-md bg-white! p-4! shadow-xl">
                    <ModalTargetsAdicionais listaDeTragets={(a: Target[]) => setTargetsAdicionais(a)} targetsAdicionais={targetsAdicionais} />
                    <Separator className="mt-2!"  orientation="horizontal" />
                    <SelectSegmantsAndClasses listaDeTragets={(listaDeTragets: Target[]) => setTargets(listaDeTragets)} />
                </div>
            </main>

        </section>
    )
}