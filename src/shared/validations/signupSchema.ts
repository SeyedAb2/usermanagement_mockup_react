import * as yup from 'yup'
import { UserKind } from '../utils/userTypeList'

export const SignUpValidationSchema  =  yup.object({
    name:yup.string().required('نام و نام خانوادگی را وارد کنید'),
    password:yup.string().required('رمزعبور را وارد کنید').min(4,'حداقل ۴ کارکتر باشد').matches(/^(?=.*[a-z])(?=.*\d)\S{4,}$/i , "رمز اید شامل یکی از موارد /^(?=.*[a-z])(?=.*){4,}$/i"),
    phone:yup.string().required('شماره معتبر وارد کنید').min(10,'شماره معتبر وارد کنید'),
    type: yup
    .mixed<UserKind>()
    .oneOf(["farmer", "seller", "service"], "نوع کاربر نامعتبر است")
    .required("نوع کاربر را انتخاب کنید"),
})



