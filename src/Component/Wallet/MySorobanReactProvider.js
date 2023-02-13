import React from 'react';
import {
  SorobanReactProvider,
  getDefaultConnectors,
} from '@soroban-react/core';
import { chain } from '../../utils/allowedChains';

const chains = [chain.sandbox, chain.standalone, chain.futurenet];
const { connectors } = getDefaultConnectors({
  appName: 'Example Stellar App',
  chains,
});

export default function MySorobanReactProvider({ children }) {
  // console.log("soororororo",allowedChains)
  return (
    <SorobanReactProvider chains={chains} connectors={connectors}>
      {children}
    </SorobanReactProvider>
  );
}
