import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Phone } from "@mui/icons-material";
import logo from "../../../assets/images/logo.png";
import Seo from "../../../shared/components/seo/Seo";
import { Link } from "react-router";
import { toPersianDegit } from './../../../shared/utils/toPersianDigits';
import { LabelPosition } from "../../../shared/utils/textFieldLabelStyleConfig";
import { useForm } from "react-hook-form";
import { LoginValidationSchema } from "../../../shared/validations/loginSchema";
import { useState } from "react";
import useLogin from "../../../shared/hooks/useLogin";
import { UserType } from "../../../shared/types";
import { yupResolver } from "@hookform/resolvers/yup";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function Login() {
  const [passwordType, setPasswordType] = useState('password')
  const { isPending, mutate} = useLogin()
  const {handleSubmit, register , formState : {errors}} = useForm({
    resolver: yupResolver(LoginValidationSchema)
  })

  const onSubmit = (data:UserType)=>{
    mutate(data)
  }
  return (
    <>
      <Seo SITE_NAME="ورود | وال فارم" />
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
                ورود به وال‌فارم
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="شماره تلفن"
                variant="outlined"
                margin="normal"
                error={errors.phone?.message ? true : false}
                {...register('phone')}
                placeholder="مثال : ۹۱۲۳۴۵۶۷۸۹"
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
            <Typography variant="body2" sx={{color:'error.main', fontSize:10}}>{errors.phone?.message}</Typography>

            <TextField
              fullWidth
              sx={LabelPosition({gap:14})}
              label="رمز عبور"
              type="password"
              variant="outlined"
              margin="normal"
              error={errors.password?.message ? true : false}
              {...register('password')}
              placeholder="********"
              InputLabelProps={{ shrink: true }}
              inputProps={{ dir: "ltr" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{cursor:'pointer'}} onClick={()=>{setPasswordType(passwordType=='password' ? 'text' : 'password')}}>
                    {passwordType=='password' ? <VisibilityOffIcon fontSize="small" sx={{marginX:1,color:errors.password?.message && 'error.main'}} /> : <VisibilityIcon fontSize="small" sx={{marginX:1,color:errors.password?.message && 'error.main'}} /> }
                  </InputAdornment>
                ),
              }}
            />
            <Typography variant="body2" sx={{color:'error.main', fontSize:10}}>{errors.password?.message}</Typography>

            <Button
              fullWidth
              variant="contained"
              size="large"
              type='submit'
              sx={{ mt: 3, borderRadius: 2 }}
            >
              {isPending ? <CircularProgress sx={{color:"primary.contrastText"}} size="26px" thickness={5} /> : 'ورود'}
            </Button>
            </form>

            <Typography
              variant="body2"
              sx={{ textAlign: "center", mt: 2, fontSize:13, color: "gray.500" }}
            >
              هنوز ثبت‌نام نکرده‌اید؟{" "}
              <Link to="/signup" viewTransition>
                <span style={{color:'green'}}>ثبت‌نام کنید</span>
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
