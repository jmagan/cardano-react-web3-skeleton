/*
 * Created Date: Wednesday July 6th 2022
 * Author: Juan Salvador Magán Valero
 *
 * Copyright (c) 2022 Juan Salvador Magán Valero. All rights reserved.
 *
 */

import { useContext } from 'react';

import { WalletAPIContext } from '../context/WalletAPIContext';

export default function WalletIconComponent() {
  const { cardano } = window;
  const { selectedWallet } = useContext(WalletAPIContext);

  if (selectedWallet === 'Nami') {
    return <img src={cardano?.nami?.icon} alt="Nami Icon" height="18px" />;
  }

  if (selectedWallet === 'Flint') {
    return <img src={cardano?.flint?.icon} alt="Flint Icon" height="18px" />;
  }

  if (selectedWallet === 'Eternl') {
    return <img src={cardano?.eternl?.icon} alt="Eternl Icon" height="18px" />;
  }

  return null;
}
