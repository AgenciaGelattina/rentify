import { createContext, FC, useContext, useEffect, useState } from "react";
import { Card, CardActions, CardContent, CardHeader, Drawer, IconButton, Stack } from "@mui/material";
import { useFetchData } from "@phoxer/react-components";
import { IProperty } from "../Properties/Details";
import { IContract } from "../Properties/Contracts/Details";
import Binnacle, { IBinnacle } from "./Binnacle";
import BinnacleForm from "./Form";
import { Add, Close } from "@mui/icons-material";
import useDataResponse from "@src/Hooks/useDataResponse";
import { StoreContext } from "@src/DataProvider";
import LoadingBox from "../LoadingBox";

interface IBinnaclesProps {
    openBinnacle: boolean;
    setOpenBinnacle: (open: boolean) => void;
    property: IProperty;
    contract?: IContract;
};

interface IBinnaclesData {
    binnacles: IBinnacle[];
    total: number;
    page: number;
    limit: number;
};

const binnaclesDataDefault: IBinnaclesData = {
    binnacles: [],
    total: 0,
    page: 0,
    limit: 50
};
/*
const BinnaclesContext = createContext<TUseSnackMessages>({ openBinnacle: () => {}, total: 0, });

export const useSnackMessages = (): TUseSnackMessages => {
    return useContext(SnackMessagesContext);
}
*/
const Binnacles: FC<IBinnaclesProps> = ({ openBinnacle, setOpenBinnacle, property, contract }) => {
    const { state: { user } } = useContext(StoreContext);
    const { fetchData, loading } = useFetchData(`${process.env.NEXT_PUBLIC_API_URL!}`);
    const { validateResult } = useDataResponse();
    const [binnaclesData, setBinnaclesData] = useState<IBinnaclesData>(binnaclesDataDefault);

    const getBinnacles = () => {
        let params: Object = { property_id: property.id };
        if (contract) {
            params = { ...params, contract_id: contract.id };
        };

        fetchData.get('/properties/binnacles.php', params, (response: any) => {
            const data = validateResult(response.result);
            if (data) {
                setBinnaclesData(data);
            };
        });
    };

    useEffect(() => {
        if (openBinnacle) {
            getBinnacles();
        }
    }, [property.id, contract?.id, openBinnacle]);
    
    return (<>
        <Drawer
            anchor={"right"}	
            open={openBinnacle}
            onClose={() => setOpenBinnacle(false)}
        >
            <Card>
                <CardHeader
                    action={
                        <IconButton onClick={() => setOpenBinnacle(false)}>
                            <Close />
                        </IconButton>
                    }
                    title={`Bitácora de: ${property.title}`}
                    subheader={contract ? `Contrato #: ${contract.id}` : ''}
                />
            </Card>
            <CardContent>
                {loading && <LoadingBox />}
                {binnaclesData.binnacles.length > 0 && (<Stack spacing={2}>
                    {binnaclesData.binnacles.map((binnacle: IBinnacle, ix: number) => {
                        return <Binnacle key={ix} binnacle={binnacle} />;
                    })}
                </Stack>)}
            </CardContent>
            <CardActions disableSpacing>
                <IconButton>
                    <Add />
                </IconButton>
            </CardActions>
        </Drawer>
        <BinnacleForm />
    </>);
};

export default Binnacles;