import React from 'react'
import * as SorobanClient from "soroban-client"
window.Buffer = window.Buffer || require("buffer").Buffer;

export default function Vault_req() {
    const invokerKeypair = SorobanClient.Keypair.fromSecret(process.env.REACT_APP_PRIVATE_KEY_BORROW);
    let key = invokerKeypair.publicKey();
    console.log("xdr",SorobanClient.xdr);

    function addFootprint(raw, networkPassphrase, footprint) {
        if ('innerTransaction' in raw) {
            // TODO: Handle feebump transactions
            return addFootprint(raw.innerTransaction, networkPassphrase, footprint);
        }
        // TODO: Figure out a cleaner way to clone this transaction.
        const source = new SorobanClient.Account(raw.source, `${parseInt(raw.sequence) - 1}`);
        const txn = new SorobanClient.TransactionBuilder(source, {
            fee: raw.fee,
            memo: raw.memo,
            networkPassphrase,
            timebounds: raw.timeBounds,
            ledgerbounds: raw.ledgerBounds,
            minAccountSequence: raw.minAccountSequence,
            minAccountSequenceAge: raw.minAccountSequenceAge,
            minAccountSequenceLedgerGap: raw.minAccountSequenceLedgerGap,
            extraSigners: raw.extraSigners,
        });
        for (let rawOp of raw.operations) {
            if ('function' in rawOp) {
                console.log("🚀 ~ file: client.js ~ line 55 ~ addFootprint ~ rawOp", rawOp);
                // TODO: Figure out a cleaner way to clone these operations
                txn.addOperation(SorobanClient.Operation.invokeHostFunction({
                    function: rawOp.function,
                    parameters: rawOp.parameters,
                    footprint: SorobanClient.xdr.LedgerFootprint.fromXDR(footprint, 'base64'), // just updating the footprint value here.
                }));
            } else {
                // TODO: Handle this.
                throw new Error("Unsupported operation type");
            }
        }
        return txn.build();
    }

    const handleClick = async (e) => {
        e.preventDefault();
        // Connect to the SOROBAN_RPC_URL Node with the SorobanClient.
        const server = new SorobanClient.Server(`${process.env.REACT_APP_SOROBAN_RPC_URL}`, { allowHttp: true }); // we call node as server here
        console.log("🚀 ~ file: client.js ~ line 69 ~ main ~ server", server);


        console.log("🚀 ~ file: client.js ~ line 73 ~ main ~ invokerKeypair.publicKey()", invokerKeypair.publicKey());



        let { sequence } = await server.getAccount(invokerKeypair.publicKey())
        console.log("🚀 ~ file: client.js ~ line 72 ~ main ~ sequence", sequence);

        let invokerAccount = new SorobanClient.Account(invokerKeypair.publicKey(), sequence) // In stellar-sdk: // const invokerAccount = await server.loadAccount(invokerKeypair.publicKey());
        console.log("🚀 ~ file: client.js ~ line 74 ~ main ~ invokerAccount", invokerAccount);



        // /********** WAY 02: Build the hello transaction with SorobanClient.Operation.invokeHostFunction **********/
        // // parameters required by fn SorobanClient.Operation.invokeHostFunction(opts) //default opts
        let opts = {
            function: SorobanClient.xdr.HostFunction.hostFnInvokeContract(),//24 operation of //it take all th funtion as a param 
            parameters: [],
            footprint: new SorobanClient.xdr.LedgerFootprint({ readOnly: [], readWrite: [] })//empty
        };

        // // updating above opts object
        let contractIdObj = SorobanClient.xdr.ScVal.scvObject(SorobanClient.xdr.ScObject.scoBytes(Buffer.from(process.env.REACT_APP_CONTRACT_ID, 'hex')));
        opts.parameters.push(contractIdObj); // 1. Push Contract ID

        let contractFnNameObj = SorobanClient.xdr.ScVal.scvSymbol("vault_req"); // let's say we want to invoke hello method
        opts.parameters.push(contractFnNameObj); // 2. Push Function Name

        let contractMethodParameterObj = SorobanClient.xdr.ScVal.scvSymbol(key); // symbol passing
        opts.parameters.push(contractMethodParameterObj); // 3. Push Function Argument


        contractMethodParameterObj = SorobanClient.xdr.ScVal.scvObject(SorobanClient.xdr.ScObject.scoU32(new SorobanClient.xdr.Uint32(Number(100)))); // u64 - working ref
        opts.parameters.push(contractMethodParameterObj); // 4. Push Function Argument 2
        contractMethodParameterObj = SorobanClient.xdr.ScVal.scvObject(SorobanClient.xdr.ScObject.scoU32(new SorobanClient.xdr.Uint32(Number(100)))); // u64 - working ref
        opts.parameters.push(contractMethodParameterObj); // 4. Push Function Argument 2
        contractMethodParameterObj = SorobanClient.xdr.ScVal.scvObject(SorobanClient.xdr.ScObject.scoU32(new SorobanClient.xdr.Uint32(Number(8)))); // u64 - working ref
        opts.parameters.push(contractMethodParameterObj); // 4. Push Function Argument 3
        contractMethodParameterObj = SorobanClient.xdr.ScVal.scvObject(SorobanClient.xdr.ScObject.scoU32(new SorobanClient.xdr.Uint32(Number(3)))); // u64 - working ref
        opts.parameters.push(contractMethodParameterObj); // 4. Push Function Argument 4
        

        // // We'll add footprint in tx below, using way 01

        let hello_transaction = new SorobanClient.TransactionBuilder(invokerAccount, {
            fee: 100,
            networkPassphrase: process.env.REACT_APP_NETWORK_PASSPHRASE,
            v1: true
        })
            .addOperation(SorobanClient.Operation.invokeHostFunction(opts))
            .setTimeout(SorobanClient.TimeoutInfinite)
            .build();
        console.log("🚀 ~ file: client.js ~ line 185 ~ main ~ build hello_transaction without footprint, only opts", hello_transaction);

        // // updating footprint in hello_transaction // Footprint Way 01:
        // // // Next: Simulating Transaction to get a footprint // Transaction should contain invoke host function operation in order to get a footprint
        let { footprint } = await server.simulateTransaction(hello_transaction);
        console.log("🚀 ~ file: client.js ~ line 131 ~ main ~ Transaction Simulated; footprint", footprint);
        // "classic_transaction" does not have a footprint

        // // // Footprint Way 01
        // // // attaching the footprint created above to the previously created transaction object
        let transaction_with_footprint = addFootprint(hello_transaction, process.env.REACT_APP_NETWORK_PASSPHRASE, footprint);
        console.log("🚀 ~ file: client.js ~ line 196 ~ main ~ transaction_with_footprint", transaction_with_footprint);

        // // // Sign transaction_with_footprint using the invokerKeypair.
        transaction_with_footprint.sign(invokerKeypair);
        console.log('Transaction has been signed using invokerKeypair.');

        // // Finally, send the singed tx obj to the servers.
        try {
            let response = await server.sendTransaction(transaction_with_footprint);
            // if (response) {
            //     setid(response.id);
            //     setsucess(false);
            // }
            // Soroban server do not have a submitTransaction endpoint
            console.log(`transaction_with_footprint was successfully submitted.\nComplete response: ${JSON.stringify(response)} \nTransaction hash: ${response.id}`);
        } catch (error) {
            console.log(`Tx Failed! More details:\n${JSON.stringify(error)}`);
        }
    }


  return (
    <div>
         <div className="card">
                <header className='card-header'>

                    Vault Request

                </header>
                <form className="card-form"  >
                    <div className="input">
                        <input type="text" className="input-field" />
                        <label className="input-label">Principle</label>
                    </div>
                    <div className="input">
                        <input type="text" className="input-field"  />
                        <label className="input-label">rate</label>
                    </div>
                    <div className="input">
                        <input type="text" className="input-field"  />
                        <label className="input-label">months</label>
                    </div>
                    <div className="input">
                        <input type="text" className="input-field"  />
                        <label className="input-label">lent_token</label>
                    </div>


                    <div className="action">
                        <button className="action-button"
                        // onClick={(e)=>{
                        //     e.preventDefault()
                        //     console.log("to", to );
                        //     console.log("param", param )   
                        // }}
                        >submit</button>
                    </div>
                </form>

            </div>
    </div>
  )
}
