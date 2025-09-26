import {
  Avatar,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ShareOutlined,
  ContentCopyOutlined,
  LocalPhoneOutlined,
  HomeOutlined,
  PlaceOutlined,
} from "@mui/icons-material";
import { UserType } from "../types";
import { toPersianDegit } from "../utils/toPersianDigits";

export default function UserHeaderDetailCard({ user }: { user: UserType }) {
  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 3,
        boxShadow: 4,
        overflow: "hidden",
        borderTop: (theme) => `5px solid ${theme.palette.primary.main}`,
        position: "relative",
      }}
    >
      <Stack
        direction="row"
        sx={{ position: "absolute", top: 8, left: 8, zIndex: 2, gap: 0.5 }}
      >
        <Tooltip title="اشتراک‌گذاری">
          <IconButton
            size="small"
            onClick={() =>
              navigator.share?.({ title: user.name, url: window.location.href })
            }
          >
            <ShareOutlined />
          </IconButton>
        </Tooltip>
        <Tooltip title="کپی لینک">
          <IconButton
            size="small"
            onClick={() => navigator.clipboard.writeText(window.location.href)}
          >
            <ContentCopyOutlined />
          </IconButton>
        </Tooltip>
      </Stack>

      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        <Stack
          sx={{gap:1}}
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "center", sm: "flex-start" }}
          textAlign={{ xs: "center", sm: "left" }}
        >
          <Avatar
            src={user.logo ?? undefined}
            sx={{
              width: { xs: 72, sm: 96 },
              height: { xs: 72, sm: 96 },
              border: (t) => `3px solid ${t.palette.divider}`,
            }}
          />
          <Stack spacing={1} >
            <Typography variant="h5" sx={{textAlign:{xs:'center',sm:'right'}}} fontWeight={800}>
              {user.name}
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 0.5, sm: 3 }}
              alignItems={{ xs: "center", sm: "center" }}
              justifyContent="center"
              divider={
                <Divider
                  flexItem
                  sx={{ display: { xs: "none", sm: "block" }, mx: 1 }}
                />
              }
            >
              <Stack direction="row" spacing={0.5} alignItems="center">
                <LocalPhoneOutlined fontSize="small" />
                <Typography variant="body2">۰{toPersianDegit(user.phone)}</Typography>
              </Stack>

              {user.age && <Stack direction="row" spacing={0.5} alignItems="center">
                <HomeOutlined fontSize="small" />
                <Typography variant="body2">سن: {toPersianDegit(user.age)}</Typography>
              </Stack>}

              {user.address && <Stack direction="row" spacing={0.5} alignItems="center">
                <PlaceOutlined fontSize="small" />
                <Typography variant="body2">{user.address}</Typography>
              </Stack>}
            </Stack>
          </Stack>
        </Stack>

        <Typography
          variant="body2"
          sx={{
            textAlign:{xs:'justify',sm:'right'},
            mt: 1.5,
            color: "text.secondary",
            lineHeight: 2,
          }}
        >
          {user.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
