import { FC } from 'react';
import { DialogContent } from '@mui/material';
import RspDialog from '@src/Components/RspDialog';
import RspDialogTitle from '@src/Components/RspDialog/RspDialogTitle';
import PropertyDetails, { IProperty } from '@src/Components/Properties/Details';
import TabsContent from '@src/Components/TabsContent';
import ContractData from './ContractData';
import ExpiredContracts from '@src/Components/Properties/Contracts/Expired';
import FinalizedContracts from '@src/Components/Properties/Contracts/Finalized';

export interface IPropertyContract {
    open: boolean;
    property?: IProperty;
}

type TPropertyContractProps = {
    setOpen: (propertyContract: IPropertyContract) => void;
}

const PropertyContract: FC<TPropertyContractProps & IPropertyContract> = ({ property, open, setOpen }) => {

    return (<RspDialog open={open} onClose={() => setOpen({ open: false })}>
        <RspDialogTitle title="CONTRATOS" onClose={() => setOpen({ open: false })} />
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
                    tab: { label: "CANCELADOS / EXPIRADOS" },
                    component: () => {
                        return <ExpiredContracts property={property} />
                    }
                },
                { 
                    tab: { label: "FINALIZADOS" },
                    component: () => {
                        return <FinalizedContracts property={property} />
                    }
                }
            ]} />)}
        </DialogContent>
    </RspDialog>)
}

export default PropertyContract;