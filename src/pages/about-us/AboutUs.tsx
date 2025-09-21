import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  InfoRounded,
  Phone,
  AlternateEmail,
  Place,
  AccessTime,
} from "@mui/icons-material";
import Seo from "../../shared/components/seo/Seo";
import { toPersianDegit } from './../../shared/utils/toPersianDigits';

export default function AboutUs() {
  const theme = useTheme();

  const lat = 35.7248;
  const lng = 51.3817;

  return (
    <>
      <Seo SITE_NAME="درباره ما | وال‌فارم" />
      <Box
        sx={{
          minHeight: "calc(100vh - 120px)",
          display: "flex",
          alignItems: "center",
          bgcolor: "background.default",
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {/* ستون اطلاعات/توضیحات */}
            <Grid size={{xs:12, md:6}}>
              <Card
                sx={(t) => ({
                  borderRadius: 3,
                  boxShadow: 6,
                  borderTop: `5px solid ${t.palette?.wlc?.[500] ?? t.palette.primary.main}`,
                })}
              >
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Box sx={{ mb: 2,display:'flex', alignItems:'center', justifyContent:'start', gap:1 }}>
                    <InfoRounded/>
                    <Typography variant="h6" fontWeight={700}>
                      {" "}درباره‌ی وال‌فارم
                    </Typography>
                  </Box>

                  <Typography variant="body1" sx={{ color: "text.secondary", mb: 3, lineHeight: 2 }}>
                    وال‌فارم با هدف ارائه‌ی محصولات و خدمات کشاورزی باکیفیت شکل گرفته است.
                    ما تلاش می‌کنیم با تکیه بر تجربه و فناوری، زنجیره تأمین را کوتاه‌تر و
                    دسترسی شما به محصولات سالم را آسان‌تر کنیم.
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                    راه‌های ارتباطی
                  </Typography>

                  <List sx={{ py: 0 }}>
                    <ListItem disableGutters sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Phone sx={{ color: theme.palette?.wlc?.[600] ?? theme.palette.primary.main }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Stack direction="column" spacing={0}>
                            <Link href="tel:02112345678" underline="hover">{toPersianDegit('021-12345678')}</Link>
                            <Typography sx={{fontSize:12}}>پاسخگویی: همه‌روزه ۹ الی ۱۸</Typography>
                          </Stack>
                        }
                      />
                    </ListItem>

                    <ListItem disableGutters sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <AlternateEmail sx={{ color: theme.palette?.wlc?.[600] ?? theme.palette.primary.main }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Link href="mailto:info@wallfarm.ir" underline="hover">info@wallfarm.ir</Link>}
                        secondary="پشتیبانی ایمیلی"
                      />
                    </ListItem>

                    <ListItem disableGutters sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Place sx={{ color: theme.palette?.wlc?.[600] ?? theme.palette.primary.main }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="تهران، خیابان مثال، پلاک ۱۲"
                        secondary={<Link href={`https://maps.google.com/?q=${lat},${lng}`} target="_blank" rel="noreferrer" underline="hover">مشاهده روی نقشه</Link>}
                      />
                    </ListItem>

                    <ListItem disableGutters sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <AccessTime sx={{ color: theme.palette?.wlc?.[600] ?? theme.palette.primary.main }} />
                      </ListItemIcon>
                      <ListItemText primary="ساعات کاری: ۹ تا ۱۸" secondary="شنبه تا چهارشنبه" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* ستون نقشه */}
            <Grid size={{xs:12, md:6}}>
              <Card
                sx={(t) => ({
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: 6,
                  borderTop: `5px solid ${t.palette?.wlc?.[500] ?? t.palette.primary.main}`,
                  overflow: "hidden",
                })}
              >
                <CardContent sx={{ p: { xs: 2.5, md: 3,  } , height: 1,display: "flex", flexDirection: "column", }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
                    موقعیت ما روی نقشه
                  </Typography>

                  {/* کادر با نسبت تصویر برای ریسپانسیو */}
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      borderRadius: 2,
                      flex: 1,
                      overflow: "hidden",
                      aspectRatio: "16 / 9",
                      "@supports not (aspect-ratio: 1)": {
                        pt: "56.25%",
                      },
                    }}
                  >
                    <Box
                      component="iframe"
                      title="WallFarm Map"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      sx={{
                        position: "@supports (aspect-ratio: 1) ? static : absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        border: 0,
                        filter: "saturate(1.05) contrast(1.02)",
                      }}
                      src={`https://www.google.com/maps?q=${lat},${lng}&hl=fa&z=15&output=embed`}
                    />
                  </Box>

                  <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 1.5 }}>
                    برای مسیریابی دقیق روی «مشاهده روی نقشه» در بخش اطلاعات کلیک کنید.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
