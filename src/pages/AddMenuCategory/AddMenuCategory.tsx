import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  InputAdornment,
  MenuItem,
  FormHelperText,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import {
  Search,
  Dashboard,
  People,
  Settings,
  ShoppingCart,
  Home,
  Category,
  ListAlt,
  BarChart,
  Inventory,
  ReceiptLong,
  AccountCircle,
  LocalShipping,
  Assignment,
  CalendarMonth,
  Folder,
  Email,
  Cloud,
  Support,
  Store,
  Business,
  Report,
  Lock,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useMemo } from "react";
import { LabelPosition } from "../../shared/utils/textFieldLabelStyleConfig";



// ✅ ولیدیشن
const schema = yup.object({
  categoryName: yup.string().required("نام دسته الزامی است"),
  menus: yup
    .array()
    .of(yup.string())
    .min(1, "حداقل باید یک منو انتخاب کنید")
    .required("انتخاب منو الزامی است"),
  icon: yup.string().required("انتخاب آیکون الزامی است"),
});

export default function AddMenuCategory() {
  const navigate = useNavigate();

  // ✅ لیست منوهای ساختگی برای انتخاب
  const menusList = [
    {
      id: "1",
      title: "داشبورد",
      page: "Dashboard",
      icon: <Dashboard />,
    },
    { id: "2", title: "کاربران", page: "Users", icon: <People /> },
    { id: "3", title: "حسابداری", page: "Accounting", icon: <ReceiptLong /> },
    { id: "4", title: "گزارشات", page: "Reports", icon: <BarChart /> },
    { id: "5", title: "سفارشات", page: "Orders", icon: <ShoppingCart /> },
    { id: "6", title: "کالاها", page: "Products", icon: <Inventory /> },
    { id: "7", title: "پشتیبانی", page: "Support", icon: <Support /> },
    { id: "8", title: "تنظیمات", page: "Settings", icon: <Settings /> },
    { id: "9", title: "حمل‌ونقل", page: "Transport", icon: <LocalShipping /> },
    { id: "10", title: "مدیریت", page: "Admin", icon: <AccountCircle /> },
  ];

  // ✅ آیکون‌ها از متریال
  const allIcons = useMemo(
    () => [
      { name: "Dashboard", icon: <Dashboard /> },
      { name: "People", icon: <People /> },
      { name: "Settings", icon: <Settings /> },
      { name: "ShoppingCart", icon: <ShoppingCart /> },
      { name: "Home", icon: <Home /> },
      { name: "Category", icon: <Category /> },
      { name: "ListAlt", icon: <ListAlt /> },
      { name: "BarChart", icon: <BarChart /> },
      { name: "Inventory", icon: <Inventory /> },
      { name: "ReceiptLong", icon: <ReceiptLong /> },
      { name: "AccountCircle", icon: <AccountCircle /> },
      { name: "LocalShipping", icon: <LocalShipping /> },
      { name: "Assignment", icon: <Assignment /> },
      { name: "CalendarMonth", icon: <CalendarMonth /> },
      { name: "Folder", icon: <Folder /> },
      { name: "Email", icon: <Email /> },
      { name: "Cloud", icon: <Cloud /> },
      { name: "Support", icon: <Support /> },
      { name: "Store", icon: <Store /> },
      { name: "Business", icon: <Business /> },
      { name: "Report", icon: <Report /> },
      { name: "Lock", icon: <Lock /> },
    ],
    []
  );

  const [searchIcon, setSearchIcon] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>("Dashboard");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      categoryName: "",
      menus: [],
      icon: "Dashboard",
    },
  });

  const filteredIcons = allIcons.filter((i) =>
    i.name.toLowerCase().includes(searchIcon.toLowerCase())
  );

  const onSubmit = () => {
    toast.success("دسته‌بندی با موفقیت اضافه شد!");
    reset();
    setTimeout(() => navigate("/"), 1500);
  };

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
          maxWidth: 820,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 3, textAlign: "right", fontWeight: "bold" }}
        >
          افزودن دسته‌بندی منو
        </Typography>

        {/* 🔹 نام دسته */}
        <Controller
          name="categoryName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="نام دسته *"
              fullWidth
              error={!!errors.categoryName}
              helperText={errors.categoryName?.message}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  "& fieldset": { borderColor: "#ccc" },
                  "&:hover fieldset": { borderColor: "#085E42" },
                  "&.Mui-focused fieldset": { borderColor: "#085E42" },
                },
                ...LabelPosition({ right: 25, rightActive: 30 }),
              }}
            />
          )}
        />

        {/* 🔹 انتخاب منوها */}
        <Controller
          name="menus"
          control={control}
          render={({ field }) => (
            <Box sx={{ mb: 4 }}>
              <Typography sx={{ mb: 1, fontWeight: 500, textAlign: "right" }}>
                انتخاب منوها *
              </Typography>
              <Select
                {...field}
                multiple
                fullWidth
                input={<OutlinedInput />}
                renderValue={(selected) =>
                  selected
                    .map((id) => menusList.find((m) => m.id === id)?.title)
                    .join("، ")
                }
                error={!!errors.menus}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    "& fieldset": { borderColor: "#ccc" },
                    "&:hover fieldset": { borderColor: "#085E42" },
                    "&.Mui-focused fieldset": { borderColor: "#085E42" },
                  },
                  ...LabelPosition({ right: 25, rightActive: 30 }),
                }}
              >
                {menusList.map((menu) => (
                  <MenuItem key={menu.id} value={menu.id}>
                    <Checkbox checked={field.value.includes(menu.id)} />
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          {menu.icon}
                          <Typography>{menu.title}</Typography>
                          <Typography
                            sx={{
                              fontSize: "0.75rem",
                              color: "#777",
                              ml: 1,
                            }}
                          >
                            ({menu.page})
                          </Typography>
                        </Box>
                      }
                    />
                  </MenuItem>
                ))}
              </Select>
              {errors.menus && (
                <FormHelperText error sx={{ textAlign: "right" }}>
                  {errors.menus?.message}
                </FormHelperText>
              )}
            </Box>
          )}
        />

        {/* 🔹 انتخاب آیکون */}
        <Typography sx={{ mb: 1, fontWeight: 500, textAlign: "right" }}>
          انتخاب آیکون *
        </Typography>

        <TextField
          placeholder="جستجوی آیکون..."
          fullWidth
          value={searchIcon}
          onChange={(e) => setSearchIcon(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              "& fieldset": { borderColor: "#ccc" },
              "&:hover fieldset": { borderColor: "#085E42" },
              "&.Mui-focused fieldset": { borderColor: "#085E42" },
            },
            ...LabelPosition({ right: 25, rightActive: 30 }),
          }}
        />

        <Grid container spacing={2} sx={{ maxHeight: 300, overflowY: "auto" }}>
          {filteredIcons.map((item) => (
            <Grid size={{xs:3,sm:2}} key={item.name}>
              <Box
                onClick={() => setSelectedIcon(item.name)}
                sx={{
                  cursor: "pointer",
                  borderRadius: "10px",
                  p: 2,
                  textAlign: "center",
                  border:
                    selectedIcon === item.name
                      ? "2px solid #1976d2"
                      : "1px solid #e0e0e0",
                  bgcolor:
                    selectedIcon === item.name ? "#e3f2fd" : "transparent",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#1976d2",
                  },
                  ...LabelPosition({ right: 25, rightActive: 30 }),
                }}
              >
                {item.icon}
                <Typography sx={{ fontSize: "0.75rem", mt: 1 }}>
                  {item.name}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* 🔹 دکمه ثبت */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
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
            ثبت
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
