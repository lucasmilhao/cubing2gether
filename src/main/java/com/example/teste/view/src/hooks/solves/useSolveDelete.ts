import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { type AxiosPromise } from "axios"

const API = 'http://localhost:8080'

const fetchData = async (idSolve : number) : AxiosPromise<void> => {   
    const token = localStorage.getItem("authToken");

    const response = await axios.delete(`${API}/solves/${idSolve}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response;
}


export function useSolveDelete(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: fetchData, 
        retry: 2,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["solves-data"]})
        }
    })
}