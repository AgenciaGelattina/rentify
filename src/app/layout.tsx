'use client';
import DataProviders from '@src/DataProvider';
import { SnackMessages, Dialogs } from '@phoxer/react-components';
import AuthVerification from '@src/Components/AuthVerification';
import { StyledEngineProvider } from '@mui/material/styles';
import { IPageLayout } from '@src/Constants';
import './global.css';

const RootLayout: React.FC<IPageLayout> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <title>Rentify | Admin</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta name="description" content="Admin" />
        <link rel="icon" href="/assets/images/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
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