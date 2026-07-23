import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, API_URL } from "../../service/api";

const fetchdata = async (request : FormData) : Promise<string> => {
    const response = await api.post(`${API_URL}/uploads`, request);

    return response.data;
}

export function useUploadPost() {
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