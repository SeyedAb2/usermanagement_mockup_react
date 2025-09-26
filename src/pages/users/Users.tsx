import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";


import Seo from "../../shared/components/seo/Seo";
import { UserKind } from "../../shared/utils/userTypeList";
import { UserType } from "../../shared/types";
import UserCard from "../../shared/components/UserCard";
import NotUserFound from "../../shared/components/NotUserFound";
import { useQuery } from "@tanstack/react-query";
import { getAllusersApi } from "../../services/api/auth";
import Error from "../../shared/components/Error";
import SearchUserFilter from "../../shared/components/SearchUserFilter";
import PaginationCard from "../../shared/components/PaginationCard";
import UsersPageSkeleton from "../../shared/components/skeletons/UsersPageSkeleton";


export default function UsersPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<"" | UserKind>("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const { data:users = [], isError, isLoading } = useQuery({
    queryKey:['allusers'],
    queryFn:getAllusersApi,
  })
  const filtered = useMemo(() => {
    const term = q.trim();
    return users && users.length ? users.filter((u:UserType) => {
      const matchesName =
        !term ||
        u.name && u.name.includes(term);
      const matchesType = !type || u.type === type;
      return matchesName && matchesType;
    }) : [];
  }, [q, type , users]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSearch = (v: string) => {
    setQ(v);
    setPage(1);
  };
  const handleType = (v: "" | UserKind) => {
    setType(v);
    setPage(1);
  };

  if(isLoading)
    return <UsersPageSkeleton />

  if(isError)
    return <Error />

  if(!isLoading){
    return (
      <>
        <Seo SITE_NAME="کاربران | وال‌فارم" />
        <Box sx={{ py: { xs: 3, md: 5 } }}>
          <Container maxWidth="lg">
            <SearchUserFilter q={q} type={type as UserKind} handleSearch={handleSearch} handleType={handleType} />
  
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                {filtered.length.toLocaleString("fa-IR")} نتیجه
              </Typography>
            </Stack>
  
            <Grid container spacing={2}>
              {paged.map((u) => (
                <Grid key={u.id} size={{xs:12, sm:6, md:3}}>
                    <UserCard user={u}/>
                </Grid>
              ))}
            </Grid>
  
            {filtered.length === 0 && (
              <NotUserFound />
            )}
  
            <PaginationCard page={page} setPage={setPage} totalPages={totalPages} />
          </Container>
        </Box>
      </>
    );
  }
}