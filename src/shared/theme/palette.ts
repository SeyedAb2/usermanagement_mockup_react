import type { PaletteOptions } from '@mui/material/styles';

const green600 = '#2F855A'; 
const green500 = '#38A169'; 
const gray800  = '#1F2937'; 
const mint200  = '#C6F6D5'; 
const amber400 = '#F6E05E'; 
const blue500  = '#3B82F6'; 
const red600   = '#DC2626'; 


export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary:   { main: green600, light: green500, contrastText: '#ffffff' },
  secondary: { main: blue500,  contrastText: '#ffffff' },
  success: { main: green500 },
  warning: { main: amber400 },
  info:    { main: blue500 },
  error:   { main: red600 },
  background: {
    default: '#F0FFF4',    
    paper:   '#ffffff'
  },
  text: {
    primary:   gray800,          
    secondary: '#475569'          
  },
  divider: '#E2E8F0',
};

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary:   { main: green500, dark: green600, light: mint200, contrastText: '#0B0F14' },
  secondary: { main: blue500,  contrastText: '#0B0F14' },
  success: { main: green500 },
  warning: { main: amber400 },
  info:    { main: blue500 },
  error:   { main: red600 },
  background: {
    default: '#111827',           
    paper:   gray800              
  },
  text: {
    primary:   '#E5E7EB',         
    secondary: mint200           
  },
  divider: 'rgba(198,246,213,0.16)',
};