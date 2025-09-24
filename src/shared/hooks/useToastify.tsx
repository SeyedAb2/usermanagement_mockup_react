import { toast } from "react-toastify";

import { ToastifyType } from "../types";
import { useCallback } from "react";
import { useUIStore } from "../../store/ui.store";

export default function useToastify(){
    const {themeMode} = useUIStore()
    const notify = useCallback(({ type, message }: ToastifyType) => {
    toast[type](message, { position: "bottom-left",theme:themeMode??'light' });
  }, []);

  return { notify };
}