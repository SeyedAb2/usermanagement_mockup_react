import { Search } from "@mui/icons-material";
import { Stack, Box, Typography, Select, MenuItem, TextField, InputAdornment, FormGroup, FormControlLabel, Checkbox, Slider, Button } from "@mui/material";
import { CategoryKey } from "../types/product.type";
import { TYPE_LABEL } from "../utils/product-const";
import { LabelPosition } from "../utils/textFieldLabelStyleConfig";

type Props = {
    sortInput:"new" | "old",
    setSortInput:(value:"new" | "old")=>void,
    qInput:string,
    setQInput:(value:string)=>void,
    catsInput:CategoryKey[],
    toggleCatInput:(value:CategoryKey)=>void,
    priceInput:number[],
    setPriceInput:(value:number[])=>void,
    applyFilters:()=>void,
}

export default function ProductSearchFilterCard({
    sortInput,
    setSortInput,
    qInput,
    setQInput,
    catsInput,
    toggleCatInput,
    priceInput,
    setPriceInput,
    applyFilters,
}:Props){
    return (
        <Stack spacing={2} sx={{ width: { xs: "100%", md: "auto" } }}>
            <Box sx={{ minWidth: 180 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                مرتب‌سازی
            </Typography>
            <Select
                fullWidth
                value={sortInput}
                onChange={(e) => setSortInput(e.target.value as "new" | "old")}
            >
                <MenuItem value="new">جدیدترین</MenuItem>
                <MenuItem value="old">قدیمی‌ترین</MenuItem>
            </Select>
            </Box>

            <TextField
            label="جستجوی محصول"
            value={qInput}
            sx={LabelPosition({right:15,rightActive:30})}
            InputLabelProps={{ shrink: true }}
            inputProps={{ dir: "rtl" }}
            onChange={(e) => setQInput(e.target.value)}
            InputProps={{
                startAdornment: (
                <InputAdornment position="start">
                    <Search />
                </InputAdornment>
                ),
            }}
            />

            <Stack>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                دسته‌بندی (چند انتخاب)
            </Typography>
            <FormGroup row sx={{ gap: 1 }}>
                {(Object.keys(TYPE_LABEL) as CategoryKey[]).map((k:CategoryKey) => (
                <FormControlLabel
                    key={k}
                    control={
                    <Checkbox
                        checked={catsInput.includes(k)}
                        onChange={() => toggleCatInput(k)}
                        sx={{
                        color: "primary.main",
                        "&.Mui-checked": { color: "primary.main" },
                        }}
                    />
                    }
                    label={TYPE_LABEL[k]}
                />
                ))}
            </FormGroup>
            </Stack>

            <Box>
                <Typography variant="subtitle2">قیمت (تومان)</Typography>
                <Slider
                    sx={{ direction: "rtl" }}
                    value={priceInput}
                    min={0}
                    max={300_000_000}
                    step={250_000}
                    onChange={(_, v) => setPriceInput(v as number[])}
                    valueLabelDisplay="auto"
                />
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption">{priceInput[1].toLocaleString("fa-IR")}</Typography>
                    <Typography variant="caption">{priceInput[0].toLocaleString("fa-IR")}</Typography>
                </Stack>
            </Box>

            <Stack direction="row" justifyContent="flex-end">
                <Button variant="contained" onClick={applyFilters}>
                    اعمال فیلترها
                </Button>
            </Stack>
        </Stack>
    );
}