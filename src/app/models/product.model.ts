import { Category } from "./category.model";
import { Reviews } from "./reviews.model";

export class Product {
    id?: string;
    name?: string;
    description?: string;
    image?: string;
    price?: number;
    reviews?: Reviews[];
    rating?: number;
    numReviews?: number;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    category?: Category;
    countInStock?: number;
}
