import type { Target } from "@/service/interfaces/Targets.interface";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus, GraduationCap, PhoneIncoming, User, UsersRound, UserX } from "lucide-react";
import { z } from "zod";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { School } from "@/service/interfaces/ResultGetSegments.interface"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SelectClasseAndSegmentsNewTarget from "@/components/SelectClasseAndSegmentsNewTarget";

/* ===========================
   SCHEMAS ZOD
=========================== */

const responsavelSchema = z.object({
  name: z.string().min(3, "Nome é obrigatório"),
  mobileNumber: z
    .string()
    .transform((val) => val.replace(/\D/g, "")) // 👈 LIMPA TUDO QUE NÃO É NÚMERO
    .refine((val) => val.length >= 10 && val.length <= 11 || val.length === 13, {
      message: "Informe um celular válido com DDD + (10 ou 11 dígitos)",
    }),
  cpf: z
    .string()
    .transform((val) => val.replace(/\D/g, "")) // limpa máscara
    .refine((val) => isValidCPF(val), {
      message: "Informe um CPF válido",
    }),
});

function isValidCPF(cpf: string): boolean {
  // Remove tudo que não é número
  cpf = cpf.replace(/\D/g, "");

  // Deve ter 11 dígitos
  if (cpf.length !== 11) return false;

  // Elimina CPFs com todos os dígitos iguais (111.111.111-11, etc)
  if (/^(\d)\1+$/.test(cpf)) return false;

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number(cpf[i]) * (10 - i);
  }
  let firstDigit = (sum * 10) % 11;
  if (firstDigit === 10) firstDigit = 0;
  if (firstDigit !== Number(cpf[9])) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number(cpf[i]) * (11 - i);
  }
  let secondDigit = (sum * 10) % 11;
  if (secondDigit === 10) secondDigit = 0;
  if (secondDigit !== Number(cpf[10])) return false;

  return true;
}

const studentSchema = z.object({
  rm: z.string().min(3, "RM obrigatório"),
  name: z.string().min(3, "Nome do aluno obrigatório"),
  email: z.string().email("E-mail inválido"),
  serie: z.string().min(1, "Série obrigatória"),
  classCode: z.string().min(1, "Código da classe obrigatório"),
  description: z.string().min(1, "Descrição obrigatória"),
});

/* ===========================
   COMPONENTE
=========================== */

interface Props {
  listaDeTragets: (template: Target[]) => void;
  targetsAdicionais: Target[];
}

