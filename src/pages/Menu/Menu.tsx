// Menu.tsx — دو مرحله‌ای + نمایش سرویس‌های صفحه و زیرصفحه‌ها

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
  Tooltip,
  Divider,
  List,
  Chip,
  useTheme,
  OutlinedInput,
  Select,
  InputLabel,
  FormControl,
  Grid,
  InputAdornment,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  Dashboard,
  People,
  Settings,
  Home,
  Assessment,
  ShoppingCart,
  BarChart,
  Notifications,
  Security,
  Build,
  HelpOutline,
  AccountCircle,
  Folder,
  ListAlt,
  Map,
  CalendarMonth,
  Message,
  AttachMoney,
  Category,
} from "@mui/icons-material";

import {
  useForm,
  Controller,
  useFieldArray,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMemo, useState } from "react";
import { LabelPosition } from "../../shared/utils/textFieldLabelStyleConfig";

// ======================= Types & Mock Data =======================

type HttpMethod = "POST" | "GET" | "PUT" | "DELETE" | "PATCH";

interface ServiceAccess {
  nameFa: string;      // مثل: افزودن کاربر
  nameEn: string;      // CreateUser
  method: HttpMethod;  // GET/POST/...
  description?: string;
}

interface SubPage {
  id: number;
  name: string;
  url: string;
  relatedServices?: ServiceAccess[]; // ممکن است خالی باشد
}

interface PageDetail {
  id: number;
  name: string;
  url: string;
  description: string;
  relatedServices?: ServiceAccess[]; // سرویس‌های موردنیاز صفحه
  subPages?: SubPage[];              // زیرصفحات با سرویس‌هایشان
}

interface MenuGroup {
  id: string;
  name: string;
}

const methodColors: Record<HttpMethod, string> = {
  POST: "#4CAF50",
  PUT: "#FFC107",
  DELETE: "#F44336",
  GET: "#2196F3",
  PATCH: "#009688",
};

// سرویس‌ها برای مثال
const S = {
  CreateUser: { nameFa: "افزودن کاربر", nameEn: "CreateUser", method: "POST" as const, description: "ایجاد کاربر جدید" },
  UpdateUser: { nameFa: "ویرایش کاربر", nameEn: "UpdateUser", method: "PUT" as const, description: "به‌روزرسانی اطلاعات کاربر" },
  DeleteUser: { nameFa: "حذف کاربر", nameEn: "DeleteUser", method: "DELETE" as const, description: "حذف حساب کاربری" },
  GetUsers:   { nameFa: "مشاهده کاربران", nameEn: "GetUsers", method: "GET" as const, description: "لیست کاربران" },
  GetInvoice: { nameFa: "مشاهده فاکتور", nameEn: "GetInvoice", method: "GET" as const, description: "نمایش فاکتور" },
  ConfirmInv: { nameFa: "تایید فاکتور", nameEn: "ConfirmInvoice", method: "PATCH" as const, description: "تایید نهایی" },
} satisfies Record<string, ServiceAccess>;

// صفحات با زیرصفحه و دسترسی‌ها (برخی زیرصفحه‌ها بدون دسترسی)
const mockPages: PageDetail[] = [
  {
    id: 101,
    name: "داشبورد مدیریت",
    url: "/admin/dashboard",
    description: "صفحه اصلی مدیریتی با آمار کلی سیستم.",
    relatedServices: [S.GetUsers], // خود صفحه فقط مشاهده کاربران را لازم دارد
    subPages: [
      {
        id: 1011,
        name: "گزارش روزانه",
        url: "/admin/daily",
        relatedServices: [S.GetUsers], // این زیرصفحه دسترسی دارد
      },
      {
        id: 1012,
        name: "اعلان‌ها",
        url: "/admin/notifications",
        relatedServices: [], // این یکی عمداً بدون دسترسی
      },
    ],
  },
  {
    id: 102,
    name: "مدیریت کاربران",
    url: "/user/list",
    description: "لیست کاربران و عملیات CRUD.",
    relatedServices: [S.GetUsers, S.CreateUser, S.UpdateUser, S.DeleteUser],
    subPages: [
      {
        id: 1021,
        name: "افزودن کاربر",
        url: "/user/create",
        relatedServices: [S.CreateUser],
      },
      {
        id: 1022,
        name: "ویرایش کاربر",
        url: "/user/edit",
        relatedServices: [S.UpdateUser],
      },
    ],
  },
  {
    id: 103,
    name: "فاکتورهای مالی",
    url: "/fin/invoices",
    description: "مشاهده و مدیریت فاکتورها.",
    relatedServices: [S.GetInvoice, S.ConfirmInv],
    subPages: [
      {
        id: 1031,
        name: "جزئیات فاکتور",
        url: "/fin/invoices/:id",
        relatedServices: [S.GetInvoice],
      },
    ],
  },
  {
    id: 104,
    name: "تنظیمات سیستمی",
    url: "/settings",
    description: "تنظیمات فنی و مدیریتی.",
    relatedServices: [],
    subPages: [],
  },
];

