interface Window { WavesKeeper: IWavesKeeper; }
declare var WavesKeeper: IWavesKeeper | undefined;

interface IWavesKeeperBase {
  /**
   * Allows subscribing to Waves Keeper events.
   */
  on: (event: 'update', cb: (state: IPublicState) => void) => void;
}
interface IWavesKeeper extends IWavesKeeperBase {
  /**
   * On initialize window.WavesKeeper has not api methods.
   * You can use WavesKeeper.initialPromise for waiting end initializing api.
   */
  initialPromise: Promise<IWavesKeeperReady>;
  /**
   * If a website is trusted, Waves Keeper public data are returned.
   */
  publicState?: publicState;
  /**
   * If a website is not trusted, events won't show.
   */
  auth?: auth;
  /**
   * A method for signing transactions in Waves' network.
   */
  signTransaction?: signTransaction;
  /**
   * This is similar to "signTransaction", but it also broadcasts a transaction to the blockchain.
   */
  signAndPublishTransaction?: signAndPublishTransaction;
  /**
   * A package transaction signature. Sometimes several transactions need to be simultaneously signed, 
   * and for users' convenience, up to seven transactions at ones could be signed
   */
  signTransactionPackage?: signTransactionPackage;
  /**
   * Waves Keeper's method for signing an order to the matcher. 
   */
  signOrder?: signOrder;
  /**
   * Waves Keeper's method for creating an order to the matcher is identical to signOrder,
   * but it also tries to send data to the matcher.
   */
  signAndPublishOrder?: signAndPublishOrder;
  /**
   * Waves Keeper's method for cancelling an order to the matcher. It works identically to 
   * signCancelOrder, but also tries to send data to the matcher.
   */
  signAndPublishCancelOrder?: signAndPublishCancelOrder;
  /**
   * Waves Keeper's method for signing cancellation of an order to the matcher. As input, 
   * it accepts an object similar to a transaction like this:
   */
  signCancelOrder?: signCancelOrder;
  /**
   * Waves Keeper's method for signing typified data, for signing requests on various services. 
   * As input, it accepts an object similar to a transaction like this:
   */
  signRequest?: signRequest;
}

interface IWavesKeeperReady extends IWavesKeeperBase {
  /**
   * If a website is trusted, Waves Keeper public data are returned.
   */
  publicState: publicState;
  /**
   * If a website is not trusted, events won't show.
   */
  auth: auth;
  /**
   * A method for signing transactions in Waves' network.
   */
  signTransaction: signTransaction;
  /**
   * This is similar to "signTransaction", but it also broadcasts a transaction to the blockchain.
   */
  signAndPublishTransaction: signAndPublishTransaction;
  /**
   * A package transaction signature. Sometimes several transactions need to be simultaneously signed, 
   * and for users' convenience, up to seven transactions at ones could be signed
   */
  signTransactionPackage: signTransactionPackage;
  /**
   * Waves Keeper's method for signing an order to the matcher. 
   */
  signOrder: signOrder;
  /**
   * Waves Keeper's method for creating an order to the matcher is identical to signOrder,
   * but it also tries to send data to the matcher.
   */
  signAndPublishOrder: signAndPublishOrder;
  /**
   * Waves Keeper's method for cancelling an order to the matcher. It works identically to 
   * signCancelOrder, but also tries to send data to the matcher.
   */
  signAndPublishCancelOrder: signAndPublishCancelOrder;
  /**
   * Waves Keeper's method for signing cancellation of an order to the matcher. As input, 
   * it accepts an object similar to a transaction like this:
   */
  signCancelOrder: signCancelOrder;
  /**
   * Waves Keeper's method for signing typified data, for signing requests on various services. 
   * As input, it accepts an object similar to a transaction like this:
   */
  signRequest: signRequest;
}


type publicState = () => Promise<IPublicState>;
type auth = (data: IAuthInput) => Promise<IAuthReturn>;

