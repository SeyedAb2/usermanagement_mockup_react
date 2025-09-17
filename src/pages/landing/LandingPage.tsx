import { Button } from "@mui/material";
import Seo from "../../shared/components/seo/Seo";

const LandingPage = ()=>{
    return (
        <>
            <Seo SITE_NAME="صفحه اصلی | وال فارم" />
            <h1>سلام صفحه اصلی هستم</h1>
            <Button variant="contained">کلیک  کنید</Button>
        </>
    )
}

export default LandingPage;