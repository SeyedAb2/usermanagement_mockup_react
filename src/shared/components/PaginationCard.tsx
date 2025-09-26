import { ChevronRight, ChevronLeft } from "@mui/icons-material";
import { Stack, Pagination, PaginationItem } from "@mui/material";
import { toPersianDegit } from "../utils/toPersianDigits";

type Props = {
    totalPages:number,
    page:number,
    setPage:(page:number)=>void
}
export default function PaginationCard({totalPages,page,setPage}:Props){
    return (
        <Stack alignItems="center" sx={{ mt: 3 }}>
            <Pagination
                count={totalPages}
                sx={{direction:'rtl'}}
                page={page}
                onChange={(_, p) => setPage(p)}
                color="primary"
                shape="rounded"
                renderItem={(item) => (
                    <PaginationItem
                    slots={{
                        previous: ChevronRight,
                        next: ChevronLeft,
                    }}
                    {...item}
                    page={item.page ? toPersianDegit(item.page) : undefined}
                    />
                )}
            />
        </Stack>
    )
}