type signTransaction = (data: TransactionType) => Promise<ISignTransactionReturn | string>;
type signAndPublishTransaction = (data: TransactionType) => Promise<ISignTransactionReturn | string>;
type signTransactionPackage = (data: MassTransactionType[]) => Promise<ISignTransactionReturn[] | string[]>;

type signOrder = (data: IDataInput<1002, ISignOrderInput>) => Promise<string>;
type signAndPublishOrder = (data: IDataInput<1002, ISignOrderInput>) => Promise<string>;

type signAndPublishCancelOrder = (data: IDataInput<1003, ISignCancelOrderInput>) => Promise<string>;
type signCancelOrder = (data: IDataInput<1003, ISignCancelOrderInput>) => Promise<string>;

type signRequest = (data: IDataInput<1001 | 1004, ISignRequestInput>) => Promise<string>;

type AmountType = number | string | MoneyLike;

type MassTransactionType = IDataInput<3, ITransactionIssue> |
IDataInput<4, ITransactionTransfer> |
IDataInput<5, ITransactionReissue> |
IDataInput<6, ITransactionBurn> |
IDataInput<10, ITransactionCreateAlias> |
IDataInput<11, ITransactionMassTransfer> |
IDataInput<12, ITransactionDataTx>;

type TransactionType = IDataInput<3, ITransactionIssue> |
IDataInput<4, ITransactionTransfer> |
IDataInput<5, ITransactionReissue> |
IDataInput<6, ITransactionBurn> |
IDataInput<8, ITransactionLease> |
IDataInput<9, ITransactionLeaseCancel> |
IDataInput<10, ITransactionCreateAlias> |
IDataInput<11, ITransactionMassTransfer> |
IDataInput<12, ITransactionDataTx> |
IDataInput<13, ITransactionSetScript> |
IDataInput<14, ITransactionSponsorship> |
IDataInput<15, ITransactionSetAssetScript> |
IDataInput<16, ITransactionScriptInvocation>;


interface ITransactionBase {
  fee: MoneyLike;
  /**
   * sender's public key in base58
   */
  senderPublicKey?: string;
  /**
   * time in ms
   */
  timestamp?: number | string;
}

interface ITransactionIssue extends ITransactionBase {
  /**
   * token name, 4 to 16 bytes
   */
  name: string;
  /**
   * token description, 0 to 1000 bytes
   */
  description: string;
  quantity: number | string;
  /**
   * precision up to 8
   */
  precision: number,
  reissuable: boolean,
  /**
   * asset script
   */
  script?: string;
}

interface ITransactionTransfer extends ITransactionBase {
  amount: MoneyLike;
  /**
   * recipient's address or alias
   */
  recipient: string;
  /**
   * [,140 bytes] string or byte Array – additional info in text
   */
  attachment: string;
}

interface ITransactionReissue extends ITransactionBase {
  assetId: string;
  quantity: AmountType;
  /**
   * deny reissue
   */
  reissuable: boolean;
}

interface ITransactionBurn extends ITransactionBase {

  assetId: string;
  amount: AmountType;
}

interface ITransactionLease extends ITransactionBase {
  /**
   * recipient's address or alias
   */
  recipient: string;
  amount: AmountType;
}

interface ITransactionLeaseCancel extends ITransactionBase {
  /**
   * leasing transaction ID
   */
  leaseId: string;
}

interface ITransactionCreateAlias extends ITransactionBase {
  /**
   * 4 to 30 bytes
   */
  alias: string;
}

interface ITransactionMassTransferObject {
  /**
   * address/alias
   */
  recipient: string;
  amount: AmountType;
}

interface ITransactionMassTransfer extends ITransactionBase {
  /**
   * total to be sent
   * instead of calculating the amount you may insert
   * { assetId: "ID of the asset to be sent", coins: 0},
   */
  totalAmount: MoneyLike;
  /**
   * 
   */
  transfers: ITransactionMassTransferObject[];
  /**
   * [,140 bytes в base58] string – additional info
   */
  attachment: string;
}

interface ITransactionDataTxData {
  /**
   * data type
   */
  type: "binary" | 'string' | "integer" | "boolean";
  /**
   * field name
   */
  key: string;
  /**
   * depends on the type
   */
  value: string | number | boolean;

}

