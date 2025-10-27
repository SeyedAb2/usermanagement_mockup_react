// AddPage.jsx (نسخه اصلاح شده)
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Checkbox,
  ListItemText,
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

// 💡 برای استفاده در Multiple Select باید IDها را به عنوان مقدار در نظر بگیریم.
const mockSubPages = [
  { id: 1, name: "صفحه اصلی داشبورد", url: "/dashboard" },
  { id: 2, name: "گزارش کاربران", url: "/reports/users" },
  { id: 3, name: "فاکتورهای مالی", url: "/invoices" },
  { id: 4, name: "پنل تنظیمات", url: "/settings" },
];

const mockPageGroups = [
  { id: 'chickens', name: 'گروه مرغداران', baseUrl: '/chicken' },
  { id: 'transporters', name: 'گروه حمل و نقل', baseUrl: '/transporters' },
  { id: 'finance', name: 'گروه مالی و حسابداری', baseUrl: '/finance' },
  { id: 'admin', name: 'گروه ادمین سیستم', baseUrl: '/system' },
];

const mockServices = [
    { nameFa: 'ساخت اکانت کاربر', nameEn: 'CreateUser', method: 'POST' },
    { nameFa: 'مشاهده لیست کاربران', nameEn: 'GetUsersList', method: 'GET' },
    { nameFa: 'ویرایش حساب مالی', nameEn: 'UpdateCashAccount', method: 'PUT' },
    { nameFa: 'حذف سرویس دهنده', nameEn: 'DeleteServiceProvider', method: 'DELETE' },
    { nameFa: 'ارسال پیام اطلاع‌رسانی', nameEn: 'SendNotification', method: 'POST' },
    { nameFa: 'دریافت جزئیات سفارش', nameEn: 'GetOrderDetail', method: 'GET' },
    { nameFa: 'تایید نهایی فاکتور', nameEn: 'ConfirmInvoice', method: 'PATCH' },
    { nameFa: 'لغو تراکنش', nameEn: 'CancelTransaction', method: 'DELETE' },
];

// =================================================================
// 1. ✅ ولیدیشن (Yup Schema)
// =================================================================
const schema = yup.object({
  pageName: yup.string().required("نام صفحه الزامی است"),
  pageUrl: yup.string().required("آدرس صفحه (URL) الزامی است"), 
  description: yup.string().nullable(),
  // زیر صفحات: آرایه‌ای از IDها (انتخابی)
  subPages: yup.array().of(yup.number()).nullable(), 
  // گروه‌بندی صفحه: رشته‌ای از ID گروه (اجباری)
  pageGroup: yup.string().required("انتخاب گروه‌بندی صفحه الزامی است"),
  // دسترسی‌های سرویس: آرایه‌ای از نام‌های انگلیسی سرویس (اجباری)
  serviceAccesses: yup.array().of(yup.string()).min(1, "انتخاب حداقل یک دسترسی سرویس الزامی است").required("دسترسی‌های سرویس الزامی است"),
});



