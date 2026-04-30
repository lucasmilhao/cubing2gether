import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosPromise } from "axios"
import { api } from "../../service/api";

const API_URL = `https://musical-succotash-g4gr9p6xv573vgpp-8080.app.github.dev`;

const fetchData = async (idSolve : number) : AxiosPromise<void> => {   
    const response = api.delete(`${API_URL}/solves/${idSolve}`);

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