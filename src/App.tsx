import { BrowserRouter } from "react-router";
import {HelmetProvider} from 'react-helmet-async';

import ThemeProvider from './app/providers/ThemeProvider.tsx'
import AppRouterProvider from './app/providers/AppRouterProvider.tsx';

const App = () => {

  return (
    <HelmetProvider>
      <ThemeProvider>
        <AppRouterProvider />
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default App
