import PageWrapper from "@src/Components/Wrappers/Page";

export type TAccountsLayout = {
    children: React.ReactNode;
}

const TAccountsLayout: React.FC<TAccountsLayout> = ({ children }) => {

    return (<PageWrapper navigation>
        { children }
    </PageWrapper>)
}

export default TAccountsLayout;