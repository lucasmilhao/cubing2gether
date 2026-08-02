import { useQuery } from "@tanstack/react-query";
import type { AxiosPromise } from "axios";
import { api } from "../../service/api";

interface SolveProps {
    id : number,
    tempo :  number,
    scramble: string,
    penalty : string,
    userId: string
}

const fetchData = async () : AxiosPromise<SolveProps[]> => {
    const response = api.get(`/solves`);

    return response;
}

export function useSolveData() {
    return useQuery ({
        queryFn: fetchData,
        queryKey: ["solves-data"],
        retry: 2
    })
    
}