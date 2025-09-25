import { useState } from "react";
import {
  Card, Grid, TextField, Checkbox, FormControlLabel,
  Stack, Button, Typography,
  CircularProgress,
  Box
} from "@mui/material";
import { KeyOutlined } from "@mui/icons-material";
import { LabelPosition } from "../../../shared/utils/textFieldLabelStyleConfig";
import { useForm } from "react-hook-form";
import { ResetPasswordValidationSchema } from "../../../shared/validations/resetPass.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserType } from "../../../shared/types";
import usePatchUser from "../../../shared/hooks/usePatchUser";
import { useAuthStore } from "../../../store/auth.store";

export default function ResetPass() {
  const { getUser } = useAuthStore() 
  const [show, setShow] = useState(false);
  const { isPending,mutate } = usePatchUser()
  const { handleSubmit, register , formState : {errors}} = useForm({
    resolver: yupResolver(ResetPasswordValidationSchema)
  })

  const onSubmit = (data:UserType)=>{
    mutate({...getUser(),...data})
  }

  return (
    <Card sx={{ p: 2, borderRadius: 3, boxShadow: 4 }}>
      <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>
        تغییر رمز عبور
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              sx={LabelPosition({rightActive:30,right:25})}
              fullWidth
              error={errors.password?.message ? true : false}
              {...register('password')}
              label="رمز جدید"
              type={show ? "text" : "password"}
              inputProps={{ dir: "rtl" }}
            />
            <Typography variant="body2" sx={{color:'error.main', mt:1, fontSize:10}}>{errors.password?.message}</Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              error={errors.confirmPassword?.message ? true : false}
              {...register('confirmPassword')}
              sx={LabelPosition({rightActive:30,right:26})}
              label="تکرار رمز جدید"
              type={show ? "text" : "password"}
            />
            <Typography variant="body2" sx={{color:'error.main', mt:1, fontSize:10}}>{errors.confirmPassword?.message}</Typography>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormControlLabel sx={{mr:-1}}
              control={<Checkbox checked={show} onChange={(e) => setShow(e.target.checked)} />}
              label="نمایش رمزها"
            />
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button type="submit" variant="contained">
          {isPending ? <CircularProgress sx={{color:"primary.contrastText"}} size="26px" thickness={5} /> : 
            (<Box sx={{display:"flex"}}>
              <KeyOutlined />
              <Typography sx={{mr:1}}>اعمال تغییرات</Typography>
            </Box>)
          }
            
          </Button>
        </Stack>
      </form>
    </Card>
  );
}
