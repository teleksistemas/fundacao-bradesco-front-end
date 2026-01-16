import { GetTempletes } from "@/service/GetTempletes";
import type { ResultGetTempletes, TemplateWhatsapp } from "@/service/interfaces/ResultGetTempletes.interface"
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Props {
    setTemplateDefinido: (template: TemplateWhatsapp) => void;
}

export default function SelectTemplete({ setTemplateDefinido }: Props) {
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

  function handleSelect(value: string) {
    const templateSelecionado = templetes.find(t => t.id === value);
    if (templateSelecionado) {
      setTemplateDefinido(templateSelecionado);
    }
  }

  return (
    <Select onValueChange={handleSelect}>
      <SelectTrigger className="min-w-full max-w-full p-2! text-base!">
        <SelectValue placeholder="Selecione um template" />
      </SelectTrigger>

      <SelectContent className="min-w-45 p-4!">
        <SelectGroup>
          <SelectLabel className="text-base! text-white bg-destructive p-1! text-center! rounded-2xl mb-2!">
            Lista dos templates ativos
          </SelectLabel>

          {templetes.map(templete => (
            <SelectItem key={templete.id} value={templete.id}>
              {templete.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
