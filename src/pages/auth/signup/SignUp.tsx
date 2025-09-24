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
import BadgeIcon from '@mui/icons-material/Badge';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState } from "react";
import { Link } from "react-router";
import {useForm} from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup";
import { DevTool } from '@hookform/devtools'

import logo from "../../../assets/images/logo.png";
import Seo from "../../../shared/components/seo/Seo";
import { toPersianDegit } from './../../../shared/utils/toPersianDigits';
import { LabelPosition } from "../../../shared/utils/textFieldLabelStyleConfig";
import { SignUpValidationSchema } from "../../../shared/validations/signupSchema";
import { UserType } from "../../../shared/types";
import useSignUp from "../../../shared/hooks/useSignup";
import { otherUserFields } from './../../../shared/utils/otherUserField';


export default function SignUp() {
  const defaultFields = otherUserFields
  const [passwordType, setPasswordType] = useState('password')
  const { isPending, mutate} = useSignUp()
  const {handleSubmit, control, register , formState : {errors}} = useForm({
    resolver: yupResolver(SignUpValidationSchema)
  })

  const onSubmit = (data:UserType)=>{
    mutate({...defaultFields,...data})
  }

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

            <form onSubmit={handleSubmit(onSubmit)}>  
              {/* نام و نام خانوادگی */}
              <TextField
                fullWidth
                sx={LabelPosition({gap:0})}
                label="نام و نام خانوادگی"
                type="text"
                error={errors.name?.message ? true : false}
                {...register('name')}
                variant="outlined"
                placeholder="مثال : مجتبی اکبری"
                margin="normal"
                InputLabelProps={{ shrink: true }}
                inputProps={{ dir: "rtl" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon fontSize="small" sx={{marginX:1, color:errors.name?.message && 'error.main'}} />
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="body2" sx={{color:'error.main', fontSize:10}}>{errors.name?.message}</Typography>

              <TextField
                fullWidth
                label="شماره تلفن"
                variant="outlined"
                margin="normal"
                error={errors.phone?.message ? true : false}
                {...register('phone')}
                placeholder="مثال: ۹۱۲۳۴۵۶۷۸۹"
                sx={LabelPosition({gap:10})}    
                InputLabelProps={{ shrink: true }}
                inputProps={{ dir: "ltr" }} 
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone fontSize="small" sx={{color:errors.name?.message && 'error.main'}}/>
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

              {/* رمز عبور */}
              <TextField
                fullWidth
                sx={LabelPosition({gap:14})}
                label="رمز عبور"
                type={passwordType}
                error={errors.password?.message ? true : false}
                {...register('password')}
                placeholder="************"
                variant="outlined"
                margin="normal"
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
                {isPending ? <CircularProgress sx={{color:"primary.contrastText"}} size="26px" thickness={5} /> : 'ثبت نام'}
              </Button>
              <DevTool control={control} />
            </form>

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
