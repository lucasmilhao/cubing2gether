import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../service/api";
import type { UsuarioProps } from "../../interface/UsuarioProps";
interface UsuarioEditMutation {
    id: string;
    formData: FormData;
}

const fetchdata = async (request: UsuarioEditMutation): Promise<UsuarioProps> => {

    const response = await api.put(
        `/usuarios/${request.id}`,
        request.formData
    );

    return response.data;
};

export function useUsuarioEdit() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["upload-data"]})
            queryClient.invalidateQueries({queryKey : ["usuario-id-data"]})
            queryClient.invalidateQueries({queryKey : ["usuario-logado-data"]})
        }
    });
}