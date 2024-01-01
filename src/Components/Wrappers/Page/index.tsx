import Navigation from '@src/Components/Navigation';
import { SContainer } from './styles';

type TWrapper = {
   children: React.ReactNode;
   centerContent?: boolean;
   navigation?: boolean;
   padding?: string;
}

const PageWrapper: React.FC<TWrapper> = ({ centerContent = false, padding = '0', navigation = false, children }) => {
    if (navigation) {
        return (<SContainer centerContent={false} padding={padding}>
            <Navigation>
                {children}
            </Navigation>
        </SContainer>);
    }

    return (<SContainer centerContent={centerContent} padding={padding}>
        {children}
    </SContainer>);
}

export default PageWrapper;