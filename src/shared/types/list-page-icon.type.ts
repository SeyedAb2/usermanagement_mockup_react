import { ReactElement } from "react";

export interface ListPageIconType {
    name:string,
    icon:ReactElement,
    path:string,
    disablePath?:boolean,
    type?:'danger'|'manual'
}