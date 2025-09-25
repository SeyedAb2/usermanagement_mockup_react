export const toEnDigits = (val: number | string) =>
  typeof val === "string"
    ? val.toString().replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString())
    : val.toString();
