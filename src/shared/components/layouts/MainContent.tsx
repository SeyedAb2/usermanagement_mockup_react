import { Box } from "@mui/material";
import { Outlet } from "react-router";

const MainContent = () => {
    return (
        <>
            <Box sx={{
                minHeight:'100vh',
                mx:1,
                mt:1
            }}>
                <Outlet />
            </Box>
        </>
    )
}

export default MainContent;