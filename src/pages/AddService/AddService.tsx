// AddService.jsx (نسخه جدید)
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  ListSubheader,
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
// 0. 💾 داده‌های ساختگی (Mock Data)
// =================================================================

const mockServiceMethods = [
  { id: 'POST', name: 'POST', color: '#f57c00' }, // نارنجی
  { id: 'GET', name: 'GET', color: '#064b35' },   // سبز تیره
  { id: 'PUT', name: 'PUT', color: '#1976d2' },   // آبی
  { id: 'PATCH', name: 'PATCH', color: '#8e24aa' }, // بنفش
  { id: 'DELETE', name: 'DELETE', color: '#d32f2f' }, // قرمز
];


// =================================================================
// 1. ✅ ولیدیشن (Yup Schema)
// =================================================================
const schema = yup.object({
  serviceName: yup.string().required("نام سرویس (انگلیسی) الزامی است"),
  serviceFaName: yup.string().required("نام فارسی سرویس الزامی است"),
  description: yup.string().nullable(),
  serviceUrl: yup.string().required("آدرس سرویس الزامی است"), 
  serviceMethod: yup.string().oneOf(
      mockServiceMethods.map(m => m.id), 
      "متد سرویس نامعتبر است"
  ).required("متد سرویس الزامی است"),
  serviceCode: yup.string().required("کد سرویس الزامی است"),
});


// =================================================================
// 2. 🚀 تعریف کامپوننت
// =================================================================
export default function AddService() {
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      serviceName: "", 
      serviceFaName: "", 
      description: "", 
      serviceUrl: "", 
      serviceMethod: "", 
      serviceCode: "", 
    }
  });

  // 💡 این تابع در عمل داده‌های سرویس جدید را به API ارسال می‌کند.
  const onSubmit = () => {
    // console.log("Add Service Form Data:", data);
    toast.success("سرویس جدید با موفقیت اضافه شد!");
    reset();
    setTimeout(() => navigate("/"), 1500); // بازگشت به صفحه اصلی یا لیست سرویس‌ها
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
        direction: "rtl", // برای اطمینان از راست به چپ بودن کلی فرم
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
          ➕ افزودن سرویس جدید
        </Typography>

        {/* 1. 🔹 نام سرویس (انگلیسی - اجباری) */}
        <Controller
          name="serviceName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="نام سرویس (Service Name) *" 
              fullWidth
              error={!!errors.serviceName}
              helperText={errors.serviceName?.message}
              variant="outlined"
              sx={commonInputSx}
            />
          )}
        />
        
        {/* 2. 🔹 نام فارسی سرویس (اجباری) */}
        <Controller
          name="serviceFaName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="نام فارسی سرویس *" 
              fullWidth
              error={!!errors.serviceFaName}
              helperText={errors.serviceFaName?.message}
              variant="outlined"
              sx={commonInputSx}
            />
          )}
        />

        {/* 3. 🔹 آدرس سرویس (اجباری) */}
        <Controller
          name="serviceUrl"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="آدرس سرویس (URL) *" 
              fullWidth
              error={!!errors.serviceUrl}
              helperText={errors.serviceUrl?.message}
              variant="outlined"
              sx={commonInputSx}
            />
          )}
        />
        
        {/* 4. 🔹 کد سرویس (اجباری) */}
        <Controller
          name="serviceCode"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="کد سرویس (مثلا: 1001) *" 
              fullWidth
              error={!!errors.serviceCode}
              helperText={errors.serviceCode?.message}
              variant="outlined"
              sx={commonInputSx}
            />
          )}
        />

        {/* 5. 🔹 متد سرویس (اجباری - Single Select) */}
        <Controller
          name="serviceMethod"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="متد سرویس *"
              fullWidth
              error={!!errors.serviceMethod}
              helperText={errors.serviceMethod?.message}
              variant="outlined"
              sx={commonInputSx}
              // ✅ اضافه کردن InputLabelProps برای راست به چپ کردن Label در حالت انتخاب نشده
              InputLabelProps={{
                sx: { right: 0, left: "auto" },
              }}
            >
              <ListSubheader sx={{ textAlign: 'right', fontWeight: 'bold' }}>انتخاب متد:</ListSubheader>
              {mockServiceMethods.map((method) => (
                <MenuItem 
                  key={method.id} 
                  value={method.id} 
                  sx={{ justifyContent: 'flex-end' }}
                >
                  <Box
                    sx={{
                      fontWeight: 'bold', 
                      fontSize: '0.9rem', 
                      color: 'white',
                      bgcolor: method.color,
                      p: '2px 8px',
                      borderRadius: '4px'
                    }}
                  >
                    {method.name}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* 6. 🔹 توضیحات (اختیاری) */}
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
            ثبت سرویس
          </Button>
        </Box>
      </Box>
    </Box>
  );
}