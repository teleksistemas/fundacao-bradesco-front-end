"use client"

import { GetSegments } from "@/service/GetSegments"
import type { ResultGetSegments, Segments, School } from "@/service/interfaces/ResultGetSegments.interface"
import { GetClasses } from "@/service/GetClasses"
import type { Classes, Parents } from "@/service/interfaces/ResultGetClasses.interface"
import type { Target } from "@/service/interfaces/Targets.interface.ts"

import { Checkbox } from "@/components/ui/checkbox"
import { LoaderCircle, GraduationCap, User, BookOpen, Layers } from "lucide-react"
import toast from "react-hot-toast"
import { useState, useEffect } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Props {
  listaDeTragets: (template: Target[]) => void
}

function extractSerieType(description: string): string {
  // Remove o último caractere se for letra (A, B, C, etc)
  return description.replace(/\s+[A-Z]$/, "").trim()
}

interface SerieGroup {
  serieType: string // ex: "EF 1º ano"
  classes: SchoolWithKey[]
}

interface SchoolWithKey extends School {
  key: string
}

export default function SelectSegmentsAndClassesTree({ listaDeTragets }: Props) {
  const [segments, setSegments] = useState<Segments[]>([])
  const [classe, setClasse] = useState<School | null>(null)
  const [isLoopingGetClasse, setIsloopingGetClass] = useState<boolean>(false)
  const [segmentSelecionado, setSegmentSelecionado] = useState<Segments | null>(null)
  const [classes, setClasses] = useState<Parents[]>([])
  const [targets, setTargets] = useState<Target[]>([])

  // Estados para controlar os checkboxes selecionados
  const [selectedSegments, setSelectedSegments] = useState<Set<string>>(new Set())
  const [selectedSeries, setSelectedSeries] = useState<Set<string>>(new Set())
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set())
  const [selectedParents, setSelectedParents] = useState<Set<string>>(new Set())
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())

  useEffect(() => {
    listaDeTragets(targets)
  }, [targets])

  useEffect(() => {
    if (classe) {
      setClasses([])
      setIsloopingGetClass(true)
      ChamarGetClasse()
    }
  }, [classe])

  async function ChamarGetClasse() {
    try {
      if (!segmentSelecionado || !classe) {
        toast.error("Erro ao puxar alunos da classe")
        setIsloopingGetClass(false)
        return
      }
      const result: Classes = await GetClasses(segmentSelecionado.segmentCode, classe.classCode, classe.serie)
      await setTimeout(() => {
        console.log("Time para forçar espera")
      }, 5000)
      setIsloopingGetClass(false);
      setClasses(Array.isArray(result.data) ? result.data : [result.data]);
    } catch (e: any) {
      console.log(e);
      setIsloopingGetClass(false);
      toast.error("Erro ao puxar alunos da classe")
    }
  }

  async function ChamarGetSegments() {
    try {
      const result: ResultGetSegments = await GetSegments()
      setSegments(Array.isArray(result.data) ? result.data : [result.data])
    } catch {
      toast.error("Não conseguimos puxar seus segmentos")
    }
  }

  function addTarget(target: Target) {
    setTargets((prev) => {
      const exists = prev.some((t) => t.cpf === target?.cpf && t.student?.rm === target.student?.rm)
      if (exists) return prev
      return [...prev, target]
    })
  }

  function removeTarget(cpf: string, rm: string) {
    setTargets((prev) => prev.filter((t) => !(t.cpf === cpf && t.student?.rm === rm)))
  }

  function hasParentsInData(parents: Parents[]): boolean {
    return parents && parents.length > 0 && parents[0] && "cpf" in parents[0]
  }

  const getSegmentKey = (segmentCode: string) => `segment-${segmentCode}`
  const getSerieKey = (segmentCode: string, serieType: string) => `serie-${segmentCode}-${serieType}`
  const getClassKey = (segmentCode: string, serieType: string, classCode: string) =>
    `class-${segmentCode}-${serieType}-${classCode}`
  const getParentKey = (segmentCode: string, serieType: string, classCode: string, cpf: string) =>
    `parent-${segmentCode}-${serieType}-${classCode}-${cpf}`
  const getStudentKey = (cpf: string, rm: string) => `student-${cpf}-${rm}`

  function groupClassesBySerieType(classes: School[]): SerieGroup[] {
    const grouped = new Map<string, SchoolWithKey[]>()

    classes.forEach((school) => {
      const serieType = extractSerieType(school.description)
      if (!grouped.has(serieType)) {
        grouped.set(serieType, [])
      }
      grouped.get(serieType)!.push({
        ...school,
        key: `${school.classCode}-${school.description}`,
      })
    })

    return Array.from(grouped.entries()).map(([serieType, classArray]) => ({
      serieType,
      classes: classArray,
    }))
  }

  useEffect(() => {
    ChamarGetSegments()
  }, [])

  if (segments.length === 0) {
    return (
      <div className="min-w-full max-w-xl mx-auto p-4! flex items-center justify-center">
        <LoaderCircle className="mt-5! w-6 h-6 animate-spin" />
      </div>
    )
  }

  function formatarTelefone(numero: string): string {
    // Remove qualquer coisa que não seja número (segurança extra)
    const limpo = numero.replace(/\D/g, "");

    // Verifica se tem 11 dígitos (DDD + 9 dígitos)
    if (limpo.length !== 11) {
      return "Número inválido";
    }

    const ddd = limpo.slice(0, 2);
    const parte1 = limpo.slice(2, 7);
    const parte2 = limpo.slice(7, 11);

    return `(${ddd}) ${parte1}-${parte2}`;
  }


  return (
    <div className="min-w-full! max-w-xl! mx-auto! p-4!">
      <div className="space-y-3!">
        {/* NÍVEL 1: SEGMENT */}
        <Accordion type="single" collapsible className="w-full! space-y-3!">
          {segments.map((segmento, segmentIndex) => {
            const serieGroups = groupClassesBySerieType(segmento.classes)

            return (
              <AccordionItem
                value={getSegmentKey(segmento.segmentCode)}
                key={segmentIndex}
                className="w-full! border! border-border! rounded-lg! overflow-hidden! bg-card! shadow-sm! hover:shadow-md! transition-shadow!"
              >
                <AccordionTrigger className="min-w-100! px-4! py-3! hover:bg-accent! transition-colors! hover:no-underline! flex! justify-between! items-center!">
                  <div className="w-full! flex! justify-start! items-center! gap-2!">
                    <div className="flex! items-center! justify-center! w-10! h-10! rounded-full! bg-primary/10!">
                      <GraduationCap className="w-5! h-5! text-primary!" />
                    </div>
                    <span className="font-semibold! text-lg!">{segmento.segmentCode}</span>
                  </div>

                  <span>
                    <Checkbox
                      checked={selectedSegments.has(segmento.segmentCode)}
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                      onCheckedChange={async (checked) => {
                        toast.loading(`${checked ? "Adicionando segmento..." : "Removendo segmento..."}`)

                        if (checked) {
                          setSelectedSegments((prev) => new Set(prev).add(segmento.segmentCode))
                        } else {
                          setSelectedSegments((prev) => {
                            const newSet = new Set(prev)
                            newSet.delete(segmento.segmentCode)
                            return newSet
                          })
                        }

                        // Iterar por todas as séries e classes
                        for (const serieGroup of serieGroups) {
                          // Adicionar/remover a série do selectedSeries
                          const serieKey = getSerieKey(segmento.segmentCode, serieGroup.serieType)
                          if (checked) {
                            setSelectedSeries((prev) => new Set(prev).add(serieKey))
                          } else {
                            setSelectedSeries((prev) => {
                              const newSet = new Set(prev)
                              newSet.delete(serieKey)
                              return newSet
                            })
                          }

                          for (const cls of serieGroup.classes) {
                            const classKey = getClassKey(segmento.segmentCode, serieGroup.serieType, cls.classCode)

                            if (checked) {
                              setSelectedClasses((prev) => new Set(prev).add(classKey))
                            } else {
                              setSelectedClasses((prev) => {
                                const newSet = new Set(prev)
                                newSet.delete(classKey)
                                return newSet
                              })
                            }

                            const res = await GetClasses(segmento.segmentCode, cls.classCode, cls.serie)

                            res.data.forEach((p: Parents) => {
                              const parentKey = getParentKey(
                                segmento.segmentCode,
                                serieGroup.serieType,
                                cls.classCode,
                                p.cpf,
                              )
                              if (checked) {
                                setSelectedParents((prev) => new Set(prev).add(parentKey))
                              } else {
                                setSelectedParents((prev) => {
                                  const newSet = new Set(prev)
                                  newSet.delete(parentKey)
                                  return newSet
                                })
                              }

                              p.students.forEach((st) => {
                                const studentKey = getStudentKey(p.cpf, st.rm)
                                if (checked) {
                                  setSelectedStudents((prev) => new Set(prev).add(studentKey))
                                } else {
                                  setSelectedStudents((prev) => {
                                    const newSet = new Set(prev)
                                    newSet.delete(studentKey)
                                    return newSet
                                  })
                                }

                                const target = {
                                  cpf: p.cpf,
                                  name: p.name,
                                  mobileNumber: p.mobileNumber,
                                  student: {
                                    rm: st.rm,
                                    name: st.name,
                                    email: st.email,
                                    serie: cls.serie,
                                    classCode: cls.classCode,
                                    description: cls.description,
                                  },
                                }

                                if (checked) addTarget(target)
                                else removeTarget(target.cpf, target.student.rm)
                              })
                            })
                          }
                        }

                        toast.dismiss()
                        if (checked) {
                          toast.success("Segmentos adicionados a lista de disparo")
                        } else {
                          toast.error("Segmentos removidos da lista de disparo")
                        }
                      }}
                    />
                  </span>
                </AccordionTrigger>

                <AccordionContent className="px-4! pb-3!">
                  <div className="pl-2! pt-2! space-y-2!">
                    {/* NÍVEL 2: SÉRIE/TIPO (ex: EF 1º ano) */}
                    <Accordion type="single" collapsible className="w-full! space-y-2!">
                      {serieGroups.map((serieGroup, serieIndex) => (
                        <AccordionItem
                          value={getSerieKey(segmento.segmentCode, serieGroup.serieType)}
                          key={serieIndex}
                          className="border! border-border! rounded-md! overflow-hidden! bg-white! shadow-sm!"
                        >
                          <AccordionTrigger className="p-3! py-2.5! hover:bg-amber-400/20! transition-colors! hover:no-underline!">
                            <div className="w-full! flex! items-center! justify-between! pr-3!">
                              <div className="flex! items-center! gap-2.5!">
                                <div className="flex! items-center! justify-center! w-8! h-8! rounded-md! bg-amber-500/20!">
                                  <Layers className="w-4! h-4! text-amber-600! dark:text-amber-400!" />
                                </div>
                                <span className="font-medium! text-sm!">{serieGroup.serieType}</span>
                              </div>
                              <Checkbox
                                checked={selectedSeries.has(getSerieKey(segmento.segmentCode, serieGroup.serieType))}
                                onClick={(e) => e.stopPropagation()}
                                onPointerDown={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                                onCheckedChange={async (checked) => {
                                  const serieKey = getSerieKey(segmento.segmentCode, serieGroup.serieType)
                                  toast.loading(`${checked ? "Adicionando série..." : "Removendo série..."}`)

                                  if (checked) {
                                    setSelectedSeries((prev) => new Set(prev).add(serieKey))
                                  } else {
                                    setSelectedSeries((prev) => {
                                      const newSet = new Set(prev)
                                      newSet.delete(serieKey)
                                      return newSet
                                    })
                                  }

                                  // Toggle all classes and students in this serie
                                  for (const cls of serieGroup.classes) {
                                    const classKey = getClassKey(
                                      segmento.segmentCode,
                                      serieGroup.serieType,
                                      cls.classCode,
                                    )

                                    if (checked) {
                                      setSelectedClasses((prev) => new Set(prev).add(classKey))
                                    } else {
                                      setSelectedClasses((prev) => {
                                        const newSet = new Set(prev)
                                        newSet.delete(classKey)
                                        return newSet
                                      })
                                    }

                                    const res = await GetClasses(segmento.segmentCode, cls.classCode, cls.serie)

                                    res.data.forEach((p: Parents) => {
                                      const parentKey = getParentKey(
                                        segmento.segmentCode,
                                        serieGroup.serieType,
                                        cls.classCode,
                                        p.cpf,
                                      )
                                      if (checked) {
                                        setSelectedParents((prev) => new Set(prev).add(parentKey))
                                      } else {
                                        setSelectedParents((prev) => {
                                          const newSet = new Set(prev)
                                          newSet.delete(parentKey)
                                          return newSet
                                        })
                                      }

                                      p.students.forEach((st) => {
                                        const studentKey = getStudentKey(p.cpf, st.rm)
                                        if (checked) {
                                          setSelectedStudents((prev) => new Set(prev).add(studentKey))
                                        } else {
                                          setSelectedStudents((prev) => {
                                            const newSet = new Set(prev)
                                            newSet.delete(studentKey)
                                            return newSet
                                          })
                                        }

                                        const target = {
                                          cpf: p.cpf,
                                          name: p.name,
                                          mobileNumber: p.mobileNumber,
                                          student: {
                                            rm: st.rm,
                                            name: st.name,
                                            email: st.email,
                                            serie: cls.serie,
                                            classCode: cls.classCode,
                                            description: cls.description,
                                          },
                                        }

                                        if (checked) addTarget(target)
                                        else removeTarget(target.cpf, target.student.rm)
                                      })
                                    })
                                  }

                                  toast.dismiss()
                                  if (checked) {
                                    toast.success("Série adicionada a lista de disparo")
                                  } else {
                                    toast.error("Série removida da lista de disparo")
                                  }
                                }}
                              />
                            </div>
                          </AccordionTrigger>

                          <AccordionContent className="px-4! pb-3! pt-2!">
                            {/* NÍVEL 3: CLASS CODE (A, B, C, etc) */}
                            <Accordion type="single" collapsible className="w-full! space-y-2!">
                              {serieGroup.classes.map((classItem, classIndex) => (
                                <AccordionItem
                                  value={getClassKey(segmento.segmentCode, serieGroup.serieType, classItem.classCode)}
                                  key={classIndex}
                                  className="border! border-border! rounded-md! overflow-hidden! bg-gray-50! shadow-sm!"
                                >
                                  <AccordionTrigger
                                    className="p-2.5! py-2! hover:bg-blue-400/20! transition-colors! hover:no-underline!"
                                    onClick={() => (setClasse(classItem), setSegmentSelecionado(segmento))}
                                  >
                                    <div className="w-full! flex! items-center! justify-between! pr-3!">
                                      <div className="flex! items-center! gap-2.5!">
                                        <div className="flex! items-center! justify-center! w-7! h-7! rounded-md! bg-blue-500/20!">
                                          <BookOpen className="w-3.5! h-3.5! text-blue-600! dark:text-blue-400!" />
                                        </div>
                                        <span className="font-medium! text-xs!">{`Turma ${classItem.classCode}`}</span>
                                      </div>
                                      <Checkbox
                                        checked={selectedClasses.has(
                                          getClassKey(segmento.segmentCode, serieGroup.serieType, classItem.classCode),
                                        )}
                                        onClick={(e) => e.stopPropagation()}
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onKeyDown={(e) => e.stopPropagation()}
                                        onCheckedChange={async (checked) => {
                                          const classKey = getClassKey(
                                            segmento.segmentCode,
                                            serieGroup.serieType,
                                            classItem.classCode,
                                          )
                                          const res = await GetClasses(
                                            segmento.segmentCode,
                                            classItem.classCode,
                                            classItem.serie,
                                          )

                                          if (checked) {
                                            setSelectedClasses((prev) => new Set(prev).add(classKey))

                                            res.data.forEach((p: Parents) => {
                                              const parentKey = getParentKey(
                                                segmento.segmentCode,
                                                serieGroup.serieType,
                                                classItem.classCode,
                                                p.cpf,
                                              )
                                              setSelectedParents((prev) => new Set(prev).add(parentKey))

                                              p.students.forEach((st) => {
                                                const studentKey = getStudentKey(p.cpf, st.rm)
                                                setSelectedStudents((prev) => new Set(prev).add(studentKey))

                                                const target: Target = {
                                                  cpf: p.cpf,
                                                  name: p.name,
                                                  mobileNumber: p.mobileNumber,
                                                  student: {
                                                    rm: st.rm,
                                                    name: st.name,
                                                    email: st.email,
                                                    serie: classItem.serie,
                                                    classCode: classItem.classCode,
                                                    description: classItem.description,
                                                  },
                                                }
                                                addTarget(target)
                                              })
                                            })

                                            toast.success("Classe adicionada a lista de disparo")
                                          } else {
                                            setSelectedClasses((prev) => {
                                              const newSet = new Set(prev)
                                              newSet.delete(classKey)
                                              return newSet
                                            })

                                            res.data.forEach((p: Parents) => {
                                              const parentKey = getParentKey(
                                                segmento.segmentCode,
                                                serieGroup.serieType,
                                                classItem.classCode,
                                                p.cpf,
                                              )
                                              setSelectedParents((prev) => {
                                                const newSet = new Set(prev)
                                                newSet.delete(parentKey)
                                                return newSet
                                              })

                                              p.students.forEach((st) => {
                                                const studentKey = getStudentKey(p.cpf, st.rm)
                                                setSelectedStudents((prev) => {
                                                  const newSet = new Set(prev)
                                                  newSet.delete(studentKey)
                                                  return newSet
                                                })
                                                removeTarget(p.cpf, st.rm)
                                              })
                                            })

                                            toast.error("Classe removida da lista de disparo")
                                          }
                                        }}
                                      />
                                    </div>
                                  </AccordionTrigger>

                                  <AccordionContent className="px-3! pb-3! pt-2!">
                                    {/* NÍVEL 4 & 5: RESPONSÁVEIS E STUDENTS ou APENAS STUDENTS */}
                                    {isLoopingGetClasse ? (
                                      <div className="flex items-center justify-center py-4!">
                                        <LoaderCircle className="w-5! h-5! animate-spin" />
                                      </div>
                                    ) : classes.length > 0 ? (
                                      <>
                                        {/* Se os dados contêm responsáveis com estudantes */}
                                        {hasParentsInData(classes) ? (
                                          <Accordion type="single" collapsible className="w-full space-y-1.5!">
                                            {classes.map((parent, parentIndex) => (
                                              <AccordionItem
                                                value={getParentKey(
                                                  segmento.segmentCode,
                                                  serieGroup.serieType,
                                                  classItem.classCode,
                                                  parent.cpf,
                                                )}
                                                key={parentIndex}
                                                className="border! border-border/50! rounded-md! overflow-hidden! bg-gray-50/50! shadow-xs!"
                                              >
                                                <AccordionTrigger className="p-2! py-1.5! hover:bg-green-400/20! transition-colors! hover:no-underline! text-xs!">
                                                  <div className="w-full! flex! items-center! justify-between! pr-2!">
                                                    <div className="flex! items-center! gap-2!">
                                                      <div className="flex! items-center! justify-center! w-6! h-6! rounded-md! bg-green-500/20!">
                                                        <User className="w-3! h-3! text-green-600! dark:text-green-400!" />
                                                      </div>
                                                      <div className="flex! flex-col!">
                                                        <span className="font-medium! text-xs!">{parent.name}</span>
                                                        <span className="text-xs! text-gray-500! flex! gap-1!">Telefone: {formatarTelefone(parent.mobileNumber)}</span>
                                                      </div>
                                                    </div>
                                                    <Checkbox
                                                      checked={selectedParents.has(
                                                        getParentKey(
                                                          segmento.segmentCode,
                                                          serieGroup.serieType,
                                                          classItem.classCode,
                                                          parent.cpf,
                                                        ),
                                                      )}
                                                      onClick={(e) => e.stopPropagation()}
                                                      onPointerDown={(e) => e.stopPropagation()}
                                                      onKeyDown={(e) => e.stopPropagation()}
                                                      onCheckedChange={(checked) => {
                                                        const parentKey = getParentKey(
                                                          segmento.segmentCode,
                                                          serieGroup.serieType,
                                                          classItem.classCode,
                                                          parent.cpf,
                                                        )

                                                        if (checked) {
                                                          setSelectedParents((prev) => new Set(prev).add(parentKey))
                                                        } else {
                                                          setSelectedParents((prev) => {
                                                            const newSet = new Set(prev)
                                                            newSet.delete(parentKey)
                                                            return newSet
                                                          })
                                                        }

                                                        parent.students.forEach((st) => {
                                                          const studentKey = getStudentKey(parent.cpf, st.rm)
                                                          if (checked) {
                                                            setSelectedStudents((prev) => new Set(prev).add(studentKey))

                                                            const target: Target = {
                                                              cpf: parent.cpf,
                                                              name: parent.name,
                                                              mobileNumber: parent.mobileNumber,
                                                              student: {
                                                                rm: st.rm,
                                                                name: st.name,
                                                                email: st.email,
                                                                serie: classItem.serie,
                                                                classCode: classItem.classCode,
                                                                description: classItem.description,
                                                              },
                                                            }
                                                            addTarget(target)
                                                          } else {
                                                            setSelectedStudents((prev) => {
                                                              const newSet = new Set(prev)
                                                              newSet.delete(studentKey)
                                                              return newSet
                                                            })
                                                            removeTarget(parent.cpf, st.rm)
                                                          }
                                                        })
                                                      }}
                                                    />
                                                  </div>
                                                </AccordionTrigger>

                                                <AccordionContent className="px-2! pb-2! pt-1!">
                                                  {/* NÍVEL 5: STUDENTS */}
                                                  <div className="space-y-1!">
                                                    {parent.students.map((student, studentIndex) => (
                                                      <div
                                                        key={studentIndex}
                                                        className="flex! items-center! justify-between! p-1.5! pr-10! rounded-md! bg-white/50! border! border-border/30! hover:bg-white! transition-colors! text-xs!"
                                                      >
                                                        <div className="flex! items-center! gap-2!">
                                                          <span className="font-medium!">{student.name}</span>
                                                          <span className="text-gray-500!">({student.rm})</span>
                                                        </div>
                                                        <Checkbox
                                                          checked={selectedStudents.has(
                                                            getStudentKey(parent.cpf, student.rm),
                                                          )}
                                                          onClick={(e) => e.stopPropagation()}
                                                          onPointerDown={(e) => e.stopPropagation()}
                                                          onKeyDown={(e) => e.stopPropagation()}
                                                          onCheckedChange={(checked) => {
                                                            const studentKey = getStudentKey(parent.cpf, student.rm)

                                                            if (checked) {
                                                              setSelectedStudents((prev) => new Set(prev).add(studentKey))
                                                            } else {
                                                              setSelectedStudents((prev) => {
                                                                const newSet = new Set(prev)
                                                                newSet.delete(studentKey)
                                                                return newSet
                                                              })
                                                            }

                                                            const target: Target = {
                                                              cpf: parent.cpf,
                                                              name: parent.name,
                                                              mobileNumber: parent.mobileNumber,
                                                              student: {
                                                                rm: student.rm,
                                                                name: student.name,
                                                                email: student.email,
                                                                serie: classItem.serie,
                                                                classCode: classItem.classCode,
                                                                description: classItem.description,
                                                              },
                                                            }

                                                            if (checked) addTarget(target)
                                                            else if (target.student?.rm) removeTarget(target.cpf, target.student.rm)
                                                          }}
                                                        />
                                                      </div>
                                                    ))}
                                                  </div>
                                                </AccordionContent>
                                              </AccordionItem>
                                            ))}
                                          </Accordion>
                                        ) : (
                                          /* Se os dados contêm apenas estudantes diretos (sem responsável) */
                                          <div className="space-y-1.5!">
                                            {classes.map((student: any, studentIndex: number) => (
                                              <div
                                                key={studentIndex}
                                                className="flex! items-center! justify-between! p-2! pr-10! rounded-md! bg-white! border! border-border! hover:bg-blue-50/50! transition-colors!"
                                              >
                                                <div className="flex! items-center! gap-3!">
                                                  <div className="flex! items-center! justify-center! w-7! h-7! rounded-md! bg-blue-500/20!">
                                                    <GraduationCap className="w-3.5! h-3.5! text-blue-600! dark:text-blue-400!" />
                                                  </div>
                                                  <div className="flex! flex-col!">
                                                    <span className="font-medium! text-sm!">{student.name}</span>
                                                    <span className="text-xs! text-gray-500!">RM: {student.rm}</span>
                                                  </div>
                                                </div>
                                                <Checkbox
                                                  checked={selectedStudents.has(
                                                    getStudentKey(student.rm, student.rm),
                                                  )}
                                                  onClick={(e) => e.stopPropagation()}
                                                  onPointerDown={(e) => e.stopPropagation()}
                                                  onKeyDown={(e) => e.stopPropagation()}
                                                  onCheckedChange={(checked) => {
                                                    const studentKey = getStudentKey(student.rm, student.rm)

                                                    if (checked) {
                                                      setSelectedStudents((prev) => new Set(prev).add(studentKey))

                                                      const target: Target = {
                                                        cpf: student.rm,
                                                        name: student.name,
                                                        mobileNumber: student.mobileNumber,
                                                        student: {
                                                          rm: student.rm,
                                                          name: student.name,
                                                          email: student.email,
                                                          serie: student.serie,
                                                          classCode: student.classCode,
                                                          description: student.description,
                                                        },
                                                      }
                                                      addTarget(target)
                                                    } else {
                                                      setSelectedStudents((prev) => {
                                                        const newSet = new Set(prev)
                                                        newSet.delete(studentKey)
                                                        return newSet
                                                      })
                                                      removeTarget(student.rm, student.rm)
                                                    }
                                                  }}
                                                />
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </>
                                    ) : (
                                      <div className="text-center! py-4! text-xs! text-gray-500!">
                                        Nenhum responsável encontrado
                                      </div>
                                    )}
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </div>
  )
}
