// tslint:disable-next-line
interface Window { WavesKeeper: IWavesKeeperNotReady; }
declare var WavesKeeper: IWavesKeeperNotReady | undefined;

interface IWavesKeeperBase {
  /**
   * Allows subscribing to Waves Keeper events.
   */
  on: (event: 'update', cb: (state: IPublicState) => void) => void;
}

interface IWavesKeeper<T extends undefined | never> extends IWavesKeeperBase {

  /**
   * If a website is trusted, Waves Keeper public data are returned.
   */
  publicState: TPublicState | T;
  /**
   * If a website is not trusted, events won't show.
   */
  auth?: TAuth | T;
  /**
   * A method for signing transactions in Waves' network.
   */
  signTransaction?: TSignTransaction | T;
  /**
   * This is similar to "signTransaction", but it also broadcasts a transaction to the blockchain.
   */
  signAndPublishTransaction?: TSignAndPublishTransaction | T;
  /**
   * A package transaction signature. Sometimes several transactions need to be simultaneously signed, 
   * and for users' convenience, up to seven transactions at ones could be signed
   */
  signTransactionPackage?: TSignTransactionPackage | T;
  /**
   * Waves Keeper's method for signing an order to the matcher. 
   */
  signOrder?: TSignOrder | T;
  /**
   * Waves Keeper's method for creating an order to the matcher is identical to signOrder,
   * but it also tries to send data to the matcher.
   */
  signAndPublishOrder?: TSignAndPublishOrder | T;
  /**
   * Waves Keeper's method for cancelling an order to the matcher. It works identically to 
   * signCancelOrder, but also tries to send data to the matcher.
   */
  signAndPublishCancelOrder?: TSignAndPublishCancelOrder | T;
  /**
   * Waves Keeper's method for signing cancellation of an order to the matcher. As input, 
   * it accepts an object similar to a transaction like this:
   */
  signCancelOrder?: TSignCancelOrder | T;
  /**
   * Waves Keeper's method for signing typified data, for signing requests on various services. 
   * As input, it accepts an object similar to a transaction like this:
   */
  signRequest?: TSignRequest | T;
}

interface IWavesKeeperNotReady extends IWavesKeeper<undefined> {
  /**
   * On initialize window.WavesKeeper has not api methods.
   * You can use WavesKeeper.initialPromise for waiting end initializing api.
   */
  initialPromise: Promise<IWavesKeeperReady>;
}

interface IWavesKeeperReady extends IWavesKeeper<never> { }


type TPublicState = () => Promise<IPublicState>;
type TAuth = (data: IAuthInput) => Promise<IAuthReturn>;

type TSignTransaction = (data: TTransactionType) => Promise<ISignTransactionReturn | string>;
type TSignAndPublishTransaction = (data: TTransactionType) => Promise<ISignTransactionReturn | string>;
type TSignTransactionPackage = (data: TMassTransactionType[]) => Promise<ISignTransactionReturn[] | string[]>;

type TSignOrder = (data: IDataInput<1002, ISignOrderInput>) => Promise<string>;
type TSignAndPublishOrder = (data: IDataInput<1002, ISignOrderInput>) => Promise<string>;

type TSignAndPublishCancelOrder = (data: IDataInput<1003, ISignCancelOrderInput>) => Promise<string>;
type TSignCancelOrder = (data: IDataInput<1003, ISignCancelOrderInput>) => Promise<string>;

type TSignRequest = (data: IDataInput<1001 | 1004, ISignRequestInput>) => Promise<string>;

type TMassTransactionType = IDataInput<3, ITransactionIssue> |
IDataInput<4, ITransactionTransfer> |
IDataInput<5, ITransactionReissue> |
IDataInput<6, ITransactionBurn> |
IDataInput<10, ITransactionCreateAlias> |
IDataInput<11, ITransactionMassTransfer> |
IDataInput<12, ITransactionDataTx>;

type TTransactionType = IDataInput<3, ITransactionIssue> |
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

type TMoneyLike = IMoneyLikeCoins | IMoneyLikeTokens;

type TAmountType = number | string | TMoneyLike;

interface ITransactionBase {
  fee: TMoneyLike;
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
  amount: TMoneyLike;
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
  quantity: TAmountType;
  /**
   * deny reissue
   */
  reissuable: boolean;
}

interface ITransactionBurn extends ITransactionBase {

  assetId: string;
  amount: TAmountType;
}

interface ITransactionLease extends ITransactionBase {
  /**
   * recipient's address or alias
   */
  recipient: string;
  amount: TAmountType;
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
  amount: TAmountType;
}

interface ITransactionMassTransfer extends ITransactionBase {
  /**
   * total to be sent
   * instead of calculating the amount you may insert
   * { assetId: "ID of the asset to be sent", coins: 0},
   */
  totalAmount: TMoneyLike;
  /**
   * 
   */
  transfers: ITransactionMassTransferObject[];
  /**
   * [,140 bytes in base58] string – additional info
   */
  attachment: string;
}

type IDataTxEntry<T> = T & {
  key: string;
}

type TTransactionDataTxData = IDataTxEntry<IDataTxInteger>  |
IDataTxEntry<IDataTxInteger>  |
IDataTxEntry<IDataTxBoolean>  |
IDataTxEntry<IDataTxString> ;

interface ITransactionDataTx extends ITransactionBase {
  data: TTransactionDataTxData[];
}

interface ITransactionSetScript extends ITransactionBase {
  script: string;
}

interface ITransactionSponsorship {
  /**
   * fee price in the asset.
   */
  minSponsoredAssetFee: TMoneyLike;
}
interface ITransactionSetAssetScript extends ITransactionBase {
  assetId: string;
  script: string;
}

type TTransactionScriptInvocationFnArgs = IDataTxInteger |
IDataTxBoolean |
IDataTxString |
IDataTxBinary;

interface IDataTxInteger {
  type: 'integer';
  value: number;
}

interface IDataTxBoolean {
  type: 'boolean';
  value: boolean;
}

interface IDataTxString {
  type: 'string';
  value: string;
}

interface IDataTxBinary {
  type: 'binary';
  value: Uint8Array;
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
    args: TTransactionScriptInvocationFnArgs[];
    /**
     * (at now can use only 1 payment)
     */
  }
  payment?: TMoneyLike[];
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
  amount: TMoneyLike;
  price: TMoneyLike;
  orderType: 'sell' | 'buy';
  /**
   * fee (0.003 WAVES minimum)
   */
  matcherFee: TMoneyLike;
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


interface IAuthInput {
  /**
   * name of the service
   */
  name?: string;
  /**
   *  a line with any data
   */
  data: string;
  /**
   *  a websites' full URL for redirect
   */
  referrer?: string;
  /**
   *  path to the logo relative to the referreror origin of the website
   */
  icon?: string;
  /**
   * relative path to the website's Auth API
   */
  successPath?: string;
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

interface IPublicStateMessage {
  id: string;
  status: string;
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
  messages: IPublicStateMessage[],
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
  network: string;
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
    network: string;
  }
}

interface IPublicStateNetwork {
  code: string;
  server: string;
  matcher: string;
}
