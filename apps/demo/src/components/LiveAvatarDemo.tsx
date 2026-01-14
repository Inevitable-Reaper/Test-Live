"use client";

import { useState } from "react";
import { LiveAvatarSession } from "./LiveAvatarSession";
import { PlayIcon, CloseIcon } from "./Icons"; // Changed MicIcon to PlayIcon

export const LiveAvatarDemo = () => {
  const [sessionToken, setSessionToken] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    try {
      const res = await fetch("/api/start-session", {
        method: "POST",
      });
      if (!res.ok) {
        const error = await res.json();
        setError(error.error);
        return;
      }
      const { session_token } = await res.json();
      setSessionToken(session_token);
    } catch (error: unknown) {
      setError((error as Error).message);
    }
  };

  const onSessionStopped = () => {
    setSessionToken("");
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black overflow-hidden flex items-center justify-center">
      {!sessionToken ? (
        <div className="z-10 flex flex-col items-center gap-6">
          {error && (
            <div className="bg-red-500/20 text-red-500 px-4 py-2 rounded-md border border-red-500">
              {"Error: " + error}
            </div>
          )}
          
          {/* Updated Buttons Container */}
          <div className="flex items-center gap-6 fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50">
            <button
              onClick={handleStart}
              className="bg-white text-black hover:bg-gray-200 p-4 rounded-full transition-all shadow-lg"
              aria-label="Start"
            >
              {/* Using the new PlayIcon here */}
              <PlayIcon size={24} />
            </button>
            <button
              disabled
              className="bg-gray-600/50 text-gray-400 p-4 rounded-full cursor-not-allowed border border-gray-500/30"
              aria-label="Cancel"
            >
              <CloseIcon size={24} />
            </button>
          </div>
        </div>
      ) : (
        <LiveAvatarSession
          mode="FULL"
          sessionAccessToken={sessionToken}
          onSessionStopped={onSessionStopped}
        />
      )}
    </div>
  );
};