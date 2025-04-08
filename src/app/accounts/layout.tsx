import PageWrapper from "@src/Components/Wrappers/Page";
import { FC, ReactNode } from "react";

export type TAccountsLayout = {
    children: ReactNode;
}

const TAccountsLayout: FC<TAccountsLayout> = ({ children }) => {
    return (<PageWrapper navigation>
        { children }
    </PageWrapper>)
}

export default TAccountsLayout;