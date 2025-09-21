import React, { useState } from "react";
import {
  Avatar, Box, Button, Card, IconButton, InputAdornment,
  Stack, TextField, Tooltip, Typography, Grid // v2 – استفاده با size={{}}
} from "@mui/material";
import {
  CameraAltOutlined, Instagram, PlaceOutlined,
  Telegram, Twitter, SaveOutlined
} from "@mui/icons-material";

const defaultUser = {
  name: "علی محمدی",
  age: 34,
  phone: "09901234567",
  address: "مازندران، بابل - گتاب",
  bio: "کشاورز با ۱۰ سال تجربه…",
  social: { telegram: "@alimohammadi", instagram: "@ali.mohammadi", x: "@ali_dev" },
  avatar: "https://i.pravatar.cc/150?img=13",
};

export default function Info() {
  const [name, setName] = useState(defaultUser.name);
  const [age, setAge] = useState<number | "">(defaultUser.age);
  const [phone, setPhone] = useState(defaultUser.phone);
  const [address, setAddress] = useState(defaultUser.address);
  const [bio, setBio] = useState(defaultUser.bio);
  const [telegram, setTelegram] = useState(defaultUser.social.telegram);
  const [instagram, setInstagram] = useState(defaultUser.social.instagram);
  const [x, setX] = useState(defaultUser.social.x);
  const [logoUrl, setLogoUrl] = useState(defaultUser.avatar);

  const onLogoPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setLogoUrl(url);
  };

  return (
    <Card sx={{ p: 2, borderRadius: 3, boxShadow: 4 }}>
      <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>
        ویرایش حساب کاربری
      </Typography>

      {/* آواتار + دکمه دوربین */}
      <Stack direction="row" alignItems="center" sx={{ gap: 2, mb: 2 }}>
        <Box sx={{ position: "relative", width: 96, height: 96 }}>
          <Avatar src={logoUrl} sx={{ width: 96, height: 96 }} />
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
                "&:hover": { bgcolor: "background.paper" }, // هاور آواتار روی دکمه اثر نگذارد
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

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField fullWidth label="نام و نام خانوادگی" value={name} onChange={(e) => setName(e.target.value)} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="سن"
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value) || "")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="شماره تماس"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start">+98</InputAdornment>) }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="آدرس"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><PlaceOutlined /></InputAdornment>) }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="توصیف کاربر"
            multiline
            minRows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </Grid>

        {/* شبکه‌های اجتماعی */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="تلگرام"
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><Telegram /></InputAdornment>) }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="اینستاگرام"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><Instagram /></InputAdornment>) }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="X (توییتر)"
            value={x}
            onChange={(e) => setX(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><Twitter /></InputAdornment>) }}
          />
        </Grid>
      </Grid>

      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button variant="contained" startIcon={<SaveOutlined />}>اعمال تغییرات</Button>
      </Stack>
    </Card>
  );
}
