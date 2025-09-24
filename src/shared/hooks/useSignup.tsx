import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../store/auth.store";
import { UserType } from "../types";
import { signupApi } from "../../services/api/auth";
import { useNavigate } from "react-router";
import { scrollToTop } from "../utils/scrollToTop";
import useToastify from "./useToastify";

export default function useSignUp(){

    const { setUser } = useAuthStore()
    const navigate = useNavigate()
    const { notify } = useToastify();
    return useMutation({
        mutationKey:['signup'],
        mutationFn:(data:UserType)=>signupApi(data),
        onSuccess:(data:UserType)=>{
            scrollToTop();
            setUser(data);
            notify({type:'success',message:'ثبت نام با موفقیت انجام شد'})
            setTimeout(() => {navigate('/dashboard')}, 1200);
        },
        onError:(error)=>{
            notify({type:'error',message:error.message})
        }
    })
}