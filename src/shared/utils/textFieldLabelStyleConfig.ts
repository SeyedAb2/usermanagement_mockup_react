export const LabelPosition = ({gap}:{gap:number})=>{
    return {
        '& .MuiInputLabel-root': {
            left:'auto',
            right:gap
        },
        '& .MuiOutlinedInput-notchedOutline':{
            textAlign:'right',
        }
    }
}