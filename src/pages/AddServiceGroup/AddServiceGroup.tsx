// AddServiceGroup.jsx
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
// 0. 💾 داده‌های ساختگی (Mock Data) - میکروسرویس‌ها
// =================================================================

const mockMicroServices = [
  { id: 'shipping', name: 'Shipping' },
  { id: 'accounting', name: 'Accounting' },
  { id: 'slaughterhouse', name: 'Slaughterhouse' },
  { id: 'invoice', name: 'Invoice' },
  { id: 'usermanagement', name: 'User Management' },
  { id: 'financing', name: 'Financing' },
];


// =================================================================
// 1. ✅ ولیدیشن (Yup Schema) - گروه سرویس
// =================================================================
const serviceGroupSchema = yup.object({
  groupName: yup.string().required("نام گروه (انگلیسی) الزامی است"),
  groupPersianName: yup.string(),
  microServiceId: yup.string().oneOf(
      mockMicroServices.map(m => m.id), 
      "میکروسرویس انتخاب شده نامعتبر است"
  ).required("انتخاب میکروسرویس الزامی است"),
  description: yup.string().nullable(), // اختیاری
});


// =================================================================
// 2. 🚀 تعریف کامپوننت AddServiceGroup
// =================================================================
export default function AddServiceGroup() {
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(serviceGroupSchema),
    mode: "onChange",
    defaultValues: {
      groupName: "", 
      groupPersianName: "", 
      microServiceId: "", 
      description: "", 
    }
  });

  // 💡 تابع ارسال داده
  const onSubmit = () => {
    toast.success("گروه سرویس جدید با موفقیت اضافه شد!");
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
           افزودن گروه سرویس جدید
        </Typography>

        {/* 1. 🔹 نام گروه (انگلیسی - اجباری) */}
        <Controller
          name="groupName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="نام گروه (Group Name) *" 
              fullWidth
              error={!!errors.groupName}
              helperText={errors.groupName?.message}
              variant="outlined"
              sx={{...commonInputSx,'& .MuiInputBase-input':{textAlign:'left'}}}
            />
          )}
        />

        {/* 1. 🔹 نام گروه (انگلیسی - اجباری) */}
        <Controller
          name="groupPersianName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="نام فارسی گروه(اختیاری) " 
              fullWidth
              error={!!errors.groupPersianName}
              helperText={errors.groupPersianName?.message}
              variant="outlined"
              sx={{...commonInputSx}}
            />
          )}
        />
        
        {/* 2. 🔹 انتخاب میکروسرویس (اجباری - Single Select) */}
        <Controller
          name="microServiceId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="میکروسرویس مرتبط *"
              fullWidth
              error={!!errors.microServiceId}
              helperText={errors.microServiceId?.message}
              variant="outlined"
              sx={commonInputSx}
              // تنظیمات RTL برای Label در حالت انتخاب نشده
              InputLabelProps={{
                sx: { right: 0, left: "auto" },
              }}
            >
              <ListSubheader sx={{ textAlign: 'right', fontWeight: 'bold' }}>انتخاب میکروسرویس:</ListSubheader>
              {mockMicroServices.map((service) => (
                <MenuItem 
                  key={service.id} 
                  value={service.id} 
                  sx={{ justifyContent: 'flex-end', direction: 'ltr' }} // LTR برای نام انگلیسی
                >
                  {service.name}
                </MenuItem>
              ))}
            </TextField>
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
            ثبت گروه سرویس
          </Button>
        </Box>
      </Box>
    </Box>
  );
}