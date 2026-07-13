export interface SolveRequest {
    tempo : number,
    scramble : string,
    penalty : any,
    userId? : string,
    partidaId? : string | null
}