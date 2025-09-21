import { Button, TextField } from "@mui/material";
import Seo from "../../shared/components/seo/Seo";
import { useState } from "react";
import { LabelPosition } from "../../shared/utils/textFieldLabelStyleConfig";

const LandingPage = ()=>{
    const [weight , setWight] = useState('')
    const [height , setHeight] = useState('')
    const [bmi , setBmi] = useState('')

    const bmiHandle = ()=>{
        setBmi((+weight/(((+height)/100)*((+height)/100))).toString())
    }
    
    return (
        <>
            <Seo SITE_NAME="صفحه اصلی | وال فارم" />
            <h1>محسابه BMI </h1>
            <br />
            <TextField
              fullWidth={false}
              value={height}
              onChange={(e)=>{setHeight(e.target.value)}}
              sx={LabelPosition({gap:14})}
              label="قد(cm)"
              type="text"
              variant="outlined"
              margin="normal"
            />
            <br />
            <TextField
              fullWidth={false}
              onChange={(e)=>{setWight(e.target.value)}}
              value={weight}
              sx={LabelPosition({gap:14})}
              label="وزن(km)"
              type="text"
              variant="outlined"
              margin="normal"
            />
            <br />
            <Button onClick={()=>bmiHandle()} variant="contained">محاسبه کن لعنتی</Button>
            <br />
            <br />
            <h3>BMI شما : {bmi}</h3>
        </>
    )
}

export default LandingPage;