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
import EditContract, { IEditContractData } from '../../ContractForm/EditContract/Recurring';
import { formatContractDataToEdit } from '@src/app/admin/properties/ContractData';
import ContractTabs from '../../Details/Tabs';
import { isAfter } from 'date-fns';

export interface IExpiredContractSummary {
    open: boolean;
    contract?: IContract;
    property?: IProperty;
}

interface IContractDataToEdit {
    showEditForm: boolean;
    contract?: IEditContractData;
}

interface IExpiredContractDetails extends IExpiredContractSummary {
    setOpen: (value: SetStateAction<IExpiredContractSummary>) => void;
    getContractsList: () => void;
    getProperties: () => void;
    onRenewContract: (contract: IContract) => void;
}

const ExpiredContractDetails: FC<IExpiredContractDetails> = ({ open, contract, property, setOpen, getContractsList, getProperties, onRenewContract }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const [contractData, setContractData] = useState<IContract | null>();
    const [editContract, setEditContract] = useState<IContractDataToEdit>({ showEditForm: false });
    const [finalizeContractModal, setFinalizeContractModal] = useState<boolean>(false);

    const getContractData = () => {
        setContractData(null);
        if (isNotNil(contract) && isNotNil(property)) {
            fetchData.get('/properties/contracts/contract.php', { contract_id: contract.id, status: "data" }, (response: TCallBack) => {
                const contract = validateResult(response.result);
                if (contract) {
                    setContractData(contract);
                    setEditContract({ showEditForm: false, contract: formatContractDataToEdit(contract, property) })
                }
            });
        }
    };

    useEffect(() => {
        if (open) {
            getContractData();
        } else {
            setContractData(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);
    

    const activateContract = () => {
        if (isNotNil(contractData) && isNotNil(property)) {
            fetchData.post('/properties/contracts/cancel.php', { property_id: property.id, contract_id: contractData.id, cancel: 0 }, (response: TCallBack) => {
                const actived = validateResult(response.result);
                if (actived) {
                    getProperties();
                    getContractsList();
                    setOpen({ open: false });
                }
            });
        }
    };

    const finalizeContract = () => {
        setFinalizeContractModal(false);
        if (isNotNil(contractData)) {
            fetchData.post('/properties/contracts/finalize.php', { contract_id: contractData.id, finalize: 1 }, (response: TCallBack) => {
                const finalized = validateResult(response.result);
                if (finalized) {
                    getContractsList();
                    setOpen({ open: false });
                }
            });
        }
    };

    const renewContract = () => {
        if (isNotNil(contractData)) {
            onRenewContract(contractData);
            setOpen({ open: false });
        }
    }

    const canBeReactivated = contractData?.canceled && !contractData?.expired;
    const canBeRenewed = !contractData?.canceled && contractData?.expired;
    const isRecurring = contractData?.type === "recurring";
    //const isExpress = contractData?.type === "express";

    return (<RspDialog open={open} onClose={() => setOpen({ open: false })}>
        <RspDialogTitle title="RESUMEN DE CONTRATO" onClose={() => setOpen({ open: false })} />
        <DialogContent>
            {isNotNil(property) && <PropertyDetails property={property} />}
            {editContract.showEditForm && editContract.contract && isRecurring && <EditContract contract={editContract.contract} onContractDataSaved={getContractData} onCancel={() => {
                setEditContract((fd: IContractDataToEdit) => {
                    return { ...fd, showEditForm: false }
                });
            }} />}
            {isNotNil(contractData) && !editContract.showEditForm && <ContractDetails contract={contractData} actions={
                <Stack spacing={1} direction="row" sx={{ justifyContent: "end", alignItems: "center" }}>
                    {canBeRenewed && isRecurring && <Button disabled={loading} variant="contained" color='success' onClick={renewContract}>RENOVAR</Button>}
                    {canBeReactivated && <Button disabled={loading} variant="contained" color='error' onClick={activateContract}>REACTIVAR</Button>}
                    <Button disabled={loading} variant="contained" color='error' onClick={() => {
                        setFinalizeContractModal(true);
                    }}>FINALIZAR</Button>
                    {isRecurring && <Button disabled={loading} variant="contained" onClick={() => {
                        setEditContract((fd: IContractDataToEdit) => {
                            return { ...fd, showEditForm: true }
                        });
                    }}>EDITAR</Button>}
                </Stack>
            } />}
            {(isNotNil(property) && isNotNil(contractData)) && <ContractTabs contract={contractData} property={property} /> }

            <AlertModal
                open={finalizeContractModal}
                message="Estas seguro que quieres finalizar el contrato?. El contrato pasará a la lista de finalizados."
                closeModal={() => {
                    setFinalizeContractModal(false);
                }}
                onConfirmation={finalizeContract}
            />
        </DialogContent>
    </RspDialog>)
}

export default ExpiredContractDetails;
