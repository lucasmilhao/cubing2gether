import {useMutation, useQuery} from "@tanstack/react-query";
import type { UsuarioProps } from "../../interface/UsuarioProps";
import { api } from "../../service/api";

const API_URL = `http://localhost:8080`;

const fetchdata = async (emailUsuario : string) : Promise<UsuarioProps> => {
    const response = await api.get(`${API_URL}/usuarios/email/${emailUsuario}`);

    return response.data;
}

export function useUsuarioemailData() {

    return useMutation({
        mutationFn: fetchdata,
        retry: 2
    });
}