import { FC } from 'react';
import TabsContent from '@src/Components/TabsContent';
import FileFolders from '@src/Components/Properties/Contracts/FileFolders';
import Payments from '@src/Components/Properties/Contracts/Payments';
import Comments from '@src/Components/Properties/Contracts/Comments';
import Contractors from '@src/Components/Properties/Contracts/Contractors';
import { IContract } from '..';
import { IProperty } from '@src/Components/Properties/Details';

interface IContractTabsProps {
    property: IProperty;
    contract: IContract;
}

const ContractTabs: FC<IContractTabsProps> = ({ property, contract }) => {
    return (<TabsContent tabs={[
        {
            tab: { label: "PAGOS" },
            component: () => {
                return <Payments contract={contract}  />;
            }
        },
        { 
            tab: { label: "CONTACTOS" },
            component: () => {
                return <Contractors contract={{ id: contract.id }}  />;
            }
        },
        { 
            tab: { label: "COMENTARIOS" },
            component: () => {
                return <Comments contract={{ id: contract.id }} property={{ id: property.id }}  />
            }
        },
        { 
            tab: { label: "ARCHIVOS" },
            component: () => {
                return <FileFolders contract={{ id: contract.id }}  />
            }
        }
    ]} />);
}

export default ContractTabs;