import { Answer, Quiz, Result } from "./entityTypes";

export type UserPlaySession = {
    id:string,
    meetId:string,
    createdAt:string,
    quiz: Pick<Quiz,'id'|'userId' | 'text'|'createdAt'> & {answers?:Answer[]},
    answers: Omit<Answer,'results'|'quiz'>[],
    result: Pick<Result,'id'|'createdAt'> | null,
    answer: Pick<Answer,'id'|'isCorrect'> | null,
    results?: Result[] | null
};

export type UserQuiz = Omit<Quiz,'deletedAt'>;

export type UserPlaySessionResult = UserPlaySession & {
    result: Pick<Result,'id'|'createdAt'>,
    answer: Pick<Answer,'id'|'isCorrect'>
};

export type ZoomContext = Partial<{
    aud: string;
    entitlements: Array<string>;
    exp: number;
    iss: string;
    theme: string;
    ts: number;
    typ: string;
    uid: string;
    mid?: string;
  }>

export type ZoomContextString = string|null;
export type DecryptedContext = ZoomContext | null;
export type ZoomTokens ={
    access_token:string,
    refresh_token:string
} | null;
export type ZoomUser ={
    display_name:string,
    firstname:string,
    surname:string,
    email:string
} | null


export type UserZoomContext = Partial<{
    context: ZoomContextString,
    decrypted:DecryptedContext,
    tokens:ZoomTokens,
    user:ZoomUser
}>