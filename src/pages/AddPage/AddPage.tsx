// AddPage.tsx (نسخه نهایی با رفع قطعی خطای Multi-Select در Step 2 و بهبود ظاهر)

import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Checkbox,
  ListItemText,
  ListSubheader,
  Stepper,
  Step,
  StepLabel,
  Paper,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  OutlinedInput,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useMemo } from "react"; 
import { LabelPosition } from "../../shared/utils/textFieldLabelStyleConfig";

// 🚨 تابع جایگزین برای تنظیم موقعیت Label در RTL (بازگردانده شد و اعمال شد)

// پایان تابع LabelPosition

// =================================================================
// 0. 💾 داده‌های ساختگی (Mock Data) و Type Definitions
// =================================================================

interface SubPage {
  id: number;
  name: string;
  url: string;
  relatedServices?: Service[]; 
  description: string; 
}

interface PageGroup {
  id: string;
  name: string;
  baseUrl: string;
}

interface MicroService {
  id: string;
  nameEn: string;
  nameFa: string;
}

interface ServiceGroup {
  id: string;
  microServiceId: string;
  nameEn: string;
  nameFa: string;
}

interface Service {
  nameEn: string;
  nameFa: string;
  method: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
  microServiceId: string;
  serviceGroupId: string;
  description: string; 
}

interface FormValues {
  // Step 1
  pageName: string;
  pageUrl: string;
  pageCode: number | null; 
  description: string | null;
  pageGroup: string; 

  // Step 2 
  subPages: number[]; // 👈 باید در Schema به صورت required() باشد

  // Step 3 
  serviceAccesses: string[]; 

  // Step 4 
  uploadedImage: File | string | null; // 👈 باید در Schema به صورت mixed<...>().nullable().required() باشد
}

const methodColors: Record<Service['method'], string> = {
  'POST': '#4CAF50', 
  'PUT': '#FFC107', 
  'DELETE': '#F44336', 
  'GET': '#2196F3', 
  'PATCH': '#009688', 
};

// Mock Data
const mockServices: Service[] = [
  { nameFa: 'ساخت اکانت کاربر', nameEn: 'CreateUser', method: 'POST', microServiceId: 'core', serviceGroupId: 'action', description: 'ایجاد حساب کاربری جدید با سطح دسترسی پایه و ثبت در دیتابیس کاربران.' },
  { nameFa: 'مشاهده لیست کاربران', nameEn: 'GetUsersList', method: 'GET', microServiceId: 'core', serviceGroupId: 'action', description: 'دریافت لیست جامع کاربران با امکان فیلتر و جستجو در رول‌های مختلف.' },
  { nameFa: 'ثبت تراکنش بانکی', nameEn: 'SubmitTransaction', method: 'POST', microServiceId: 'core', serviceGroupId: 'bank', description: 'ثبت یک تراکنش مالی جدید در سیستم بانکی متصل به سامانه‌های شاپرک.' },
  { nameFa: 'ویرایش سطح دسترسی', nameEn: 'UpdateRole', method: 'PUT', microServiceId: 'user', serviceGroupId: 'role', description: 'ویرایش نقش و مجوزهای یک کاربر خاص بعد از احراز هویت مجدد.' },
  { nameFa: 'حذف نقش', nameEn: 'DeleteRole', method: 'DELETE', microServiceId: 'user', serviceGroupId: 'role', description: 'حذف یک نقش کاربری و جابجایی کاربران آن به نقش پیش‌فرض.' },
  { nameFa: 'تایید نهایی فاکتور', nameEn: 'ConfirmInvoice', method: 'PATCH', microServiceId: 'fin', serviceGroupId: 'invoice', description: 'تایید و صدور نهایی فاکتور برای مشتری و ارسال نوتیفیکیشن.' },
  { nameFa: 'مشاهده فاکتور', nameEn: 'GetInvoice', method: 'GET', microServiceId: 'fin', serviceGroupId: 'invoice', description: 'مشاهده جزئیات کامل یک فاکتور مالی با سوابق پرداخت.' },
];

