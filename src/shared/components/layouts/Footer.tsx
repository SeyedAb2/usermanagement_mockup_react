import { Box, Container, IconButton, Typography } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import TelegramIcon from '@mui/icons-material/Telegram';

import Logo from "../../../assets/images/logo.png"

const Footer = ()=>{
    return (
        <>
            <Container 
                maxWidth={false}
                sx={{
                    bgcolor:'wlc.100',
                    padding:1,
                    margin:0,
                    borderTop:'1px solid',
                    borderColor:'gray.400'
                }}    
            >
                <Box component='div' maxWidth='xl' sx={{
                   display:'flex',
                   flexDirection:'row',
                   justifyContent:'space-between',
                   alignItems:'center', 
                   width:'100%'
                }}>
                    <Box sx={{
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'start',
                        gap:2
                    }}>
                        <Box sx={{width:30,height:30}}>
                            <img className='img-full' src={Logo} alt="" />
                        </Box>
                        <Typography variant='subtitle1' sx={{
                            display:'flex',
                            color:'gray.600',
                            fontSize:{xs:10, sm:12 , md:14},
                            fontStyle:'italic'
                        }} >© توسعه داده شده توسط تیم وال‌فارم</Typography>
                    </Box>
                    <Box sx={{
                        display:'flex',
                        justifyContent:'end',
                        alignItems:'center',
                        gap:1,
                    }}>
                        <IconButton>
                            <InstagramIcon />
                        </IconButton>
                        <IconButton>
                            <XIcon />
                        </IconButton>
                        <IconButton>
                            <TelegramIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Container>            
        </>
    )
}

export default Footer;

