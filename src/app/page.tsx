'use client';
import { FC } from 'react';
import PageWrapper from '@src/Components/Wrappers/Page';
import ContractsSummary from './summary/page';

const Main: FC = () => {
  return (<PageWrapper navigation>
    <ContractsSummary />
  </PageWrapper>)
}

export default Main;