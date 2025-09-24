import { UserType } from './user.type';

export interface AuthStateType {
    user:UserType | null,
    setUser: (user:UserType)=> void,
    getUser: ()=> UserType | null,
    isLogined: ()=> boolean,
    logout: ()=> void
}