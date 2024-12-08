  import Offer from "./Offer";
  import User from "./User";

  export type OrderStatus = "Accepted" | "Pending" | 0 | 1; // it can be a number because of a weired backend logic

  export default interface Order {
    orderId: number;
    description: string;
    from: string;
    fromLatitude: string | null;
    fromLongitude: string | null;
    pickupCity: string;
    to: string;
    toLatitude: string | null;
    toLongitude: string | null;
    deliveryCity: string;

    createdAt: Date;
    status: OrderStatus;
    offers: Offer[];
    clientId: string;
    client?: User;
    deliveryPersonNumber?: string | null;

    isFragile: boolean;
    length: number;
    width: number;
    height: number;
    weight: number;
    quantity: number;
  }