import { FC } from 'react';
import RspDialog from '../RspDialog';
import RspDialogTitle from '../RspDialog/RspDialogTitle';
import { Chip, DialogContent, Divider, Typography } from '@mui/material';
import { TPropertyDetails } from './Details';
import { HolidayVillage }  from '@mui/icons-material';
import { isNotNil } from 'ramda';

export interface IPropertyView {
    open: boolean;
    property?: TPropertyDetails;
}

type TPropertyViewProps = {
    setOpen: (propertyView: IPropertyView) => void;
}

const PropertyView: FC<TPropertyViewProps & IPropertyView> = ({ open, property, setOpen }) => {
    
    if (isNotNil(property)) {
        const { title, description, group, type, status} = property;
    
        return (<RspDialog open={open} onClose={() => setOpen({ open: false })}>
            <RspDialogTitle title={title} onClose={() => setOpen({ open: false })} />
            <DialogContent>
                <Typography variant="body1" gutterBottom>{description}</Typography>
                {group.id > 0 && <Chip icon={<HolidayVillage />} label={group.title} variant="outlined" />}
                <Chip label={type.label} variant="outlined" />
                <Chip label={status.label} variant="outlined" />
                <Divider />
            </DialogContent>
        </RspDialog>)
    }
    return null;
};

export default PropertyView;