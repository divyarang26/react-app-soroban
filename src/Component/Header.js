import React, { useState } from 'react'
import * as SorobanClient from "soroban-client"
import {
  isConnected,
  getPublicKey,
  signTransaction,
} from "@stellar/freighter-api";
window.Buffer = window.Buffer || require("buffer").Buffer;

export default function Header() {

  const [key ,setkey] = useState();

    // const invokerKeypair = SorobanClient.Keypair.fromSecret(process.env.REACT_APP_PRIVATE_KEY_BORROW);
    // let key = invokerKeypair.publicKey()
    // const invokerKeypair2 = SorobanClient.Keypair.fromSecret(process.env.REACT_APP_PRIVATE_KEY_LENDER);
    // let key2 = invokerKeypair2.publicKey()
    // console.log(process.env.REACT_APP_PRIVATE_KEY_LENDER);

    const connectWallet = (e) =>{
      e.preventDefault();
      
      if (isConnected()) {
        alert("User has Freighter!");
      }
      
      const retrievePublicKey = async () => {
        let publicKey = "";
        let error = "";
      
        try {
          publicKey = await getPublicKey();
        } catch (e) {
          error = e;
        }
      
        if (error) {
          return error;
        }
    
        setkey(publicKey)
        // return publicKey;

      };
      
      const result = retrievePublicKey();
      // console.log("key2222",publicKey);
    }

  return (
    <div>
        <div >
               
              
                <button onClick={e =>{connectWallet(e)}}  className="public_key">
                    Wallet
                </button>
                  
                
                <div className="public_key" >
                    borrower key: {key}
                </div>
                {/* <div className="public_key" >
                   lender key: {key2}
                </div>  */}
            </div>
    </div>
  )
}