const initialMenuGroups: MenuGroup[] = [
  { id: "1", name: "ترابری" },
  { id: "2", name: "پرورش" },
  { id: "3", name: "کشتارگاه" },
  { id: "4", name: "مالی" },
  { id: "5", name: "مدیریت" },
];

const iconOptions = [
  { name: "Category", icon: <Category /> },
  { name: "Home", icon: <Home /> },
  { name: "ShoppingCart", icon: <ShoppingCart /> },
  { name: "Settings", icon: <Settings /> },
  { name: "People", icon: <People /> },
  { name: "Dashboard", icon: <Dashboard /> },
  { name: "Assessment", icon: <Assessment /> },
  { name: "BarChart", icon: <BarChart /> },
  { name: "Notifications", icon: <Notifications /> },
  { name: "Security", icon: <Security /> },
  { name: "Build", icon: <Build /> },
  { name: "HelpOutline", icon: <HelpOutline /> },
  { name: "AccountCircle", icon: <AccountCircle /> },
  { name: "Folder", icon: <Folder /> },
  { name: "ListAlt", icon: <ListAlt /> },
  { name: "Map", icon: <Map /> },
  { name: "CalendarMonth", icon: <CalendarMonth /> },
  { name: "Message", icon: <Message /> },
  { name: "AttachMoney", icon: <AttachMoney /> },
];

// ======================= Form Types & Schema =======================

interface FormValues {
  defaultName: string;
  menuNames: unknown[];  // باید اینجا به صورت صحیح تایپ شود
  description: string | null;
  menuGroups: string[];
  selectedIcon: string;
  selectedPageId: number | null;
}


const step1Schema = yup.object({
  defaultName: yup.string().required("نام پیش‌فرض الزامی است"),
  menuNames: yup
    .array()
    .of(yup.string().trim().required("نام منو نمی‌تواند خالی باشد"))
    .min(1, "حداقل یک نام منو لازم است")
    .required(),
  description: yup.string().nullable().defined(),
  menuGroups: yup.array().of(yup.string().required()).defined(),
  selectedIcon: yup.string().defined(), // اختیاری (اگر خواستی اجباری شود: .required(...))
}).required();

const step2Schema = yup.object({
  selectedPageId: yup
    .number()
    .nullable()
    .required("انتخاب صفحه برای منو الزامی است")
    .typeError("انتخاب صفحه الزامی است"),
}).required();

const combinedSchema = step1Schema.concat(step2Schema) as yup.ObjectSchema<FormValues>;
const steps = ["مرحله ۱: مشخصات اصلی و گروه منو", "مرحله ۲: انتخاب صفحه و پیش‌نمایش"];

// ============================ Component ============================

