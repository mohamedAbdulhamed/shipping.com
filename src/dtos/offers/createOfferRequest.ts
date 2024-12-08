import Order from "../../entities/Order";

export default interface CreateOfferRequest {
  price: number;
  comment: string;
  orderId: Order["orderId"];
  deliveryDate: Date | string;
}