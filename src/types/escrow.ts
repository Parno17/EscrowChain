export enum OrderStatus {
  Draft = -1,              // Draft pesanan
  Funded = 0,             // Pembeli mengunci dana ke PDA Solana Escrow + Masuk DeFi Yield Vault (HELD)
  ConfirmedBySeller = 1,  // Penjual konfirmasi pesanan masuk & siapkan barang
  Shipped = 2,            // Penjual mengirimkan barang elektronik (resi pengiriman & bukti on-chain)
  RefundRequested = 3,    // Pembeli menerima barang tidak sesuai & ajukan refund / sengketa
  Disputed = 6,           // Sengketa masuk ke Pengadilan Tribunal Multi-Sig DAO
  Completed = 4,          // Pesanan selesai -> Escrow PDA melepas dana utama + hasil yield ke Penjual & Pembeli (RELEASED)
  Refunded = 5            // Barang tidak ada / Timeout tercapai -> Dana dikembalikan otomatis ke Pembeli
}

export type InitiatorType = 'buyer' | 'seller';

export interface EscrowOrder {
  id: number;
  initiator: InitiatorType;
  buyer: string;       // Solana Base58 Address
  seller: string;      // Solana Base58 Address
  arbiter: string;     // Solana Base58 Address (Tribunal Multi-Sig)
  adminAddress: string;// Protocol Treasury / Governance
  pdaAddress: string;  // Program Derived Address: PDA [b"escrow", order_id]
  vaultPda: string;    // Token Vault PDA: [b"vault", escrow.key()]

  // Financials & Currency (Solana & AMN)
  amountSol: number;   // In SOL (e.g. 1.25 SOL)
  amountAmn: number;   // Equivalent in Amanah Token ($AMN)
  amountIdr: number;   // In Rupiah (IDR)
  gasFeeSol: number;   // Solana microcent fee (e.g. 0.000005 SOL ≈ Rp 12)
  gasSavedComparedToEthIdr: number; // Gas savings vs Ethereum

  // DeFi Yield Streaming Mechanism
  isDefiYieldActive: boolean;
  defiStrategy: 'Kamino SOL Yield' | 'Marinade mSOL Liquid' | 'Raydium Liquidity Safe';
  apyPercent: number;        // e.g. 6.8% APY
  yieldAccruedSol: number;   // Total interest generated while locked in Escrow PDA
  yieldAccruedAmn: number;   // Bonus AMN cashback generated
  buyerYieldShare: number;   // 40% to buyer as loyalty cashback
  sellerYieldShare: number;  // 40% to seller as fulfillment bonus
  protocolBurnShare: number; // 20% to AMN buyback-and-burn

  // Timelock & Security Safeguards
  deadlineTimestamp: number;
  deadlineSlot: number;      // Solana Block Slot
  daysToDeadline: number;
  autoRefundTriggerable: boolean;
  securityProofHash?: string;// SHA-256 / IPFS hash of unboxing / delivery proof
  antiPhishingVerified: boolean;

  status: OrderStatus;
  desc: string;
  settlementTerms?: string;
  
  // Detail Barang Elektronik / UMKM
  productName: string;
  category: string;
  selectedVariation?: string;
  quantity: number;
  courierTracking?: string;
  courierName?: string;
  
  // Skenario Penjual & Pembeli
  outOfStockReason?: string;
  refundReason?: string;
  refundProofNote?: string;
  disputeReason?: string;
  resolutionNotes?: string;
  
  // Status Kontrak & Admin Governance
  adminHeldTokenStatus: 'HELD_IN_PDA' | 'RELEASED_TO_SELLER' | 'REFUNDED_TO_BUYER';
  adminNotes?: string;
  adminReleasedAt?: number;
  adminReleasedBy?: string;
  tribunalVotes?: {
    judge: string;
    vote: 'release_to_seller' | 'refund_to_buyer';
    timestamp: number;
  }[];
  