export default function ModalTargetsAdicionais({
  listaDeTragets,
  targetsAdicionais,
}: Props) {
  const [targetsAdicionaisModal, setTargetsAdicionaisModal] =
    useState<Target[]>(targetsAdicionais);

  const [stepModal, setStepModal] = useState<number>(1);
  const [erros, setErros] = useState<string[]>([]);

  const [responsavel, setResponsavel] = useState({
    name: "",
    mobileNumber: "",
    cpf: "",
  });

  const [student, setStudent] = useState({
    rm: "",
    name: "",
    email: "",
    serie: "",
    classCode: "",
    description: "",
  });

  /* ===========================
     VALIDAÇÃO STEP 1
  =========================== */

  function validarStep1() {
    const result = responsavelSchema.safeParse(responsavel);

    if (!result.success) {
      const mensagens = result.error.issues.map((e) => e.message);
      setErros(mensagens);
      return false;
    }

    setErros([]);
    setStepModal(2);
    return true;
  }

  /* ===========================
     ADICIONAR TARGET
  =========================== */

  function adicionarTarget() {
    const result = studentSchema.safeParse(student);

    if (!result.success) {
      const mensagens = result.error.issues.map((e) => e.message);
      setErros(mensagens);
      return;
    }

    const novoTarget: Target = {
      name: responsavel.name,
      mobileNumber: (responsavel.mobileNumber.length <= 11 && responsavel.mobileNumber.length >= 10) ? `55${responsavel.mobileNumber}` : responsavel.mobileNumber,
      cpf: responsavel.cpf,
      student: {
        rm: student.rm,
        name: student.name,
        email: student.email,
        serie: student.serie,
        classCode: student.classCode,
        description: student.description,
      },
    };

    const novaLista = [...targetsAdicionaisModal, novoTarget];

    setTargetsAdicionaisModal(novaLista);
    listaDeTragets(novaLista);

    // Limpar formulário
    setResponsavel({ name: "", mobileNumber: "", cpf: "" });
    setStudent({
      rm: "",
      name: "",
      email: "",
      serie: "",
      classCode: "",
      description: "",
    });

    setStepModal(1);
    setErros([]);
  }

  /* ===========================
     REMOVER TARGET
  =========================== */

  function removerTarget(cpf: string) {
    const novaLista = targetsAdicionaisModal.filter(
      (t) => t.cpf !== cpf
    );

    setTargetsAdicionaisModal(novaLista);
    listaDeTragets(novaLista);
  }

  function setClasseNewtarget(dados: School) {
    setStudent({ ...student, serie: dados.serie, classCode: dados.classCode, description: dados.description })
  }

  return (
    <div className="space-y-4! p-4! w-full">

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="destructive" className="p-2! shadow-lg">
            <CirclePlus /> Contato provisório
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-105 p-4!">
          <h1 className="font-bold mb-2!">
            {stepModal === 1
              ? "Novo contato adicional - Responsável"
              : "Dados do aluno"}
          </h1>

          <p className="text-sm text-muted-foreground mb-2">
            Para adicionar contato à sua lista de disparo, preencha os dados abaixo.
          </p>

          {erros.length > 0 && (
            <div className="bg-red-100 text-red-700 p-2! rounded-md mb-2!">
              {erros.map((e, i) => (
                <p key={i}>• {e}</p>
              ))}
            </div>
          )}

          {stepModal === 1 ? (
            <div className="space-y-3">
              <div className="mt-3!">
                <Label className="mb-1!">Nome do responsável</Label>
                <Input
                  className="p-2!"
                  value={responsavel.name}
                  onChange={(e) =>
                    setResponsavel({ ...responsavel, name: e.target.value })
                  }
                />
              </div>

              <div className="mt-3!">
                <Label className="mb-1!">Telefone do responsável</Label>
                <Input
                  className="p-2!"
                  value={responsavel.mobileNumber}
                  onChange={(e) =>
                    setResponsavel({
                      ...responsavel,
                      mobileNumber: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mt-3!">
                <Label className="mb-1!">CPF do responsável</Label>
                <Input
                  className="p-2!"
                  value={responsavel.cpf}
                  onChange={(e) =>
                    setResponsavel({ ...responsavel, cpf: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-2 mt-3">
                <Button className="p-2! mt-2!" variant="destructive" onClick={validarStep1}>
                  Próximo
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="mt-3!">
                <Label className="mb-1!">RM do aluno</Label>
                <Input
                  className="p-2!"
                  value={student.rm}
                  onChange={(e) =>
                    setStudent({ ...student, rm: e.target.value })
                  }
                />
              </div>

              <div className="mt-3!">
                <Label className="mb-1!">Nome do aluno</Label>
                <Input
                  className="p-2!"
                  value={student.name}
                  onChange={(e) =>
                    setStudent({ ...student, name: e.target.value })
                  }
                />
              </div>

              <div className="mt-3!">
                <Label className="mb-1!">E-mail do aluno</Label>
                <Input
                  className="p-2!"
                  value={student.email}
                  onChange={(e) =>
                    setStudent({ ...student, email: e.target.value })
                  }
                />
              </div>

              <div className="mt-3!">
                <Label className="mb-1!">Série do aluno</Label>
                <SelectClasseAndSegmentsNewTarget setClasse={setClasseNewtarget} />
                {/* <Input
                  className="p-2!"
                  value={student.serie}
                  onChange={(e) =>
                    setStudent({ ...student, serie: e.target.value })
                  }
                /> */}
              </div>

              {/* <div className="mt-3!">
                <Label className="mb-1!">Código da classe</Label>
                <Input
                  className="p-2!"
                  value={student.classCode}
                  onChange={(e) =>
                    setStudent({
                      ...student,
                      classCode: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mt-3!">
                <Label className="mb-1!">Descrição da série</Label>
                <Input
                  className="p-2!"
                  value={student.description}
                  onChange={(e) =>
                    setStudent({
                      ...student,
                      description: e.target.value,
                    })
                  }
                />
              </div> */}

              <div className="flex gap-2 mt-3!">
                <Button variant="destructive" className="p-2!" onClick={adicionarTarget}>
                  Adicionar
                </Button>

                <Button className="p-2!" onClick={() => setStepModal(1)}>
                  Voltar
                </Button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>

      <div className="p-2! py-4! w-full bg-accent mt-4! shadow-lg text-center rounded-md">
        {targetsAdicionaisModal.length === 0 && (
          <span>No momento não tem contatos adicionais na sua lista</span>
        )}

        {targetsAdicionaisModal.map((t) => (
          <div
            key={t.cpf}
            className="w-full flex gap-2 justify-between items-center border p-2! rounded-md bg-accent shadow-lg mt-2!"
          >
            <span className="flex gap-2 items-center text-sm">
              <UsersRound size={20} /> {t.name} -
              <PhoneIncoming size={18} /> {t.mobileNumber} -
              <User size={20} /> {t.student.name} -
              <GraduationCap size={20} /> {t.student.description}
            </span>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  className="px-2! py-1! w-8 h-8 cursor-pointer"
                  onClick={() => removerTarget(t.cpf)}
                >
                  <UserX />
                </Button>
              </TooltipTrigger>

              <TooltipContent>
                <p className="p-2!">Remover contato da lista</p>
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
      </div>
    </div>
  );
}
