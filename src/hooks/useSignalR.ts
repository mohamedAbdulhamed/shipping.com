import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";

const useSignalR = (url: string, onMessageReceived: () => any, accessToken: string | null) => {
  const connection = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    const initSignalR = async () => {
      connection.current = new signalR.HubConnectionBuilder()
        .withUrl(url, {
          accessTokenFactory: () => accessToken || "", // Add token if required
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      connection.current.on("NewOrderNotification", onMessageReceived);

      try {
        await connection.current.start();
        console.log("SignalR connected!"); // TODO: remove in production
      } catch (err) {
        // console.error("Error connecting to SignalR:", err);
        // it is not neccessary
      }
    };

    initSignalR();

    return () => {
      if (connection.current) {
        connection.current.stop();
      }
    };
  }, [url, onMessageReceived]);

  return connection;
};

export default useSignalR;