  createdAt: number;
  txHashCreated: string; // Solana Transaction Signature (Base58)
  txHistory: EscrowTxEvent[];
}

export interface EscrowTxEvent {
  txHash: string; // Solana Transaction Signature (Base58)
  slotNumber: number;
  computeUnitsUsed: number;
  feeSol: number;
  method: 
    | 'initialize_escrow_pda' 
    | 'deposit_sol_with_yield' 
    | 'seller_confirm_order'
    | 'seller_report_unavailable'
    | 'mark_shipped_with_proof' 
    | 'confirm_received_and_distribute_yield' 
    | 'buyer_request_refund'
    | 'claim_auto_refund_timeout'
    | 'tribunal_resolve_dispute'
    | 'admin_emergency_circuit_breaker';
  from: string;
  to: string;
  valueSol: number;
  timestamp: number;
  statusFrom: OrderStatus;
  statusTo: OrderStatus;
  note?: string;
}

export interface UserAuth {
  isLoggedIn: boolean;
  method: 'phantom' | 'solflare' | 'backpack' | 'metamask' | 'passkey' | 'email' | 'google' | null;
  email?: string;
  displayName: string;
  avatarUrl?: string;
  walletAddress: string; // Solana Base58 or EVM Address
  role: 'buyer' | 'seller' | 'admin' | 'arbiter';
  securityPhrase?: string; // Anti-Phishing secret phrase
  is2FAActive?: boolean;
  reputationScore?: number; // 0 - 100 on-chain rating
  stakedAmn?: number;       // Staked AMN for fee discount
  vipTier?: 'Standard' | 'Silver Merchant' | 'Amanah VIP Gold';
}

export interface Web3Account {
  address: string;          // Solana Base58 or EVM address
  label: string;
  role: 'buyer' | 'seller' | 'admin' | 'arbiter';
  name: string;
  email?: string;
  authMethod?: 'phantom' | 'solflare' | 'backpack' | 'metamask' | 'google' | 'passkey';
  balanceSol: number;       // SOL Balance
  balanceAmn: number;       // AMN Token Balance
  balanceUsdc: number;      // USDC-SPL Balance
  stakedAmn: number;        // Staked AMN
  avatarUrl?: string;
  businessName?: string;
  reputationScore: number;  // 0 - 100
  securityPhrase: string;
}

export interface UmkmProduct {
  id: string;
  title: string;
  sellerName: string;
  sellerAddress: string;
  priceSol: number;
  priceAmn: number;
  priceIdr: number;
  category: string;
  location: string;
  image: string;
  imageUrl?: string;
  city?: string;
  description?: string;
  stock?: number;
  defaultDeadlineDays: number;
}

export interface ElectronicProduct {
  id: string;
  name: string;
  category: 'Smartphone' | 'Laptop & Komputer' | 'Audio & Headphone' | 'Smartwatch' | 'Kamera' | 'Elektronik Rumah';
  variations: string[];
  stock: number;
  priceIdr: number;
  priceSol: number;
  priceAmn: number;
  description: string;
  sellerAddress: string;
  sellerName: string;
  imageUrl: string;
  warranty: string;
  defaultDeadlineDays: number;
  isAvailable: boolean;
}

export interface TokenomicsMetric {
  name: string;
  symbol: string;
  totalSupply: number;
  circulatingSupply: number;
  stakedSupply: number;
  totalBurned: number;
  priceUsd: number;
  priceIdr: number;
  stakingApy: number;
  escrowYieldApy: number;
  buybackPoolSol: number;
}

export interface SecurityRiskItem {
  id: string;
  code: string;
  name: string;
  riskDescription: string;
  mitigation: string;
  statusInEscrow: 'Diterapkan' | 'Sebagian' | 'Belum' | 'Dibatasi';
  citation: string;
  solanaAnchorSnippet?: string;
}
