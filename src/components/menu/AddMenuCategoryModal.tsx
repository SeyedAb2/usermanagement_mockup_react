import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";

export default function AddMenuCategoryModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (categoryName: string) => void;
}) {
  const [name, setName] = useState("");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth dir="rtl">
      <DialogTitle>افزودن دسته‌بندی منو</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="نام دسته‌بندی *"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>انصراف</Button>
        <Button
          variant="contained"
          onClick={() => {
            if (!name.trim()) return;
            onCreated(name.trim());
            setName("");
          }}
          sx={{ bgcolor: "#085E42", "&:hover": { bgcolor: "#064b35" } }}
        >
          ایجاد
        </Button>
      </DialogActions>
    </Dialog>
  );
}
