import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosPromise } from "axios"
import { api } from "../../service/api";

const fetchData = async (idSolve : number) : AxiosPromise<void> => {   
    const response = api.delete(`/solves/${idSolve}`);

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