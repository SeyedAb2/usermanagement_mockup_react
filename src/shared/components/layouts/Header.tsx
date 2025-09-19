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
import ProductionQuantityLimitsOutlinedIcon from '@mui/icons-material/ProductionQuantityLimitsOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import SunnyIcon from '@mui/icons-material/Sunny';
import LoginIcon from '@mui/icons-material/Login';

import LogoSrc from '../../../assets/images/logo.png';
import { Link } from 'react-router';
import { useUIStore } from '../../../store/ui.store';

const pages = [
    {name:'محصولات',path:'/products',icon:  <ProductionQuantityLimitsOutlinedIcon sx={{fontSize:20}}/>},
    {name:'کاربران',path:'/users',icon: <PeopleAltOutlinedIcon sx={{fontSize:20}}/>},
    {name:'درباره ما',path:'/about-us',icon: <InfoOutlinedIcon sx={{fontSize:20}}/>}
];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const Header = () => {
  const themeMode = useUIStore((state)=>state)
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  

  return (
    <AppBar position="sticky"
        sx={{
            bgcolor:'bar.main',
            color:'bar.contrastText'
        }}    
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to='/' viewTransition>
            <Box
                sx={{display:{xs:'none',md:'flex'},justifyContent:'start',alignItems:'center'}}
            >
                <Box sx={{
                        width:'60px',
                        height:'60px'
                    }} >
                    <img style={{width:'100%',height:'100%'}} src={LogoSrc} alt="wallfarm" />
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
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                  <Link viewTransition to={page.path} >
                    <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                        <Typography sx={{ display:'flex',gap:1, justifyContent:'start', alignItems:'center' , textAlign: 'center' , color:'primary.main' }}>{page.icon}{page.name}</Typography>
                    </MenuItem>
                  </Link>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <Link to='/' viewTransition>
                <Box
                    sx={{display:{xs:'flex',md:'none'},justifyContent:'start',alignItems:'center'}}
                >
                    <Box sx={{
                            width:'60px',
                            height:'60px'
                        }} >
                        <img style={{width:'100%',height:'100%'}} src={LogoSrc} alt="wallfarm" />
                    </Box>
                    <Typography
                        variant="h5"
                        noWrap
                        sx={{
                        mr: 2,
                        display: { xs: 'flex', md: 'none' },
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
          
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', marginRight:100 } }}>
            {pages.map((page) => (
              <Link viewTransition to={page.path}>
                <Button
                  key={page.name}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, display: 'flex' , color:'primary', justifyContent:'center', alignItems:'center' }}
                >
                  {page.icon}
                  <Typography variant='body2' sx={{marginX:1}}>
                      {page.name}
                  </Typography>
                </Button>
              </Link>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton sx={{marginX:2}} onClick={themeMode.toggleTheme}>
                {themeMode.themeMode=='light' ? <BedtimeIcon /> : <SunnyIcon /> }
            </IconButton >

                <Link to="/login" viewTransition>
                    <Button variant='contained'>
                            <LoginIcon />
                            <Typography sx={{marginX:1}} variant='body1'>
                                ورود
                            </Typography>
                    </Button>
                </Link>

            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, display:'none' }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
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
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
