import { Search } from "@mui/icons-material";
import { Card, CardContent, Grid, TextField, InputAdornment, FormControl, MenuItem } from "@mui/material";
import { LabelPosition } from "../utils/textFieldLabelStyleConfig";
import { UserKind } from "../utils/userTypeList";


type Props = {
    q:string,
    type:UserKind,
    handleSearch:(value:string)=>void,
    handleType:(value:""|UserKind)=>void,
}

export default function SearchUserFilter({q, type,handleSearch,handleType}:Props){
    return (
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{xs:12, md:8}}>
                        <TextField
                            sx={LabelPosition({right:25,rightActive:30})}
                            fullWidth
                            label="جستجو بر اساس نام"
                            placeholder="مثلاً: علی محمدی"
                            value={q}
                            onChange={(e) => handleSearch(e.target.value)}
                            InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                <Search />
                                </InputAdornment>
                            ),
                            }}
                        />
                    </Grid>
                    <Grid size={{xs:12, md:4}}>
                        <FormControl fullWidth>
                            <TextField
                            sx={LabelPosition({right:25,rightActive:30})}
                            inputProps={{ dir: "rtl" }}
                            select fullWidth label="نوع کاربری"
                            value={type}
                            onChange={(e) =>
                                handleType(e.target.value as "" | UserKind)
                            }
                            >
                                <MenuItem value="">همه</MenuItem>
                                <MenuItem value="farmer">کشاورز</MenuItem>
                                <MenuItem value="seller">فروشنده</MenuItem>
                                <MenuItem value="service">خدمات‌دهنده</MenuItem>
                            </TextField>
                        </FormControl>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}