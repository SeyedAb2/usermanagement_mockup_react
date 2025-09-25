export const LabelPosition = ({right=10,rightActive=10}:{right?:number,rightActive?:number})=>{
    return {
        '& .MuiInputLabel-root': {
            left:'auto',
            right,
            transformOrigin: 'top right',
        },
        '& .MuiInputLabel-root.MuiInputLabel-shrink, & .MuiInputLabel-root.Mui-focused': {
            right: rightActive,
        },
        '& .MuiOutlinedInput-notchedOutline':{
            textAlign:'right',
            direction:'rtl'
        },
        "& .MuiSelect-icon": { left: 8, right: "auto" },
        "& .MuiSelect-select": { pl: 4, pr: 2, textAlign: "right"}
    }
}