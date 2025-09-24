import {HelmetProvider} from 'react-helmet-async';

import ThemeProvider from './app/providers/ThemeProvider.tsx'
import AppRouterProvider from './app/providers/AppRouterProvider.tsx';
import ReactQueryProvider from './app/providers/ReactQueryProvider.tsx';
import { ToastContainer } from 'react-toastify';

const App = () => {

  return (
    <ReactQueryProvider>
      <HelmetProvider>
        <ThemeProvider>
          <AppRouterProvider />
          <ToastContainer />
        </ThemeProvider>
      </HelmetProvider>
    </ReactQueryProvider>
  )
}

export default App
