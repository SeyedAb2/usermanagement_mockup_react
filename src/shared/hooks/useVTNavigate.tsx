import { useNavigate } from "react-router";

export default function useVTNavigate() {
  const navigate = useNavigate();
  return (to: string) => {
    const go = () => navigate(to);
    if (document.startViewTransition) document.startViewTransition(go);
    else go();
  };
}