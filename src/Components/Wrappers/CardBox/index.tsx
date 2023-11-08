import { SCardBox } from './styles';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { CardTypeMap } from '@mui/material';

type TCardBox = {
   children: React.ReactNode;
   cardProps?: OverridableComponent<CardTypeMap<{}, "div">>
}

const CardBox: React.FC<TCardBox> = ({ children, cardProps }) => {
    return (<SCardBox {...cardProps}>
        {children}
    </SCardBox>);
}

export default CardBox;