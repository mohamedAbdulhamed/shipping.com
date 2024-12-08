import { AxiosInstance, AxiosResponse } from "axios";
import { GetDataResponse } from "../../config/constants";
import Offer from "../../entities/Offer";
import CreateOfferRequest from "../../dtos/offers/CreateOfferRequest";

const fetchAllsURL = "/Offer/GetAll";
const fetchByIdURL = "/Offer/GetById/";
const postURL = "/Offer/Add/";
const putURL = "/Offer/Update/";
const acceptURL = "/Offer/AcceptOffer/";
const declineURL = "/Offer/RejectOffer";
const deleteURL = "/Offer/Delete/";

export const fetchOffers = async (
  axiosInstance: AxiosInstance
): Promise<GetDataResponse<Offer[]>> => {
  try {
    const response = await axiosInstance.get(fetchAllsURL);

    // const response: Offer[] = [
    //   {
    //     offerId: 1,
    //     price: 688,
    //     orderId: 1,
    //     order: {
    //       orderId: 1,
    //       description: "car delivery",
    //       from: "giza, 16 medan, bla bla few more words to test length validation inside a stepper, and we are still testing to see when will the text get wrapped, i hope it does, ok it did.",
    //       deliveryCity: "Giza",
    //       to: "giza, 48 dokki, bla bla",
    //       pickupCity: "Cairo",
    //       createdAt: new Date(),
    //       status: "Accepted",
    //       offers: [],
    //       clientId: "1",
  
    //       estimatedDeliveryStartDate: new Date(),
    //       estimatedDeliveryEndDate: new Date(),
  
    //       isFragile: true,
    //       height: 1,
    //       width: 2,
    //       depth: 3,
    //       weight: 4,
    //       quantity: 5,
    //     },
    //     deliveryDate: new Date(),
    //     shippingCompanyId: "1",
    //     status: "Accepted",
    //     comment: "best you can get",
    //   },
    // ];

    return {
      data: response.data.Result || [],
    };
  } catch (error) {
    throw error;
  }
};

export const fetchOffer = async (
  axiosInstance: AxiosInstance,
  id: Offer["offerId"],
  controller: AbortController
): Promise<GetDataResponse<Offer>> => {
  try {
    const response = await axiosInstance.get(`${fetchByIdURL}${id}`, {
      signal: controller.signal,
    });

    const data = response.data.Result;
    return {
      data,
    };
  } catch (error) {
    throw error;
  }
};

export const addOffer = async (
  axiosInstance: AxiosInstance,
  offer: CreateOfferRequest
): Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.post(postURL, offer);

    return response;
  } catch (error) {
    throw error;
  }
};

export const updateOffer = async (
  axiosInstance: AxiosInstance,
  offer: Offer
): Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.put(putURL, offer);

    return response;
  } catch (error) {
    throw error;
  }
};

export const acceptOffer = async (
  axiosInstance: AxiosInstance,
  offerId: Offer['offerId']
): Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.put(acceptURL, null, {
      params: { offerId },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const declineOffer = async (
  axiosInstance: AxiosInstance,
  offerId: Offer['offerId']
): Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.put(declineURL, null, {
      params: { offerId },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

// TODO: replace with withdraw
export const deleteOffer = async (
  axiosInstance: AxiosInstance,
  offerId: Offer["offerId"]
): Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.delete(`${deleteURL}${offerId}`);

    return response;
  } catch (error) {
    throw error;
  }
};
