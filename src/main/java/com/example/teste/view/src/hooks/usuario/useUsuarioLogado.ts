import axios from "axios";
import type { UsuarioRequest } from "../../interface/UsuarioRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UsuarioProps } from "../../interface/UsuarioProps";

const API_URL = `http://localhost:8080`;

const fetchdata = async () : Promise<UsuarioProps> => {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API_URL}/usuarios/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
}

export function useUsuarioLogado() {

    return useQuery({
        queryFn: fetchdata,
        queryKey: ["usuario-logado-data"],
        retry: 2
    });
}