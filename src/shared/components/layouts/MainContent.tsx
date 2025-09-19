import { Box } from "@mui/material";
import { Outlet } from "react-router";

const MainContent = () => {
    return (
        <>
            <Box sx={{
                minHeight:'100vh'
            }}>
                <Outlet />
            </Box>
        </>
    )
}

export default MainContent;