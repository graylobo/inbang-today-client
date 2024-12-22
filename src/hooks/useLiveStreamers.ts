// hooks/useLiveStreamers.ts
import { useEffect, useState } from "react";
import io from "socket.io-client";

export const useLiveStreamers = () => {
  const [streamers, setStreamers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const socket = io("http://localhost:4000");

    // // 초기 데이터 로딩
    // fetch("http://your-server-url/live-streamers")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setStreamers(data);
    //     setIsLoading(false);
    //   });

    // 실시간 업데이트 수신
    socket.on("updateLiveStreamers", (data) => {
      setStreamers(data.streamInfos);
      setIsLoading(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { streamers, isLoading };
};