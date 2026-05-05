import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../service/api";

const API_URL = `http://localhost:8080`;

const fetchdata = async (request : FormData) => {
    const response = await api.post(`${API_URL}/uploads`, request);

    return response.data;
}

export function useUploadPost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["upload-data"]})
        }
    });
}