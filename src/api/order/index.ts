import { AxiosInstance, AxiosResponse } from "axios";
import { GetDataResponse } from "../../config/constants";
import Order from "../../entities/Order";
import CreateOrderRequest from "../../dtos/orders/createOrderRequest";

const fetchAllsURL = "/Order/GetAll";
const fetchByIdURL = "/Order/GetById";
const postURL = "/Order/Add";
const putURL = "/Order/Update";
const deleteURL = "/Order/Delete";

interface Filters {
  pickupCity: string | null,
  deliveryCity: string | null,
  isFragile: boolean | null,
  weight: number | null,
  sortBy: string | null,
  sortDescending: boolean,
}

export const fetchOrders = async (
  axiosInstance: AxiosInstance,
  signal: AbortSignal,
  page: number = 1,
  perPage: number = 10,
  filters?: Filters,
): Promise<GetDataResponse<Order[]>> => {
  try {
    const params: Record<string, any> = { pageNumber: page, pageSize: perPage };

    console.log("params", params)

    if (filters) {
      if (filters.pickupCity) {
        params.pickupCity = filters.pickupCity;
      }

      if (filters.deliveryCity) {
        params.deliveryCity = filters.deliveryCity;
      }

      if (filters.isFragile) {
        params.isFragile = filters.isFragile;
      }

      if (filters.weight) {
        params.weight = filters.weight;
      }

      if (filters.sortBy) {
        params.sortBy = filters.sortBy;
      }

      params.sortDescending = filters.sortDescending;
    }

    const response = await axiosInstance.get(fetchAllsURL, { params, signal });

    // const response: Order[] = [
    //   {
    //     orderId: 1,
    //     description: "car delivery",
    //     from: "giza, 16 medan, bla bla few more words to test length validation inside a stepper, and we are still testing to see when will the text get wrapped, i hope it does, ok it did.",
    //     deliveryCity: "Giza",
    //     to: "giza, 48 dokki, bla bla",
    //     pickupCity: "Cairo",
    //     createdAt: new Date(),
    //     status: "Accepted",
    //     offers: [],
    //     clientId: "1",

    //     estimatedDeliveryStartDate: new Date(),
    //     estimatedDeliveryEndDate: new Date(),

    //     isFragile: true,
    //     height: 1,
    //     width: 2,
    //     depth: 3,
    //     weight: 4,
    //     quantity: 5,
    //   },
    //   {
    //     orderId: 2,
    //     description: "animal delivery",
    //     deliveryCity: "Giza",
    //     from: "giza, 16 medan, bla bla",
    //     pickupCity: "Cairo",
    //     to: "giza, 48 dokki, bla bla",
    //     createdAt: new Date(),
    //     status: "Pending",
    //     offers: [],
    //     clientId: "1",

    //     estimatedDeliveryStartDate: new Date(),
    //     estimatedDeliveryEndDate: new Date(),

    //     isFragile: true,
    //     height: 1,
    //     width: 2,
    //     depth: 3,
    //     weight: 4,
    //     quantity: 5,
    //   },
    //   {
    //     orderId: 3,
    //     description: "human delivery",
    //     deliveryCity: "Giza",
    //     from: "giza, 16 medan, bla bla",
    //     pickupCity: "Cairo",
    //     to: "giza, 48 dokki, bla bla",
    //     createdAt: new Date(),
    //     status: "Accepted",
    //     offers: [],
    //     clientId: "1",

    //     estimatedDeliveryStartDate: new Date(),
    //     estimatedDeliveryEndDate: new Date(),

    //     isFragile: true,
    //     height: 1,
    //     width: 2,
    //     depth: 3,
    //     weight: 4,
    //     quantity: 5,
    //   },
    //   {
    //     orderId: 4,
    //     description: "car delivery",
    //     deliveryCity: "Giza",
    //     from: "giza, 16 medan, bla bla",
    //     pickupCity: "Cairo",
    //     to: "giza, 48 dokki, bla bla",
    //     createdAt: new Date(),
    //     status: "Pending",
    //     offers: [],
    //     clientId: "1",

    //     estimatedDeliveryStartDate: new Date(),
    //     estimatedDeliveryEndDate: new Date(),

    //     isFragile: true,
    //     height: 1,
    //     width: 2,
    //     depth: 3,
    //     weight: 4,
    //     quantity: 5,
    //   },
    //   {
    //     orderId: 5,
    //     description: "animal delivery",
    //     deliveryCity: "Giza",
    //     from: "giza, 16 medan, bla bla",
    //     pickupCity: "Cairo",
    //     to: "giza, 48 dokki, bla bla",
    //     createdAt: new Date(),
    //     status: "Accepted",
    //     offers: [],
    //     clientId: "1",

    //     estimatedDeliveryStartDate: new Date(),
    //     estimatedDeliveryEndDate: new Date(),

    //     isFragile: true,
    //     height: 1,
    //     width: 2,
    //     depth: 3,
    //     weight: 4,
    //     quantity: 5,
    //   },
    //   {
    //     orderId: 6,
    //     description: "human delivery",
    //     deliveryCity: "Giza",
    //     from: "giza, 16 medan, bla bla",
    //     pickupCity: "Cairo",
    //     to: "giza, 48 dokki, bla bla",
    //     createdAt: new Date(),
    //     status: "Pending",
    //     offers: [],
    //     clientId: "1",

    //     estimatedDeliveryStartDate: new Date(),
    //     estimatedDeliveryEndDate: new Date(),

    //     isFragile: true,
    //     height: 1,
    //     width: 2,
    //     depth: 3,
    //     weight: 4,
    //     quantity: 5,
    //   },
    // ];

    // console.log(response);
    
    const data = response.data.Result.entites;
    const totalItems = response.data.Result.totalItems;
    const totalPages = response.data.Result.totalPages;

    return {
      data,
      totalItems,
      totalPages,
    };
  } catch (error) {
    throw error;
  }
};

export const fetchOrder = async (
  axiosInstance: AxiosInstance,
  id: Order["orderId"],
  controller: AbortController
): Promise<GetDataResponse<Order>> => {
  try {
    const response = await axiosInstance.get(`${fetchByIdURL}/${id}`, {
      signal: controller.signal,
    });

    // const response: Order = {
    //   id: "1",
    //   title: "order title",
    //   from: "123, main street, giza",
    //   pickupCity: "Giza",
    //   to: "123 main street ,cairo",
    //   deliveryCity: "Cairo",
    //   status: "Pending",
    //   offers: [
    //     {
    //       id: "1",
    //       companyName: "Alwatanya test offer",
    //       price: 153,
    //       status: "Pending",
    //       orderId: "1",
    //     },
    //     {
    //       id: "2",
    //       companyName: "Alwatanya2 more words for length validation",
    //       price: 432,
    //       status: "Pending",
    //       orderId: "1",
    //     },
    //   ],
    // };

    const data = response.data.Result || {};
    return { data };
  } catch (error) {
    throw error;
  }
};

export const addOrder = async (
  axiosInstance: AxiosInstance,
  order: CreateOrderRequest
): Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.post(postURL, order);
    console.log(response.data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateOrder = async (
  axiosInstance: AxiosInstance,
  order: Order
): Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.put(putURL, order);

    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteOrder = async (
  axiosInstance: AxiosInstance,
  orderId: Order["orderId"]
): Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.delete(`${deleteURL}/${orderId}`);

    return response;
  } catch (error) {
    throw error;
  }
};