interface ITransactionDataTx extends ITransactionBase {
  data: ITransactionDataTxData[];
}

interface ITransactionSetScript extends ITransactionBase {
  script: string;
}

interface ITransactionSponsorship {
  /**
   * fee price in the asset.
   */
  minSponsoredAssetFee: MoneyLike;
}
interface ITransactionSetAssetScript extends ITransactionBase {
  assetId: string;
  script: string;
}

interface ITransactionScriptInvocationFnArgs {
  /**
   * data type
   */
  type: "binary" | 'string' | "integer" | "boolean";
  /**
   * depends on the type
   */
  value: string | number | boolean;

}

interface ITransactionScriptInvocation extends ITransactionBase {
  /**
   *  – address script account
   */
  dappAddress: string;
  call: {
    /**
     * function name
     */
    function: string;
    /**
     * 
     */
    args: ITransactionScriptInvocationFnArgs[];
    /**
     * (at now can use only 1 payment)
     */
  }
  payment?: MoneyLike[];
}



interface IDataInput<T, D> {
  type: T;
  data: D;
}

interface ISignRequestInput {
  timestamp: number;
}

interface ISignCancelOrderInput {
  /**
   * order ID
   */
  id: string;
  /**
   * sender's public key in base58
   */
  senderPublicKey?: string;

}

interface ISignOrderInput {
  amount: MoneyLike;
  price: MoneyLike;
  orderType: 'sell' | 'buy';
  /**
   * fee (0.003 WAVES minimum)
   */
  matcherFee: MoneyLike;
  /**
   * the public key of the exchange service
   */
  matcherPublicKey: string;
  /**
   * the order's expiration time
   */
  expiration: string | number;
  /**
   * current time
   */
  timestamp?: string | number;
  /**
   * public key in base58
   */
  senderPublicKey?: string;
}

interface ISignTransactionReturn {
  version: number;
  assetId: string;
  amount: number;
  feeAssetId: string;
  fee: number;
  recipient: string;
  attachment: string;
  timestamp: number;
  senderPublicKey: string;
  proofs: string[];
  type: number;
}

interface IMoneyLikeBase {
  assetId: string;
}

interface IMoneyLikeCoins extends IMoneyLikeBase {
  coins: string;
}

interface IMoneyLikeTokens extends IMoneyLikeBase {
  tokens: string;
}

type MoneyLike = IMoneyLikeCoins | IMoneyLikeTokens;

interface IAuthInput {
  name: string;
  data: string;
  referrer: string;
  icon: string;
  successPath: string;
}

interface IAuthReturn {
  /**
   * a host that requested a signature
   */
  host: string;
  /**
   * the name of an application that requested a signature
   */
  name: string;
  /**
   * a prefix participating in the signature
   */
  prefix: string;
  /**
   * an address in Waves network
   */
  address: string;
  /**
   * the user's public key
   */
  publicKey: string;
  /**
   * signature
   */
  signature: string;
  /**
   * API version
   */
  version: string;
}

interface IPublicState {
  /**
   * keeper initialized
   */
  initialized: boolean;
  /**
   * keeper in wait mode
   */
  locked: boolean;
  /**
   * current account, if the user allowed access to the website, or null
   */
  account: IPublicStateAccount | null,
  /**
   * current Waves network, node and matcher addresses
   */
  network: IPublicStateNetwork,
  /**
   * signature request statuses
   */
  messages: string[],
  /**
   * available transaction versions for each type
   */
  txVersion: {
    [version: string]: [number];
  }
}

interface IPublicStateAccount {
  name: string;
  publicKey: string;
  /**
   * waves address
   */
  address: string;
  /**
   * network byte
   */
  networkCode: string;
  balance: {
    /**
     * balance in waves
     */
    available: string;
    /**
     * leased balance
     */
    leasedOut: string;
  }
}

interface IPublicStateNetwork {
  code: string;
  server: string;
  matcher: string;
}
