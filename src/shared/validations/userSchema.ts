import * as yup from 'yup'
import { toEnDigits } from '../utils/toEnglishDegit';

const phoneIR = /^(?:\+98|0098|0)?9\d{9}$/; 
const TYPE_OPTIONS = ["farmer", "seller", "service"] as const;

export const UserInfoEditValidationSchema  =  yup.object({
    id:yup.number(),
    name:yup.string().required('نام و نام خانوادگی را وارد کنید'),
    phone: yup
        .string()
        .transform(toEnDigits)
        .matches(phoneIR, "شماره موبایل نامعتبر است")
        .required("شماره موبایل الزامی است"),
    age:yup.number().nullable(),
    description:yup.string(),
    type: yup
        .string()
        .oneOf(TYPE_OPTIONS as unknown as string[], "نوع نامعتبر است")
        .required("انتخاب نوع الزامی است"),
    address: yup.string().trim().max(200, "آدرس خیلی طولانی است").default(""),
    logo:yup.string().nullable(),
    social: yup.object({
        telegram: yup
        .string()
        .trim()
        .matches(/^@?[a-zA-Z0-9_]{0,32}$/, "شناسه تلگرام نامعتبر است"),
        instagram: yup
        .string()
        .trim()
        .matches(/^@?[a-zA-Z0-9_.]{0,30}$/, "نام کاربری اینستاگرام نامعتبر است"),
        twitter: yup
        .string()
        .trim()
        .matches(/^@?[A-Za-z0-9_]{0,15}$/, "نام کاربری توییتر نامعتبر است"),
    }),
})
