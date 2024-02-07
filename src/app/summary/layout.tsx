import PageWrapper from "@src/Components/Wrappers/Page";

export type TContractsSummaryLayout = {
    children: React.ReactNode;
}

const TContractsSummaryLayout: React.FC<TContractsSummaryLayout> = ({ children }) => {

    return (<PageWrapper navigation>
        { children }
    </PageWrapper>)
}

export default TContractsSummaryLayout;