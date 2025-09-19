import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  InputAdornment,
} from "@mui/material";
import { Phone, Lock } from "@mui/icons-material";
import BadgeIcon from '@mui/icons-material/Badge';
import logo from "../../../assets/images/logo.png";
import Seo from "../../../shared/components/seo/Seo";
import { Link } from "react-router";
import { toPersianDegit } from './../../../shared/utils/toPersianDigits';
import { LabelPosition } from "../../../shared/utils/textFieldLabelStyleConfig";

export default function SignUp() {

  return (
    <>
      <Seo SITE_NAME="ثبت نام | وال فارم" />
      <Box
        sx={{
          minHeight: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          sx={{
            maxWidth: 380,
            width: "100%",
            borderRadius: 3,
            boxShadow: 6,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <img src={logo} alt="logo" width={70} height={70} />
              <Typography variant="h6" sx={{ mt: 1, fontWeight: "bold" }}>
                به وال‌فارم خوش آمدید
              </Typography>
            </Box>

            {/* نام و نام خانوادگی */}
            <TextField
              fullWidth
              sx={LabelPosition({gap:0})}
              label="نام و نام خانوادگی"
              type="text"
              variant="outlined"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              inputProps={{ dir: "rtl" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon fontSize="small" sx={{marginX:1}} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="شماره تلفن"
              variant="outlined"
              margin="normal"
              sx={LabelPosition({gap:10})}    
              InputLabelProps={{ shrink: true }}
              inputProps={{ dir: "ltr" }} 
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="start">
                    <Box
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: 'success.main',
                        color:'wlc.100',
                        fontSize: "0.85rem",
                        fontWeight: 500,
                      }}
                    >
                      {toPersianDegit('98+')}
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            {/* رمز عبور */}
            <TextField
              fullWidth
              sx={LabelPosition({gap:14})}
              label="رمز عبور"
              type="password"
              variant="outlined"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              inputProps={{ dir: "ltr" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock fontSize="small" sx={{marginX:1}} />
                  </InputAdornment>
                ),
              }}
            />
            

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, borderRadius: 2 }}
            >
              ثبت نام
            </Button>

            <Typography
              variant="body2"
              sx={{ textAlign: "center", fontSize:13 , mt: 2, color: "gray.500" }}
            >
              اگر حساب کاربری دارید{" "}
              <Link to="/login" viewTransition>
                <span style={{color:'green'}}>وارد شوید</span>
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
