import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { BgColor } from "@/enums/styles";

export type PageProps = {
  props: {
    public?: boolean;
    fullPage?: boolean;
    hideNav?: boolean;
    bgColor?: BgColor;
    requiredUserRoles?: Array<string>;
  };
};

type NextPageWithLayout = NextPage & {
  layout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// this works, but when attempting to use the types above, it doesnt work the same.
// It still makes _app props of type any.
// export interface AppProps extends NextJsAppProps<PageProps> {
//   pageProps: PageProps;
// }

export type LayoutProps = {
  hideNav?: boolean;
  children: ReactElement;
};
