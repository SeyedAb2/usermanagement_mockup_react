import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import {
  ExpandMore,
  Search,
  Home,
  Add,
  ChevronLeft,
} from "@mui/icons-material";

import {
  Dashboard,
  People,
  LocalShipping,
  LocalMall,
  AccountBalanceWallet,
  Calculate,
  Paid,
  DirectionsCar,
  AccountBalance,
  BusinessCenter,
  Assignment,
  // آیکون‌های جدید برای دسته‌بندی‌ها
  Work, // برای مدیریتی
  AttachMoney, // برای مالی
  Build, // برای عملیاتی
  NotInterested, // برای ندارد/بدون دسته‌بندی
} from "@mui/icons-material";

import { useMemo, useState } from "react";
import DeleteConfirmModal from "../../components/access/DeleteConfirmModal";
import AddMenuCategoryModal from "../../components/menu/AddMenuCategoryModal";
import { LabelPosition } from "../../shared/utils/textFieldLabelStyleConfig";
import { useNavigate } from "react-router";

// فرض بر این است که LabelPosition از فایل دیگری import شده است



// ------------------ تایپ‌ها ------------------
type ServicePerm = { key: string; label: string; checked?: boolean };
type RoutePerm = { path: string; label: string; checked?: boolean };

// اصلاح نام تایپ برای جلوگیری از تداخل با کامپوننت MenuItem از MUI
type MenuItemType = { 
  id: string;
  group: string; // گروه‌بندی منو (برای سرچ)
  titleFa: string;
  titleEn: string;
  icon?: React.ReactNode;
  services: ServicePerm[];
  routes: RoutePerm[];
};

type UserMenuAccess = {
  id: string; // همان id منو
  priority: number;
  category?: string | null;
  defaultTitleFa: string; // نام‌پیش فرض اصلی
  defaultTitleEn: string;
  customTitleFa: string; // نامی که کاربر انتخاب کرده است (اگر انتخاب نکرده باشد، برابر با defaultTitleFa است)
  services: ServicePerm[];
  routes: RoutePerm[];
};

// ------------------ تعریف ساختار جدید دسته‌بندی‌ها به همراه آیکون ------------------

type CategoryData = {
    key: string; // مقدار اصلی برای ذخیره در state
    label: string; // نام نمایشی
    icon: React.ReactNode; // آیکون Material UI
};

const CATEGORIES_DATA: CategoryData[] = [
    { key: "ندارد", label: "ندارد", icon: <NotInterested color="disabled" /> },
    { key: "مدیریتی", label: "مدیریتی", icon: <Work color="primary" /> },
    { key: "مالی", label: "مالی", icon: <AttachMoney color="success" /> },
    { key: "عملیاتی", label: "عملیاتی", icon: <Build color="warning" /> },
];

const INIT_CATEGORIES = CATEGORIES_DATA.map(c => c.key);


// ------------------ داده‌های ساختگی ------------------

