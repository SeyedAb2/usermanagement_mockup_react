import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  Container,
  Menu,
  MenuItem,
  IconButton,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Logo from "src/assets/images/Logo.png";

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Box
      sx={{
        mt: 1,
        mx: 1,
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
        direction: "rtl",
        position: "sticky", // ← کل Box چسبنده می‌شود
        top: 0,
        zIndex: 1100, // بالاتر از سایر عناصر
      }}
    >
      <AppBar
        position="static"
        sx={{
          bgcolor: "#085E42",
          borderRadius: "12px",
          boxShadow: "none",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              px: { xs: 1, sm: 2 },
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {/* لوگو سمت راست */}
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: "bold",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                component="img"
                src={Logo}
                alt="لوگو زنجیره تولید مام"
                sx={{
                  height: 32,
                  width: "auto",
                  display: "block",
                  objectFit: "contain",
                }}
              />
            </Typography>

            {/* پروفایل سمت چپ */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ flexShrink: 0 }}
            >
              
              <IconButton
                onClick={handleMenuOpen}
                sx={{ color: "white", p: 0, mr: 0.5 }}
              >
                <ExpandMore />
              </IconButton>
              <Avatar
                sx={{
                  bgcolor: "#F2C94C",
                  color: "#fff",
                  fontWeight: "bold",
                  width: 40,
                  height: 40,
                }}
              >
                م
              </Avatar>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <MenuItem onClick={handleMenuClose}>پروفایل</MenuItem>
                <MenuItem onClick={handleMenuClose}>خروج</MenuItem>
              </Menu>
              {!isMobile && (
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#fff", fontWeight: 500 }}
                >
                  مجتبی اکبری
                </Typography>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}