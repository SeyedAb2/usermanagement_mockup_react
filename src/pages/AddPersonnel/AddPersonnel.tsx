import {
  Box, Button, Paper, TextField, Typography, MenuItem
} from "@mui/material";
// اگه از API size استفاده می‌کنی:
import {Grid} from "@mui/material"; // ⬅️ Grid v2
// اگر Grid معمولی می‌خواهی، این خط را حذف کن و از Grid عادی با item/xs/... استفاده کن

import { Image, PersonAddAlt } from "@mui/icons-material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { LabelPosition } from "../../shared/utils/textFieldLabelStyleConfig";

type PersonnelForm = yup.InferType<typeof schema>;


// interface PersonnelForm {
//   firstName: string;
//   lastName: string;
//   nationalCode: string;
//   phoneNumber: string;
//   personnelCode: string;
//   gender: string;
//   role: string;
//   serviceUnit: string;
//   accountNumber: string;
//   tafsiliCode: string;
//   address: string;
//   birthDate: Date | null;
// }

// ✅ اسکیما تایپ‌دار و کامل (اجباری/اختیاری)
const schema= yup.object({
  firstName: yup.string().required("نام الزامی است"),
  lastName: yup.string().required("نام خانوادگی الزامی است"),
  nationalCode: yup.string().required("کد ملی الزامی است"),
  phoneNumber: yup.string().required("شماره همراه الزامی است"),
  personnelCode: yup.string().required("کد پرسنلی الزامی است"),
  gender: yup.string().required("انتخاب جنسیت الزامی است"),
  role: yup.string().required("انتخاب نقش الزامی است"),
  serviceUnit: yup.string().required("انتخاب واحد خدمت الزامی است"),
  tafsiliCode: yup.string().required("شناسه تفصیلی الزامی است"),
  // اختیاری‌ها
  accountNumber: yup.string().notRequired().default(""),
  address: yup.string().notRequired().default(""),
  birthDate: yup.date().nullable().notRequired().default(null),
}).required();

