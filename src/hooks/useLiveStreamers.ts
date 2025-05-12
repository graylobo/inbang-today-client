import { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";

export const useLiveStreamers = (crewId?: number) => {
  const [streamers, setStreamers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const connectSocket = () => {
      if (!isConnected && !socketRef.current) {
        const socket = io(process.env.NEXT_PUBLIC_API_URL);
        socketRef.current = socket;
        setIsConnected(true);

        socket.on("connect", () => {
          console.log("Socket connected");
        });

        socket.on("disconnect", () => {
          console.log("Socket disconnected");
          setIsConnected(false);
        });

        socket.on("liveStreamersUpdated", (data) => {
          fetchLiveStreamersByCrewID();
        });

        socket.on("error", (error) => {
          console.error("Socket error:", error);
          setIsConnected(false);
        });
      }
    };

    const fetchLiveStreamersByCrewID = async () => {
      try {
        if (crewId) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/crawler/broadcasts?crewId=${crewId}`
          );
          const data = await response.json();
          setStreamers(data.streamInfos || []);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching live streamers:", error);
        setIsLoading(false);
      }
    };

    const fetchInitialData = async () => {
      await fetchLiveStreamersByCrewID();
      connectSocket();
    };

    fetchInitialData();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    };
  }, [crewId]);

  return { streamers, isLoading, isConnected };
};
