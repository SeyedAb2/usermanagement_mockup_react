// AddMicroService.jsx
import {
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// فرض بر وجود این فایل
import { LabelPosition } from "../../shared/utils/textFieldLabelStyleConfig"; 


// =================================================================
// 1. ✅ ولیدیشن (Yup Schema) - میکروسرویس
// =================================================================
const microServiceSchema = yup.object({
  microServiceName: yup.string().required("نام میکروسرویس (انگلیسی) الزامی است"),
  microServiceFaName: yup.string().nullable(), // اختیاری
  description: yup.string().nullable(), // اختیاری
});


// =================================================================
// 2. 🚀 تعریف کامپوننت AddMicroService
// =================================================================
export default function AddMicroService() {
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(microServiceSchema),
    mode: "onChange",
    defaultValues: {
      microServiceName: "", 
      microServiceFaName: "", 
      description: "", 
    }
  });

  // 💡 تابع ارسال داده
  const onSubmit = () => {
    toast.success("میکروسرویس جدید با موفقیت اضافه شد!");
    reset();
    setTimeout(() => navigate("/"), 1500); // بازگشت به صفحه اصلی یا لیست
  };
  
  // 💡 استایل‌های مشترک برای TextField و Select برای یکپارچگی Label Position
  const commonInputSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        "& fieldset": { borderColor: "#ccc" },
        "&:hover fieldset": { borderColor: "#085E42" },
        "&.Mui-focused fieldset": { borderColor: "#085E42" },
    },
    // فرض بر این است که LabelPosition تابع استایل‌دهی RTL را اعمال می‌کند
    ...LabelPosition({ right: 25, rightActive: 30 }), 
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
        direction: "rtl",
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
           افزودن میکروسرویس جدید
        </Typography>

        {/* 1. 🔹 نام میکروسرویس (انگلیسی - اجباری) */}
        <Controller
          name="microServiceName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="نام میکروسرویس (MicroService Name) *" 
              fullWidth
              error={!!errors.microServiceName}
              helperText={errors.microServiceName?.message}
              variant="outlined"
              sx={{...commonInputSx,'& .MuiInputBase-input':{textAlign:'left'}}}
            />
          )}
        />
        
        {/* 2. 🔹 نام فارسی میکروسرویس (اختیاری) */}
        <Controller
          name="microServiceFaName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="نام فارسی میکروسرویس (اختیاری)" 
              fullWidth
              error={!!errors.microServiceFaName}
              helperText={errors.microServiceFaName?.message}
              variant="outlined"
              sx={commonInputSx}
            />
          )}
        />

        {/* 3. 🔹 توضیحات (اختیاری) */}
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
              sx={commonInputSx}
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
            ثبت میکروسرویس
          </Button>
        </Box>
      </Box>
    </Box>
  );
}