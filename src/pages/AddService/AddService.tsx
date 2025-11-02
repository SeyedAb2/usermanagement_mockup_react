import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  ListSubheader,
} from "@mui/material";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react"; 
import { LabelPosition } from "../../shared/utils/textFieldLabelStyleConfig";

// =================================================================
// 0. 💾 داده‌های ساختگی (Mock Data)
// =================================================================

const mockServiceMethods: MethodOption[] = [
  { id: 'POST', name: 'POST', color: '#f57c00' }, 
  { id: 'GET', name: 'GET', color: '#064b35' },   
  { id: 'PUT', name: 'PUT', color: '#1976d2' },   
  { id: 'PATCH', name: 'PATCH', color: '#8e24aa' }, 
  { id: 'DELETE', name: 'DELETE', color: '#d32f2f' }, 
];

const mockMicroServices: MicroService[] = [
  { id: 'core', name: 'Core', faName: 'هسته سیستم', description: 'سرویس‌های اصلی و پایه‌ای' },
  { id: 'user', name: 'UserManagement', faName: 'مدیریت کاربران', description: 'احراز هویت و مجوزها' },
  { id: 'fin', name: 'Financing', faName: 'امور مالی', description: 'حسابداری و تراکنش‌ها' },
];

const mockServiceGroups: ServiceGroup[] = [
  // گروه‌های Core
  { id: 'action', microServiceId: 'core', name: 'Action', faName: 'عملیات سیستمی' },
  { id: 'bank', microServiceId: 'core', name: 'Bank', faName: 'بانک و امور بانکی' },
  { id: 'log', microServiceId: 'core', name: 'Logging', faName: 'ثبت وقایع' },
  // گروه‌های UserManagement
  { id: 'role', microServiceId: 'user', name: 'Role', faName: 'نقش‌های کاربری' },
];

// =================================================================
// 1. ✅ ولیدیشن (Yup Schema)
// =================================================================
const schema = yup.object({
  serviceName: yup.string().required("نام سرویس (انگلیسی) الزامی است"), 
  serviceFaName: yup.string().required("نام فارسی سرویس الزامی است"),   
  microServiceId: yup.string().oneOf(
    mockMicroServices.map(m => m.id), 
    "انتخاب میکروسرویس الزامی است"
  ).required("انتخاب میکروسرویس الزامی است"),
  serviceGroupId: yup.string().required("انتخاب گروه سرویس الزامی است"),
  serviceMethod: yup.string().oneOf(
      mockServiceMethods.map(m => m.id), 
      "متد سرویس نامعتبر است"
  ).required("متد سرویس الزامی است"),
  serviceUrl: yup.string().required("آدرس سرویس الزامی است"), 
  serviceCode: yup.string().required("کد سرویس الزامی است"),
  description: yup.string().nullable(),
});

type ServiceMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';
interface MethodOption {
  id: ServiceMethod;
  name: string;
  color: string;
}

interface MicroService {
  id: string;
  name: string;
  faName: string;
  description: string;
}

interface ServiceGroup {
  id: string;
  microServiceId: string;
  name: string;
  faName: string;
}

// interface FormValues {
//   serviceName: string;
//   serviceFaName: string;
//   microServiceId: string;
//   serviceGroupId: string;
//   serviceMethod: ServiceMethod;
//   serviceUrl: string;
//   serviceCode: string;
//   description: string | null;
// }

