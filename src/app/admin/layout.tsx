"use client"
import PageWrapper from '@src/Components/Wrappers/Page';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'

export type TAdminLayout = {
    children: React.ReactNode;
}

const TAdminLayout: React.FC<TAdminLayout> = ({ children }) => {
    return (<PageWrapper navigation>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            { children }
        </LocalizationProvider>
    </PageWrapper>)
}

export default TAdminLayout;