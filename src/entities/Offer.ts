import Order from "./Order";
import User from "./User";

export type OfferStatus = "Accepted" | "Rejected" | "Pending";

export default interface Offer {
  offerId: number;
  price: number;
  comment?: string;
  deliveryDate: Date | string;
  status: OfferStatus;

  orderId: Order["orderId"];
  order?: Order;

  shippingCompanyId: User["id"];
  shippingCompany?: User;
}