import { FC, useEffect, useState } from 'react';
import { Button, Divider, Stack } from '@mui/material';
import { ConditionalRender, TCallBack, useFetchData, useSnackMessages } from '@phoxer/react-components';
import LoadingBox from '@src/Components/LoadingBox';
import useDataResponse from '@src/Hooks/useDataResponse';
import { IProperty } from '@src/Components/Properties/Details';
import NewContract from '@src/Components/Properties/Contracts/ContractForm/NewContract';
import EditContract, { IEditContractData, defaultContractValues } from '@src/Components/Properties/Contracts/ContractForm/EditContract/Recurring';
import { isNil, isNotNil } from 'ramda';
import ContractDetails, { IContract } from '@src/Components/Properties/Contracts/Details';
import ContractTabs from '@src/Components/Properties/Contracts/Details/Tabs';
import AlertModal, { IAlertModalProps } from '@src/Components/AlertModal';
import RecurringPayments from '@src/Components/Properties/Contracts/Charges/Recurring';
import ExpressPayments from '@src/Components/Properties/Contracts/Charges/Express';

interface IContractDataToEdit {
    showEditForm: boolean;
    contract?: IEditContractData;
}

export const formatContractDataToEdit = (contract: IContract, property: IProperty): IEditContractData => {
    return {
        id: contract.id,
        property: property.id,
        currency: contract.currency,
        due_date: contract.due_date.day,
        start_date: contract.start_date ? new Date(contract.start_date) : null,
        end_date: contract.end_date ? new Date(contract.end_date) : null,
        in_date: contract.in_date ? new Date(contract.in_date) : null,
        out_date: contract.out_date ? new Date(contract.out_date) : null,
    }
}

interface IContractDataProps {
    property: IProperty;
    getProperties: () => void;
}

const ContractData: FC<IContractDataProps> = ({ property, getProperties }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const [contractData, setContractData] = useState<IContract | null>(null);
    const [editContract, setEditContract] = useState<IContractDataToEdit>({ showEditForm: false });
    const [cancelContractModal, setCancelContractModal] = useState<boolean>(false);

    const getContractData = () => {
        setContractData(null);
        fetchData.get('/properties/contracts/contract.php', { property_id: property.id, status: "current" }, (response: TCallBack) => {
            const contract = validateResult(response.result);
            if (contract) {
                setContractData(contract);
                if (contract.id > 0) {
                    setEditContract({ showEditForm: false, contract: formatContractDataToEdit(contract, property) });
                }
            }
        });
    }

    const onContractDataSaved = () => {
        getContractData();
        getProperties();
    }

    const cancelContract = () => {
        setCancelContractModal(false);
        if (contractData) {
            fetchData.post('/properties/contracts/cancel.php', { property_id: property.id, contract_id: contractData.id, cancel: 1 }, (response: TCallBack) => {
                const canceled = validateResult(response.result);
                if (canceled) {
                    getProperties();
                    getContractData();
                }
            });
        }
    };

    useEffect(() => {
        if (property && property.id > 0) {
            getContractData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [property]);

    if (loading || isNil(contractData)) {
        return <LoadingBox />
    };

    const isNewContract = contractData.id === 0;
    const isRecurring = contractData.type === "recurring";
    const isExpress = contractData.type === "express";

    return (<>
        {isNewContract &&  <NewContract property={property} onContractDataSaved={onContractDataSaved} />}
        {(editContract.showEditForm && isNotNil(editContract.contract)) && (
            <EditContract contract={editContract.contract} onContractDataSaved={onContractDataSaved} onCancel={() => {
                setEditContract((fd: IContractDataToEdit) => {
                    return { ...fd, showEditForm: false }
                });
            }} />
        )}
        {((!isNewContract && !editContract.showEditForm) && contractData.id > 0) && (<>
            <ContractDetails contract={contractData} actions={
                <Stack spacing={1} direction="row" sx={{ justifyContent: "end", alignItems: "center" }}>
                    <Button disabled={loading} variant="contained" color='warning' onClick={() => {
                        setCancelContractModal(true);
                    }}>CANCELAR</Button>
                    {isRecurring && <Button disabled={loading} variant="contained" onClick={() => {
                        setEditContract((fd: IContractDataToEdit) => {
                            return { ...fd, showEditForm: true }
                        });
                    }}>EDITAR</Button>}
            </Stack>
            } />
            <Divider sx={{ margin: '1rem 0 1rem 0' }} />
            
            {isRecurring && <RecurringPayments
                contract={contractData}
                editMode={true}
            /> }

            {isExpress && <ExpressPayments
                contract={contractData}
                editMode={true}
            />}

            <ContractTabs contract={contractData} property={property} />
            <Divider sx={{ margin: '1rem 0 1rem 0' }} />
            
            <AlertModal
                open={cancelContractModal}
                message="Estas seguro que quieres cancelar el contrato?, el contrato pasará a la lista de CANCELADOS / EXPIRADOS"
                closeModal={() => {
                    setCancelContractModal(false);
                }}
                onConfirmation={cancelContract}
            />
        </>)}
    </>);
}

export default ContractData;