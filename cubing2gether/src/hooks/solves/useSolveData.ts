import { useQuery } from "@tanstack/react-query";
import type { AxiosPromise } from "axios";
import axios from "axios";

const API = `http://localhost:8080`;

interface SolveProps {
    id : number,
    tempo :  number,
    scramble: string,
    penalty : string,
    userId: string
}

const fetchData = async () : AxiosPromise<SolveProps[]> => {
    const response = await axios.get(`${API}/solves`);

    return response;
}

export function useSolveData() {
    return useQuery ({
        queryFn: fetchData,
        queryKey: ["solves-data"],
        retry: 2
    })
    
}