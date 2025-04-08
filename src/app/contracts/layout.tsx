"use client"
import { FC } from "react";
import PageWrapper from "@src/Components/Wrappers/Page";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { IPageLayout } from "@src/Constants";


const TContractsSummaryLayout: FC<IPageLayout> = ({ children }) => {
    return (<PageWrapper navigation>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            { children }
        </LocalizationProvider>
    </PageWrapper>)
}

export default TContractsSummaryLayout;