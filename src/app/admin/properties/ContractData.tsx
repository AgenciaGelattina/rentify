import { FC, useEffect, useState } from 'react';
import { Button, Divider } from '@mui/material';
import { ConditionalRender, TCallBack, useFetchData, useSnackMessages } from '@phoxer/react-components';
import LoadingBox from '@src/Components/LoadingBox';
import useDataResponse from '@src/Hooks/useDataResponse';
import { IProperty } from '@src/Components/Properties/Details';
import RecurringList from '@src/Components/Properties/Contracts/Payments/Recurring';
import { IRecurringPaymentForm } from '@src/Components/Properties/Contracts/Payments/Recurring/Form';
import Header from '@src/Components/Header';
import ContractForm, { defaultContractValues, IContractData } from '@src/Components/Properties/Contracts/ContractForm';
import { isNil } from 'ramda';
import ContractDetails, { IContract } from '@src/Components/Properties/Contracts/Details';
import ContractTabs from '@src/Components/Properties/Contracts/Details/Tabs';

interface IContractDataProps {
    property: IProperty;
}

const ContractData: FC<IContractDataProps> = ({ property }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const [contractData, setContractData] = useState<IContract | null>(null);
    const [editContract, setEditContract] = useState<boolean>(false);
    const [recurringPaymentForm, setRecurringPaymentForm] = useState<IRecurringPaymentForm>({ open: false, recurringPayment: null });
    //const { showSnackMessage } = useSnackMessages();

    const getContractData = () => {
        setContractData(null);
        setEditContract(false);
        fetchData.get('/properties/contracts/contract.php', { property_id: property.id }, (response: TCallBack) => {
            const contract = validateResult(response.result);
            console.log('CONTRACT', contract);
            if (contract) {
                setContractData(contract);
                if (contract.id === 0 ) {
                    setEditContract(true);
                }
            }
        });
    }

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
        <ConditionalRender condition={isNewContract || editContract}>
            <ContractForm property={property} contract={null} onContractDataSaved={getContractData} />
        </ConditionalRender>
        <ConditionalRender condition={!isNewContract}>
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
        </ConditionalRender>
    </>);
}

export default ContractData;