const MOCK_MENUS: MenuItemType[] = [
  {
    id: "dashboard",
    group: "داشبورد",
    titleFa: "داشبورد عمومی پرورش",
    titleEn: "farm/dashboard",
    icon: <Dashboard />,
    services: [
      { key: "submitActionService", label: "ثبت کاربران ترابری" },
      { key: "approveSlaughterService", label: "تأیید مدیر کشتارگاه" },
      { key: "approveSeniorService", label: "تایید مدیر ارشد" },
      { key: "deleteRequestService", label: "حذف درخواست توسط مدیر ارشد" },
    ],
    routes: [
      { path: "/farm/dashboard/submit", label: "ارسال فرم" },
      { path: "/farm/dashboard/home", label: "خانه داشبورد" },
    ],
  },
  {
    id: "users",
    group: "کاربران",
    titleFa: "مدیریت کاربران",
    titleEn: "users",
    icon: <People />,
    services: [
      { key: "userAdd", label: "افزودن کاربر" },
      { key: "userEdit", label: "ویرایش کاربر" },
      { key: "userDelete", label: "حذف کاربر" },
      { key: "userResetPassword", label: "بازنشانی رمز عبور" },
    ],
    routes: [
      { path: "/users/list", label: "لیست کاربران" },
      { path: "/users/create", label: "افزودن کاربر" },
      { path: "/users/roles", label: "نقش‌ها و سطح دسترسی" },
    ],
  },
  // ... (بقیه MOCK_MENUS برای حفظ حجم داده‌های ساختگی)
  {
    id: "transport",
    group: "ترابری",
    titleFa: "مدیریت ترابری",
    titleEn: "transport",
    icon: <LocalShipping />,
    services: [
      { key: "transportRequest", label: "ثبت درخواست حمل" },
      { key: "transportApprove", label: "تأیید حمل توسط مدیر" },
      { key: "transportCancel", label: "لغو درخواست حمل" },
    ],
    routes: [
      { path: "/transport/requests", label: "لیست درخواست‌ها" },
      { path: "/transport/tracking", label: "پیگیری حمل" },
    ],
  },
  {
    id: "logistics",
    group: "حمل و نقل",
    titleFa: "مدیریت حمل و نقل",
    titleEn: "logistics",
    icon: <LocalMall />,
    services: [
      { key: "vehicleAdd", label: "افزودن وسیله نقلیه" },
      { key: "routePlan", label: "برنامه‌ریزی مسیر" },
      { key: "fuelControl", label: "کنترل سوخت" },
    ],
    routes: [
      { path: "/logistics/vehicles", label: "وسایل نقلیه" },
      { path: "/logistics/routes", label: "مسیرها" },
    ],
  },
  {
    id: "pettyCash",
    group: "مالی",
    titleFa: "تنخواه گردان",
    titleEn: "petty-cash",
    icon: <AccountBalanceWallet />,
    services: [
      { key: "cashRequest", label: "درخواست تنخواه" },
      { key: "cashApprove", label: "تأیید پرداخت" },
      { key: "cashReport", label: "گزارش هزینه‌ها" },
    ],
    routes: [
      { path: "/petty-cash/list", label: "لیست درخواست‌ها" },
      { path: "/petty-cash/report", label: "گزارش تنخواه" },
    ],
  },
  {
    id: "accounting",
    group: "مالی",
    titleFa: "حسابداری",
    titleEn: "accounting",
    icon: <Calculate />,
    services: [
      { key: "invoiceRegister", label: "ثبت فاکتور" },
      { key: "balanceCheck", label: "بررسی تراز مالی" },
      { key: "expenseReport", label: "گزارش هزینه‌ها" },
    ],
    routes: [
      { path: "/accounting/invoices", label: "فاکتورها" },
      { path: "/accounting/balance", label: "تراز مالی" },
    ],
  },
  {
    id: "finance",
    group: "مالی",
    titleFa: "امور مالی",
    titleEn: "finance",
    icon: <Paid />,
    services: [
      { key: "paymentRequest", label: "درخواست پرداخت" },
      { key: "budgetControl", label: "کنترل بودجه" },
      { key: "salaryManagement", label: "مدیریت حقوق و دستمزد" },
    ],
    routes: [
      { path: "/finance/payments", label: "پرداخت‌ها" },
      { path: "/finance/budget", label: "بودجه‌ها" },
    ],
  },
  {
    id: "drivers",
    group: "منابع انسانی",
    titleFa: "مدیریت رانندگان",
    titleEn: "drivers",
    icon: <DirectionsCar />,
    services: [
      { key: "driverAdd", label: "افزودن راننده" },
      { key: "driverLicenseCheck", label: "بررسی مدارک راننده" },
      { key: "driverPerformance", label: "ارزیابی عملکرد راننده" },
    ],
    routes: [
      { path: "/drivers/list", label: "لیست رانندگان" },
      { path: "/drivers/performance", label: "عملکرد رانندگان" },
    ],
  },
  {
    id: "treasury",
    group: "مالی",
    titleFa: "خزانه‌داری",
    titleEn: "treasury",
    icon: <AccountBalance />,
    services: [
      { key: "fundTransfer", label: "انتقال وجه" },
      { key: "depositControl", label: "کنترل سپرده‌ها" },
      { key: "cashFlow", label: "گردش نقدی" },
    ],
    routes: [
      { path: "/treasury/transfers", label: "انتقال‌ها" },
      { path: "/treasury/overview", label: "نمای کلی خزانه" },
    ],
  },
  {
    id: "management",
    group: "سازمان",
    titleFa: "مدیریت کل",
    titleEn: "management",
    icon: <BusinessCenter />,
    services: [
      { key: "staffManage", label: "مدیریت پرسنل" },
      { key: "departmentControl", label: "کنترل واحدها" },
      { key: "reportAnalytics", label: "گزارشات و تحلیل‌ها" },
    ],
    routes: [
      { path: "/management/departments", label: "واحدها" },
      { path: "/management/reports", label: "گزارشات" },
    ],
  },
  {
    id: "deputy",
    group: "سازمان",
    titleFa: "معاونت‌ها",
    titleEn: "deputy",
    icon: <Assignment />,
    services: [
      { key: "assignProjects", label: "اختصاص پروژه‌ها" },
      { key: "reviewReports", label: "بررسی گزارشات" },
      { key: "approvalRequests", label: "تأیید درخواست‌ها" },
    ],
    routes: [
      { path: "/deputy/projects", label: "پروژه‌ها" },
      { path: "/deputy/reports", label: "گزارشات معاونت" },
    ],
  },
];

