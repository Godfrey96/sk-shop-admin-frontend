export class Cart {
    items?: CartItem[];
}

export class CartItem {
    productId?: string;
    quantity?: number;
}

export class cartItemDetailed {
    product?: any;
    quantity?: any;
}
