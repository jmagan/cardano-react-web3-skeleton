import React, {useContext} from 'react';
import { WalletAPIContext } from '../context/WalletAPIContext';

import * as CSL from '@emurgo/cardano-serialization-lib-browser';
import * as MSG from '@emurgo/cardano-message-signing-browser';

export default function HomePage() {

  const { walletAPI } = useContext(WalletAPIContext);

  const signTest01 = async () => {
    console.log("Testing sign 01");

    const fullAddress = CSL.Address.from_bech32("addr_test1qp0e5qe6qgcy3vq0edsn962hz5cdnj9cecv8l3ajz89z6up092f5h9tjd7zgaj054jqa337mtue6mrmkfd93n48dqdvsj8las4");
    const stakeAddress = CSL.Address.from_bech32("stake_test1uqhj4y6tj4exlpywe862eqwccld47vad3amykjce6nksxkgmcqd2e");

    const signedData = await walletAPI.signData(stakeAddress.to_hex(), Buffer("Hello sign 01").toString("hex"));

    console.log(signedData);

    console.log("Creating COSE_Sign1: " + JSON.stringify(signedData.signature));
    const message = MSG.COSESign1.from_bytes(Buffer.from(signedData.signature, "hex")); 

    const key = MSG.COSEKey.from_bytes(Buffer.from(signedData.key, "hex"));
    
    
    console.log("Payload: " + Buffer.from(message.signed_data().payload()).toString("hex")); 

    console.log("Public key: " + Buffer.from(key.header(MSG.Label.new_int(MSG.Int.new_negative(MSG.BigNum.from_str("2")))).as_bytes()).toString("hex")); 

    console.log("Signed data: " + Buffer.from(message.signed_data().to_bytes()).toString("hex"));

    
    const publicKey = CSL.PublicKey.from_hex(Buffer.from(key.header(MSG.Label.new_int(MSG.Int.new_negative(MSG.BigNum.from_str("2")))).as_bytes()).toString("hex"));

    console.log(Buffer.from("Hello sign 01"));
    console.log(Buffer.from("Hello sign 01").toString("hex"));
    console.log(publicKey.verify(message.signed_data().to_bytes(), 
      CSL.Ed25519Signature.from_hex("78220748F21321869410F90F0B4EEC64F65100B9DF0769EB3BB08EC3F39402A05BBEE159EB6EC0B0F48A28E98A15A0FE49097D7BE9456CC196E4BB7ACB364D03")));
    console.log("Public key hash " + publicKey.hash().to_hex());
  } 

  return (<>
    <div>Hello World!</div>

    <button onClick={ () => signTest01() }>Sign test 01</button>
  </>)
}