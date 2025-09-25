import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../store/auth.store";
import { UserType } from "../types";
import { patchUserApi } from "../../services/api/auth";
import { scrollToTop } from "../utils/scrollToTop";
import useToastify from "./useToastify";

export default function usePatchUser(){

    const { setUser } = useAuthStore()
    const { notify } = useToastify();
    return useMutation({
        mutationKey:['patch-user'],
        mutationFn:(data:UserType)=>patchUserApi(data),
        onSuccess:(data:UserType)=>{
            scrollToTop();
            setUser(data);
            notify({type:'info',message:'اطلاعات با موفقیت ویرایش شد'})
        },
        onError:(error)=>{
            notify({type:'error',message:error.message})
        }
    })
}