import { AuthProvider } from './app/contexts/AuthContext';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {  
  
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp;