const mockSubPages: SubPage[] = [
  { id: 1, name: "صفحه اصلی داشبورد", url: "/dashboard", description: "صفحه اصلی پلتفرم با خلاصه آمار و اطلاعات کلی سیستم." },
  { id: 2, name: "گزارش کاربران", url: "/reports/users", description: "گزارش‌های مفصل از فعالیت‌ها و وضعیت کاربران پلتفرم.", relatedServices: mockServices.filter(s => ['GetUsersList', 'UpdateRole', 'DeleteRole'].includes(s.nameEn)) }, 
  { id: 3, name: "فاکتورهای مالی", url: "/invoices", description: "مشاهده و مدیریت فاکتورهای صادر شده و دریافتی سیستم.", relatedServices: mockServices.filter(s => ['GetInvoice', 'ConfirmInvoice'].includes(s.nameEn)) }, 
  { id: 4, name: "پنل تنظیمات", url: "/settings", description: "تنظیمات فنی و مدیریتی پلتفرم برای ادمین‌ها.", relatedServices: mockServices.filter(s => ['UpdateRole'].includes(s.nameEn)) }, 
  { id: 5, name: "صفحه پنجم فرعی", url: "/subpage/five", description: "یک صفحه فرعی دیگر برای تست انتخاب چندگانه." },
  { id: 6, name: "مدیریت سرویس‌ها", url: "/service/manage", description: "صفحه مخصوص مدیریت کلیه سرویس‌ها.", relatedServices: mockServices.filter(s => ['CreateUser', 'SubmitTransaction'].includes(s.nameEn)) },
];

const mockPageGroups: PageGroup[] = [
  { id: 'chickens', name: 'گروه مرغداران', baseUrl: '/chicken' },
  { id: 'transporters', name: 'گروه حمل و نقل', baseUrl: '/transporters' },
];

const mockMicroServices: MicroService[] = [
  { id: 'core', nameEn: 'Core', nameFa: 'هسته سیستم' },
  { id: 'user', nameEn: 'UserManagement', nameFa: 'مدیریت کاربران' },
  { id: 'fin', nameEn: 'Financing', nameFa: 'امور مالی' },
];

const mockServiceGroups: ServiceGroup[] = [
  { id: 'action', microServiceId: 'core', nameEn: 'Action', nameFa: 'عملیات سیستمی' },
  { id: 'bank', microServiceId: 'core', nameEn: 'Bank', nameFa: 'بانک و امور بانکی' },
  { id: 'role', microServiceId: 'user', nameEn: 'Role', nameFa: 'نقش‌های کاربری' },
  { id: 'invoice', microServiceId: 'fin', nameEn: 'Invoice', nameFa: 'فاکتور و صورتحساب' },
];


// =================================================================
// 1. ✅ ولیدیشن (Yup Schema) - ۴ استپ
// =================================================================

const step1Schema = yup.object({
  pageName: yup.string().required("نام صفحه الزامی است"),
  pageUrl: yup.string().required("آدرس صفحه (URL) الزامی است"),

  // این فیلد اختیاری است اما می‌تواند null باشد
  pageCode: yup
    .number()
    .nullable()
    .transform((v, ov) => (ov === "" ? null : v))
    .typeError("کد صفحه باید عددی باشد")
    .defined(), // ❗️به‌جای required

  pageGroup: yup.string().required("انتخاب گروه‌بندی صفحه الزامی است"),

  // اختیاری و قابل null
  description: yup.string().nullable().defined(), // ❗️به‌جای required
}).required();

// Step 2 (زیر صفحات) نیازی به ولیدیشن اجباری ندارد

const step3Schema = yup.object({
  serviceAccesses: yup
    .array()
    .of(yup.string().required())
    .min(1, "انتخاب حداقل یک دسترسی سرویس الزامی است")
    .required("دسترسی‌های سرویس الزامی است"),
}).required();

const optionalStepsSchema = yup.object({
  subPages: yup.array().of(yup.number().required()).defined(),

  // قابل null و حضورش در فرم تعریف شده است
  uploadedImage: yup
    .mixed<File | string>()
    .nullable()
    .defined(), // ❗️به‌جای required
});

// Schema نهایی (ترکیب تمامی فیلدهای FormValues)
const combinedSchema = step1Schema
  .concat(step3Schema)
  .concat(optionalStepsSchema) as yup.ObjectSchema<FormValues>;

const steps = [
  'مرحله ۱: مشخصات پایه صفحه', 
  'مرحله ۲: تنظیم زیر صفحات وابسته', 
  'مرحله ۳: تنظیم دسترسی سرویس‌ها', 
  'مرحله ۴: پیش‌نمایش و بارگذاری عکس'
];


// =================================================================
// 2. 🚀 تعریف کامپوننت AddPage
// =================================================================

