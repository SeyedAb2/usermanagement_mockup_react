import { AxiosResponse } from 'axios'
import { BASE_API_URL } from '../../environment/environment'
import { UserType } from '../../shared/types'
import api from './axios-unterceptor'

const baseApi = BASE_API_URL

export const signupApi = async (user:UserType):Promise<UserType> => {
    const response:AxiosResponse<UserType> = await api.post<UserType>(`${baseApi}/users`,user)
    return response.data;
}

export const loginApi = async ({phone,password}:UserType):Promise<UserType> => {
    const response:AxiosResponse<UserType[]> = await api.get<UserType[]>(`${baseApi}/users`,{
        params: {phone, password}
    })
    const found = response.data[0];
    if(!found){
        const err = new Error('شماره تلفن یا رمزعبور اشتباه است')
        throw err;
    }
    return found;
}

export const getAllusersApi = async ():Promise<UserType[]>=>{
    const response:AxiosResponse<UserType[]> = await api.get<UserType[]>(`${baseApi}/users`);
    return response.data
}

export const getUserApi = async (id:number|string):Promise<UserType>=>{
    const response:AxiosResponse<UserType> = await api.get<UserType>(`${baseApi}/users/${id}`);
    return response.data
}

export const patchUserApi = async (user:UserType):Promise<UserType> => {
    const response:AxiosResponse<UserType> = await api.patch<UserType>(`${baseApi}/users/${user.id}`,user)
    return response.data;
}


