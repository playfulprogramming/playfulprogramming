import { AppProps } from "next/app";
import "../global.scss";
import { Layout } from "components/layout";
import { HistoryProvider } from "constants/history-context";
import PlausibleProvider from "next-plausible";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <PlausibleProvider
        domain="unicorn-utterances.com"
        trackOutboundLinks={true}
      >
        <HistoryProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </HistoryProvider>
      </PlausibleProvider>
    </>
  );
}