export default function AddPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); 
  
  // هوک‌های استپ ۳ (سرویس‌ها) در سطح بالا
  const [selectedMicroService, setSelectedMicroService] = useState<string>('');
  const [selectedServiceGroup, setSelectedServiceGroup] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>(''); 

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    setValue,
    trigger,
    watch, // 👈 اضافه شدن watch برای رندر مجدد در Step 2
  } = useForm<FormValues>({
    resolver: yupResolver(combinedSchema),
    mode: "onChange",
    defaultValues: {
      pageName: "",
      pageUrl: "",
      pageCode: null,
      description: null,
      subPages: [], 
      pageGroup: "",
      serviceAccesses: [],
      uploadedImage: null,
    }
  });


  // =================================================================
  // 2.1. 💡 منطق فیلترینگ (استفاده از useMemo در سطح بالا)
  // =================================================================
  
  // منطق فیلترینگ استپ ۳ (سرویس‌ها)
  const availableServiceGroups = useMemo(() => {
    return mockServiceGroups.filter(g => g.microServiceId === selectedMicroService);
  }, [selectedMicroService]);

  const availableServices = useMemo(() => {
    return mockServices.filter(s => 
      s.microServiceId === selectedMicroService && 
      s.serviceGroupId === selectedServiceGroup &&
      s.nameFa.includes(searchTerm)
    );
  }, [selectedMicroService, selectedServiceGroup, searchTerm]); 
  

  // =================================================================
  // 2.2. 💡 مدیریت استپر و ولیدیشن
  // =================================================================

  const handleNext = async () => {
    let fieldsToValidate: Array<keyof FormValues> = [];

    if (activeStep === 0) { // مرحله ۱: مشخصات پایه
      fieldsToValidate = ['pageName', 'pageUrl', 'pageGroup'];
    } else if (activeStep === 1) { // مرحله ۲: زیر صفحات (اختیاری است، بدون ولیدیشن پیش می‌رود)
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      return; 
    } else if (activeStep === 2) { // مرحله ۳: سرویس‌ها
      fieldsToValidate = ['serviceAccesses'];
    }
    // مرحله ۴ (پیش نمایش) نیازی به ولیدیشن ندارد

    if (fieldsToValidate.length > 0) {
      const isStepValid = await trigger(fieldsToValidate);
      if (isStepValid) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        toast.error("لطفاً فیلدهای اجباری مرحله جاری را پر کنید.");
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1); 
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinalSubmit = () => {
    // console.log("Final Form Data:", data);
    toast.success("صفحه جدید با موفقیت ثبت نهایی شد!");
    // reset();
    // setActiveStep(0);
    // setImagePreviewUrl(null);
    setTimeout(() => navigate("/"), 500);
  };


  // =================================================================
  // 2.3. 💡 استایل‌های مشترک
  // =================================================================
  
  const commonInputSx = useMemo(() => ({
    mb: 3, 
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        "& fieldset": { borderColor: "#ccc" },
        "&:hover fieldset": { borderColor: "#085E42" },
        "&.Mui-focused fieldset": { borderColor: "#085E42" },
    },
    // 🚨 اعمال LabelPosition روی تمامی فیلدها
    ...LabelPosition({ right: 25, rightActive: 30 }), 
  }), []);
  

  // =================================================================
  // 2.4. 💡 منطق CRUD سرویس (Step 3)
  // =================================================================

  const addService = (serviceNameEn: string) => {
    const currentAccesses = getValues('serviceAccesses');
    if (!currentAccesses.includes(serviceNameEn)) {
      setValue('serviceAccesses', [...currentAccesses, serviceNameEn], { shouldValidate: true });
      toast.info(`سرویس ${mockServices.find(s => s.nameEn === serviceNameEn)?.nameFa} افزوده شد.`);
    } else {
      toast.warn("این سرویس قبلاً انتخاب شده است.");
    }
  };

  const removeService = (serviceNameEn: string) => {
    const currentAccesses = getValues('serviceAccesses');
    setValue('serviceAccesses', currentAccesses.filter(name => name !== serviceNameEn), { shouldValidate: true });
    toast.error("سرویس حذف شد.");
  };

  // =================================================================
  // 2.5. 💡 رندرینگ استپ‌ها (اصلاح شده)
  // =================================================================
  
  // رندر Step 1 (مشخصات پایه)
  const renderStep1 = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Controller
        name="pageName"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="نام صفحه *" fullWidth error={!!errors.pageName} helperText={errors.pageName?.message} sx={commonInputSx}/>
        )}
      />
      <Controller
        name="pageUrl"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="آدرس صفحه (URL) *" fullWidth error={!!errors.pageUrl} helperText={errors.pageUrl?.message} sx={{...commonInputSx,'& .MuiInputBase-input':{textAlign:'left'}}}/>
        )}
      />
      <Controller
        name="pageCode"
        control={control}
        render={({ field }) => (
          <TextField 
            {...field} 
            label="کد صفحه (اختیاری)" 
            fullWidth 
            type="number"
            error={!!errors.pageCode} 
            helperText={errors.pageCode?.message} 
            sx={{...commonInputSx,'& .MuiInputBase-input':{textAlign:'left'}}}
            onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
            value={field.value === null ? '' : field.value}
          />
        )}
      />
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
            sx={commonInputSx}
          >
            <ListSubheader sx={{ textAlign: 'right', fontWeight: 'bold' }}>انتخاب گروه:</ListSubheader>
            {mockPageGroups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '100%' }}>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{group.name}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{group.baseUrl}</Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="توضیحات (اختیاری)" fullWidth multiline minRows={3} sx={commonInputSx}/>
        )}
      />
    </Box>
  );

  // 🚨 رندر Step 2 (انتخاب زیرصفحات با Multi-Select کاملاً اصلاح شده و پایدار)
  const renderStep2Subpages = () => {
    // 🚨 استفاده از watch برای رندر مجدد کامپوننت و آپدیت لیست سمت چپ بلافاصله
    const selectedSubpagesIds = watch('subPages') || [];
    
    // جزئیات زیرصفحات انتخاب شده
    const selectedSubPagesDetails = mockSubPages.filter(p => selectedSubpagesIds.includes(p.id));
    
    // 🚨 تابع برای تبدیل مقدار به آرایه اعداد
    const parseValueToNumberArray = (value: unknown): number[] => {
        if (!value) return [];
        // مطمئن می‌شویم که مقادیر به صورت آرایه هستند و به عدد تبدیل می‌شوند
        const arrayValue = Array.isArray(value) ? value : [value];
        return arrayValue
            .map(v => typeof v === 'string' ? parseInt(v, 10) : v)
            .filter(v => typeof v === 'number' && !isNaN(v)) as number[];
    };
    
    // 🚨 رندر مقادیر انتخاب شده در باکس ورودی
    const renderSelectedValue = (selected: unknown) => {
        const ids = parseValueToNumberArray(selected);
        return ids
            .map(id => mockSubPages.find(p => p.id === id)?.name)
            .filter(name => name) // فیلتر کردن مقادیر نامعتبر
            .join(', ');
    };

    return (
        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
            
            {/* بخش راست: انتخاب چند گزینه‌ای */}
            <Box sx={{ flex: 1, minWidth: 250, display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'right' }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#085E42', mb: 1 }}>
                    انتخاب زیر صفحات وابسته (اختیاری)
                </Typography>
                
                <Controller
                    name="subPages"
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth sx={{...commonInputSx, mt: 0}}>
                            <InputLabel id="subpage-multi-select-label" sx={{textAlign: 'right'}}>لیست صفحات موجود</InputLabel>
                            <Select
                                labelId="subpage-multi-select-label"
                                multiple // 👈 فعال شدن Multi-Select
                                value={field.value || []} // 👈 استفاده مستقیم از field.value
                                onChange={(e) => {
                                    // 🚨 تبدیل مقدار انتخاب شده (که رشته یا آرایه‌ای از رشته است) به آرایه‌ای از عدد
                                    const newNumberArray = parseValueToNumberArray(e.target.value);
                                    field.onChange(newNumberArray); // 👈 به‌روزرسانی React Hook Form
                                    // 🚨 دیگر نیازی به setValue مجدد نیست زیرا watch فعال است.
                                }}
                                input={<OutlinedInput label="لیست صفحات موجود" />}
                                renderValue={renderSelectedValue} // 👈 تابع رندر
                                MenuProps={{
                                    PaperProps: {
                                        style: { maxHeight: 300 },
                                    },
                                }}
                            >
                                <ListSubheader sx={{ textAlign: 'right', fontWeight: 'bold' }}>
                                    انتخاب از لیست زیر صفحات:
                                </ListSubheader>
                                {/* نمایش تمام زیر صفحات برای انتخاب */}
                                {mockSubPages.map((page) => (
                                    <MenuItem key={page.id} value={page.id} sx={{ p: 1, pr: 2 }}>
                                        {/* 🚨 چک کردن مقدار عددی در آرایه */}
                                        <Checkbox checked={selectedSubpagesIds.includes(page.id)} /> 
                                        <ListItemText primary={page.name} secondary={page.url} sx={{ textAlign: 'right' }}/>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                />
            </Box>

            {/* بخش چپ: لیست جزئیات زیرصفحات انتخاب شده (شامل دسترسی‌ها) */}
            <Box sx={{ flex: 1, minWidth: 250, textAlign: 'right' }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#085E42', mb: 2 }}>
                    جزئیات زیر صفحات انتخاب شده ({selectedSubPagesDetails.length})
                </Typography>
                <Paper 
                    elevation={1} 
                    sx={{ 
                        p: 2, 
                        maxHeight: 400, 
                        overflowY: 'auto', 
                        bgcolor: '#fafafa',
                        borderRadius: '10px' // 👈 بوردر ردیوس
                    }}
                >
                    {selectedSubPagesDetails.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                            زیر صفحه‌ای برای نمایش جزئیات انتخاب نشده است.
                        </Typography>
                    ) : (
                        selectedSubPagesDetails.map(page => (
                            <Box 
                                key={page.id} 
                                sx={{ 
                                    mb: 2, // 👈 فاصله عمودی بیشتر
                                    p: 2, // 👈 پدینگ کلی باکس
                                    border: '1px solid #eee', 
                                    borderRadius: '8px', // 👈 بوردر ردیوس
                                    bgcolor: 'white' 
                                }}
                            >
                                <Typography variant="body1" fontWeight="bold" color="#085E42" sx={{ mb: 0.5 }}>
                                    {page.name} <Typography component="span" variant="caption" color="text.secondary">({page.url})</Typography>
                                </Typography>
                                <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
                                    <Box component="span" fontWeight="bold">توضیحات:</Box> {page.description}
                                </Typography>
                                
                                {/* 🚨 نمایش دسترسی‌ها */}
                                <Typography variant="body2" fontWeight="bold" sx={{ my: 1 }}>دسترسی‌های مرتبط:</Typography>
                                <List dense disablePadding>
                                    {page.relatedServices && page.relatedServices.length > 0 ? (
                                        page.relatedServices.map(s => (
                                            <ListItem 
                                                key={s.nameEn} 
                                                sx={{ 
                                                    py: 0.5, 
                                                    px: 1, // 👈 پدینگ افقی
                                                    pr: 1, 
                                                    borderRight: `3px solid ${methodColors[s.method]}`, 
                                                    mb: '4px', // 👈 فاصله عمودی بین آیتم‌ها
                                                    bgcolor: '#f5f5f5',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    borderRadius: '4px' // 👈 بوردر ردیوس
                                                }}
                                            >
                                                <Box sx={{ textAlign: 'right', flexGrow: 1, ml: 1 }}>
                                                    <Typography fontSize="0.9rem" fontWeight="500">{s.nameFa}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{s.description.substring(0, 50)}...</Typography>
                                                </Box>
                                                <Chip 
                                                    label={s.method}
                                                    size="small"
                                                    sx={{ 
                                                        bgcolor: methodColors[s.method], 
                                                        color: 'white', fontWeight: 'bold', fontSize: '0.7rem' 
                                                    }}
                                                />
                                            </ListItem>
                                        ))
                                    ) : (
                                        <Typography variant="caption" color="text.disabled" display="block" sx={{ textAlign: 'right', mt: 1 }}>سرویس مرتبطی تعریف نشده است</Typography>
                                    )}
                                </List>
                                
                            </Box>
                        ))
                    )}
                </Paper>
            </Box>
        </Box>
    );
  }
  
  // رندر Step 3 (تنظیم دسترسی سرویس‌ها)
  const renderStep3Services = () => {
    const currentServiceAccesses = getValues('serviceAccesses');
    const selectedServicesDetails = mockServices.filter(s => currentServiceAccesses.includes(s.nameEn));
    

    return (
      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
        
        {/* بخش راست: انتخاب سرویس */}
        <Box sx={{ flex: 1, minWidth: 250, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#085E42', textAlign: 'right' }}>
            انتخاب و جستجوی دسترسی سرویس
          </Typography>

          {/* 1. انتخاب میکروسرویس */}
          <TextField
            select
            label="میکروسرویس *"
            fullWidth
            value={selectedMicroService}
            onChange={(e) => {
              setSelectedMicroService(e.target.value);
              setSelectedServiceGroup(''); 
              setSearchTerm(''); 
            }}
            sx={{  }}
          >
            {mockMicroServices.map(ms => (
              <MenuItem key={ms.id} value={ms.id}>{ms.nameFa} ({ms.nameEn})</MenuItem>
            ))}
          </TextField>

          {/* 2. انتخاب گروه سرویس (وابسته به میکروسرویس) */}
          <TextField
            select
            label="گروه سرویس *"
            fullWidth
            disabled={!selectedMicroService}
            value={selectedServiceGroup}
            onChange={(e) => {
              setSelectedServiceGroup(e.target.value);
              setSearchTerm(''); 
            }}
            helperText={!selectedMicroService ? "ابتدا میکروسرویس را انتخاب کنید" : ""}
            sx={{ ...commonInputSx, mb: 2 }}
          >
            {availableServiceGroups.map(sg => (
              <MenuItem key={sg.id} value={sg.id}>{sg.nameFa} ({sg.nameEn})</MenuItem>
            ))}
          </TextField>
          
          {/* 3. فیلد جستجو در سرویس‌ها */}
          <TextField
            label="جستجو در نام سرویس‌ها"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={!selectedServiceGroup}
            sx={{ ...commonInputSx, mb: 2 }}
          />

          {/* 4. لیست سرویس‌ها برای افزودن */}
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, textAlign: 'right' }}>
              سرویس‌های موجود در گروه:
            </Typography>
            <Paper elevation={1} sx={{ p: 1, maxHeight: 200, overflowY: 'auto', bgcolor: '#fafafa', borderRadius: '10px' }}>
              {availableServices.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                  {selectedServiceGroup ? "سرویسی یافت نشد یا گروه سرویس را انتخاب کنید." : "گروه سرویس را انتخاب کنید."}
                </Typography>
              ) : (
                <List disablePadding >
                  {availableServices.map(s => (
                    <Tooltip title={s.description} placement="left" key={s.nameEn}> 
                      <ListItem 
                        secondaryAction={
                          <Button 
                            size="small" 
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={() => addService(s.nameEn)} 
                            disabled={currentServiceAccesses.includes(s.nameEn)}
                            sx={{ minWidth: 80, fontSize: '0.75rem', ml: 1, p: '4px 8px' }}
                          >
                            &nbsp; افزودن
                          </Button>
                        }
                        sx={{ 
                            '&:hover': { bgcolor: '#e8f5e9' }, 
                            py: 0.5, 
                            borderRight: `4px solid ${methodColors[s.method]}`, 
                            mb: '2px', 
                            bgcolor: 'white',
                            borderRadius: '6px' // 👈 بوردر ردیوس
                        }} 
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '100%', ml: 1, }}>
                          <Typography fontWeight="bold" fontSize="0.9rem">{s.nameFa}</Typography>
                          <Typography variant="caption" color="text.secondary">{s.nameEn}</Typography>
                        </Box>
                        <Chip 
                          label={s.method}
                          size="small"
                          sx={{ 
                            bgcolor: methodColors[s.method],
                            color: 'white', fontWeight: 'bold', fontSize: '0.7rem' 
                          }}
                        />
                      </ListItem>
                    </Tooltip>
                  ))}
                </List>
              )}
            </Paper>
            
            {errors.serviceAccesses && (
              <Typography color="error" variant="caption" sx={{ textAlign: 'right', mt: 1 }}>
                {errors.serviceAccesses.message}
              </Typography>
            )}
          </Box>
        </Box>
        
        {/* بخش چپ: لیست سرویس‌های انتخابی و دسترسی‌های زیرصفحات */}
        <Box sx={{ flex: 1, minWidth: 250 }}>
          

          {/* لیست سرویس‌های انتخابی */}
          <Box sx={{ maxHeight: 300, overflowY: 'auto', p: 1, border: '1px solid #ddd', borderRadius: '10px', textAlign: 'right' }}>
            {selectedServicesDetails.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                هنوز سرویسی انتخاب نشده است.
              </Typography>
            ) : (
              selectedServicesDetails.map(service => {
                const microService = mockMicroServices.find(m => m.id === service.microServiceId);
                const group = mockServiceGroups.find(g => g.id === service.serviceGroupId);
                
                return (
                  <Tooltip title={service.description} placement="left" key={service.nameEn}>
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 1.5, mb: 1, 
                        borderRight: `4px solid ${methodColors[service.method]}`, 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        borderRadius: '6px'
                      }}
                    >
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography fontWeight="bold">{service.nameFa}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {group?.nameFa} ({microService?.nameFa})
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip 
                          label={service.method}
                          size="small"
                          sx={{ 
                            fontWeight: 'bold', 
                            color: 'white',
                            bgcolor: methodColors[service.method],
                            mr: 1 
                          }}
                        />
                        <IconButton size="small" color="error" onClick={() => removeService(service.nameEn)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Paper>
                  </Tooltip>
                );
              })
            )}
          </Box>
        </Box>
      </Box>
    );
  };
  

  
  // رندر Step 4 (پیش‌نمایش و بارگذاری تصویر)
  const renderStep4Preview = () => {
    const values = getValues();
    const groupDetails = mockPageGroups.find(g => g.id === values.pageGroup);
    // جزئیات کامل صفحات وابسته (گرفته شده از مرحله ۲)
    const selectedSubPagesDetails = mockSubPages.filter(p => values.subPages.includes(p.id)); 
    const selectedServiceDetails = mockServices.filter(s => values.serviceAccesses.includes(s.nameEn));

    // مدیریت آپلود عکس
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviewUrl(reader.result as string);
          setValue('uploadedImage', file, { shouldDirty: true });
        };
        reader.readAsDataURL(file);
      }
    };

    const handleImageDelete = () => {
      setImagePreviewUrl(null);
      setValue('uploadedImage', null, { shouldDirty: true });
    };

    return (
      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column' } }}>
        
        {/* بخش راست: پیش‌نمایش مشخصات و دسترسی‌ها */}
        <Box sx={{ flex: 1.5, minWidth: 300, textAlign: 'right' }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#085E42', mb: 2 }}>
            پیش‌نمایش مشخصات صفحه
          </Typography>
          <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: '10px' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: '#085E42' }}>{values.pageName || "نام صفحه نامشخص"}</Typography>
            <Typography variant="body2" color="text.secondary" dir="ltr" sx={{ textAlign: 'left' }}>{values.pageUrl}</Typography>
            <Divider sx={{ my: 2 }}/>
            <Typography variant="body2" sx={{ mb: 1 }}><b>گروه:</b> {groupDetails?.name || "ندارد"} | <b>کد صفحه:</b> {values.pageCode || "ندارد"}</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}><b>توضیحات:</b> {values.description || "توضیحاتی ثبت نشده است."}</Typography>

            {/* نمایش صفحات وابسته به صورت لیستی و با جزئیات کامل */}
            <Typography variant="body2" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>زیر صفحات وابسته (با سرویس‌های مجاز):</Typography>
            <List dense disablePadding sx={{ border: '1px solid #eee', borderRadius: '8px', bgcolor: '#f9f9f9' }}>
              {selectedSubPagesDetails.length > 0 ? (
                selectedSubPagesDetails.map(page => (
                  <ListItem key={page.id} sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 1, borderBottom: '1px solid #eee' }}>
                    <Typography variant="body2" fontWeight="bold" color="#085E42">
                      {page.name} <Typography component="span" variant="caption" color="text.secondary">({page.url})</Typography>
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5, justifyContent: 'flex-start', width: '100%' }}>
                      {page.relatedServices && page.relatedServices.length > 0 ? (
                        page.relatedServices.map(s => (
                          <Chip 
                            key={s.nameEn}
                            label={`${s.nameFa} (${s.method})`}
                            size="small"
                            sx={{ bgcolor: methodColors[s.method], color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }}
                          />
                        ))
                      ) : (
                        <Typography variant="caption" color="text.disabled">سرویس دسترسی وابسته ندارد</Typography>
                      )}
                    </Box>
                  </ListItem>
                ))
              ) : (
                <ListItem><ListItemText primary={<Typography variant="body2" textAlign="right" color="text.secondary">زیر صفحه وابسته‌ای انتخاب نشده است.</Typography>}/></ListItem>
              )}
            </List>
            
          </Paper>

          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#085E42', mb: 2 }}>
             پیش‌نمایش دسترسی سرویس‌ها ({selectedServiceDetails.length})
          </Typography>
          <Box sx={{ maxHeight: 200, overflowY: 'auto', p: 1, border: '1px solid #ddd', borderRadius: '10px', textAlign: 'right' }}>
            {selectedServiceDetails.length === 0 ? (
              <Typography variant="body2" color="error" textAlign="center" py={2}>
                **خطا:** هیچ دسترسی سرویسی انتخاب نشده است!
              </Typography>
            ) : (
              selectedServiceDetails.map(service => {
                const microService = mockMicroServices.find(m => m.id === service.microServiceId);
                const group = mockServiceGroups.find(g => g.id === service.serviceGroupId);
                return (
                  <Tooltip title={service.description} placement="left" key={service.nameEn}>
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 1, mb: 1, 
                        borderRight: `5px solid ${methodColors[service.method]}`, 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        bgcolor: '#fafafa',
                        borderRadius: '6px'
                      }}
                    >
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body1" fontWeight="bold">{service.nameFa}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {microService?.nameFa} / {group?.nameFa}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip 
                          label={service.method}
                          size="medium"
                          sx={{ 
                            fontWeight: 'bold', 
                            color: 'white',
                            bgcolor: methodColors[service.method],
                            mr: 1 
                          }}
                        />
                      </Box>
                    </Paper>
                  </Tooltip>
                );
              })
            )}
          </Box>
        </Box>
        
        {/* بخش چپ: بارگذاری تصویر */}
        <Box sx={{ flex: 1, minWidth: 250, textAlign: 'right' }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#085E42', mb: 2 }}>
            بارگذاری تصویر صفحه
          </Typography>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              minHeight: 250, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center',
              borderRadius: '10px',
              border: imagePreviewUrl ? 'none' : '2px dashed #ccc'
            }}
          >
            {imagePreviewUrl ? (
              <>
                <Box 
                  component="img" 
                  src={imagePreviewUrl} 
                  alt="Page Preview" 
                  onClick={() => setIsImageModalOpen(true)} 
                  sx={{ 
                    cursor: 'pointer',
                    maxHeight: 200, 
                    maxWidth: '100%', 
                    objectFit: 'contain', 
                    mb: 2, 
                    borderRadius: '8px',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'scale(1.02)' }
                  }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleImageDelete}
                >
                    &nbsp; حذف تصویر
                </Button>
              </>
            ) : (
              <>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  تصویری بارگذاری نشده است.
                </Typography>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload-button"
                  type="file"
                  onChange={handleImageUpload}
                />
                <label htmlFor="image-upload-button">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<AddCircleOutlineIcon />}
                    sx={{ bgcolor: '#085E42', '&:hover': { bgcolor: '#064b35' } }}
                  >
                    &nbsp;  انتخاب تصویر صفحه
                  </Button>
                </label>
              </>
            )}
          </Paper>
          
          {/* مودال نمایش تصویر بزرگ‌تر (Dialog) */}
          {imagePreviewUrl && (
            <Dialog 
              open={isImageModalOpen} 
              onClose={() => setIsImageModalOpen(false)} 
              maxWidth="md" 
              fullWidth
            >
              <DialogTitle sx={{ textAlign: 'right', fontWeight: 'bold' }}>
                پیش‌نمایش بزرگ‌تر تصویر صفحه
              </DialogTitle>
              <DialogContent>
                <Box 
                  component="img" 
                  src={imagePreviewUrl} 
                  alt="Page Preview Full" 
                  sx={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setIsImageModalOpen(false)} color="primary">
                  بستن
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </Box>
      </Box>
    );
  };
  
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderStep1();
      case 1:
        return renderStep2Subpages(); 
      case 2:
        return renderStep3Services(); 
      case 3:
        return renderStep4Preview(); 
      default:
        return <Typography>مراحل تکمیل شد</Typography>;
    }
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
        onSubmit={handleSubmit(handleFinalSubmit)}
        sx={{
          bgcolor: "#fff",
          p: 4,
          borderRadius: "12px",
          width: "100%",
          maxWidth: 900,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", textAlign: "right", color: '#085E42', mb: 2 }}
        >
          ایجاد صفحه جدید
        </Typography>

        {/* Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4, direction: 'ltr' }}> 
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel sx={{ '& .MuiStepLabel-label': { textAlign: 'center' } }}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* محتوای استپ */}
        <Box sx={{ minHeight: 450 }}>
          {getStepContent(activeStep)}
        </Box>

        {/* دکمه‌های کنترل استپر */}
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 3, justifyContent: 'space-between', borderTop: '1px solid #eee' }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowForwardIcon />}
            sx={{ mr: 1 }}
          >
            &nbsp;برگشت
          </Button>

          <Button
            variant="contained"
            onClick={activeStep === steps.length - 1 ? handleSubmit(handleFinalSubmit) : handleNext}
            sx={{ bgcolor: '#085E42', '&:hover': { bgcolor: '#064b35' } }}
            endIcon={activeStep === steps.length - 1 ? <SaveIcon /> : <ArrowBackIcon />}
          >
            {activeStep === steps.length - 1 ? 'ثبت نهایی' : 'ادامه'} &nbsp;
          </Button>
        </Box>

      </Box>
    </Box>
  );
}