// =================================================================
// 2. 🚀 تعریف کامپوننت
// =================================================================
export default function AddService() {

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue, 
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      serviceName: "", 
      serviceFaName: "", 
      microServiceId: "",
      serviceGroupId: "",
      serviceMethod: undefined, // یا از یکی از متدهای معتبر مثل 'GET' استفاده کنید      serviceUrl: "", 
      serviceCode: "", 
      description: "", 
    }
  });

  const selectedMicroServiceId = useWatch({ control, name: "microServiceId" });
  const [filteredServiceGroups, setFilteredServiceGroups] = useState<ServiceGroup[]>([]);

  // 💡 فیلتر کردن گروه‌ها بر اساس میکروسرویس
  useEffect(() => {
    if (selectedMicroServiceId) {
      const filteredGroups = mockServiceGroups.filter(
        (group) => group.microServiceId === selectedMicroServiceId
      );
      setFilteredServiceGroups(filteredGroups);
      setValue('serviceGroupId', ''); // ریست کردن گروه پس از تغییر میکروسرویس
    } else {
      setFilteredServiceGroups([]);
      setValue('serviceGroupId', '');
    }
  }, [selectedMicroServiceId, setValue]);

  // 💡 تابع ارسال داده
  const onSubmit = () => {
    // console.log("Add Service Form Data:", data); 
    toast.success("سرویس جدید با موفقیت اضافه شد!");
    reset();
    // navigate("/services"); // مسیر دهی پس از موفقیت
  };
  
  // 💡 استایل‌های مشترک برای TextFieldها
  const commonInputSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        "& fieldset": { borderColor: "#ccc" },
        "&:hover fieldset": { borderColor: "#085E42" },
        "&.Mui-focused fieldset": { borderColor: "#085E42" },
    },
    ...LabelPosition({ right: 25, rightActive: 30 }), 
  };

  // 💡 تابع کمکی برای نمایش متن انتخاب شده در Select
  const renderSelectedValue = (value: string, mockData: (MicroService | ServiceGroup)[]) => {
    const item = mockData.find(m => m.id === value);
    if (!item) return null;

    // Type Guard: بررسی وجود پراپرتی 'description' در شیء
    const displayValue = 'description' in item ? item.description : item.faName;
    
    return (
      <Box 
        sx={{ 
          // ... (استایل‌ها)
          justifyContent: 'flex-start',
          paddingRight: '4px', 
          paddingLeft: '0',
        }}
      >
        <Typography component="span" sx={{ direction: 'rtl', fontWeight: 'bold' }}>
          {item.faName || displayValue} {/* استفاده از displayValue که شامل description یا faName است */}
        </Typography>
        <Typography component="span" sx={{ direction: 'ltr', ml: 1, mr: 0.5, color: '#085E42', fontWeight: 'bold' }}>
          ({item.name}) 
        </Typography>
      </Box>
    );
  };

  // 💡 استایل برای تراز کردن Select در حالت انتخاب شده (مهم برای رفع مشکل فاصله)
  const selectSx = {
    "& .MuiSelect-select": {
      paddingRight: '14px !important',
      textAlign: 'right',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      direction: 'rtl',
    },
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
          ➕ افزودن سرویس جدید
        </Typography>
        <Controller
          name="microServiceId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="انتخاب میکروسرویس *"
              fullWidth
              error={!!errors.microServiceId}
              helperText={errors.microServiceId?.message}
              variant="outlined"
              sx={{ 
                ...commonInputSx, 
                ...selectSx,
                ...(field.value && { 
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#085E42" },
                    "&.Mui-focused fieldset": { borderColor: "#085E42" } 
                  }
                })
              }}
              // 💡 راه حل: renderValue به SelectProps منتقل شد
              SelectProps={{
                renderValue: (value) => renderSelectedValue(value as string, mockMicroServices),
              }}
              // ❌ این خط حذف شد: renderValue={(value) => renderSelectedValue(value, mockMicroServices)}
            >
              <ListSubheader sx={{ textAlign: 'right', fontWeight: 'bold' }}>لیست میکروسرویس‌ها:</ListSubheader>
              {mockMicroServices.map((service) => (
                <MenuItem 
                  key={service.id} 
                  value={service.id} 
                  sx={{ justifyContent: 'space-between', direction: 'rtl' }}
                >
                  <Typography component="span" variant="caption" color="text.secondary">({service.faName || 'بدون نام فارسی'})</Typography>
                  <Typography component="span" sx={{ direction: 'ltr', fontWeight: 'bold' }}>{service.name}</Typography>
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="serviceGroupId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="انتخاب گروه سرویس *"
              fullWidth
              disabled={!selectedMicroServiceId}
              error={!!errors.serviceGroupId}
              helperText={errors.serviceGroupId?.message || (selectedMicroServiceId ? "" : "ابتدا میکروسرویس را انتخاب کنید.")}
              variant="outlined"
              sx={{
                ...commonInputSx,
                ...selectSx,
                ...(field.value && {
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#085E42", borderWidth: "2px" },
                    "&.Mui-focused fieldset": { borderColor: "#085E42", borderWidth: "2px" }
                  }
                })
              }}
              // ⭐️ اصلاح نهایی: انتقال renderValue به داخل SelectProps
              SelectProps={{
                renderValue: (value) => renderSelectedValue(value as string, filteredServiceGroups),
              }}
            >
              <ListSubheader sx={{ textAlign: 'right', fontWeight: 'bold' }}>
                گروه‌های مربوط به {mockMicroServices.find(m => m.id === selectedMicroServiceId)?.name || '...'}
              </ListSubheader>
              {filteredServiceGroups.map((group) => (
                <MenuItem
                  key={group.id}
                  value={group.id}
                  sx={{ justifyContent: 'space-between', direction: 'rtl' }}
                >
                  <Typography component="span" variant="caption" color="text.secondary">({group.faName || 'بدون نام فارسی'})</Typography>
                  <Typography component="span" sx={{ direction: 'ltr', fontWeight: 'bold' }}>{group.name}</Typography>
                </MenuItem>
              ))}
            </TextField>
          )}
        />

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
              sx={{...commonInputSx,'& .MuiInputBase-input':{textAlign:'left'}}}
            />
          )}
        />

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
              sx={{ ...commonInputSx, ...selectSx }}
              
              // ⭐️ اصلاحیه: انتقال renderValue به داخل SelectProps برای رفع خطای تایپ‌اسکریپت
              SelectProps={{
                renderValue: (value) => {
                  // 💡 تایپ value در اینجا به درستی unknown است، اما در زمان اجرا، رشته خواهد بود
                  const stringValue = typeof value === 'string' ? value : '';
                  const method = mockServiceMethods.find(m => m.id === stringValue);
                  return method ? (
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
                  ) : null;
                }
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
              sx={{...commonInputSx,'& .MuiInputBase-input':{textAlign:'left'}}}
            />
          )}
        />
        
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
              sx={{...commonInputSx,'& .MuiInputBase-input':{textAlign:'left'}}}
            />
          )}
        />

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
