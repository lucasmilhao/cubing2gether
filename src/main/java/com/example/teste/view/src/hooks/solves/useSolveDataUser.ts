import { useQuery } from "@tanstack/react-query";
import type { AxiosPromise } from "axios";
import { api } from "../../service/api";

const API_URL = `https://musical-succotash-g4gr9p6xv573vgpp-8080.app.github.dev`;

interface SolveProps {
    id : number,
    tempo :  number,
    scramble: string,
    penalty : string,
    userId: string
}

const fetchData = async (userId : string | undefined) : AxiosPromise<SolveProps[]> => {
    const response = api.get(`${API_URL}/solves/${userId}`);

    return response;
}

export function useSolveDataUser(userId : string | undefined) {
    return useQuery ({
        queryFn: () => fetchData(userId),
        queryKey: ["solves-data", userId],
        retry: 2,
        enabled: !!userId
    })
}