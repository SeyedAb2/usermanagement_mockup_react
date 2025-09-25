import ProductionQuantityLimitsOutlinedIcon from '@mui/icons-material/ProductionQuantityLimitsOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

import { ListPageIconType } from "../types";
import { AccountCircleOutlined, KeyOutlined, ShoppingBasketOutlined } from '@mui/icons-material';

export const menuItem:ListPageIconType[] = [
    {name:'محصولات',path:'/products',icon:  <ProductionQuantityLimitsOutlinedIcon sx={{fontSize:20}}/>},
    {name:'کاربران',path:'/users',icon: <PeopleAltOutlinedIcon sx={{fontSize:20}}/>},
    {name:'درباره ما',path:'/about-us',icon: <InfoOutlinedIcon sx={{fontSize:20}}/>}
]

export const settingItem:ListPageIconType[] = [
    {name:'حساب کاربری',path:'/dashboard',icon:  <AccountCircleOutlinedIcon sx={{fontSize:20}}/>},
    {name:'خروج',path:'',disablePath:true,type:'danger',icon: <LogoutOutlinedIcon sx={{fontSize:20}}/>},
]

export const dashboardMenuItem:ListPageIconType[] = [
    { key: "info", name: "حساب کاربری", icon: <AccountCircleOutlined />, path: "/dashboard/info" },
    { key: "my-products", name: "محصولات من", icon: <ShoppingBasketOutlined />, path: "/dashboard/my-products" },
    { key: "reset-pass", name: "تغییر رمز عبور", icon: <KeyOutlined />, path: "/dashboard/reset-pass" },
]

