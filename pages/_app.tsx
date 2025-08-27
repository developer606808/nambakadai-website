import { NextIntlClientProvider } from 'next-intl';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const messages = pageProps.messages || {};

  return (
    <NextIntlClientProvider messages={messages}>
      <Component {...pageProps} />
    </NextIntlClientProvider>
  );
}

export default MyApp;