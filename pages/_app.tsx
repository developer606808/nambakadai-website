import { NextIntlClientProvider } from 'next-intl';
import { AppProps } from 'next/app';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const messages = pageProps.messages || {};

  return (
    <NextIntlClientProvider messages={messages}>
      <Component {...pageProps} />
    </NextIntlClientProvider>
  );
}

export default MyApp;