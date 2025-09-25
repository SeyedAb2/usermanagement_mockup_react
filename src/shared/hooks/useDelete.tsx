import { useMutation, useQueryClient } from "@tanstack/react-query";
import useToastify from "./useToastify";
import { deleteProductApi } from "../../services/api/product";
import { ProductType } from "../types";
import { sleep } from "../utils/sleepDlay";

export default function useDelete(){
    const queryClient = useQueryClient();
    const { notify } = useToastify();
    return useMutation({
        mutationKey:['deleteProduct'],
        mutationFn:(id:string|number)=>deleteProductApi(id),
        onMutate: async (id: number) => {
            await sleep(300)
            await queryClient.cancelQueries({ queryKey: ["allProduct"] });
            const previous = queryClient.getQueryData<ProductType[]>(["allProduct"]);
            queryClient.setQueryData<ProductType[]>(["allProduct"], (old) =>
                (old ?? []).filter((p) => p.id !== id)
            );
            return { previous };
        },
        onSuccess:()=>{
            notify({type:'info',message:'محصول با موفقیت حذف شد'})
        },
        onError:(error)=>{
            notify({type:'error',message:error.message})
        }
    })
}