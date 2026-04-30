import React, { useEffect, useRef } from "react";

const EventMap = ({ event }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!event?.mapx || !event?.mapy) return;
    if (!mapRef.current) return;

    const initMap = () => {
      const position = new window.naver.maps.LatLng(event.mapy, event.mapx);
      const map = new window.naver.maps.Map(mapRef.current, {
        center: position,
        zoom: 15,
      });
      new window.naver.maps.Marker({ position, map });
    };

    if (window.naver?.maps) {
      initMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_MAP_CLIENT_ID}`;
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector(`script[src*="naver.com"]`);
      if (existingScript) document.head.removeChild(existingScript);
    };
  }, [event]);

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        📍 찾아오시는 길
      </h2>
      <div 
        ref={mapRef} 
        className="w-full h-[350px] rounded-3xl overflow-hidden border-4 border-gray-50 shadow-sm" 
      />
    </div>
  );
};

export default EventMap;