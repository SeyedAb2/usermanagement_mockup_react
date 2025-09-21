import { useState } from "react";
import {
  Card, Grid, TextField, Checkbox, FormControlLabel,
  Stack, Button, Typography
} from "@mui/material"; // Grid v2 – استفاده با size={{}}
import { KeyOutlined } from "@mui/icons-material";

export default function ResetPass() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);

  return (
    <Card sx={{ p: 2, borderRadius: 3, boxShadow: 4 }}>
      <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>
        تغییر رمز عبور
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="رمز فعلی"
            type={show ? "text" : "password"}
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="رمز جدید"
            type={show ? "text" : "password"}
            value={next}
            onChange={(e) => setNext(e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="تکرار رمز جدید"
            type={show ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={<Checkbox checked={show} onChange={(e) => setShow(e.target.checked)} />}
            label="نمایش رمزها"
          />
        </Grid>
      </Grid>

      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button variant="contained" startIcon={<KeyOutlined />}>
          اعمال تغییرات
        </Button>
      </Stack>
    </Card>
  );
}
