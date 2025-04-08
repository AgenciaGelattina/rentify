import { ICurrency } from "@src/Components/Forms/CurrencySelector";
import { IProperty } from "@src/Components/Properties/Details";
import { FC, useState } from "react";
import { TContractType } from "../../Details";
import { clone } from "ramda";
import ConditionalAlert from "@src/Components/ConditionalAlert";
import { TCallBack, useFetchData } from "@phoxer/react-components";
import { FieldValues } from "react-hook-form";
import useDataResponse from "@src/Hooks/useDataResponse";
import NewExpressContract from "./Express";
import NewRecurringContract from "./Recurring";
import { getUIKey } from "@src/Utils";
import { Divider, FormControlLabel, Switch } from "@mui/material";
import { CONTRACT_TYPE } from "@src/Constants";

export interface INewContractData {
    id: number;
    type: TContractType;
    property: number;
    currency: ICurrency;
    value: number;
    due_date: number;
    start_date: Date | null;
    end_date: Date | null;
    in_date: Date | null;
    out_date: Date | null;
}

export const formatContractData = (contract: INewContractData) => {
    const contractData = clone(contract);
    contractData.start_date = contract.start_date ? new Date(contract.start_date) : null;
    contractData.end_date = contract.end_date ? new Date(contract.end_date) : null;
    contractData.in_date = contract.in_date ? new Date(contract.in_date) : null;
    contractData.out_date = contract.out_date ? new Date(contract.out_date) : null;
    contractData.value = 0;
    return contractData;
}

interface INewContractProps {
    property: IProperty;
    onContractDataSaved: () => void;
}

const NewContract: FC<INewContractProps> = ({ property, onContractDataSaved }) => {
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const [isExpress, setIsExpress] = useState<boolean>(false);
    const { validateResult } = useDataResponse();

    const saveContractData = (data: FieldValues) => {

        // default folders
        data.folders = [
            { name: getUIKey({ removeHyphen: true, toUpperCase: true }), title: "Contrato y Documentos", description: "Documentación del contrato" },
            { name: getUIKey({ removeHyphen: true, toUpperCase: true }), title: "Fotos de la Propiedad", description: "Evidencia de condiciones de la propiedad antes de la entrega" }
        ];
        
        fetchData.post('/properties/contracts/contract.php', data, (response: TCallBack) => {
            const success = validateResult(response.result);
            if (success) {
                onContractDataSaved();
            }
        });
    }
    
    return (<>
        <ConditionalAlert condition={true} severity="warning" title="No hay un contrato vigente." message="Inicie un contrato nuevo." />
        <FormControlLabel
            control={
                <Switch
                    checked={isExpress}
                    onChange={() => setIsExpress((exp:boolean) => !exp)}
                    inputProps={{ 'aria-label': 'express' }}
                />
            }
            label={`Contrato ${isExpress ? CONTRACT_TYPE.express : CONTRACT_TYPE.recurring}`}
        />
        <Divider />
        {!isExpress && <NewRecurringContract property={property} loading={loading} saveContractData={saveContractData} />}
        {isExpress && <NewExpressContract property={property} loading={loading} saveContractData={saveContractData} />}
    </>);
}

export default NewContract;