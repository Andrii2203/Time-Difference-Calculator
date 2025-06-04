import { useEffect } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export const isTokenExpired = (token: string) : boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch (error) {
      console.error("Error parsing token:", error);
      return true;
    }
}

export const getTokensFromCookies = (): { accessToken: string | null, refreshToken: string | null } => {    
    const getCookieByName = (name: string): string | null => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      if(match) { 
        return match[2];
      } 
      else {
        return null;
      }
    }
    const accessToken = getCookieByName("accessToken");
    const refreshToken = getCookieByName("refreshToken");
    return { accessToken, refreshToken }
  }

export const refreshAccessToken = async (): Promise<void> => {
    try{
      setInterval(async () => {
        await fetch("http://localhost:5000/refresh", {
          method: "POST",
          credentials: "include",
        });
      }, 10 * 60 * 1000); // 10 minutes

      console.log("Token refreshed successfully.");
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
}

export const fetchWithAuth = async (input: RequestInfo, init: RequestInit = {}) => {
  const fingerprint = localStorage.getItem("fingerprint");

  console.log("Fetching with auth...");
  console.log("Fingerprint:", fingerprint);

  const fetchWithToken = async () => {
    console.log("Fetching with access token...");
    return await fetch(input, {
      ...init,
      credentials: "include",
    });
  };

  let res = await fetchWithToken();
  console.log("Initial response status:", res.status);

  if (res.status === 401) {
    console.warn("Access token expired. Attempting to refresh...");
    console.log("Sending refresh request...");
    const refreshRes = await fetch("http://localhost:5000/refresh", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fingerprint }),
      credentials: "include",
    });

    console.log("Refresh response status:", refreshRes.status);

    if (refreshRes.ok) {
      console.log("Access token refreshed successfully.");
      
      res = await fetchWithToken();
      console.log("Response after refreshing token:", res.status);
    } else {
      console.error("Failed to refresh access token. Logging out.");
      throw new Error("No authenticated");
    }
  } else {
    console.log("Access token is valid. Proceeding with request...");
  }

  return res;
}



export const useDeviceFingerprint = () => {
  useEffect(() => {
    const initialize = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const fingerprint = result.visitorId;

      localStorage.setItem("fingerprint", fingerprint);

      try {
        const saveRes = await fetch("http://localhost:5000/save-devices", {
          method: "POST",
          body: JSON.stringify({ fingerprint }),
          headers: { 
            "Content-Type": "application/json", 
          },
          credentials: "include",
        });
        if(saveRes.ok) {
          console.log("Device fingerprint saved successfully.");
        } else {
          const text = await saveRes.text();
          console.error("Failed to save device fingerprint, status:", text);
        }
      } catch (error) {
        console.error("Error during fingerprint:", error);
      }
    }
    initialize();
  }, [])
}
