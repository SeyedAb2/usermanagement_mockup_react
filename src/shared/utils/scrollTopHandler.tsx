import { useLocation } from "react-router";
import { useScrollTop } from "../hooks/useScrollTop";

const ScrollToTopHandler = () => {
  const location = useLocation();
  useScrollTop([location.pathname], { behavior: "smooth" });
  return null;
};

export default ScrollToTopHandler;