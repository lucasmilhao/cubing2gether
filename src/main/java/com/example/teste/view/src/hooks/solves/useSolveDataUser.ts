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

const fetchData = async (userId : string | undefined) : AxiosPromise<SolveProps[]> => {
    const token = localStorage.getItem("authToken");
    
    const response = await axios.get(`${API}/solves/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response;
}

export function useSolveDataUser(userId : string | undefined) {
    return useQuery ({
        queryFn: () => fetchData(userId),
        queryKey: ["solves-data", userId],
        retry: 2
    })
    
}