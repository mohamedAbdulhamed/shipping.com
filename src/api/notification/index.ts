import { AxiosInstance, AxiosResponse } from "axios";
import { GetDataResponse } from "../../config/constants";
import Notification from "../../entities/Notification.ts";

const fetchAllsURL = "/Notification/GetAll";
const fetchNumberURL = "/Notification/GetAll";
const markAsReadURL = "/Notification/MarkAsRead/";
const markAsUnreadURL = "/Notification/MarkAsUnread/";
const markAllAsUnreadURL = "/Notification/MarkAllAsUnread/";
const deleteURL = "/Notification/Delete/";
const deleteAllURL = "/Notification/DeleteAll/";

export const fetchNotifications = async (
  axiosInstance: AxiosInstance
): Promise<GetDataResponse<Notification[]>> => {
  try {
    const response = await axiosInstance.get(fetchAllsURL);

    return {
      data: response.data.Result || [],
    };
  } catch (error) {
    throw error;
  }
};

export const fetchNumber = async (
  axiosInstance: AxiosInstance
): Promise<GetDataResponse<number>> => {
  try {
    const response = await axiosInstance.get(fetchNumberURL);

    return {
      data: response.data.Result || null,
    };
  } catch (error) {
    throw error;
  }
};

export const markAsRead = async (
  axiosInstance: AxiosInstance,
  id: Notification["id"],
  controller: AbortController
): Promise<GetDataResponse<boolean>> => {
  try {
    const response = await axiosInstance.get(`${markAsReadURL}${id}`, {
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

export const markAsUnread = async (
  axiosInstance: AxiosInstance,
  id: Notification["id"],
  controller: AbortController
): Promise<GetDataResponse<boolean>> => {
  try {
    const response = await axiosInstance.get(`${markAsUnreadURL}${id}`, {
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

export const markAllAsUnread = async (
  axiosInstance: AxiosInstance,
  controller: AbortController
): Promise<GetDataResponse<boolean>> => {
  try {
    const response = await axiosInstance.get(markAllAsUnreadURL, {
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

export const deleteNotification = async (
  axiosInstance: AxiosInstance,
  id: Notification["id"]
): Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.delete(`${deleteURL}${id}`);

    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteAllNotifications = async (
  axiosInstance: AxiosInstance,
): Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.delete(deleteAllURL);

    return response;
  } catch (error) {
    throw error;
  }
};
