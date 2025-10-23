import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Chip,
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
} from "@mui/material";
import {
  ExpandMore,
  Search,
  Home,
  Edit,
  Delete,
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
} from "@mui/icons-material";

import { useMemo, useState } from "react";
import EditAccessModal from "../../components/access/EditAccessModal";
import DeleteConfirmModal from "../../components/access/DeleteConfirmModal";
import AddMenuCategoryModal from "../../components/menu/AddMenuCategoryModal";

type ServicePerm = { key: string; label: string; checked?: boolean };
type RoutePerm = { path: string; label: string; checked?: boolean };

type MenuItem = {
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
  titleFa: string;
  titleEn: string;
  services: ServicePerm[];
  routes: RoutePerm[];
};

const MOCK_MENUS: MenuItem[] = [
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


const INIT_CATEGORIES = ["پیش‌فرض", "مدیریتی", "مالی", "عملیاتی"];

export default function UserAccessManagement() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<string[]>(INIT_CATEGORIES);
  const [resultsExpanded, setResultsExpanded] = useState<string | false>(false);
  const [myAccessExpanded, setMyAccessExpanded] = useState<string | false>(false);

  // ستون وسط: دسترسی‌های فعلی کاربر
  const [userAccess, setUserAccess] = useState<UserMenuAccess[]>([]);

  // مودال‌ها
  const [editOpen, setEditOpen] = useState<{
    open: boolean;
    item?: UserMenuAccess;
  }>({ open: false });

  const [deleteOpen, setDeleteOpen] = useState<{
    open: boolean;
    id?: string;
  }>({ open: false });

  const [addCatOpen, setAddCatOpen] = useState(false);
  const [pendingCatSetter, setPendingCatSetter] = useState<
    ((val: string) => void) | null
  >(null);

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

  const addMenuToAccess = (menu: MenuItem) => {
    // اگر قبلاً اضافه شده بود، فقط بازش کن
    const exists = userAccess.find((x) => x.id === menu.id);
    if (exists) {
      setMyAccessExpanded(menu.id);
      return;
    }
    const next: UserMenuAccess = {
      id: menu.id,
      priority: userAccess.length + 1,
      category: "پیش‌فرض",
      titleFa: menu.titleFa,
      titleEn: menu.titleEn,
      services: menu.services.map((s) => ({ ...s })), // کپی
      routes: menu.routes.map((r) => ({ ...r })),
    };
    setUserAccess((prev) => [...prev, next]);
    setMyAccessExpanded(menu.id);
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
  };

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
          <Box
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
            ع
          </Box>
          <Box >
            <Typography sx={{mx:1}} fontWeight={700}>علی عظیمی</Typography>
            <Typography sx={{mx:1}} variant="body2" color="text.secondary">
              نقش: مدیر واحد پرورش · شناسه: 10234
            </Typography>
          </Box>
        </Stack>

        <Box sx={{display:'flex',gap:1}}>
          <Chip label="فعال"  color="success" variant="outlined" />
          <Chip label="آخرین ورود: 1403/07/01" variant="outlined" />
        </Box>
      </Paper>

      {/* سه ستون */}
      <Grid container spacing={2}>
        {/* ستون راست: جستجو و نتایج (آکاردئون) */}
        <Grid size={{ xs: 12, md: 4 }}>
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
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ width: "100%", justifyContent: "space-between" }}
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
                      <Button
                        size="small"
                        variant="contained"
                        onClick={(e) => {
                          e.stopPropagation();
                          addMenuToAccess(m);
                        }}
                        sx={{ bgcolor: "#085E42", "&:hover": { bgcolor: "#064b35" } }}
                      >
                        تأیید
                      </Button>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography fontWeight={700} mb={1}>
                      دسترسی سرویس‌ها
                    </Typography>
                    <Stack>
                      {m.services.map((s) => (
                        <FormControlLabel
                          key={s.key}
                          control={<Checkbox defaultChecked={false} />}
                          label={`${s.label}`}
                          sx={{ mr: 0 }}
                        />
                      ))}
                    </Stack>

                    <Divider sx={{ my: 2 }} />
                    <Typography fontWeight={700} mb={1}>
                      دسترسی آدرس‌های داخلی
                    </Typography>
                    <Stack spacing={0.5}>
                      {m.routes.map((r) => (
                        <FormControlLabel
                          key={r.path}
                          control={<Checkbox defaultChecked={false} />}
                          label={
                            <Stack spacing={0.3}>
                              <Typography>{r.label}</Typography>
                              <Typography variant="caption" color="text.secondary" dir="rtl">
                                {r.path}
                              </Typography>
                            </Stack>
                          }
                          sx={{ mr: 0 }}
                        />
                      ))}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* ستون وسط: دسترسی‌های انتخاب‌شده کاربر */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography fontWeight={700} mb={1}>
              دسترسی‌های کاربر
            </Typography>
            {userAccess.length === 0 ? (
              <Typography color="text.secondary">هنوز چیزی انتخاب نشده است…</Typography>
            ) : (
              <Stack spacing={1}>
                {userAccess.map((m) => (
                  <Accordion
                    key={m.id}
                    expanded={myAccessExpanded === m.id}
                    onChange={(_, ex) => setMyAccessExpanded(ex ? m.id : false)}
                    sx={{
                      borderRadius: 2,
                      "&:before": { display: "none" },
                      border: "1px solid #d1e7dd",
                      bgcolor: "#f1f8f5",
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ width: "100%", justifyContent: "space-between" }}
                      >
                        <Stack>
                          <Typography fontWeight={700}>{m.titleFa}</Typography>
                          <Typography variant="caption" color="text.secondary" dir="rtl">
                            {m.titleEn}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditOpen({ open: true, item: m });
                            }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteOpen({ open: true, id: m.id });
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography fontWeight={700} mb={1}>
                        دسترسی سرویس‌ها
                      </Typography>
                      <Stack>
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
                            sx={{ mr: 0 }}
                          />
                        ))}
                      </Stack>
                      <Divider sx={{ my: 2 }} />
                      <Typography fontWeight={700} mb={1}>
                        آدرس‌های داخلی
                      </Typography>
                      <Stack>
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
                              <Stack spacing={0.3}>
                                <Typography>{r.label}</Typography>
                                <Typography variant="caption" color="text.secondary" dir="ltr">
                                  {r.path}
                                </Typography>
                              </Stack>
                            }
                            sx={{ mr: 0 }}
                          />
                        ))}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* ستون چپ: پیش‌نمایش ساختار درختی */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography fontWeight={700} mb={1}>
              پیش‌نمایش نهایی دسترسی‌ها
            </Typography>
            <List dense>
              {userAccess.map((m) => (
                <Box key={m.id} sx={{ mb: 1, border: "1px solid #eee", borderRadius: 1 }}>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <Home />
                    </ListItemIcon>
                    <ListItemText
                      primary={m.titleFa}
                    />
                    
                  </ListItem>
                  <Divider />
                  <List disablePadding dense>
                    {m.services
                      .filter((s) => s.checked)
                      .map((s) => (
                        <ListItem key={s.key} sx={{ pl: 2 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>•</ListItemIcon>
                          <ListItemText primary={s.label} />
                        </ListItem>
                      ))}
                    {m.routes
                      .filter((r) => r.checked)
                      .map((r) => (
                        <ListItem key={r.path} sx={{ pl: 2 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>↳</ListItemIcon>
                          <ListItemText
                            primary={r.label}
                            secondary={<span dir="ltr">{r.path}</span>}
                          />
                        </ListItem>
                      ))}
                  </List>
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* مودال‌ها */}
      <EditAccessModal
        open={editOpen.open}
        item={editOpen.item}
        categories={categories}
        onClose={() => setEditOpen({ open: false })}
        onSave={(updated) => {
          setUserAccess((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
          setEditOpen({ open: false });
        }}
        onAddCategory={() => {
          setAddCatOpen(true);
          // setter برای زمانی که دسته جدید ساخته شد
          setPendingCatSetter(() => (val: string) => {
            setCategories((c) => Array.from(new Set([...c, val])));
          });
        }}
      />

      <DeleteConfirmModal
        open={deleteOpen.open}
        title="حذف دسترسی"
        description="آیا از حذف این دسترسی مطمئن هستید؟"
        onCancel={() => setDeleteOpen({ open: false })}
        onConfirm={() => deleteOpen.id && handleDelete(deleteOpen.id)}
      />

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
