import React from 'react';
import { useSorobanReact } from '@soroban-react/core';
export default function Wallet() {
  const { address, activeChain, server, connect, disconnect } =
    useSorobanReact();

  const handleConnect = async () => {
    await connect();
  };
  const handleDisconnect = async () => {
    await disconnect();
  };
  return (
    <>
      {/* <button onClick={handleDisconnect}>disconnect</button> */}
      <button onClick={handleConnect}>connect</button>

      <div>Wallet address:- {address ? address : '--'} </div>
    </>
  );
}
