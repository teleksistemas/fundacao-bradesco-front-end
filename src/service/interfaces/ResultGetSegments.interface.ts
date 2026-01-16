export interface ResultGetSegments {
    success: boolean,
    message: string,
    data: Segments | []
}

export interface Segments {
    segmentCode: string,
    classes: School[]
}


export interface School {
    serie: string,
    classCode: string,
    description: string
}