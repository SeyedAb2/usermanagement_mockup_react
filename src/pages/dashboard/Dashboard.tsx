// لایه داشبورد: سایدبار راست + Drawer موبایل + Outlet
import { Box, Container, Stack } from "@mui/material";
import { Outlet } from "react-router";
import Seo from "../../shared/components/seo/Seo";
import DashboardSidebar from "../../shared/components/DashboardSidebar";
import DashboardSidebarMobile from "../../shared/components/DashboardSidebarMobile";



export default function Dashboard() {

  return (
    <>
      <Seo SITE_NAME="داشبورد کاربر" />
      <Box sx={{ py: { xs: 2, md: 4 } }}>
        <Container maxWidth="lg">
          <DashboardSidebarMobile />
          <Stack direction="row" sx={{ gap: 2 }}>
            <Box
              sx={{
                width: 280,
                display: { xs: "none", md: "block" },
                position: "sticky",
                top: 100,
                alignSelf: "flex-start",
                height: "fit-content",
              }}
            >
              <DashboardSidebar />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Outlet />
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
}