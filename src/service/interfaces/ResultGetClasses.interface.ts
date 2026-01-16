export interface ResultGetClasses {
    success: boolean,
    message: string,
    data: Classes | []
}

export interface Classes {
    schoolCode: string,
    segmentCode: string,
    data: Parents[]
}


export interface Parents {
    cpf: string,
    mobileNumber: string,
    name: string,
    students: Students[]
}

export interface Students {
    rm: string,
    name: string,
    email: string,
    serie: string,
    classCode: string,
    description: string
}

