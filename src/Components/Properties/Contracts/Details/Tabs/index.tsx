import { FC } from 'react';
import TabsContent from '@src/Components/TabsContent';
import FileFolders from '@src/Components/Properties/Contracts/FileFolders';
import Payments from '@src/Components/Properties/Contracts/Payments';
import Contractors from '@src/Components/Properties/Contracts/Contractors';
import { IContract } from '..';

interface IContractTabsProps {
    contract: IContract;
    editMode: boolean;
}

const ContractTabs: FC<IContractTabsProps> = ({ contract, editMode }) => {

    return (<TabsContent tabs={[
        { 
            tab: { label: "PAGOS" },
            component: () => {
                return <Payments contract={contract} editMode={editMode} />;
            }
        },
        { 
            tab: { label: "CONTACTOS" },
            component: () => {
                return <Contractors contract={{ id: contract.id }} editMode={editMode} />;
            }
        },
        { 
            tab: { label: "ARCHIVOS" },
            component: () => {
                return <FileFolders contract={{ id: contract.id }} editMode={editMode} />
            }
        }
    ]} />);
}

export default ContractTabs;