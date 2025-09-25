import * as  yup from 'yup'
import {
  Avatar, Box, Button, Card, IconButton, InputAdornment,
  Stack, TextField, Tooltip, Typography, Grid, 
  CircularProgress
} from "@mui/material";
import {
  CameraAltOutlined, Instagram, PlaceOutlined,
  Telegram, Twitter, SaveOutlined,
  Phone
} from "@mui/icons-material";
import { useAuthStore } from "../../../store/auth.store";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserInfoEditValidationSchema } from "../../../shared/validations/userSchema";
import { LabelPosition } from "../../../shared/utils/textFieldLabelStyleConfig";
import { toPersianDegit } from '../../../shared/utils/toPersianDigits';
import usePatchUser from '../../../shared/hooks/usePatchUser';
import { UserType } from '../../../shared/types';

type FormValues = yup.InferType<typeof UserInfoEditValidationSchema>;

export default function Info() {
  const user = useAuthStore(state=>state.getUser())
  const { setValue,watch, handleSubmit, register , formState : {errors}} = useForm({
    resolver: yupResolver(UserInfoEditValidationSchema),
    defaultValues:{
      name:user?.name,
      age:user?.age,
      description:user?.description,
      phone:user?.phone,
      type:user?.type,
      logo:user?.logo,
      address:user?.address,
      id:user?.id,
      social:{
        telegram:user?.social?.telegram,
        instagram:user?.social?.instagram,
        twitter:user?.social?.twitter,
      }
    }
  })
  const { isPending, mutate } = usePatchUser()
  const onLogoPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    // const url = URL.createObjectURL(f);
    // setValue('logo',url, { shouldDirty: true});
    setValue('logo',null, { shouldDirty: true});
  };

  const onSubmit = (data:FormValues)=>{
    mutate({...user,...data} as UserType)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 2, borderRadius: 3, boxShadow: 4 }}>
        <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>
          ویرایش حساب کاربری
        </Typography>

        <Stack direction="row" alignItems="center" sx={{ gap: 2, mb: 2 }}>
          <Box sx={{ position: "relative", width: 96, height: 96 }}>
            <Avatar src={watch('logo')??undefined} sx={{ width: 96, height: 96 }} />
            <Tooltip title="تغییر تصویر" disableInteractive>
              <IconButton
                component="label"
                size="small"
                aria-label="ویرایش تصویر"
                sx={{
                  position: "absolute",
                  bottom: -8,
                  left: -8,
                  bgcolor: "background.paper",
                  boxShadow: 2,
                  zIndex: 2,
                  "&:hover": { bgcolor: "background.paper" },
                }}
              >
                <CameraAltOutlined />
                <input type="file" accept="image/*" hidden onChange={onLogoPick} />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="body2" color="text.secondary">
            روی آیکون دوربین کلیک کنید تا عکس را تغییر دهید.
          </Typography>
        </Stack>

        <Grid container spacing={2} sx={{mt:5}}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth 
              label="نام و نام خانوادگی"  
              error={errors.name?.message ? true : false}
              {...register('name')}
              placeholder="مثال: مجتبی اکبری"
              sx={LabelPosition({right:10,rightActive:28})}    
              InputLabelProps={{ shrink: true }}
              inputProps={{ dir: "rtl" }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="سن"
              type="number"
              error={errors.age?.message ? true : false}
              {...register('age')}
              placeholder="مثال: ۲۵"
              sx={LabelPosition({right:10,rightActive:28})}    
              InputLabelProps={{ shrink: true }}
              inputProps={{ dir: "rtl" }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="شماره تلفن"
              error={errors.name?.message ? true : false}
              {...register('phone')}
              placeholder="مثال: ۹۱۲۳۴۵۶۷۸۹"
              sx={LabelPosition({right:10,rightActive:28})}    
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
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="آدرس"
              error={errors.address?.message ? true : false}
              {...register('address')}
              placeholder="مثال: بابل-خیابان ولیعصر"
              sx={LabelPosition({right:10,rightActive:28})}    
              InputLabelProps={{ shrink: true }}
              inputProps={{ dir: "rtl" }}
              InputProps={{ startAdornment: (<InputAdornment position="start"><PlaceOutlined /></InputAdornment>) }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="توصیف کاربر"
              multiline
              minRows={3}
              error={errors.description?.message ? true : false}
              {...register('description')}
              placeholder="مثال: من یک کشاورز هستم..."
              sx={LabelPosition({right:10,rightActive:28})}    
              InputLabelProps={{ shrink: true }}
              inputProps={{ dir: "rtl" }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="تلگرام"
              error={errors.social?.telegram?.message ? true : false}
              {...register('social.telegram')}
              placeholder="مثال: ایدی تلگرام"
              sx={LabelPosition({right:10,rightActive:28})}    
              InputLabelProps={{ shrink: true }}
              InputProps={{ startAdornment: (<InputAdornment position="start"><Telegram /></InputAdornment>) }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="اینستاگرام"
              error={errors.social?.instagram?.message ? true : false}
              {...register('social.instagram')}
              placeholder="مثال: ایدی اینستاگرام"
              sx={LabelPosition({right:10,rightActive:28})}    
              InputLabelProps={{ shrink: true }}
              InputProps={{ startAdornment: (<InputAdornment position="start"><Instagram /></InputAdornment>) }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="X (توییتر)"
              error={errors.social?.twitter?.message ? true : false}
              {...register('social.twitter')}
              placeholder="مثال: ایدی توییتر"
              sx={LabelPosition({right:10,rightActive:28})}    
              InputLabelProps={{ shrink: true }}
              InputProps={{ startAdornment: (<InputAdornment position="start"><Twitter /></InputAdornment>) }}
            />
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button variant="contained" type='submit' sx={{
            "& .MuiButton-startIcon": { ml: 1 },
          }}>
            {isPending ? <CircularProgress sx={{color:"primary.contrastText"}} size="26px" thickness={5} /> : 
                (<Box sx={{display:"flex"}}>
                  <SaveOutlined />
                  <Typography sx={{mr:1}}>اعمال تغییرات</Typography>
                </Box>)
              }
          </Button>
        </Stack>
      </Card>
    </form>
  );
}
