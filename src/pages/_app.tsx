import { ApolloProvider } from "@apollo/react-hooks";
import { ThemeProvider } from "styled-components";
import { theme } from "theme";
import { AppProvider } from "contexts/app/app.provider";
import { AuthProvider } from "contexts/auth/auth.provider";
import { LanguageProvider } from "contexts/language/language.provider";
import { StoreProvider } from "contexts/store/store.provider";
import { CartProvider } from "contexts/cart/use-cart";
import { useApollo } from "utils/apollo";
import { useMedia } from "utils/use-media";
import AppLayout from "layouts/app-layout";
// Language translation files
import localEn from "data/translation/en.json";
import localAr from "data/translation/ar.json";
import localEs from "data/translation/es.json";
import localDe from "data/translation/de.json";
import localCn from "data/translation/zh.json";
import localIl from "data/translation/he.json";

// External CSS import here
import "rc-drawer/assets/index.css";
import "rc-table/assets/index.css";
import "rc-collapse/assets/index.css";
import "react-multi-carousel/lib/styles.css";
import "components/multi-carousel/multi-carousel.style.css";
import "@redq/reuse-modal/lib/index.css";
import { GlobalStyle } from "assets/styles/global.style";

import Router from "next/router";
import withFBQ from "next-fbq";

console.log(process.env.NODE_ENV);

// Language translation Config
const messages = {
  en: localEn,
  ar: localAr,
  es: localEs,
  de: localDe,
  zh: localCn,
  he: localIl,
};
// need to provide types
function ExtendedApp({ Component, pageProps }) {
  const mobile = useMedia("(max-width: 580px)");
  const tablet = useMedia("(max-width: 991px)");
  const desktop = useMedia("(min-width: 992px)");
  const apolloClient = useApollo(pageProps.initialApolloState);
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <LanguageProvider messages={messages}>
          <StoreProvider>
            <CartProvider>
              <AppProvider>
                <AuthProvider>
                  <AppLayout>
                    <Component
                      {...pageProps}
                      deviceType={{ mobile, tablet, desktop }}
                    />
                  </AppLayout>
                  <GlobalStyle />
                </AuthProvider>
              </AppProvider>
            </CartProvider>
          </StoreProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default withFBQ("347199196693512", Router)(ExtendedApp);