// =================================================================
// 2. 🚀 تعریف کامپوننت
// =================================================================
export default function AddPage() {
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
      subPages: [], 
      serviceAccesses: [],
    }
  });

  const onSubmit = () => {
    // console.log("Add Page Form Data:", data);
    toast.success("صفحه جدید با موفقیت اضافه شد!");
    reset();
    setTimeout(() => navigate("/"), 1500);
  };
  
  // 💡 استایل‌های مشترک برای TextField و Select برای یکپارچگی Label Position
  const commonInputSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        "& fieldset": { borderColor: "#ccc" },
        "&:hover fieldset": { borderColor: "#085E42" },
        "&.Mui-focused fieldset": { borderColor: "#085E42" },
    },
    ...LabelPosition({ right: 25, rightActive: 30 }),
    // برای SelectProps و InputLabelProps در TextField نیازی به تعیین right/left نیست
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
          ساخت صفحه جدید
        </Typography>

        {/* 1. 🔹 نام (اجباری) */}
        <Controller
          name="pageName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="نام صفحه *" 
              fullWidth
              error={!!errors.pageName}
              helperText={errors.pageName?.message}
              variant="outlined"
              sx={commonInputSx}
            />
          )}
        />

        {/* 2. 🔹 آدرس صفحه (اجباری) */}
        <Controller
          name="pageUrl"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="آدرس صفحه (URL) *" 
              fullWidth
              error={!!errors.pageUrl}
              helperText={errors.pageUrl?.message}
              variant="outlined"
              sx={commonInputSx}
            />
          )}
        />
        
        {/* 5. 🔹 گروه‌بندی صفحه (اجباری - Single Select) */}
        {/* استفاده از TextField با select برای حفظ استایل LabelPosition */}
        <Controller
          name="pageGroup"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="گروه‌بندی صفحه *"
              fullWidth
              error={!!errors.pageGroup}
              helperText={errors.pageGroup?.message}
              variant="outlined"
              sx={commonInputSx}
              // ✅ اضافه کردن InputLabelProps برای راست به چپ کردن Label در حالت انتخاب نشده
              InputLabelProps={{
                sx: { right: 0, left: "auto" },
              }}
            >
              <ListSubheader sx={{ textAlign: 'right', fontWeight: 'bold' }}>انتخاب گروه:</ListSubheader>
              {mockPageGroups.map((group) => (
                <MenuItem 
                  key={group.id} 
                  value={group.id} 
                  sx={{ flexDirection: 'column', alignItems: 'flex-start', p: 1, pr: 2 }}
                >
                  <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{group.name}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {group.baseUrl}
                  </Typography>
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* 6. 🔹 دسترسی‌های سرویس (اجباری - Multiple Select با چک‌باکس) */}
        {/* مشابه پیاده سازی فیلد "نقش" در کامپوننت AddPersonnel */}
        <Controller
          name="serviceAccesses"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              fullWidth
              label="دسترسی‌های سرویس *"
              error={!!errors.serviceAccesses}
              helperText={errors.serviceAccesses?.message}
              sx={commonInputSx}
              // ✅ اضافه کردن InputLabelProps برای راست به چپ کردن Label در حالت انتخاب نشده
              InputLabelProps={{
                sx: { right: 0, left: "auto" },
              }}
              // ✅ تنظیمات Multiple Select
              SelectProps={{
                multiple: true,
                // نمایش مقادیر انتخاب شده به صورت فارسی
                renderValue: (selected) => (selected as string[])
                  .map(id => mockServices.find(s => s.nameEn === id)?.nameFa || id)
                  .join(', '),
              }}
            >
              <ListSubheader sx={{ textAlign: 'right', fontWeight: 'bold' }}>انتخاب سرویس‌ها:</ListSubheader>
              {mockServices.map((service) => (
                <MenuItem key={service.nameEn} value={service.nameEn} sx={{ p: 1, pr: 2 }}>
                  <Checkbox checked={field.value.indexOf(service.nameEn) > -1} />
                  <ListItemText>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{service.nameFa}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{service.nameEn}</Typography>
                      </Box>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          ml: 2, 
                          fontWeight: 'bold',
                          color: 'white',
                          // تعیین رنگ بر اساس متد سرویس
                          bgcolor: service.method === 'GET' ? '#064b35' : service.method === 'POST' ? '#f57c00' : service.method === 'PUT' ? '#1976d2' : '#d32f2f',
                          p: '2px 6px',
                          borderRadius: '4px'
                        }}
                      >
                        {service.method}
                      </Typography>
                    </Box>
                  </ListItemText>
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        
        {/* 4. 🔹 زیر صفحات (اختیاری - Multiple Select با چک‌باکس) */}
        <Controller
          name="subPages"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              fullWidth
              label="زیر صفحات (اختیاری)"
              error={!!errors.subPages}
              helperText={errors.subPages?.message}
              sx={commonInputSx}
              // ✅ اضافه کردن InputLabelProps برای راست به چپ کردن Label در حالت انتخاب نشده
              InputLabelProps={{
                sx: { right: 0, left: "auto" },
              }}
              // ✅ تنظیمات Multiple Select
              SelectProps={{
                multiple: true,
                // نمایش مقادیر انتخاب شده به صورت فارسی
                renderValue: (selected) => (selected as number[])
                  .map(id => mockSubPages.find(p => p.id === id)?.name || id)
                  .join(', '),
              }}
            >
              <ListSubheader sx={{ textAlign: 'right', fontWeight: 'bold' }}>صفحات موجود:</ListSubheader>
              {mockSubPages.map((page) => (
                <MenuItem key={page.id} value={page.id} sx={{ p: 1, pr: 2 }}>
                  <Checkbox checked={field?.value!.indexOf(page.id) > -1} />
                  <ListItemText primary={page.name} secondary={page.url} sx={{ textAlign: 'right' }}/>
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
            ثبت صفحه
          </Button>
        </Box>
      </Box>
    </Box>
  );
}