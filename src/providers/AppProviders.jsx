import { ThemeProvider } from './ThemeProvider';

// Combine all providers
export const AppProviders = ({ children }) => (
   <ThemeProvider>
      {children}
   </ThemeProvider>
);
