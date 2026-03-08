import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { HeroProvider } from '@/contexts/HeroContext';
import Navbar from '@/components/Navbar';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <HeroProvider>
      <Navbar />
      <main className="pt-14 min-h-screen">
        <Component {...pageProps} />
      </main>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#12121a',
            color: '#fff',
            border: '1px solid #2a2a3a',
          },
        }}
      />
    </HeroProvider>
  );
}
