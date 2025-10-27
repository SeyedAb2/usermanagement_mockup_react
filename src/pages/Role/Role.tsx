import {
  Box,
  Button,
  // MenuItem,
  TextField,
  Typography,
  // FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { useState } from "react";
// import { Dashboard, Settings, Group, ListAlt } from "@mui/icons-material";
import { LabelPosition } from "../../shared/utils/textFieldLabelStyleConfig";



// ✅ ولیدیشن
const schema = yup.object({
  roleName: yup.string().required("نام نقش الزامی است"),
  defaultMenu: yup.string().required("انتخاب منوی پیش‌فرض الزامی است"),
  description: yup.string().nullable(),
});

export default function AddRole() {
  const navigate = useNavigate();
  // const [menus] = useState([
  //   { id: "dashboard", title: "داشبورد عمومی", icon: <Dashboard />, desc: "dashboard" },
  //   { id: "users", title: "مدیریت کاربران", icon: <Group />, desc: "users" },
  //   { id: "roles", title: "مدیریت نقش‌ها", icon: <ListAlt />, desc: "roles" },
  //   { id: "settings", title: "تنظیمات سیستم", icon: <Settings />, desc: "settings" },
  // ]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = () => {
    console.log("Form Data:");

    // ✅ شبیه‌سازی موفقیت
    toast.success("نقش با موفقیت اضافه شد!");
    reset();
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <Box
      sx={{
        bgcolor: "#f5f5f5",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          bgcolor: "#fff",
          p: 4,
          borderRadius: "12px",
          width: "100%",
          maxWidth: 600,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", mb: 1, textAlign: "right" }}
        >
          افزودن نقش
        </Typography>

        {/* 🔹 نام نقش */}
        <Controller
          name="roleName"
          control={control}
          render={({ field }) => (
            <Box>
              <TextField
                {...field}
                label="نام نقش *"
                fullWidth
                error={!!errors.roleName}
                helperText={errors.roleName?.message}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    "& fieldset": { borderColor: "#ccc" },
                    "&:hover fieldset": { borderColor: "#085E42" },
                    "&.Mui-focused fieldset": { borderColor: "#085E42" },
                  },
                  ...LabelPosition({ right: 25, rightActive: 30 }),
                  
                }}
                InputLabelProps={{
                  sx: { right: 0, left: "auto" },
                }}
              />
            </Box>
          )}
        />

        {/* 🔹 منوی پیش‌فرض */}
        {/* <Controller
          name="defaultMenu"
          control={control}
          render={({ field }) => (
            <Box>
              <TextField
                {...field}
                select
                label="منوی پیش‌فرض *"
                fullWidth
                error={!!errors.defaultMenu}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    "& fieldset": { borderColor: "#ccc" },
                    "&:hover fieldset": { borderColor: "#085E42" },
                    "&.Mui-focused fieldset": { borderColor: "#085E42" },
                  },
                  ...LabelPosition({ right: 25, rightActive: 30 }),
                }}
                InputLabelProps={{
                  sx: { right: 0, left: "auto" },
                }}
              >
                {menus.map((menu) => (
                  <MenuItem
                    key={menu.id}
                    value={menu.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {menu.icon}
                      <Typography>{menu.title}</Typography>
                    </Box>
                    <Typography
                      sx={{ fontSize: "0.75rem", color: "#888", ml: 2 }}
                    >
                      {menu.desc}
                    </Typography>
                  </MenuItem>
                ))}
              </TextField>
              {errors.defaultMenu && (
                <FormHelperText error sx={{ textAlign: "right" }}>
                  {errors.defaultMenu?.message}
                </FormHelperText>
              )}
            </Box>
          )}
        /> */}

        {/* 🔹 توضیحات */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="توضیحات (اختیاری)"
              fullWidth
              multiline
              minRows={4}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  "& fieldset": { borderColor: "#ccc" },
                  "&:hover fieldset": { borderColor: "#085E42" },
                  "&.Mui-focused fieldset": { borderColor: "#085E42" },
                },
                ...LabelPosition({ right: 25, rightActive: 30 }),
              }}
              InputLabelProps={{
                sx: { right: 0, left: "auto" },
              }}
            />
          )}
        />

        {/* 🔹 دکمه ثبت */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: "#085E42",
              "&:hover": { bgcolor: "#064b35" },
              px: 4,
              py: 1.2,
              fontSize: "1rem",
              borderRadius: "8px",
            }}
          >
            ثبت
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
