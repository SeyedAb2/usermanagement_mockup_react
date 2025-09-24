import { create } from "zustand";
import { AuthStateType } from "../shared/types/auth-state.type";
import { createJSONStorage, persist } from "zustand/middleware";

export const useAuthStore = create<AuthStateType>()(
    persist(
        (set,get)=>({
            user:null,
            setUser:(user)=>{ set({ user }) },
            getUser: ()=>get().user,
            isLogined: ()=> !!get().user,
            logout:()=>{ set({ user:null }) } 
        }),
        {
            name:'auth-store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state)=> ({ user:state.user })
        }
    )
)