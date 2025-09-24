import * as yup from 'yup'

export const LoginValidationSchema  =  yup.object({
    password:yup.string().required('رمزعبور معتبر  وارد کنید'),
    phone:yup.string().required('شماره تلفن معتبر وارد کنید').min(10,'شماره تلفن معتبر وارد کنید')
})



