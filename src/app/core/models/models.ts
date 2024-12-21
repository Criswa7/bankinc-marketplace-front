export enum CardType {
    CREDITO = 'CREDITO',
    DEBITO = 'DEBITO'
}

export interface Card {
    id?: number;
    cardNumber: string;
    holderName: string;
    expirationDate: string;
    balance: number;
    cardType: CardType;
}

export interface CardCreationDTO {
    holderName: string;
    cardType: CardType;
    productId: string;
}

export interface CardRechargeDTO {
    cardNumber: string;
    amount: number;
}

export interface Transaction {
    id: number;
    card: Card;
    amount: number;
    transactionDate: string;
    status: 'EXITOSA' | 'RECHAZADA' | 'ANULADA';
}

export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating?: {
        rate: number;
        count: number;
    };
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface PaymentInfo {
    cardNumber: string;
    cardHolderName: string;
    expirationDate: string;
    totalAmount: number;
}