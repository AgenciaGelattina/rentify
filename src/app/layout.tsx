'use client';
import DataProviders from '@src/DataProvider';
import { SnackMessages, Dialogs } from '@phoxer/react-components';
import AuthVerification from '@src/Components/AuthVerification';
import { StyledEngineProvider } from '@mui/material/styles';
import './global.css';

export type TRootLayout = {
  children: React.ReactNode;
}

const RootLayout: React.FC<TRootLayout> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <title>Rentify | Admin</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta name="description" content="Admin" />
        <link rel="icon" href="/assets/images/favicon.png" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </head>
      <body>
        <DataProviders>
          <StyledEngineProvider injectFirst>
            <SnackMessages>
              <Dialogs>                
                  <AuthVerification>
                    {children}
                  </AuthVerification>
              </Dialogs>
            </SnackMessages>
          </StyledEngineProvider>
        </DataProviders>
      </body>
    </html>
  )
}

export default RootLayout;