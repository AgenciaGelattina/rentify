"use client"
import PageWrapper from '@src/Components/Wrappers/Page';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

export type TPropertiesLayout = {
    children: React.ReactNode;
}

const TPropertiesLayout: React.FC<TPropertiesLayout> = ({ children }) => {
    return (<PageWrapper navigation>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            { children }
        </LocalizationProvider>
    </PageWrapper>)
}

export default TPropertiesLayout;