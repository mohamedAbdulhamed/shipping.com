export default interface CreateOrderRequest {
  description: string;

  from: string;
  fromLatitude: string | null;
  fromLongitude: string | null;
  pickupCity: string;
  to: string;
  toLatitude: string | null;
  toLongitude: string | null;
  deliveryCity: string;

  deliveryPersonNumber?: string;

  // details
  isFragile: boolean;
  length: number;
  width: number;
  height: number;
  weight: number;
  quantity: number;
}
