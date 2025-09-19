import type { PaletteOptions } from '@mui/material/styles';

const green600 = '#2F855A'; 
const green500 = '#38A169'; 
const gray800  = '#1F2937'; 
const mint200  = '#C6F6D5'; 
const amber400 = '#F6E05E'; 
const blue500  = '#3B82F6'; 
const red600   = '#DC2626'; 
// const green100 = "#b9f6ca";
const green150 = "#cff9da";
// const green800 = "#1b5e20";
const green900 = "#0c380f";


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
  bar:   { main: green150, light: '#34D399', dark: green600, contrastText: '#000' },
  wlc: {
    100: "#e3fceb",
    200: "#b2dfdb",
    300: "#80cbc4",
    400: "#4db6ac",
    500: "#26a69a",
    600: "#009688",
    700: "#00897b",
    800: "#00796b",
    900: "#004d40",
  },
  gray: {
    100: "#f9fafb",
    200: "#f3f4f6",
    300: "#e5e7eb",
    400: "#d1d5db",
    500: "#9ca3af",
    600: "#6b7280",
    700: "#4b5563",
    800: "#374151",
    900: "#1f2937", 
  },
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
  bar:   { main: green900, light: '#34D399', dark: green600, contrastText: '#000' },
  divider: 'rgba(198,246,213,0.16)',
  wlc: {
    100: "#063830",
    200: "#00796b",
    300: "#00897b",
    400: "#009688",
    500: "#26a69a", // main
    600: "#4db6ac",
    700: "#80cbc4",
    800: "#b2dfdb",
    900: "#e0f2f1",
  },
  gray: {
    100: "#1f2937",
    200: "#374151",
    300: "#4b5563",
    400: "#374151",
    500: "#9ca3af", 
    600: "#6b7280",
    700: "#e5e7eb",
    800: "#f3f4f6",
    900: "#f9fafb", 
  },

};