import React, { useMemo, useState } from "react";
import {
  Box, Paper, Stepper, Step, StepLabel, Button, Typography, Grid,
  TextField, MenuItem, Checkbox, Stack, Radio, RadioGroup,
  FormControlLabel, Divider, List, ListItem, ListItemText as MListItemText,
  ListItemIcon, Chip, IconButton
} from "@mui/material";
import {
  PersonAddAlt, ArrowUpward, ArrowDownward,
  Home, Payments, People, Assessment, List as ListIcon,
  ReceiptLong, AccountBalance, LocalShipping, ShoppingCartCheckout, Dashboard, Image
} from "@mui/icons-material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip } from "@mui/material";
import DeleteForeverRounded from "@mui/icons-material/DeleteForeverRounded";
import { LabelPosition } from "../../shared/utils/textFieldLabelStyleConfig";

// -------------------------- انواع/ثابت‌ها --------------------------
type PersonnelForm = yup.InferType<typeof schema>;

const schema = yup.object({
  firstName: yup.string().required("نام الزامی است"),
  lastName: yup.string().required("نام خانوادگی الزامی است"),
  nationalCode: yup.string().required("کد ملی الزامی است"),
  phoneNumber: yup.string().required("شماره همراه الزامی است"),
  personnelCode: yup.string().required("کد پرسنلی الزامی است"),
  gender: yup.string().required("انتخاب جنسیت الزامی است"),
  role: yup.array().of(yup.string()).min(0).required(),
  serviceUnit: yup.string().required("انتخاب واحد خدمت الزامی است"),
  tafsiliCode: yup.string().required("شناسه تفصیلی الزامی است"),
  accountNumber: yup.string().notRequired().default(""),
  address: yup.string().notRequired().default(""),
  birthDate: yup.date().nullable().notRequired().default(null),
}).required();

// نقش‌ها
const ROLES = [
  "ترابری",
  "راننده",
  "حسابدار",
  "تنخواه",
  "خزانه دار",
  "مدیر مالی",
  "مدیر منابع انسانی",
  "مسئول خرید بازرگانی",
  "مرغدار",
  "معاون کشتارگاه",
  "مسئول واحد پرورش",
];

// منوهای نمونه برای هر نقش (قابل جایگزینی با API)
type RoleMenu = { id: string; titleFa: string; path: string };
const ROLE_MENUS: Record<string, RoleMenu[]> = {
  "ترابری": [
    { id: "transport-req", titleFa: "ثبت درخواست حمل", path: "/transport/requests" },
    { id: "transport-track", titleFa: "پیگیری حمل", path: "/transport/tracking" },
  ],
  "راننده": [
    { id: "driver-list", titleFa: "لیست رانندگان", path: "/drivers/list" },
    { id: "driver-performance", titleFa: "عملکرد رانندگان", path: "/drivers/performance" },
  ],
  "حسابدار": [
    { id: "acc-invoices", titleFa: "ثبت فاکتور", path: "/accounting/invoices" },
    { id: "acc-balance", titleFa: "تراز مالی", path: "/accounting/balance" },
  ],
  "تنخواه": [
    { id: "petty-list", titleFa: "لیست درخواست تنخواه", path: "/petty-cash/list" },
    { id: "petty-report", titleFa: "گزارش تنخواه", path: "/petty-cash/report" },
  ],
  "خزانه دار": [
    { id: "treasury-transfer", titleFa: "انتقال وجه", path: "/treasury/transfers" },
  ],
  "مدیر مالی": [
    { id: "finance-payments", titleFa: "پرداخت‌ها", path: "/finance/payments" },
    { id: "finance-budget", titleFa: "بودجه", path: "/finance/budget" },
  ],
  "مدیر منابع انسانی": [
    { id: "users", titleFa: "مدیریت کاربران", path: "/users/list" },
  ],
  "مسئول خرید بازرگانی": [
    { id: "logistics-vehicles", titleFa: "وسایل نقلیه", path: "/logistics/vehicles" },
  ],
  "مرغدار": [
    { id: "farm-dashboard", titleFa: "داشبورد پرورش", path: "/farm/dashboard/home" },
  ],
  "معاون کشتارگاه": [
    { id: "slaughter-approve", titleFa: "تأیید کشتار", path: "/slaughter/approve" },
  ],
  "مسئول واحد پرورش": [
    { id: "farm-submit", titleFa: "ارسال فرم پرورش", path: "/farm/dashboard/submit" },
  ],
};

