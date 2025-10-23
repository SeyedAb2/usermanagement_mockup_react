import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  FormHelperText,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import {
  Dashboard,
  People,
  Settings,
  ShoppingCart,
  BarChart,
  Inventory,
  ReceiptLong,
  AccountCircle,
  LocalShipping,
  Support,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LabelPosition } from "../../shared/utils/textFieldLabelStyleConfig";


const schema = yup.object({
  groupName: yup.string().required("نام گروه الزامی است"),
  menus: yup
    .array()
    .of(yup.string())
    .min(1, "حداقل باید یک منو انتخاب کنید")
    .required("انتخاب منو الزامی است"),
});

export default function AddMenuGroup() {
  const navigate = useNavigate();

  // ✅ لیست منوهای ساختگی برای انتخاب
  const menusList = [
    { id: "1", title: "داشبورد", page: "Dashboard", icon: <Dashboard /> },
    { id: "2", title: "کاربران", page: "Users", icon: <People /> },
    { id: "3", title: "کالاها", page: "Products", icon: <Inventory /> },
    { id: "4", title: "سفارشات", page: "Orders", icon: <ShoppingCart /> },
    { id: "5", title: "تنظیمات", page: "Settings", icon: <Settings /> },
    { id: "6", title: "گزارشات", page: "Reports", icon: <BarChart /> },
    { id: "7", title: "حسابداری", page: "Accounting", icon: <ReceiptLong /> },
    { id: "8", title: "پشتیبانی", page: "Support", icon: <Support /> },
    { id: "9", title: "حمل‌ونقل", page: "Transport", icon: <LocalShipping /> },
    { id: "10", title: "مدیریت", page: "Admin", icon: <AccountCircle /> },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      groupName: "",
      menus: [],
    },
  });

  const onSubmit = () => {
    toast.success("گروه منو با موفقیت ایجاد شد!");
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
          maxWidth: 700,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 3, textAlign: "right", fontWeight: "bold" }}
        >
          افزودن گروه‌بندی منو
        </Typography>

        {/* 🔹 نام گروه */}
        <Controller
          name="groupName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="نام گروه *"
              fullWidth
              error={!!errors.groupName}
              helperText={errors.groupName?.message}
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