export default function AddPersonnel() {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonnelForm>({
    resolver: yupResolver(schema), // ❌ جنریک نده
    defaultValues: {
      firstName: "",
      lastName: "",
      nationalCode: "",
      phoneNumber: "",
      personnelCode: "",
      gender: "",
      role: "",
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
    console.log("Personnel Data:", data);
    toast.success("پرسنل با موفقیت اضافه شد!");
    reset();
    setTimeout(() => navigate("/"), 1500);
  };
  
  return (
    <Box
      sx={{
        bgcolor: "#f4f4f4",
        minHeight: "100vh",
        py: 4,
        direction: "rtl",
      }}
    >
      <Paper
        sx={{
          maxWidth: 1300,
          mx: "auto",
          p: 4,
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* 🔹 عنوان */}
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            fontWeight: "bold",
            gap: 1,
            color: "#043d2b",
          }}
        >
          <PersonAddAlt />
          افزودن پرسنل
        </Typography>

        {/* 🔹 فرم اصلی */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} alignItems="flex-start">
            {/* ✅ باکس آپلود عکس سمت چپ */}
            

            {/* ✅ فیلدهای سمت راست */}
            <Grid size={{
                xs:12,
                md:9
            }}>
              <Grid container spacing={2}>
                {[
                  { name: "firstName", label: "نام *" },
                  { name: "lastName", label: "نام خانوادگی *" },
                  { name: "phoneNumber", label: "شماره همراه *" },
                  { name: "nationalCode", label: "کد ملی *" },
                  { name: "personnelCode", label: "کد پرسنلی *" },
                  { name: "tafsiliCode", label: "شناسه تفصیلی *" },
                  { name: "accountNumber", label: "شماره کارت/حساب" },
                  { name: "address", label: "آدرس" },
                ].map((f) => (
                  <Grid size={{
                    xs:12,
                    md:6
                }} key={f.name}>
                    <Controller
                      name={f.name as keyof PersonnelForm}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          sx={{...LabelPosition({ right: 25, rightActive: 30 })}}
                          label={f.label}
                          fullWidth
                          error={!!errors[f.name as keyof PersonnelForm]}
                          helperText={
                            errors[f.name as keyof PersonnelForm]?.message
                          }
                        />
                      )}
                    />
                  </Grid>
                ))}

                {/* 🔹 نقش */}
                <Grid size={{
                    xs:12,
                    md:6
                }}>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label="نقش *"
                        sx={{...LabelPosition({ right: 25, rightActive: 30 })}}
                        error={!!errors.role}
                        helperText={errors.role?.message}
                      >
                        <MenuItem value="مدیر">مدیر</MenuItem>
                        <MenuItem value="اپراتور">اپراتور</MenuItem>
                        <MenuItem value="کاربر عادی">کاربر عادی</MenuItem>
                      </TextField>
                    )}
                  />
                </Grid>

                {/* 🔹 جنسیت */}
                <Grid size={{
                    xs:12,
                    md:6
                }}>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        sx={{...LabelPosition({ right: 25, rightActive: 30 })}}
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

                {/* 🔹 واحد خدمت */}
                <Grid size={{
                    xs:12,
                    md:6
                }}>
                  <Controller
                    name="serviceUnit"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        sx={{...LabelPosition({ right: 25, rightActive: 30 })}}
                        select
                        fullWidth
                        label="واحد خدمت *"
                        error={!!errors.serviceUnit}
                        helperText={errors.serviceUnit?.message}
                      >
                        {[
                          "ترابری",
                          "مالی",
                          "پرورش",
                          "MAMRP",
                          "کشتارگاه",
                          "مدیریت",
                          "خزانه",
                        ].map((u) => (
                          <MenuItem key={u} value={u}>
                            {u}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                {/* 🔹 تاریخ تولد */}
                <Grid size={{
                    xs:12,
                    md:6
                }}>
                  <Controller
                    name="birthDate"
                    control={control}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                        <DatePicker
                        sx={{...LabelPosition({ right: 25, rightActive: 30 })}}
                          label="تاریخ تولد"
                          value={field.value}
                          onChange={(v) => field.onChange(v)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                            },
                          }}
                        />
                      </LocalizationProvider>
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid size={{
                xs:12,
                md:3
            }}>
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
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: 220,
                      mb: 2,
                    }}
                  >
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "12px",
                        objectFit: "contain",
                      }}
                    />
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        minWidth: 0,
                        borderRadius: "50%",
                        p: "6px",
                      }}
                      onClick={() => setPreviewImage(null)}
                    >
                      🗑
                    </Button>
                  </Box>
                ) : (
                  <>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        bgcolor: "#E8F5E9",
                        color: "#4CAF50",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                      }}
                    >
                      <Image fontSize="large" />
                    </Box>
                    <Typography fontWeight={500}>آپلود عکس پرسنلی</Typography>
                    <Typography fontSize="0.8rem" color="text.secondary" mb={2}>
                      پشتیبانی از فرمت‌های WEBP, PNG, JPG
                    </Typography>
                  </>
                )}

                <Box display="flex" gap={2}>
                  <Button
                    variant="contained"
                    component="label"
                    sx={{
                      bgcolor: "#085E42",
                      "&:hover": { bgcolor: "#064b35" },
                    }}
                  >
                    دوربین
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleImageUpload}
                    />
                  </Button>
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{
                      borderColor: "#085E42",
                      color: "#085E42",
                      "&:hover": { borderColor: "#064b35", color: "#064b35" },
                    }}
                  >
                    گالری
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleImageUpload}
                    />
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* 🔹 دکمه‌ها */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 4,
              direction: "rtl",
            }}
          >
            <Button
              variant="outlined"
              sx={{
                borderColor: "#888",
                color: "#444",
                px: 4,
                "&:hover": { borderColor: "#666" },
              }}
              onClick={() => reset()}
            >
              بازنشانی
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "#085E42",
                px: 4,
                "&:hover": { bgcolor: "#064b35" },
              }}
            >
              ثبت
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
