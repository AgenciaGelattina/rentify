import { FC } from 'react';
import { DialogContent } from '@mui/material';
import RspDialog from '@src/Components/RspDialog';
import RspDialogTitle from '@src/Components/RspDialog/RspDialogTitle';
import PropertyDetails, { TPropertyDetails } from '@src/Components/Properties/Details';
import TabsContent from '@src/Components/TabsContent';
import ContractData from './ContractData';
import ExpiredContracts from './ExpiredContracts';


export interface IPropertyContract {
    open: boolean;
    property?: TPropertyDetails;
}

type TPropertyContractProps = {
    setOpen: (propertyContract: IPropertyContract) => void;
}

const PropertyContract: FC<TPropertyContractProps & IPropertyContract> = ({ property, open, setOpen }) => {

    return (<RspDialog open={open} onClose={() => setOpen({ open: false })}>
        <RspDialogTitle title="CONTRATO" onClose={() => setOpen({ open: false })} />
        <DialogContent>
            {property && <PropertyDetails {...property} />}
            {property && (<TabsContent tabs={[
                { 
                    tab: { label: "CONTRATO VIGENTE" },
                    component: () => {
                        return <ContractData property={property} />
                    }
                },
                { 
                    tab: { label: "HISTORIAL DE CONTRATOS" },
                    component: () => {
                        return <ExpiredContracts property={property} />
                    }
                }
            ]} />)}
        </DialogContent>
    </RspDialog>)
}

export default PropertyContract;