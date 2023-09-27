import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
  getInitColorSchemeScript,
} from "@mui/material/styles";
import colorSchemes from "styles/colorSchemes";
import CssBaseline from "@mui/material/CssBaseline";
import { DEFAULT_THEME_MODE } from "constant";
import { Montserrat, Lexend_Deca } from "next/font/google";

const montserrat = Montserrat({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["vietnamese"],
  display: "swap",
  fallback: ["Segoe UI", "sans-serif"],
});

const lexend = Lexend_Deca({
  weight: ["500", "700"],
  subsets: ["vietnamese"],
  fallback: ["Open Sans", "san-serif"],
});

const typography = {
  fontFamily: montserrat.style.fontFamily,
  lineHeight: 1.4,
  fontFeatureSettings: "'tnum' on, 'lnum' on",
  h1: {
    fontFamily: lexend.style.fontFamily,
  },
  h2: {
    fontFamily: lexend.style.fontFamily,
  },
  h3: {
    fontFamily: lexend.style.fontFamily,
  },
  h4: {
    fontFamily: lexend.style.fontFamily,
  },
  h5: {
    fontSize: 28,
    fontWeight: 600,
    fontFamily: lexend.style.fontFamily,
  },
  h6: {
    fontSize: 24,
    fontWeight: 600,
  },
  body1: {
    fontSize: 16,
  },
  body2: {
    fontSize: 14,
  },
  subtitle1: {
    fontSize: 20,
    fontFamily: lexend.style.fontFamily,
  },
  subtitle2: {
    fontSize: 17,
  },
  caption: {
    fontSize: 12,
  },
};

type ThemeProviderProps = {
  children: React.ReactNode;
};

const theme = extendTheme({
  colorSchemes,
  typography: {
    ...typography,
    button: {
      textTransform: "none",
      fontSize: 16,
    },
  },
});

const ThemeProvider = (props: ThemeProviderProps) => {
  const { children } = props;
  getInitColorSchemeScript({
    defaultMode: DEFAULT_THEME_MODE,
    modeStorageKey: "app_mode",
  });
  return (
    <CssVarsProvider theme={theme} defaultMode={DEFAULT_THEME_MODE}>
      <CssBaseline />
      {children}
    </CssVarsProvider>
  );
};

export default ThemeProvider;
