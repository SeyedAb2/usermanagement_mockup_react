import * as yup from 'yup'

export const ResetPasswordValidationSchema  =  yup.object({
    password:yup.string().required('رمزعبور معتبر  وارد کنید').matches(/^(?=.*[a-z])(?=.*\d)\S{4,}$/i , "رمز اید شامل یکی از موارد /^(?=.*[a-z])(?=.*){4,}$/i"),
    confirmPassword:yup.string().required('رمزعبور معتبر  وارد کنید').matches(/^(?=.*[a-z])(?=.*\d)\S{4,}$/i , "رمز اید شامل یکی از موارد /^(?=.*[a-z])(?=.*){4,}$/i").oneOf([yup.ref('password'), ''],'پسورد باید یکسان باشد'),
})



