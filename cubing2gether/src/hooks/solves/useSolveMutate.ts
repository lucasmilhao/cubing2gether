import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { type AxiosPromise } from "axios"
import type { SolveRequest } from "../../interface/SolveRequest";

const API = 'http://localhost:8080'

interface SolveProps {
    tempo : number,
    scramble : string,
    penalty : null,
    userId : string
}

const fetchData = async (data : SolveRequest) : AxiosPromise<SolveProps> => {
    const response = await axios.post(`${API}/solves`, data);

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