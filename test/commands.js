const instance = await NftMarket.deployed();
instance.mintToken(
  "https://gateway.pinata.cloud/ipfs/Qme8374mgVYqwaZk2ASfBA2xwaXFMWTgKaZmKn6SoGv8Xy",
  "500000000000000000",
  { value: "25000000000000000", from: accounts[0] }
);

instance.mintToken(
  "https://gateway.pinata.cloud/ipfs/QmQ7StawT6cpuDV77ZKxTdYM2Bva8gcW5WmtFw5wFYARga",
  "300000000000000000",
  {
    value: "25000000000000000",
    from: accounts[0],
  }
);

instance.getListedNfts();
