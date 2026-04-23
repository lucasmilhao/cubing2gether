import axios from "axios";
import {useQuery} from "@tanstack/react-query";
import type { UsuarioProps } from "../../interface/UsuarioProps";

const API_URL = `http://localhost:8080`;

const fetchdata = async () : Promise<UsuarioProps[]> => {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API_URL}/usuarios`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
}

export function useUsuarioData() {

    return useQuery({
        queryFn: () => fetchdata(),
        queryKey: ["usuario-data"],
        retry: 2
    });
}