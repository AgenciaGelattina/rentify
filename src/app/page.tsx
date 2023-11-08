'use client';
import { useContext } from "react";
import { StoreContext } from '@src/DataProvider';
import PageWrapper from '@src/Components/Wrappers/Page';

const Main: React.FC = () => {
  const { state } = useContext(StoreContext);
  //const { user } = state;

  return (<PageWrapper navigation>
    hello Rentify Admin!!!
  </PageWrapper>)
}

export default Main;