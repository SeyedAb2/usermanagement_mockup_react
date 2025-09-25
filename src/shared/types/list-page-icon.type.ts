import { ReactElement } from "react";

export interface ListPageIconType {
    name:string,
    icon:ReactElement,
    path:string,
    key?:string | null | undefined,
    disablePath?:boolean,
    type?:'danger'|'manual',
}