'use client';
import { FC, useContext, useEffect } from 'react';
import { LoadingDialog } from '@phoxer/react-components';
import { StoreContext } from '@src/DataProvider';
import PageWrapper from '@src/Components/Wrappers/Page';
import { useRouter } from 'next/navigation'

const Main: FC = () => {
    const { push } = useRouter();
    const { state } = useContext(StoreContext);
    const { user } = state;

    useEffect(() => {
        if (user.id > 0) {
            switch(user.role) {
                case 5:
                case 4:
                case 3:
                    push('/contracts/payments');
                break
                default:
                    push('contracts/');
                break;
            }
            
        }
    }, [user.id, push]);

    return <LoadingDialog show={true} />
}

export default Main;