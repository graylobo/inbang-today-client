// hooks/useLiveStreamers.ts
import { useEffect, useState } from "react";
import io from "socket.io-client";

export const useLiveStreamers = (crewId?: number) => {
  const [streamers, setStreamers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  console.log(
    "process.env.NEXT_PUBLIC_API_URL",
    process.env.NEXT_PUBLIC_API_URL
  );
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL);

    // Initial data loading using a direct API call with crewId
    if (crewId) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/crawler/broadcasts?crewId=${crewId}`
      )
        .then((res) => res.json())
        .then((data) => {
          setStreamers(data.streamInfos || []);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching live streamers:", error);
          setIsLoading(false);
        });
    }

    // Real-time updates reception
    socket.on("updateLiveStreamers", (data) => {
      // If we're filtering by crew, don't update from general socket events
      if (!crewId) {
        setStreamers(data.streamInfos || []);
        setIsLoading(false);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [crewId]);

  return { streamers, isLoading };
};
