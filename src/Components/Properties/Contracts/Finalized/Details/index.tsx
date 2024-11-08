import { Button, DialogContent, Stack } from '@mui/material';
import { TCallBack, useFetchData } from '@phoxer/react-components';
import AlertModal from '@src/Components/AlertModal';
import ContractDetails, { IContract } from '@src/Components/Properties/Contracts/Details';
import PropertyDetails, { IProperty } from '@src/Components/Properties/Details';
import RspDialog from '@src/Components/RspDialog';
import RspDialogTitle from '@src/Components/RspDialog/RspDialogTitle';
import useDataResponse from '@src/Hooks/useDataResponse';
import { isNotNil } from 'ramda';
import { FC, SetStateAction, useEffect, useState } from 'react';
import { IEditContractData } from '../../ContractForm/EditContract';
import ContractTabs from '../../Details/Tabs';

export interface IFinalizedContractSummary {
    open: boolean;
    contract?: IContract;
    property?: IProperty;
}

interface IContractDataToEdit {
    showEditForm: boolean;
    contract?: IEditContractData;
}

interface IFinalizedContractDetails extends IFinalizedContractSummary {
    setOpen: (value: SetStateAction<IFinalizedContractSummary>) => void;
    getContractsList: () => void;
}

const FinalizedContractDetails: FC<IFinalizedContractDetails> = ({ open, contract, property, setOpen, getContractsList }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const [contractData, setContractData] = useState<IContract | null>();
    const [finalizeContractModal, setFinalizeContractModal] = useState<boolean>(false);

    const getContractData = () => {
        if (isNotNil(contract) && isNotNil(property)) {
            fetchData.get('/properties/contracts/contract.php', { contract_id: contract.id, status: "data" }, (response: TCallBack) => {
                const contract = validateResult(response.result);
                if (contract) {
                    setContractData(contract);
                }
            });
        }
    };

    useEffect(() => {
        console.log('OPEN', open);
        if (open) {
            getContractData();
        } else {
            setContractData(null);
        }
    }, [open]);

    const finalizeContract = () => {
        setFinalizeContractModal(false);
        if (contractData) {
            fetchData.post('/properties/contracts/finalize.php', { contract_id: contractData.id, finalize: 0 }, (response: TCallBack) => {
                const finalized = validateResult(response.result);
                if (finalized) {
                    getContractsList();
                    setOpen({ open: false });
                }
            });
        }
    };

    return (<RspDialog open={open} onClose={() => setOpen({ open: false })}>
        <RspDialogTitle title="RESUMEN DE CONTRATO" onClose={() => setOpen({ open: false })} />
        <DialogContent>
            {isNotNil(property) && <PropertyDetails property={property} />}
            {isNotNil(contractData) && <ContractDetails contract={contractData} actions={
                <Stack spacing={1} direction="row" sx={{ justifyContent: "end", alignItems: "center" }}>
                    <Button disabled={loading} variant="contained" color='warning' onClick={() => {
                        setFinalizeContractModal(true);
                    }}>REACTIVAR</Button>
                </Stack>
            } />}
            {isNotNil(contractData) && <ContractTabs contract={contractData} editMode={false} /> }

            <AlertModal
                open={finalizeContractModal}
                message="Estas seguro que quieres reactivar el contrato?. El contrato pasará a la lista de CANCELADOS / EXPIRADOS."
                closeModal={() => {
                    setFinalizeContractModal(false);
                }}
                onConfirmation={finalizeContract}
            />
        </DialogContent>

        
    </RspDialog>)
    
}

export default FinalizedContractDetails;
