import { OrderItem } from "./order-item.model";

export class Order {
    id?: string;
    orderItems?: OrderItem[];
    totalPrice?: number;
    user?: any;
    status?: number;
    dateOrdered?: string;
}
