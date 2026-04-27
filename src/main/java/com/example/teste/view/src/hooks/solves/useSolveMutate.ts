import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosPromise } from "axios"
import type { SolveRequest } from "../../interface/SolveRequest";
import { api } from "../../service/api";

const API = 'http://localhost:8080'

interface SolveProps {
    tempo : number,
    scramble : string,
    penalty : null,
    userId : string
}

const fetchData = async (data : SolveRequest) : AxiosPromise<SolveProps> => {
    const response = api.post(`${API}/solves`, data);

    return response;
} 


export function useSolveMutate(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: fetchData, 
        retry: 2,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["solves-data"]})
        }
    })
}