import axios from "axios";
import {useQuery} from "@tanstack/react-query";
import type { UsuarioProps } from "../../interface/UsuarioProps";

const API_URL = `http://localhost:8080`;

const fetchdata = async (idUsuario : string | undefined) : Promise<UsuarioProps> => {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API_URL}/usuarios/${idUsuario}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
}

export function useUsuarioDataId(idUsuario : string | undefined) {

    return useQuery({
        queryFn: () => fetchdata(idUsuario),
        queryKey: ["usuario-id-data"],
        retry: 2
    });
}