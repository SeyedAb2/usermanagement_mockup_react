import { Helmet } from 'react-helmet-async';
import { useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router';

const BASE_URL  = ''; 

export default function Seo({SITE_NAME}:{SITE_NAME:string}) {
  const { pathname } = useLocation();
  const theme = useTheme();
  const url = `${window.location.origin}${BASE_URL}${pathname}`;

  return (
    <Helmet>
      <title>{SITE_NAME}</title>
      <meta name="description" content="Wallfarm — خرید و فروش زمین، محصولات و ادوات کشاورزی" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* canonical */}
      <link rel="canonical" href={url} />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content={theme.palette.primary.main} />
      <meta name="theme-color" media="(prefers-color-scheme: dark)"  content={theme.palette.background.default} />
      <meta name="color-scheme" content="light dark" />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={SITE_NAME} />
      <meta property="og:description" content="Wallfarm — خرید و فروش زمین، محصولات و ادوات کشاورزی" />
    </Helmet>
  );
}