// آیکون برای منوها
const getMenuIcon = (m: RoleMenu) => {
  const key = `${m.id} ${m.path}`.toLowerCase();
  if (key.includes("payment") || key.includes("finance")) return <Payments />;
  if (key.includes("invoice") || key.includes("receipt")) return <ReceiptLong />;
  if (key.includes("user") || key.includes("person")) return <People />;
  if (key.includes("balance") || key.includes("treasury") || key.includes("bank")) return <AccountBalance />;
  if (key.includes("vehicle") || key.includes("transport") || key.includes("driver")) return <LocalShipping />;
  if (key.includes("purchase") || key.includes("logistics")) return <ShoppingCartCheckout />;
  if (key.includes("report") || key.includes("performance") || key.includes("approve")) return <Assessment />;
  if (key.includes("list")) return <ListIcon />;
  if (key.includes("dashboard") || key.includes("home")) return <Dashboard />;
  return <Home />;
};

// -------------------------- کامپوننت اصلی استپری --------------------------
export default function AddPersonnelStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [personData, setPersonData] = useState<PersonnelForm | null>(null);

  // استپ ۲
  const [rolesOrder, setRolesOrder] = useState<string[]>([]); // نقش‌های انتخاب‌شده (ترتیب)
  const [roleSearch, setRoleSearch] = useState("");
  const [defaultMenuId, setDefaultMenuId] = useState<string>("");

  const mergedMenus = useMemo(() => {
    const acc: { id: string; titleFa: string; path: string; fromRole: string }[] = [];
    const seen = new Set<string>();
    rolesOrder.forEach((role) => {
      (ROLE_MENUS[role] || []).forEach((m) => {
        if (!seen.has(m.id)) {
          seen.add(m.id);
          acc.push({ ...m, fromRole: role });
        }
      });
    });
    return acc;
  }, [rolesOrder]);

  // -------------------------- استپ ۱ (همراه با آپلود تصویر) --------------------------
  const StepOneForm = () => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<PersonnelForm>({
      resolver: yupResolver(schema),
      defaultValues: {
        firstName: "",
        lastName: "",
        nationalCode: "",
        phoneNumber: "",
        personnelCode: "",
        gender: "",
        role: [],
        serviceUnit: "",
        accountNumber: "",
        tafsiliCode: "",
        address: "",
        birthDate: null,
      },
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) setPreviewImage(URL.createObjectURL(file));
    };

    const onSubmit: SubmitHandler<PersonnelForm> = (data) => {
      toast.success("اطلاعات پرسنلی ثبت موقت شد، برویم به تعیین نقش‌ها و منوها…");
      setPersonData(data);
      // در استپ ۲ انتخاب نقش انجام می‌شود؛ اینجا ترتیب اولیه خالی می‌ماند
      setRolesOrder([]);
      setActiveStep(1);
    };

    return (
      <Box sx={{ bgcolor: "#f4f4f4", minHeight: "100vh", py: 4, direction: "rtl" }}>
        <Paper sx={{ maxWidth: 1300, mx: "auto", p: 4, borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <Typography variant="h6" sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "flex-start", fontWeight: "bold", gap: 1, color: "#043d2b" }}>
            <PersonAddAlt />
            افزودن پرسنل
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3} alignItems="flex-start">
              {/* فرم سمت راست */}
              <Grid size={{xs:12,md:9}}>
                <Grid container spacing={2}>
                  {[
                    { name: "firstName", label: "نام *" },
                    { name: "lastName", label: "نام خانوادگی *" },
                    { name: "phoneNumber", label: "شماره همراه *" },
                    { name: "nationalCode", label: "کد ملی *" },
                    { name: "personnelCode", label: "کد پرسنلی *" },
                    { name: "tafsiliCode", label: "شناسه تفصیلی *" },
                    { name: "accountNumber", label: "شماره کارت/حساب" },
                  ].map((f) => (
                    <Grid size={{xs:12,md:6}} key={f.name}>
                      <Controller
                        name={f.name as keyof PersonnelForm}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            sx={{ ...LabelPosition({ right: 25, rightActive: 30 }) }}
                            label={f.label}
                            fullWidth
                            error={!!errors[f.name as keyof PersonnelForm]}
                            helperText={errors[f.name as keyof PersonnelForm]?.message}
                          />
                        )}
                      />
                    </Grid>
                  ))}

                  {/* جنسیت */}
                  <Grid size={{xs:12,md:6}}>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          sx={{ ...LabelPosition({ right: 25, rightActive: 30 }) }}
                          select
                          fullWidth
                          label="جنسیت *"
                          error={!!errors.gender}
                          helperText={errors.gender?.message}
                        >
                          <MenuItem value="مرد">مرد</MenuItem>
                          <MenuItem value="زن">زن</MenuItem>
                        </TextField>
                      )}
                    />
                  </Grid>

                  {/* واحد خدمت */}
                  <Grid size={{xs:12,md:6}}>
                    <Controller
                      name="serviceUnit"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          sx={{ ...LabelPosition({ right: 25, rightActive: 30 }) }}
                          select
                          fullWidth
                          label="واحد خدمت *"
                          error={!!errors.serviceUnit}
                          helperText={errors.serviceUnit?.message}
                        >
                          {["ترابری", "مالی", "پرورش", "MAMRP", "کشتارگاه", "مدیریت", "خزانه"].map((u) => (
                            <MenuItem key={u} value={u}>
                              {u}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  {/* تاریخ تولد */}
                  <Grid size={{xs:12,md:6}}>
                    <Controller
                      name="birthDate"
                      control={control}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                          <DatePicker
                            sx={{ ...LabelPosition({ right: 25, rightActive: 30 }) }}
                            label="تاریخ تولد"
                            value={field.value}
                            onChange={(v) => field.onChange(v)}
                            slotProps={{ textField: { fullWidth: true } }}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* آپلود تصویر سمت چپ */}
              <Grid size={{xs:12,md:3}}>
                <Paper
                  variant="outlined"
                  sx={{
                    height: "100%",
                    minHeight: 300,
                    borderRadius: "12px",
                    border: "2px dashed #bdbdbd",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 2,
                    textAlign: "center",
                    bgcolor: "#fdfdfd",
                  }}
                >
                  {previewImage ? (
                    <Box sx={{ position: "relative", width: "100%", height: 220, mb: 2, overflow: "hidden", borderRadius: "12px" }}>
                      <img
                        src={previewImage}
                        alt="Preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <Tooltip title="حذف تصویر" arrow>
                        <IconButton
                          onClick={() => setPreviewImage(null)}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            bgcolor: "error.main",
                            color: "#fff",
                            border: "2px solid #fff",
                            boxShadow: 3,
                            backdropFilter: "blur(2px)",
                            "&:hover": {
                              bgcolor: "error.dark",
                              transform: "scale(1.07)",
                              boxShadow: 4,
                            },
                            transition: "transform 120ms ease, box-shadow 120ms ease",
                          }}
                        >
                          <DeleteForeverRounded fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : (
                    <>
                      <Box
                        sx={{
                          width: 80, height: 80, borderRadius: "50%", bgcolor: "#E8F5E9", color: "#4CAF50",
                          display: "flex", alignItems: "center", justifyContent: "center", mb: 2,
                        }}
                      >
                        <Image fontSize="large" />
                      </Box>
                      <Typography fontWeight={500}>آپلود عکس پرسنلی</Typography>
                      <Typography fontSize="0.8rem" color="text.secondary" mb={2}>
                        پشتیبانی از WEBP, PNG, JPG
                      </Typography>
                    </>
                  )}

                  <Box display="flex" gap={2}>
                    <Button variant="contained" component="label" sx={{ bgcolor: "#085E42", "&:hover": { bgcolor: "#064b35" } }}>
                      دوربین
                      <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
                    </Button>
                    <Button variant="outlined" component="label" sx={{ borderColor: "#085E42", color: "#085E42", "&:hover": { borderColor: "#064b35", color: "#064b35" } }}>
                      گالری
                      <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* دکمه‌ها */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4, direction: "rtl" }}>
              <Button
                variant="outlined"
                sx={{ borderColor: "#888", color: "#444", px: 4, "&:hover": { borderColor: "#666" } }}
                onClick={() => reset()}
              >
                بازنشانی
              </Button>
              <Button type="submit" variant="contained" sx={{ bgcolor: "#085E42", px: 4, "&:hover": { bgcolor: "#064b35" } }}>
                ادامه
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    );
  };

  // -------------------------- استپ ۲ (انتخاب نقش در راست + ترتیب در وسط + منوها در چپ) --------------------------
  const StepTwoAccess = () => {
    // افزودن/حذف نقش از انتخاب‌شده‌ها
    const toggleRole = (role: string, checked: boolean) => {
      setRolesOrder((prev) => {
        if (checked) {
          if (prev.includes(role)) return prev;
          return [...prev, role]; // نقش جدید به انتهای لیست (کم‌اولویت‌تر)
        } else {
          const next = prev.filter((r) => r !== role);
          // اگر منوی پیش‌فرض متعلق به نقشی بود که حذف شد، همچنان در mergedMenus باقی می‌ماند
          // اما اگر اصلاً دیگر در mergedMenus نبود، پاکش می‌کنیم:
          setTimeout(() => {
            const stillExists = mergedMenus.some((m) => m.id === defaultMenuId);
            if (!stillExists) setDefaultMenuId("");
          }, 0);
          return next;
        }
      });
    };

    const move = (idx: number, dir: "up" | "down") => {
      setRolesOrder((prev) => {
        const next = [...prev];
        const swapWith = dir === "up" ? idx - 1 : idx + 1;
        if (swapWith < 0 || swapWith >= next.length) return prev;
        [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
        return next;
      });
    };

    const filteredAllRoles = useMemo(
      () => ROLES.filter((r) => r.includes(roleSearch.trim())),
      [roleSearch]
    );

    return (
      <Box sx={{ p: 2, direction: "rtl" }}>
        <Paper sx={{ maxWidth: 1300, mx: "auto", p: 3, borderRadius: 2, background: "#f3fbf6" }}>
          <Typography variant="h6" fontWeight={700} mb={1}>
            نقش‌ها و اولویت‌ها
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            از ستون راست نقش‌ها را جست‌وجو و انتخاب کن؛ در ستون وسط ترتیب‌شان را با فلش‌ها جابه‌جا کن؛ ستون چپ منوهای ترکیبیِ نقش‌های انتخاب‌شده را نشان می‌دهد.
          </Typography>

          <Grid container spacing={2}>
            

            


            {/* ستون وسط: نقش‌های انتخاب‌شده (قابلیت جابه‌جایی) */}
            <Grid size={{xs:12,md:3,lg:3}} order={{ xs: 2, md: 3 }}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography align="center" fontWeight={700} mb={1}>نقش‌های انتخاب‌شده</Typography>
                {rolesOrder.length === 0 ? (
                  <Typography color="text.secondary" align="center">هنوز نقشی انتخاب نشده.</Typography>
                ) : (
                  <Stack spacing={1}>
                    {rolesOrder.map((role, idx) => {
                      const isTop = idx === 0;
                      const isBottom = idx === rolesOrder.length - 1;
                      return (
                        <Box
                          key={role}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            border: "1px solid #e6efe9",
                            borderRadius: 1,
                            p: 1,
                            bgcolor: "#ffffff",
                          }}
                        >
                          <Typography>{role}</Typography>
                          <Stack direction="row" spacing={0.5}>
                            <IconButton size="small" disabled={isBottom} onClick={() => move(idx, "down")} sx={{ color: isBottom ? "text.disabled" : "#2e7d32" }}>
                              <ArrowDownward fontSize="small" />
                            </IconButton>
                            <IconButton size="small" disabled={isTop} onClick={() => move(idx, "up")} sx={{ color: isTop ? "text.disabled" : "#2e7d32" }}>
                              <ArrowUpward fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Box>
                      );
                    })}
                  </Stack>
                )}
              </Paper>
            </Grid>
            

            {/* ستون چپ: منوها */}
            <Grid size={{xs:12,md:6,lg:6}} order={{ xs: 3, md: 4 }}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography align="center" fontWeight={700} mb={1}>
                  منوها (بر اساس ترتیب نقش)
                </Typography>
                <Divider sx={{ my: 1 }} />
                {mergedMenus.length === 0 ? (
                  <Typography color="text.secondary">نقشی انتخاب نشده است.</Typography>
                ) : (
                  <RadioGroup value={defaultMenuId} onChange={(e) => setDefaultMenuId(e.target.value)}>
                    <List dense disablePadding>
                      {mergedMenus.map((m) => (
                        <ListItem key={m.id} sx={{ borderBottom: "1px solid #e6efe9", "&:last-of-type": { borderBottom: "none" } }}>
                          <ListItemIcon sx={{ minWidth: 36, color: "#085E42" }}>
                            {getMenuIcon(m)}
                          </ListItemIcon>
                          <MListItemText
                            primary={
                              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                <Typography fontWeight={700}>{m.titleFa}</Typography>
                                <Chip size="small" label={`از نقش: ${m.fromRole}`} sx={{ bgcolor: "#e8f5e9", color: "#2e7d32" }} />
                                <Typography variant="caption" color="text.secondary" dir="ltr">
                                  {m.path}
                                </Typography>
                              </Stack>
                            }
                          />
                          <FormControlLabel value={m.id} control={<Radio />} label="پیش‌فرض" sx={{ m: 0 }} />
                        </ListItem>
                      ))}
                    </List>
                  </RadioGroup>
                )}
              </Paper>
            </Grid>


            {/* ستون راست: تمام نقش‌ها + جست‌وجو + تیک انتخاب */}
            <Grid size={{xs:12,md:3,lg:3}} order={{ xs: 1, md: 1 }}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography align="center" fontWeight={700} mb={1}>همه نقش‌ها</Typography>
                <TextField
                  fullWidth
                  placeholder="جست‌وجو نقش…"
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <List dense>
                  {filteredAllRoles.map((r) => {
                    const checked = rolesOrder.includes(r);
                    return (
                      <ListItem
                        key={r}
                        sx={{
                          border: "1px solid #e6efe9",
                          borderRadius: 1,
                          mb: 1,
                          bgcolor: checked ? "#f0fff4" : "#fff",
                        }}
                        secondaryAction={
                          <Checkbox
                            edge="end"
                            checked={checked}
                            onChange={(e, v) => toggleRole(r, v)}
                          />
                        }
                      >
                        <MListItemText primary={r} />
                      </ListItem>
                    );
                  })}
                </List>
              </Paper>
            </Grid>
          </Grid>

          {/* اکشن‌ها */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button onClick={() => setActiveStep(0)}>بازگشت</Button>
            <Box sx={{display:'flex'}}>
              <Button sx={{mx:1}} variant="outlined" onClick={() => { setDefaultMenuId(""); toast.info("پیش‌فرض پاک شد"); }}>
                پاک‌کردن پیش‌فرض
              </Button>
              <Button
                variant="contained"
                sx={{ bgcolor: "#085E42", "&:hover": { bgcolor: "#064b35" } }}
                onClick={() => {
                  const payload = {
                    person: personData,
                    rolesOrder,
                    defaultMenuId,
                    menus: mergedMenus,
                  };
                  console.log("FINAL PAYLOAD:", payload);
                  toast.success("پرسنل و دسترسی‌ها آماده ثبت نهایی هستند.");
                }}
              >
                تایید نهایی
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    );
  };

  // -------------------------- رندر استپر + گام‌ها --------------------------
  return (
    <Box sx={{ direction: "ltr", p: 2 }}>
      <Box sx={{ maxWidth: 1300, mx: "auto", mb: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          <Step><StepLabel>اطلاعات پرسنلی</StepLabel></Step>
          <Step><StepLabel>انتخاب نقش‌ها، ترتیب و منوی پیش‌فرض</StepLabel></Step>
        </Stepper>
      </Box>

      {activeStep === 0 ? <StepOneForm /> : <StepTwoAccess />}
    </Box>
  );
}