// فرض: لیست نام‌های منوی مجاز برای جایگزینی
const MENU_NAMES_OPTIONS = [
    "داشبورد عمومی پرورش",
    "مدیریت کاربران",
    "ترابری",
    "حسابداری",
    "امور مالی",
    "مدیریت کل",
];

export default function UserAccessManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<string[]>(INIT_CATEGORIES);
  const [resultsExpanded, setResultsExpanded] = useState<string | false>(false);
  const [editMenuId, setEditMenuId] = useState<string | null>(null); // ID منوی در حال ویرایش

  // ستون وسط: دسترسی‌های فعلی کاربر
  const [userAccess, setUserAccess] = useState<UserMenuAccess[]>([]);

  // مودال‌ها
  const [deleteOpen, setDeleteOpen] = useState<{
    open: boolean;
    id?: string;
  }>({ open: false });

  const [addCatOpen, setAddCatOpen] = useState(false);
  const [pendingCatSetter, setPendingCatSetter] = useState<
    ((val: string) => void) | null
  >(null);
  
  // ------------------ منطق‌های محاسباتی ------------------
  
  // ابزاری برای پیدا کردن آیکون و نام نمایشی بر اساس کلید دسته‌بندی
  const getCategoryDisplay = (key: string | null | undefined): { label: string, icon: React.ReactNode } => {
    // ابتدا در لیست داده‌های اصلی جستجو می‌کند
    const data = CATEGORIES_DATA.find(c => c.key === key);
    if (data) return data;
    
    // اگر کلید null/undefined/"" باشد، اطلاعات "ندارد" را برمی‌گرداند
    if (key === null || key === undefined || key === "" || key === "بدون دسته‌بندی") {
        return { label: "بدون دسته‌بندی", icon: <NotInterested color="disabled" /> };
    }
    
    // برای دسته‌بندی‌های اضافه شده در لحظه (که فقط کلیدشان در state وجود دارد)
    return { label: key, icon: <ChevronLeft color="inherit" /> };
  };


  const filteredMenus = useMemo(() => {
    const s = search.trim();
    if (!s) return MOCK_MENUS;
    return MOCK_MENUS.filter(
      (m) =>
        m.group.includes(s) ||
        m.titleFa.includes(s) ||
        m.titleEn.toLowerCase().includes(s.toLowerCase())
    );
  }, [search]);

  // دسترسی‌های مدیر واحد پرورش گروه‌بندی شده بر اساس دسته‌بندی برای پیش‌نمایش
  const { categorizedMenus, noCategoryMenus } = useMemo(() => {
    const map = new Map<string, UserMenuAccess[]>();
    
    // منوهای بدون دسته‌بندی/ندارد را جدا می‌کنیم
    const noCatMenus = userAccess
        .filter(m => !m.category || m.category === "ندارد")
        .sort((a, b) => a.priority - b.priority);

    // منوهای دسته‌بندی شده را گروه‌بندی می‌کنیم (فقط آن‌هایی که دسته‌بندی دارند و "ندارد" نیستند)
    userAccess
        .filter(m => m.category && m.category !== "ندارد")
        .forEach(m => {
            const cat = m.category as string;
            if (!map.has(cat)) map.set(cat, []);
            map.get(cat)!.push(m);
        });

    // مرتب‌سازی بر اساس اولویت
    map.forEach(menuList => menuList.sort((a, b) => a.priority - b.priority));

    const categorizedList = Array.from(map.entries()).sort(([a], [b]) => 
      a.localeCompare(b, 'fa') // مرتب‌سازی بر اساس نام دسته‌بندی
    );
    
    // بازگرداندن آیتم‌های دسته‌بندی شده و بدون دسته‌بندی به صورت جداگانه
    return { categorizedMenus: categorizedList, noCategoryMenus: noCatMenus };

  }, [userAccess]);
  
  // ------------------ هندلرهای رویداد ------------------

  const addMenuToAccess = (menu: MenuItemType) => {
    // اگر قبلاً اضافه شده بود، آن را برای ویرایش باز کن
    const exists = userAccess.find((x) => x.id === menu.id);
    if (exists) {
      setEditMenuId(menu.id);
      return;
    }
    const next: UserMenuAccess = {
      id: menu.id,
      priority: userAccess.length + 1,
      category: "ندارد", // کلید پیش‌فرض "ندارد"
      defaultTitleFa: menu.titleFa,
      defaultTitleEn: menu.titleEn,
      customTitleFa: menu.titleFa, // در ابتدا نام سفارشی همان ندارد است
      services: menu.services.map((s) => ({ ...s, checked: true })), // ندارد: همه فعال
      routes: menu.routes.map((r) => ({ ...r, checked: true })), // ندارد: همه فعال
    };
    setUserAccess((prev) => [...prev, next]);
    setEditMenuId(menu.id); // پس از افزودن، وارد حالت ویرایش شود
  };

  const handleEditChange = <K extends keyof UserMenuAccess>(menuId: string, k: K, v: UserMenuAccess[K]) => {
    setUserAccess((prev) =>
      prev.map((m) =>
        m.id === menuId
          ? { ...m, [k]: v }
          : m
      )
    );
  };

  const toggleService = (menuId: string, key: string) => {
    setUserAccess((prev) =>
      prev.map((m) =>
        m.id === menuId
          ? {
              ...m,
              services: m.services.map((s) =>
                s.key === key ? { ...s, checked: !s.checked } : s
              ),
            }
          : m
      )
    );
  };

  const toggleRoute = (menuId: string, path: string) => {
    setUserAccess((prev) =>
      prev.map((m) =>
        m.id === menuId
          ? {
              ...m,
              routes: m.routes.map((r) =>
                r.path === path ? { ...r, checked: !r.checked } : r
              ),
            }
          : m
      )
    );
  };

  const handleDelete = (id: string) => {
    setUserAccess((prev) => prev.filter((x) => x.id !== id));
    setDeleteOpen({ open: false, id: undefined });
    if (editMenuId === id) setEditMenuId(null);
  };
  
  const handleEditSave = () => {
    setEditMenuId(null); // بستن حالت ویرایش
  }

  // ------------------ رندرها ------------------

  // کامپوننت رندر فرم ویرایش داخل آکاردئون
  const EditFormContent = ({ m }: { m: UserMenuAccess }) => {
    const isEditing = editMenuId === m.id;
    
    // اگر در حال ویرایش نیست، فقط دسترسی‌ها را نمایش بده
    if (!isEditing) {
        //... (قسمت نمایش خلاصه دسترسی بدون تغییر)
        return (
            <AccordionDetails>
                <Typography fontWeight={700} mb={1}>
                    دسترسی سرویس‌ها
                </Typography>
                <Stack>
                    {m.services.filter(s => s.checked).length > 0 ? (
                        m.services.filter(s => s.checked).map((s) => (
                            <Typography key={s.key} variant="body2">
                                • {s.label}
                            </Typography>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            (سرویسی انتخاب نشده)
                        </Typography>
                    )}
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Typography fontWeight={700} mb={1}>
                    آدرس‌های داخلی
                </Typography>
                <Stack>
                    {m.routes.filter(r => r.checked).length > 0 ? (
                        m.routes.filter(r => r.checked).map((r) => (
                            <Typography key={r.path} variant="body2">
                                ↳ {r.label}
                                <Typography variant="caption" color="text.secondary" dir="ltr" ml={1}>
                                    {r.path}
                                </Typography>
                            </Typography>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            (آدرسی انتخاب نشده)
                        </Typography>
                    )}
                </Stack>
            </AccordionDetails>
        );
    }

    // در حالت ویرایش: فرم کامل
    return (
      <AccordionDetails>
        <Stack spacing={2} pb={2}>
          {/* 🔹 انتخاب نام منو */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              select
              sx={{ ...LabelPosition({ right: 25, rightActive: 30 }) }}
              label="انتخاب نام منو"
              fullWidth
              value={m.customTitleFa}
              onChange={(e) => handleEditChange(m.id, "customTitleFa", e.target.value)}
            >
                <MenuItem value={m.defaultTitleFa} disabled>
                    (نام‌پیش فرض: {m.defaultTitleFa})
                </MenuItem>
              {MENU_NAMES_OPTIONS.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </TextField>
            <IconButton
              color="success"
              sx={{
                bgcolor: "rgba(46, 125, 50, 0.1)",
                mx: 1,
                width: 40,
                height: 40,
                flexShrink: 0
              }}
              title="افزودن نام منو"
            >
              <Add />
            </IconButton>
          </Box>

          {/* 🔹 دسته‌بندی - با نمایش آیکون و حذف آیتم تکراری "بدون دسته‌بندی" */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              sx={{ ...LabelPosition({ right: 25, rightActive: 30 }) }}
              select
              label="انتخاب دسته‌بندی"
              fullWidth
              value={m.category || ""}
              onChange={(e) => handleEditChange(m.id, "category", e.target.value)}
            >
              {categories.map((cKey) => {
                const cInfo = getCategoryDisplay(cKey);
                // **حذف آیتم تکراری "بدون دسته‌بندی"** در اینجا اعمال شده است.
                // آیتم‌های INIT_CATEGORIES (شامل "ندارد") به صورت زیر نمایش داده می‌شوند:
                return (
                    <MenuItem 
                        key={cKey} 
                        value={cKey} 
                        sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1}}
                    >
                      {cInfo.icon}
                      {cInfo.label}
                    </MenuItem>
                );
              })}
              {/* آیتم تکراری (بدون دسته‌بندی) حذف شد. اگر کاربر دسته‌بندی را خالی کند، از طریق مقدار value="" ذخیره می‌شود. */}
            </TextField>
            <IconButton
              color="success"
              sx={{
                bgcolor: "rgba(46, 125, 50, 0.1)",
                mx: 1,
                width: 40,
                height: 40,
                flexShrink: 0
              }}
              title="افزودن دسته‌بندی"
              onClick={() => {
                setAddCatOpen(true);
                setPendingCatSetter(() => (val: string) => {
                    // ✅ رفع خطای سینتکسی: حذف پرانتز اضافی قبل از Array.from
                    setCategories((c) => Array.from(new Set([...c, val])));
                });
              }}
            >
              <Add />
            </IconButton>
          </Box>

          {/* 🔹 شماره اولویت */}
          <TextField
            sx={{ ...LabelPosition({ right: 25, rightActive: 30 }) }}
            type="number"
            label="اولویت (برحسب نقش)"
            fullWidth
            value={m.priority}
            onChange={(e) => handleEditChange(m.id, "priority", Number(e.target.value) || 1)}
          />

          {/* 🔹 دسترسی سرویس‌ها */}
          <Box p={2} component={Paper} variant="outlined" sx={{ borderColor: "#cfd8dc", bgcolor: "#fafafa", borderRadius: 2 }}>
            <Typography fontWeight={700} mb={1}>
              دسترسی سرویس‌ها
            </Typography>
            <Stack spacing={1}>
              {m.services.map((s) => (
                <FormControlLabel
                  key={s.key}
                  control={
                    <Checkbox
                      checked={!!s.checked}
                      onChange={() => toggleService(m.id, s.key)}
                    />
                  }
                  label={s.label}
                />
              ))}
            </Stack>
          </Box>

          {/* 🔹 آدرس‌های داخلی */}
          <Box p={2} component={Paper} variant="outlined" sx={{ borderColor: "#cfd8dc", bgcolor: "#fafafa", borderRadius: 2 }}>
            <Typography
              sx={{ color: "#2e7d32", fontWeight: 700, mb: 1.5, direction: "ltr" }}
            >
              /{m.defaultTitleEn}
            </Typography>
            <Stack spacing={1}>
              {m.routes.map((r) => (
                <FormControlLabel
                  key={r.path}
                  control={
                    <Checkbox
                      checked={!!r.checked}
                      onChange={() => toggleRoute(m.id, r.path)}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        color: "#2e7d32",
                        fontFamily: "monospace",
                        direction: "ltr",
                      }}
                    >
                      {r.path}
                    </Typography>
                  }
                />
              ))}
            </Stack>
          </Box>
        </Stack>
        {/* دکمه انصراف حذف شد، "ذخیره تغییرات" به "تأیید" تغییر نام یافت */}
        <Box sx={{display: 'flex', justifyContent: 'flex-end', gap: 1, pt:1}}>
            <Button size="small" variant="outlined" color="error" onClick={() => setDeleteOpen({ open: true, id: m.id })}>
                حذف
            </Button>
            <Button size="small" variant="contained" color="success" onClick={() => handleEditSave()}>
                تأیید
            </Button>
        </Box>
      </AccordionDetails>
    );
  };


  // ------------------ کامپوننت اصلی ------------------

  return (
    <Box sx={{ bgcolor: "#f5f7f6", minHeight: "100vh", p: 2, direction: "rtl" }}>
      {/* هدر کوچک مشخصات کاربر */}
      <Paper
        sx={{
          borderRadius: 2,
          p: 2,
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          {/* <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              bgcolor: "#e8f5e9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              color: "#085E42",
            }}
          >
            پ
          </Box> */}
          <Box >
            <Typography sx={{mx:1}} fontWeight={700}>مدیر واحد پرورش</Typography>
            <Typography sx={{mx:1}} variant="body2" color="text.secondary">
               شناسه: 10234
            </Typography>
          </Box>
        </Stack>

        <Box sx={{display:'flex',gap:1}}>
          <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 2}}>
              <Button
                  size="small"
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/')
                  }}
                  sx={{ bgcolor: "#085E42", "&:hover": { bgcolor: "#064b35" } }}
              >
                  تایید نهایی
              </Button>
          </Box>
        </Box>
      </Paper>

      {/* سه ستون */}
      <Grid container spacing={2}>
        {/* ستون راست: جستجو و نتایج (آکاردئون) - عرض 3 */}
        <Grid size={{xs:12,md:3}}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography fontWeight={700} mb={1}>
              فرم جست‌وجوی منو
            </Typography>
            <TextField
              fullWidth
              placeholder="جست‌وجوی گروه‌بندی منو، نام فارسی یا آدرس انگلیسی…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <Search sx={{ mr: 1 }} /> }}
            />
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
              {filteredMenus.map((m) => (
                <Accordion
                  key={m.id}
                  expanded={resultsExpanded === m.id}
                  onChange={(_, ex) => setResultsExpanded(ex ? m.id : false)}
                  slotProps={{
                    transition: { timeout: 200 },
                  }}
                  sx={{
                    borderRadius: 2,
                    "&:before": { display: "none" },
                    border: "1px solid #e5e7eb",
                  }}
                >
                  {/* دکمه "تأیید و افزودن" از اینجا حذف و به داخل AccordionDetails منتقل شد */}
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ width: "100%", justifyContent: "flex-start" }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <ListItemIcon sx={{ minWidth: 32 }}>{m.icon}</ListItemIcon>
                        <Box>
                          <Typography fontWeight={600}>{m.group}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {m.titleFa} — {m.titleEn}
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography fontWeight={700} mb={1}>
                      دسترسی سرویس‌ها (پیش‌نمایش)
                    </Typography>
                    <Stack>
                      {m.services.map((s) => (
                        <Typography key={s.key} variant="body2">• {s.label}</Typography>
                      ))}
                    </Stack>
                    <Divider sx={{ my: 2 }} />
                    <Typography fontWeight={700} mb={1}>
                      دسترسی آدرس‌های داخلی (پیش‌نمایش)
                    </Typography>
                    <Stack spacing={0.5}>
                      {m.routes.map((r) => (
                        <Typography key={r.path} variant="body2">
                            ↳ {r.label}
                            <Typography variant="caption" color="text.secondary" dir="rtl" ml={1}>
                                {r.path}
                            </Typography>
                        </Typography>
                      ))}
                    </Stack>
                    {/* دکمه "تأیید و افزودن" در انتهای محتوا قرار گرفت */}
                    <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 2}}>
                        <Button
                            size="small"
                            variant="contained"
                            onClick={(e) => {
                              e.stopPropagation();
                              addMenuToAccess(m);
                            }}
                            sx={{ bgcolor: "#085E42", "&:hover": { bgcolor: "#064b35" } }}
                        >
                            تأیید و افزودن
                        </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* ستون وسط: دسترسی‌های انتخاب‌شده کاربر (با امکان ویرایش درون خطی) - عرض 6 */}
        <Grid size={{xs:12,md:6}}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography fontWeight={700} mb={1}>
              دسترسی‌های مدیر واحد پرورش
            </Typography>
            {userAccess.length === 0 ? (
              <Typography color="text.secondary">هنوز چیزی انتخاب نشده است…</Typography>
            ) : (
              <Stack spacing={1}>
                {userAccess.map((m) => {
                  const isEditing = editMenuId === m.id;
                  const categoryInfo = getCategoryDisplay(m.category);
                  
                  // عنوان آکاردئون
                  const title = (
                    <Box sx={{display:'flex',gap:1,alignItems:'center'}}>
                      {m.customTitleFa}
                      {(m.defaultTitleFa != m.customTitleFa) && (<Typography variant="body2" style={{ fontSize: '0.65rem', fontWeight: 'lighter', color: 'gray' }}>
                        ({m.defaultTitleFa})
                      </Typography>)}
                      
                    </Box>
                  );
                  
                  return (
                    <Accordion
                      key={m.id}
                      expanded={isEditing} // فقط زمانی باز باشد که در حال ویرایش است
                      onChange={(_, ex) => setEditMenuId(ex ? m.id : null)}
                      sx={{
                        borderRadius: 2,
                        "&:before": { display: "none" },
                        border: isEditing ? "2px solid #2e7d32" : "1px solid #d1e7dd",
                        bgcolor: isEditing ? "#e8f5e9" : "#f1f8f5",
                      }}
                    >
                      <AccordionSummary 
                        expandIcon={<ExpandMore />}
                        // تنظیم مارجین ثابت برای رفع پرش عرضی
                        sx={{'& .MuiAccordionSummary-content': {margin: '12px 0 !important'}}} 
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ width: "100%", justifyContent: "space-between" }}
                        >
                          <Box>
                            <Typography fontWeight={700}>
                                {title}
                            </Typography>
                            <Typography sx={{display:'flex',gap:1, alignItems:'center'}} variant="caption" color="text.secondary" dir="rtl">
                                {/* نمایش آیکون و لیبل دسته‌بندی در خلاصه */}
                                {m.category || m.category === "ندارد"
                                    ? (<Box component="span" sx={{display: 'inline-flex', alignItems: 'center', gap: 0.5}}>
                                        {categoryInfo.icon}
                                        <span>دسته‌بندی: {categoryInfo.label} · </span>
                                      </Box>)
                                    : null
                                }
                              اولویت: {m.priority}
                            </Typography>
                          </Box>
                        </Stack>
                      </AccordionSummary>
                      
                      {/* محتوای داخلی: فرم ویرایش یا خلاصه دسترسی */}
                      <EditFormContent m={m} />
                      
                    </Accordion>
                  );
                })}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* ستون چپ: پیش‌نمایش ساختار درختی (بر اساس دسته‌بندی) - عرض 3 */}
        <Grid size={{xs:12,md:3}}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography fontWeight={700} mb={1}>
              پیش‌نمایش نهایی دسترسی‌ها
            </Typography>
            
            {categorizedMenus.length === 0 && noCategoryMenus.length === 0 ? (
                <Typography color="text.secondary" variant="body2">
                    (منویی انتخاب نشده است)
                </Typography>
            ) : (
                <Stack spacing={1}>
                    {/* ✅ نمایش منوهای بدون دسته‌بندی به صورت لیست کاملاً مستقل و خارج از آکاردئون */}
                    {noCategoryMenus.length > 0 && (
                        <List 
                            disablePadding 
                            dense 
                            sx={{
                                mb: 1, 
                                border: '1px solid #d1d1d1', 
                                borderRadius: 2, 
                                bgcolor: '#fff',
                                // اگر فقط آیتم بدون دسته‌بندی داشته باشیم، فاصله پایین نمی‌گذاریم
                                ...(categorizedMenus.length === 0 ? { mb: 0 } : {})
                            }}
                        >
                            {noCategoryMenus.map((m, index) => {
                                const menuIcon = MOCK_MENUS.find((item) => item.id === m.id)?.icon || <Home />;
                                return (
                                    <Box 
                                        key={m.id} 
                                        sx={{ 
                                            // حذف خط جداکننده برای آخرین آیتم
                                            borderBottom: index < noCategoryMenus.length - 1 ? '1px solid #eee' : 'none' 
                                        }}
                                    >
                                        <ListItem sx={{ pl: 1, pt: 1, pb: 1 }}>
                                            <ListItemIcon sx={{ minWidth: 28, color: '#085E42' }}>
                                                {menuIcon}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography fontWeight={600} variant="body2">
                                                        {m.customTitleFa}
                                                    </Typography>
                                                }
                                                secondary={m.customTitleFa !== m.defaultTitleFa ? `(${m.defaultTitleFa})` : null}
                                                secondaryTypographyProps={{
                                                  dir: 'rtl',
                                                  variant: 'caption',
                                                  color: 'text.secondary',
                                                }}
                                            />
                                        </ListItem>
                                    </Box>
                                );
                            })}
                        </List>
                    )}
                    
                    {/* نمایش منوهای دسته‌بندی شده (داخل آکاردئون) */}
                    {categorizedMenus.map(([category, menus]) => {
                        const categoryInfo = getCategoryDisplay(category);
                        return (
                        <Accordion
                            key={category}
                            defaultExpanded={false} 
                            slotProps={{
                                transition: { timeout: 200 },
                            }}
                            sx={{
                                borderRadius: 2,
                                "&:before": { display: "none" },
                                border: "1px solid #ccc",
                                bgcolor: "#f0f0f0",
                            }}
                        >
                            <AccordionSummary 
                                expandIcon={<ExpandMore />}
                                sx={{ 
                                    cursor: 'pointer',
                                    pointerEvents: 'auto',
                                    '& .MuiAccordionSummary-content': {margin: '8px 0 !important'}
                                }}
                            >
                                <Stack direction="row" spacing={1} alignItems="center">
                                    {/* آیکون برای دسته‌بندی */}
                                    <ListItemIcon sx={{ minWidth: 28, color: '#3f51b5' }}>
                                        {categoryInfo.icon} 
                                    </ListItemIcon>
                                    <Typography fontWeight={700}>
                                        {categoryInfo.label}
                                    </Typography>
                                </Stack>
                            </AccordionSummary>

                            <AccordionDetails sx={{p: 0, borderTop: '1px solid #ccc'}}>
                                <List disablePadding dense>
                                  {menus.map((m, index) => {
                                    

                                    const menuIcon = MOCK_MENUS.find((item) => item.id === m.id)?.icon || <Home />;

                                    return (
                                      <Box 
                                        key={m.id} 
                                        sx={{ 
                                            // حذف خط جداکننده برای آخرین آیتم
                                            borderBottom: index < menus.length - 1 ? '1px solid #eee' : 'none',
                                            bgcolor: '#fff' 
                                        }}
                                      >
                                        <ListItem sx={{ pl: 2, pt: 1, pb: 1 }}>
                                          <ListItemIcon sx={{ minWidth: 28, color: '#085E42' }}>
                                            {menuIcon}
                                          </ListItemIcon>
                                          <ListItemText
                                            primary={
                                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography sx={{display:'flex',alignItems:'center',gap:1}} fontWeight={600} variant="body2">
                                                  {m.customTitleFa}
                                                  {m.customTitleFa !== m.defaultTitleFa && (
                                                    <Typography
                                                      variant="body2"
                                                      sx={{
                                                        fontWeight: 200,
                                                        fontSize: '0.675rem',
                                                        color: 'text.secondary',
                                                        marginLeft: 1,
                                                      }}
                                                    >
                                                      ({m.defaultTitleFa})
                                                    </Typography>
                                                  )}
                                                </Typography>
                                              </Stack>
                                            }
                                            secondaryTypographyProps={{
                                              dir: 'rtl',
                                              variant: 'caption',
                                              color: 'text.secondary',
                                            }}
                                          />
                                        </ListItem>
                                      </Box>
                                    );
                                  })}
                                </List>

                            </AccordionDetails>
                        </Accordion>
                    );})}
                </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* مودال تایید حذف */}
      <DeleteConfirmModal
        open={deleteOpen.open}
        title="حذف دسترسی"
        description="آیا از حذف این دسترسی مطمئن هستید؟"
        onCancel={() => setDeleteOpen({ open: false })}
        onConfirm={() => deleteOpen.id && handleDelete(deleteOpen.id)}
      />

      {/* مودال افزودن دسته‌بندی */}
      <AddMenuCategoryModal
        open={addCatOpen}
        onClose={() => setAddCatOpen(false)}
        onCreated={(cat) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          pendingCatSetter && pendingCatSetter(cat);
          setAddCatOpen(false);
        }}
      />
    </Box>
  );
}