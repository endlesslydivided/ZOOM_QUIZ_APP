export type PlaySession ={
    id:string,
    meetId:string,
    quiz:Quiz,
    results:Result[],
    createdAt:string,
    updatedAt:string,
}

export type Result ={
    id:string,
    userId:string,
    answer:Answer,  
    playSession:PlaySession,
    createdAt:string,
    updatedAt:string,
}

export type Answer ={
    id:string,
    text:string,
    isCorrect:boolean,
    results:Result[],
    quiz:Quiz,
}

export type Quiz ={
    id:string,
    userId:string,
    text:string,
    playSessions:PlaySession[],
    answers:Answer[],
    createdAt:string,
    updatedAt:string,
    deletedAt?:string
}
