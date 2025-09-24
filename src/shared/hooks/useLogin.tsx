import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/auth.store";
import useToastify from "./useToastify";
import { useMutation } from "@tanstack/react-query";
import { UserType } from "../types";
import { loginApi } from "../../services/api/auth";

export default function useLogin(){

    const { setUser } = useAuthStore();
    const navigate = useNavigate();
    const { notify } = useToastify()

    return useMutation({
        mutationKey:['login'],
        mutationFn:(data:UserType)=>loginApi(data),
        onSuccess:(res:UserType)=>{
            setUser(res);
            notify({type:'success', message:'با موفقیت وارد شدید'})
            setTimeout(() => {
                navigate('/products')
            }, 500);
        },
        onError:(err)=>{
            notify({type:'error', message:err.message})
        }
    })
}