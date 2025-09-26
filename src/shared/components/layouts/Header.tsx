import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import SunnyIcon from '@mui/icons-material/Sunny';
import LoginIcon from '@mui/icons-material/Login';

import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import LogoSrc from '../../../assets/images/logo.png';
import { Link, useLocation, useNavigate } from 'react-router';
import { useUIStore } from '../../../store/ui.store';
import { ListPageIconType, UserType } from '../../types';
import { menuItem, settingItem } from '../../utils/menuItem';
import { useAuthStore } from '../../../store/auth.store';
import { scrollToTop } from '../../utils/scrollToTop';
import useToastify from '../../hooks/useToastify';
import { Stack, useMediaQuery, useTheme } from '@mui/material';
import { Link as RouterLink } from "react-router";

const Header = () => {
  const theme = useTheme();
  const downSm = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const loc = useLocation();
  const pages: ListPageIconType[] = menuItem;
  const settings: ListPageIconType[] = settingItem;
  const themeMode = useUIStore((state) => state);

  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const handleToggleMobileNav = () => setMobileNavOpen((p) => !p);
  const handleCloseMobileNav = () => setMobileNavOpen(false);

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const { getUser, isLogined, logout } = useAuthStore();
  const { notify } = useToastify();
  const user: UserType | null = getUser();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logoutUser = () => {
    logout();
    navigate('/login');
    scrollToTop();
    notify({ type: 'info', message: 'با موفقیت خارج شدید' });
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: 'bar.main',
        color: 'bar.contrastText',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          <Link to='/' viewTransition>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'start', alignItems: 'center' }}>
              <Box sx={{ width: '60px', height: '60px' }}>
                <img style={{ width: '100%', height: '100%' }} src={LogoSrc} alt="wallfarm" />
              </Box>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'text.primary',
                  textDecoration: 'none',
                }}
              >
                وال‌فارم
              </Typography>
            </Box>
          </Link>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="open navigation"
              aria-haspopup="true"
              onClick={handleToggleMobileNav}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <Link to='/' viewTransition>
              <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'start', alignItems: 'center' }}>
                <Box sx={{ width: '60px', height: '60px' }}>
                  <img style={{ width: '100%', height: '100%' }} src={LogoSrc} alt="wallfarm" />
                </Box>
                <Typography
                  variant="h5"
                  noWrap
                  sx={{
                    mr: 2,
                    display: { xs: 'none', sm: 'flex' },
                    flexGrow: 1,
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'text.primary',
                    textDecoration: 'none',
                  }}
                >
                  وال‌فارم
                </Typography>
              </Box>
            </Link>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', marginRight: 100 } }}>
            {pages.map((page) => {
              const active = loc.pathname.startsWith(page.path);
              return (
                <Link key={page.name} viewTransition to={page.path}>
                  <Button
                    sx={{
                      my: 2,
                      display: 'flex',
                      color: active ? 'wlc.600' : 'primary',
                      bgcolor: active ? 'wlc.100' : '',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    {page.icon}
                    <Typography variant='body2' sx={{ marginX: 1 }}>
                      {page.name}
                    </Typography>
                  </Button>
                </Link>
              );
            })}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton sx={{ marginX: 2 }} onClick={themeMode.toggleTheme}>
              {themeMode.themeMode == 'light' ? <BedtimeIcon /> : <SunnyIcon />}
            </IconButton>

            {!isLogined() && (
              <Link to="/login" viewTransition>
                <Button variant='contained' size={downSm ? 'small' : 'medium'}>
                  <LoginIcon />
                  <Typography sx={{ marginX: 1, display: { xs: 'none', sm: 'flex' } }} variant='body1'>
                    ورود
                  </Typography>
                </Button>
              </Link>
            )}

            {isLogined() && (
              <Tooltip sx={{ borderRadius: 2 }} title="Open settings">
                <IconButton disableRipple onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                      alt={user?.name ?? "User"}
                      src={user?.logo ?? undefined}
                      sx={{ width: 32, height: 32 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ display: { xs: 'none', sm: 'inline-block' }, px: 1 }}
                    >
                      {user?.name ?? ''}
                    </Typography>
                  </Stack>
                </IconButton>
              </Tooltip>
            )}

            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  component={setting.disablePath ? 'button' : RouterLink}
                  key={setting.name}
                  to={!setting.disablePath ? setting.path : ''}
                  onClick={() => {
                    handleCloseUserMenu();
                    if (setting.disablePath) { logoutUser(); }
                  }}
                >
                  <Typography
                    sx={{
                      display: 'flex',
                      gap: 1,
                      justifyContent: 'start',
                      alignItems: 'center',
                      textAlign: 'center',
                      color: setting.type == 'danger' ? 'error.main' : 'primary.main'
                    }}
                  >
                    {setting.icon}{setting.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        open={mobileNavOpen}
        onClose={handleCloseMobileNav}
        PaperProps={{ sx: { width: 300 } }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 56, height: 56 }}>
            <img style={{ width: '100%', height: '100%' }} src={LogoSrc} alt="wallfarm" />
          </Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, letterSpacing: '.3rem', color: 'text.primary' }}
          >
            وال‌فارم
          </Typography>
        </Box>
        <Divider />
        <List sx={{ py: 0 }}>
          {pages.map((page) => {
            const active = loc.pathname.startsWith(page.path);
            return (
              <RouterLink
                key={page.name}
                to={page.path}
                viewTransition
                onClick={handleCloseMobileNav}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <ListItemButton sx={{display:'flex', alignItems:'center', justifyContent:'start',width:'100%'}} selected={active}>
                  <ListItemIcon>{page.icon}</ListItemIcon>
                  <ListItemText primary={page.name} sx={{width:'auto',textAlign:'right'}}/>
                </ListItemButton>
              </RouterLink>
            );
          })}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Header;
