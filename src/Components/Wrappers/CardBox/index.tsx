import { SCardBox } from './styles';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { CardTypeMap } from '@mui/material';
import { FC } from 'react';

type TCardBox = {
   children: React.ReactNode;
   cardProps?: OverridableComponent<CardTypeMap<{}, "div">>
}

const CardBox: FC<TCardBox> = ({ children, cardProps }) => {
    return (<SCardBox {...cardProps}>
        {children}
    </SCardBox>);
}

export default CardBox;