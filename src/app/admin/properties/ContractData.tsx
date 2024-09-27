import { FC, useEffect, useState } from 'react';
import { Button, Divider, Stack } from '@mui/material';
import { ConditionalRender, TCallBack, useFetchData, useSnackMessages } from '@phoxer/react-components';
import LoadingBox from '@src/Components/LoadingBox';
import useDataResponse from '@src/Hooks/useDataResponse';
import { IProperty } from '@src/Components/Properties/Details';
import RecurringList from '@src/Components/Properties/Contracts/Payments/Recurring';
import { IRecurringPaymentForm } from '@src/Components/Properties/Contracts/Payments/Recurring/Form';
import Header from '@src/Components/Header';
import NewContract from '@src/Components/Properties/Contracts/ContractForm/NewContract';
import EditContract, { IEditContractData, defaultContractValues } from '@src/Components/Properties/Contracts/ContractForm/EditContract';
import { isNil, isNotNil } from 'ramda';
import ContractDetails, { IContract } from '@src/Components/Properties/Contracts/Details';
import ContractTabs from '@src/Components/Properties/Contracts/Details/Tabs';
import AlertModal, { IAlertModalProps } from '@src/Components/AlertModal';

interface IContractDataToEdit {
    showEditForm: boolean;
    contract?: IEditContractData;
}

const formatContractData = (contract: IContract, property: IProperty): IEditContractData => {
    return {
        id: contract.id,
        property: property.id,
        due_date: contract.due_date.day,
        start_date: contract.start_date ? new Date(contract.start_date) : null,
        end_date: contract.end_date ? new Date(contract.end_date) : null,
    }
}

interface IContractDataProps {
    property: IProperty;
}

const ContractData: FC<IContractDataProps> = ({ property }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const [contractData, setContractData] = useState<IContract | null>(null);
    const [editContract, setEditContract] = useState<IContractDataToEdit>({ showEditForm: false });
    const [endContractModal, setEndContractModal] = useState<boolean>(false);
    const [recurringPaymentForm, setRecurringPaymentForm] = useState<IRecurringPaymentForm>({ open: false, recurringPayment: null });
    //const { showSnackMessage } = useSnackMessages();

    const getContractData = () => {
        setContractData(null);
        fetchData.get('/properties/contracts/contract.php', { property_id: property.id }, (response: TCallBack) => {
            const contract = validateResult(response.result);
            if (contract) {
                setContractData(contract);
                setEditContract({ showEditForm: false, contract: formatContractData(contract, property) })
            }
        });
    }

    const endContract = () => {
        setEndContractModal(false);
        if (contractData) {
            fetchData.post('/properties/contracts/activation.php', { contract_id: contractData.id, action: "cancel" }, (response: TCallBack) => {
                const canceled = validateResult(response.result);
                if (canceled) {
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

    return (<>
        <ConditionalRender condition={isNewContract}>
            <NewContract property={property} contract={null} onContractDataSaved={getContractData} />
        </ConditionalRender>
        <ConditionalRender condition={editContract.showEditForm && isNotNil(editContract.contract)}>
            <EditContract contract={editContract.contract} onContractDataSaved={getContractData} />
        </ConditionalRender>
        <ConditionalRender condition={(!isNewContract && !editContract.showEditForm ) && contractData.id > 0}>
            <ContractDetails contract={contractData} />
            <Divider sx={{ margin: '1rem 0 1rem 0' }} />
            <Header title="PAGOS RECURRENTES:" typographyProps={{ variant: "subtitle2"} }>
                <Button size='small' disabled={loading} onClick={() => setRecurringPaymentForm({ open: true, recurringPayment: null })}>+ PAGO RECURRENTE</Button>
            </Header>
            <RecurringList
                contract={contractData}
                editMode={true}
                recurringPaymentForm={recurringPaymentForm}
                setRecurringPaymentForm={setRecurringPaymentForm}
            />
            <ContractTabs contract={contractData} editMode={true} />
            <Divider sx={{ margin: '1rem 0 1rem 0' }} />
            <Stack spacing={1} direction="row" sx={{ justifyContent: "end", alignItems: "center" }}>
                <Button disabled={loading} variant="contained" color='error' onClick={() => {
                    setEndContractModal(true);
                }}>FINALIZAR</Button>
                <Button disabled={loading} variant="contained" onClick={() => {
                    setEditContract((fd: IContractDataToEdit) => {
                        return { ...fd, showEditForm: true }
                    });
                }}>EDITAR</Button>
            </Stack>
            <AlertModal
                open={endContractModal}
                message="Estas seguro que quieres finalizar el contrato?"
                closeModal={() => {
                    setEndContractModal(false);
                }}
                onConfirmation={endContract}
            />
        </ConditionalRender>
    </>);
}

export default ContractData;