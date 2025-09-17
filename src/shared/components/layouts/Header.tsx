import { Drawer } from "@mui/material";
import { Link } from "react-router";

const Header = ()=>{

    return (
        <>
            <div style={{
                display:'flex',
                justifyContent:'between',
                alignContent:'center'
            }}>
                <Link to={'/'}>خانه</Link>
                <Link to={'/signup'}>ثبت نام</Link>
                <Link to={'/login'}>ورود</Link>
            </div>
            <Drawer></Drawer>
        </>
    )
}

export default Header;