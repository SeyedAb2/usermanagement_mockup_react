import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  MenuItem,
  Grid,
  Paper,
  InputAdornment,
} from "@mui/material";
import {
  Add,
  Delete,
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
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useMemo } from "react";
import { LabelPosition } from "../../shared/utils/textFieldLabelStyleConfig";


const schema = yup.object({
  names: yup
    .array()
    .of(
      yup.object({
        value: yup.string().required("نام منو الزامی است"),
      })
    )
    .min(1, "حداقل یک نام برای منو الزامی است"),
  page: yup.string().required("انتخاب صفحه الزامی است"),
  description: yup.string().nullable(),
  icon: yup.string().nullable(),
});

export default function Menu() {
  const navigate = useNavigate();

  const pages = [
    { id: "dashboard", title: "داشبورد", eng: "Dashboard" },
    { id: "users", title: "کاربران", eng: "Users" },
    { id: "transport", title: "حمل‌ونقل", eng: "Transport" },
    { id: "accounting", title: "حسابداری مالی", eng: "Accounting" },
    { id: "reports", title: "گزارشات", eng: "Reports" },
    { id: "settings", title: "تنظیمات", eng: "Settings" },
    { id: "warehouse", title: "انبار", eng: "Warehouse" },
    { id: "orders", title: "سفارشات", eng: "Orders" },
    { id: "products", title: "کالاها", eng: "Products" },
    { id: "support", title: "پشتیبانی", eng: "Support" },
  ];

  // ✅ لیست آیکون‌ها از متریال
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
      names: [{ value: "" }],
      icon: "Dashboard",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "names",
  });

  const filteredIcons = allIcons.filter((i) =>
    i.name.toLowerCase().includes(searchIcon.toLowerCase())
  );

  const onSubmit = () => {
    toast.success("منو با موفقیت اضافه شد!");
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
          maxWidth: 820, // کمی عریض‌تر
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 3, textAlign: "right", fontWeight: "bold" }}
        >
          افزودن منو
        </Typography>

        {/* 🔹 نام‌های منو */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ mb: 1, fontWeight: 500, textAlign: "right" }}>
            نام‌های منو *
          </Typography>

          {fields.map((field, index) => (
            <Box
              key={field.id}
              sx={{
                display: "flex",
                gap: 1,
                mb: 1.5,
                alignItems: "center",
              }}
            >
              <Controller
                name={`names.${index}.value`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    error={!!errors.names?.[index]?.value}
                    helperText={
                      errors.names?.[index]?.value
                        ? errors.names?.[index]?.value?.message
                        : ""
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        "& fieldset": { borderColor: "#ccc" },
                        "&:hover fieldset": { borderColor: "#085E42" },
                        "&.Mui-focused fieldset": { borderColor: "#085E42" },
                      },
                      ...LabelPosition({ right: 25, rightActive: 30 }),
                    }}
                    placeholder="نام منو..."
                  />
                )}
              />
              <IconButton
                color="error"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <Delete />
              </IconButton>
            </Box>
          ))}

          <Button
            startIcon={<Add />}
            onClick={() => append({ value: "" })}
            sx={{
              color: "#085E42",
              mt: 1,
              fontWeight: 500,
            }}
          >
            افزودن نام جدید
          </Button>
        </Box>

        {/* 🔹 انتخاب صفحه */}
        <Box sx={{ mb: 3 }}>
          <Controller
            name="page"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="صفحه منو *"
                fullWidth
                error={!!errors.page}
                helperText={errors.page?.message}
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
                {pages.map((p) => (
                  <MenuItem
                    key={p.id}
                    value={p.id}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <Typography sx={{ fontSize: "1rem" }}>{p.title}</Typography>
                    <Typography sx={{ fontSize: "0.75rem", color: "#777" }}>
                      {p.eng}
                    </Typography>
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Box>

        {/* 🔹 توضیحات */}
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
                mb: 4,
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

        {/* 🔹 انتخاب آیکون */}
        <Typography sx={{ mb: 1, fontWeight: 500, textAlign: "right" }}>
          انتخاب آیکون (اختیاری)
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
