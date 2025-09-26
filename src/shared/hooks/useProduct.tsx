import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "react-router";
import { scrollToTop } from "../utils/scrollToTop";
import useToastify from "./useToastify";
import { ProductType } from "../types";
import { patchProductApi, postProductApi } from "../../services/api/product";

export default function useProduct(ACTION:'ADD'|'EDIT'){
    const { getUser } = useAuthStore()
    const navigate = useNavigate()
    const { notify } = useToastify();
    return useMutation({
        mutationKey:['product'],
        mutationFn:(data:ProductType)=>ACTION==='ADD' ? postProductApi({
            ...data,
            user:getUser(),
            created_at:new Date(Date.now()).toISOString(),
            grade:Math.floor(Math.random() * (5 - 1 + 1)) + 1
        }) : patchProductApi({...data,user:getUser()}),
        onSuccess:()=>{
            scrollToTop();
            notify({type:ACTION==='ADD'?'success':'info',message:ACTION==='ADD' ? 'محصول با موفقیت اضافه شد' : 'محصول با موفقیت ویرایش شد' })
            setTimeout(() => {navigate('/dashboard/my-products')}, 500);
        },
        onError:(error)=>{
            notify({type:'error',message:error.message})
        }
    })
}