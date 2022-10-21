import { AppProps } from "next/app";
import "../global.scss";
import { Layout } from "components/layout";
import { HistoryProvider } from "constants/history-context";
import PlausibleProvider from "next-plausible";
import { buildMode } from "constants/site-config";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <PlausibleProvider
        domain="unicorn-utterances.com"
        trackOutboundLinks={true}
        enabled={buildMode !== "development"}
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