export default function Menu() {
  const navigate = useNavigate();
  const theme = useTheme();

  const [activeStep, setActiveStep] = useState(0);
  const [allMenuGroups] = useState<MenuGroup[]>(initialMenuGroups);
  const [pageSearch, setPageSearch] = useState("");
  const [iconSearch, setIconSearch] = useState("");

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    trigger,
    watch,
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(combinedSchema),
    mode: "onChange",
    defaultValues: {
      defaultName: "",
      menuNames: [""],
      description: "",
      menuGroups: [],
      selectedIcon: "",
      selectedPageId: null,
    },
  });

 const { fields, append, remove } = useFieldArray<FormValues>({
  control,
  name: "menuNames",  // تایپ را به درستی اعمال کنید
});

  const selectedPageId = watch("selectedPageId");
  const selectedIcon = watch("selectedIcon");

  // ---------- useMemo (بالا-سطحی و امن) ----------
  const filteredPages = useMemo(() => {
    const term = pageSearch.trim().toLowerCase();
    if (!term) return mockPages;
    return mockPages.filter((p) =>
      [p.name, p.url, p.description ?? ""].join(" ").toLowerCase().includes(term)
    );
  }, [pageSearch]);

  const selectedPageDetails = useMemo(
    () => mockPages.find((p) => p.id === selectedPageId),
    [selectedPageId]
  );

  const filteredIcons = useMemo(() => {
    const term = iconSearch.trim().toLowerCase();
    if (!term) return iconOptions;
    return iconOptions.filter((i) => i.name.toLowerCase().includes(term));
  }, [iconSearch]);

  // ---------- Step Navigation ----------
  const handleNext = async () => {
    const fieldsToValidate: Array<keyof FormValues> =
      activeStep === 0 ? ["defaultName", "menuNames"] : ["selectedPageId"];
    const ok = await trigger(fieldsToValidate);
    if (ok) setActiveStep((s) => s + 1);
    else toast.error("لطفاً فیلدهای اجباری مرحله جاری را پر کنید.");
  };
  const handleBack = () => setActiveStep((s) => s - 1);

  const onSubmit = (data: FormValues) => {
    console.log("Final Menu Data:", data);
    toast.success("منو با موفقیت ثبت شد!");
    reset();
    setTimeout(() => navigate("/"), 600);
  };

  // ---------- Styles ----------
  const commonInputSx = useMemo(
    () => ({
      mb: 3,
      "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        "& fieldset": { borderColor: "#ccc" },
        "&:hover fieldset": { borderColor: "#085E42" },
        "&.Mui-focused fieldset": { borderColor: "#085E42" },
      },
      ...LabelPosition({ right: 25, rightActive: 30 }),
    }),
    []
  );

  // ============================ Step 1 ============================
  const Step1 = () => {
    const selectedGroups = watch("menuGroups") || [];

    const renderSelectedGroups = (selected: unknown) => {
      const ids = Array.isArray(selected) ? selected : selected ? [selected] : [];
      return ids
        .map((id) => allMenuGroups.find((g) => g.id === id)?.name)
        .filter(Boolean)
        .join("، ");
    };

    return (
      <Grid container spacing={4} sx={{ textAlign: "right" }}>
        {/* نام پیش‌فرض */}
        <Grid size={{ xs: 12 }}>
          <Controller
            name="defaultName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="نام پیش‌فرض *"
                placeholder="نام پیش‌فرض…"
                fullWidth
                error={!!errors.defaultName}
                helperText={errors.defaultName?.message}
                sx={commonInputSx}
              />
            )}
          />
        </Grid>

        {/* نام‌های منو (لیستی) */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 1, fontWeight: "bold" }}>نام‌های منو</Typography>
          {fields.map((f, idx) => (
            <Box key={f.id} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Controller
                name={`menuNames.${idx}` as const}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    placeholder="نام منو…"
                    error={!!errors.menuNames?.[idx]}
                    helperText={errors.menuNames?.[idx]?.message as string | undefined}
                    sx={commonInputSx}
                    // onChange={(e) => update(idx, e.target.value)}
                  />
                )}
              />
              <IconButton
                aria-label="حذف"
                onClick={() => remove(idx)}
                disabled={fields.length === 1}
                size="small"
                
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            variant="text"
            onClick={() => append("")}
            startIcon={<AddCircleOutlineIcon />}
            sx={{ color: "#085E42", fontWeight: "bold", mt: -1, mb: 2 }}
          >
            &nbsp; افزودن نام جدید
          </Button>
        </Grid>

        {/* توضیحات اختیاری */}
        <Grid size={{ xs: 12 }}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="توضیحات "
                fullWidth
                multiline
                minRows={3}
                placeholder="..."
                sx={commonInputSx}
              />
            )}
          />
        </Grid>

        {/* گروه منو (چند انتخابی) - بالای آیکون */}
        <Grid size={{ xs: 12 }}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#085E42", mb: 2 }}>
            انتخاب گروه منو
          </Typography>
          <Controller
            name="menuGroups"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth sx={commonInputSx}>
                <InputLabel id="menu-group-multi-select-label">گروه‌های موجود</InputLabel>
                <Select
                  labelId="menu-group-multi-select-label"
                  multiple
                  value={field.value || []}
                  onChange={(e) => field.onChange(e.target.value)}
                  input={<OutlinedInput label="گروه‌های موجود" />}
                  renderValue={renderSelectedGroups}
                  MenuProps={{ PaperProps: { style: { maxHeight: 320 } } }}
                >
                  <ListSubheader sx={{ textAlign: "right", fontWeight: "bold" }}>
                    انتخاب از لیست گروه‌ها:
                  </ListSubheader>
                  {allMenuGroups.map((group) => (
                    <MenuItem key={group.id} value={group.id} sx={{ p: 1, pr: 2 }}>
                      <Checkbox checked={selectedGroups.includes(group.id)} />
                      <ListItemText primary={group.name} sx={{ textAlign: "right" }} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        {/* انتخاب آیکون (اختیاری) با سرچ */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: "#085E42", fontWeight: "bold" }}>
            انتخاب آیکون
          </Typography>

          <TextField
            placeholder="جستجوی آیکون…"
            fullWidth
            value={iconSearch}
            onChange={(e) => setIconSearch(e.target.value)}
            sx={{ ...commonInputSx, mt: 0, mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ ml: 0, mr: 2 }}>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Grid container spacing={2}>
            {filteredIcons.map((item) => (
              <Grid size={{ xs: 4, sm: 2 }} key={item.name}>
                <Box
                  onClick={() => setValue("selectedIcon", item.name, { shouldValidate: false })}
                  sx={{
                    cursor: "pointer",
                    borderRadius: "10px",
                    p: 2,
                    textAlign: "center",
                    border: selectedIcon === item.name ? "2px solid #085E42" : "1px solid #e0e0e0",
                    bgcolor: selectedIcon === item.name ? "#e8f5e9" : "transparent",
                    transition: "all 0.2s ease",
                    "&:hover": { borderColor: "#064b35" },
                  }}
                >
                  {item.icon}
                  <Typography sx={{ fontSize: "0.75rem", mt: 1 }}>{item.name}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    );
  };

  // ============================ Step 2 ============================
  const Step2 = () => {
    const renderServiceList = (services?: ServiceAccess[]) => {
      if (!services || services.length === 0) {
        return (
          <Typography variant="caption" color="text.disabled" sx={{ display: "block", textAlign: "right", mt: 1 }}>
            سرویس دسترسی مرتبطی تعریف نشده است.
          </Typography>
        );
      }
      return (
        <List dense disablePadding>
          {services.map((s) => (
            <Box
              key={s.nameEn}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderRight: `4px solid ${methodColors[s.method]}`,
                bgcolor: "#fff",
                borderRadius: "8px",
                px: 1.2,
                py: 0.6,
                mb: 0.6,
              }}
            >
              <Box sx={{ textAlign: "right", mr: 1 }}>
                <Typography fontSize="0.95rem" fontWeight="bold">{s.nameFa}</Typography>
                <Typography variant="caption" color="text.secondary">{s.description}</Typography>
              </Box>
              <Chip
                label={s.method}
                size="small"
                sx={{ bgcolor: methodColors[s.method], color: "white", fontWeight: "bold" }}
              />
            </Box>
          ))}
        </List>
      );
    };

    return (
      <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", md: "row" }, minHeight: 400 }}>
        {/* راست: انتخاب صفحه + سرچ */}
        <Box sx={{ flex: 1, minWidth: 250, display: "flex", flexDirection: "column", gap: 2, textAlign: "right" }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#085E42", mb: 1 }}>
            انتخاب صفحه منو *
          </Typography>

          <TextField
            placeholder="جستجو در صفحات (نام، URL، توضیحات)"
            fullWidth
            value={pageSearch}
            onChange={(e) => setPageSearch(e.target.value)}
            sx={{ ...commonInputSx, mt: 0, mb: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ ml: 1, mr: 0 }}>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Controller
            name="selectedPageId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.selectedPageId} sx={{ ...commonInputSx, mt: 0 }}>
                <InputLabel id="page-select-label">لیست صفحات موجود *</InputLabel>
                <Select
                  {...field}
                  labelId="page-select-label"
                  label="لیست صفحات موجود *"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  input={<OutlinedInput label="لیست صفحات موجود *" />}
                  MenuProps={{ PaperProps: { style: { maxHeight: 320 } } }}
                >
                  <ListSubheader sx={{ textAlign: "right", fontWeight: "bold" }}>
                    {pageSearch ? `نتایج جستجو (${filteredPages.length}):` : "تمام صفحات:"}
                  </ListSubheader>
                  {filteredPages.map((page) => (
                    <MenuItem key={page.id} value={page.id} sx={{ p: 1, pr: 2 }}>
                      <ListItemText primary={page.name} secondary={page.url} sx={{ textAlign: "right" }} />
                    </MenuItem>
                  ))}
                  {filteredPages.length === 0 && <MenuItem disabled>صفحه‌ای با این مشخصات یافت نشد.</MenuItem>}
                </Select>
                {errors.selectedPageId && (
                  <Typography color="error" variant="caption" sx={{ textAlign: "right", mt: 0.5 }}>
                    {errors.selectedPageId.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Box>

        {/* چپ: پیش‌نمایش صفحه انتخاب‌شده + سرویس‌ها و زیرصفحات با سرویس‌ها */}
        <Box sx={{ flex: 1, minWidth: 250, textAlign: "right" }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#085E42", mb: 2 }}>
            پیش‌نمایش مشخصات صفحه
          </Typography>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              minHeight: 300,
              overflowY: "auto",
              bgcolor: selectedPageDetails ? "#ffffff" : "#fafafa",
              borderRadius: "12px",
              border: selectedPageDetails ? "2px solid #085E42" : "2px dashed #ddd",
              transition: "all 0.3s ease",
            }}
          >
            {!selectedPageDetails ? (
              <Box sx={{ textAlign: "center", py: 5, color: "text.secondary" }}>
                <SearchIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="body1" fontWeight="bold">
                  صفحه‌ای انتخاب نشده است.
                </Typography>
                <Typography variant="caption">برای مشاهده جزئیات، لطفاً از لیست بالا یک صفحه انتخاب کنید.</Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ color: theme.palette.primary.main, borderBottom: "2px solid #eee", pb: 1, mb: 1 }}
                  >
                    {selectedPageDetails.name}
                  </Typography>
                  <Tooltip title="آدرس دسترسی صفحه">
                    <Typography variant="body2" color="text.secondary" sx={{ direction: "ltr", textAlign: "left", mb: 1 }}>
                      URL: <Box component="span" fontWeight="bold">{selectedPageDetails.url}</Box>
                    </Typography>
                  </Tooltip>
                  <Typography variant="body2" sx={{ mb: 2, bgcolor: "#f5f5f5", p: 1, borderRadius: "4px" }}>
                    <b>توضیحات:</b> {selectedPageDetails.description}
                  </Typography>
                </Grid>

                {/* سرویس‌های صفحه */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "#085E42", mb: 1 }}>
                    دسترسی‌های سرویس مورد نیاز
                  </Typography>
                  {renderServiceList(selectedPageDetails.relatedServices)}
                  <Divider sx={{ mt: 2 }} />
                </Grid>

                {/* زیرصفحات + سرویس‌هایشان */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "#085E42", mb: 1, mt: 1 }}>
                    زیر صفحات وابسته ({selectedPageDetails.subPages?.length || 0})
                  </Typography>

                  {selectedPageDetails.subPages && selectedPageDetails.subPages.length > 0 ? (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      {selectedPageDetails.subPages.map((sub) => (
                        <Paper
                          key={sub.id}
                          variant="outlined"
                          sx={{
                            p: 1.5,
                            borderRadius: "8px",
                            borderColor: "#d9d9d9",
                            bgcolor: "#F0FFF4",
                          }}
                        >
                          <Typography fontWeight="bold" sx={{ color: "#064b35" }}>
                            {sub.name}{" "}
                            <Typography component="span" variant="caption" color="text.secondary">
                              ({sub.url})
                            </Typography>
                          </Typography>

                          <Typography variant="body2" fontWeight="bold" sx={{ my: 2 }}>
                            دسترسی‌های سرویس این زیرصفحه:
                          </Typography>
                          {renderServiceList(sub.relatedServices)}
                        </Paper>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="caption" color="text.disabled" sx={{ display: "block", mt: 1 }}>
                      این صفحه زیر صفحه مستقیمی ندارد.
                    </Typography>
                  )}
                </Grid>
              </Grid>
            )}
          </Paper>
        </Box>
      </Box>
    );
  };

  const getStep = (s: number) => (s === 0 ? <Step1 /> : <Step2 />);

  // ============================== UI ==============================
  return (
    <Box
      sx={{
        bgcolor: "#f3f3f3",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        p: 3,
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          p: 4,
          borderRadius: "12px",
          width: "100%",
          maxWidth: 900,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, textAlign: "right", fontWeight: "bold", color: "#085E42" }}>
          افزودن منو
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4, direction: "ltr" }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel sx={{ "& .MuiStepLabel-label": { textAlign: "center" } }}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 470 }}>{getStep(activeStep)}</Box>

        <Box sx={{ display: "flex", flexDirection: "row", pt: 3, justifyContent: "space-between", borderTop: "1px solid #eee" }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowForwardIcon />}
            sx={{ mr: 1, fontWeight: "bold" }}
          >
            &nbsp;برگشت
          </Button>

          <Button
            variant="contained"
            onClick={activeStep === steps.length - 1 ? handleSubmit(onSubmit) : handleNext}
            sx={{ bgcolor: "#085E42", "&:hover": { bgcolor: "#064b35" }, fontWeight: "bold" }}
            endIcon={activeStep === steps.length - 1 ? undefined : <ArrowBackIcon />}
            type={activeStep === steps.length - 1 ? "submit" : "button"}
          >
            {activeStep === steps.length - 1 ? "ثبت نهایی منو" : "مرحله بعد"} &nbsp;
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
