import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Paper,
} from "@mui/material";
import { Close, Add } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { LabelPosition } from "../../shared/utils/textFieldLabelStyleConfig";

type ServicePerm = { key: string; label: string; checked?: boolean };
type RoutePerm = { path: string; label: string; checked?: boolean };

export type EditItem = {
  id: string;
  priority: number;
  category?: string | null;
  titleFa: string;
  titleEn: string;
  services: ServicePerm[];
  routes: RoutePerm[];
};

export default function EditAccessModal({
  open,
  item,
  categories,
  onClose,
  onSave,
}: {
  open: boolean;
  item?: EditItem;
  categories: string[];
  onClose: () => void;
  onSave: (updated: EditItem) => void;
  onAddCategory: () => void;
}) {
  const [form, setForm] = useState<EditItem | null>(null);

  // فرضی: لیست نام‌های منو
  const menuNames = [
    "داشبورد عمومی پرورش",
    "مدیریت کاربران",
    "ترابری",
    "حسابداری",
    "امور مالی",
    "مدیریت کل",
  ];

  useEffect(() => {
    setForm(item ? JSON.parse(JSON.stringify(item)) : null);
  }, [item]);

  const set = <K extends keyof EditItem>(k: K, v: EditItem[K]) =>
    setForm((prev) => (prev ? { ...prev, [k]: v } : prev));

  if (!form) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" dir="rtl">
        <DialogTitle>ویرایش دسترسی</DialogTitle>
        <DialogContent />
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" dir="rtl">
      <DialogTitle
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <Typography fontWeight={700}>{form.titleFa}</Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* 🔹 انتخاب نام منو */}
          <Grid size={{xs:12}}>
            <Box sx={{display:'flex', alignItems:'center'}}>
              <TextField
                select
                sx={{...LabelPosition({ right: 25, rightActive: 30 })}}
                label="انتخاب نام منو"
                fullWidth
                value={form.titleFa}
                onChange={(e) => set("titleFa", e.target.value)}
              >
                {menuNames.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>
              <IconButton
                color="success"
                sx={{
                  bgcolor: "rgba(46, 125, 50, 0.1)",
                  mx:1,
                  width:40,
                  height:40
                }}
                title="افزودن نام منو"
              >
                <Add />
              </IconButton>
            </Box>
          </Grid>

          {/* 🔹 دسته‌بندی */}
          <Grid size={{xs:12}}>
            <Box sx={{display:'flex' , alignItems:'center'}}>
              <TextField
                sx={{...LabelPosition({ right: 25, rightActive: 30 })}}
                select
                label="انتخاب دسته‌بندی"
                fullWidth
                value={form.category || ""}
                onChange={(e) => set("category", e.target.value)}
              >
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
              <IconButton
                color="success"
                sx={{
                  bgcolor: "rgba(46, 125, 50, 0.1)",
                  mx:1,
                  width:40,
                  height:40
                }}
                title="افزودن دسته‌بندی"
              >
                <Add />
              </IconButton>
            </Box>
          </Grid>

          {/* 🔹 شماره اولویت */}
          <Grid size={{xs:12}}>
            <TextField
                sx={{...LabelPosition({ right: 25, rightActive: 30 })}}
              type="number"
              label="اولویت (برحسب نقش)"
              fullWidth
              value={form.priority}
              onChange={(e) => set("priority", Number(e.target.value))}
            />
          </Grid>
        </Grid>

        {/* 🔹 دسترسی سرویس‌ها */}
        <Box
          mt={3}
          p={2}
          component={Paper}
          variant="outlined"
          sx={{
            borderColor: "#cfd8dc",
            bgcolor: "#fafafa",
            borderRadius: 2,
            
          }}
        >
          <Typography fontWeight={700} mb={1}>
            دسترسی سرویس‌ها
          </Typography>
          <Stack spacing={1}>
            {form.services.map((s) => (
              <FormControlLabel
                key={s.key}
                control={
                  <Checkbox
                    checked={!!s.checked}
                    onChange={() =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              services: prev.services.map((x) =>
                                x.key === s.key ? { ...x, checked: !x.checked } : x
                              ),
                            }
                          : prev
                      )
                    }
                  />
                }
                label={s.label}
              />
            ))}
          </Stack>
        </Box>

        {/* 🔹 آدرس‌های داخلی */}
        <Box
          mt={3}
          p={2}
          component={Paper}
          variant="outlined"
          sx={{
            borderColor: "#cfd8dc",
            bgcolor: "#fafafa",
            borderRadius: 2,
          }}
        >
          {/* ✅ آدرس صفحه به عنوان هدر */}
          <Typography
            sx={{
              color: "#2e7d32",
              fontWeight: 700,
              mb: 1.5,
              direction: "ltr",
            }}
          >
            /{form.titleEn}
          </Typography>

          <Stack spacing={1}>
            {form.routes.map((r) => (
              <FormControlLabel
                key={r.path}
                control={
                  <Checkbox
                    checked={!!r.checked}
                    onChange={() =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              routes: prev.routes.map((x) =>
                                x.path === r.path ? { ...x, checked: !x.checked } : x
                              ),
                            }
                          : prev
                      )
                    }
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
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>انصراف</Button>
        <Button
          variant="contained"
          sx={{ bgcolor: "#085E42", "&:hover": { bgcolor: "#064b35" } }}
          onClick={() => form && onSave(form)}
        >
          ذخیره
        </Button>
      </DialogActions>
    </Dialog>
  );
}
