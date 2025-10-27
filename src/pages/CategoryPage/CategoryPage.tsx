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
// اگر نیازی به LabelPosition ندارید، می‌توانید آن را حذف کنید
import { LabelPosition } from "../../shared/utils/textFieldLabelStyleConfig"; 


// =================================================================
// 1. ✅ تعریف شمای ولیدیشن (Schema Validation)
// =================================================================
const schema = yup.object({
  // فیلد اجباری اول: نام گروه
  categoryName: yup.string().required("نام گروه الزامی است"),
  // فیلد اجباری دوم: Base Url (استفاده از ولیدیشن URL برای اطمینان بیشتر)
  projectRepoUrl: yup.string().url("فرمت آدرس معتبر نیست").required("Base Url الزامی است"),
  // فیلد اختیاری (مانند توضیحات در کامپوننت قبلی)
  description: yup.string().nullable(),
});

// =================================================================
// 2. 🚀 تعریف کامپوننت
// =================================================================
export default function CategoryPage() {
  const navigate = useNavigate();

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

    // ✅ شبیه‌سازی موفقیت
    toast.success("گروهبندی صفحه با موفقیت ثبت شد!");
    
    // پاک کردن فرم پس از ارسال موفق
    reset(); 
    
    // شبیه‌سازی انتقال کاربر به صفحه اصلی پس از ثبت
    setTimeout(() => navigate("/"), 1500); 
  };

  return (
    <Box
      sx={{
        // استایل پس‌زمینه
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
          // استایل باکس فرم
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
          ساخت گروهبندی صفحه
        </Typography>

        {/* 🔹 نام گروه(اجباری) */}
        <Controller
          name="categoryName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="نام گروه *" // عنوان فیلد
              fullWidth
              error={!!errors.categoryName}
              helperText={errors.categoryName?.message}
              variant="outlined"
              // استایل‌های شما حفظ شده‌اند
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
        
        {/* 🔹 Base Url (اجباری) */}
        <Controller
          name="projectRepoUrl"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Base Url *" // عنوان فیلد
              fullWidth
              error={!!errors.projectRepoUrl}
              helperText={errors.projectRepoUrl?.message}
              variant="outlined"
              // استایل‌های شما حفظ شده‌اند
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

        {/* 🔹 توضیحات (اختیاری) */}
        {/* فیلد اختیاری Description کاملاً شبیه به نمونه اصلی شماست */}
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
              // استایل دکمه شما حفظ شده است
              bgcolor: "#085E42",
              "&:hover": { bgcolor: "#064b35" },
              px: 4,
              py: 1.2,
              fontSize: "1rem",
              borderRadius: "8px",
            }}
          >
            ثبت گروهبندی
          </Button>
        </Box>
      </Box>
    </Box>
  );
}