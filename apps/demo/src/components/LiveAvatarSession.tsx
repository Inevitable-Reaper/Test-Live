"use client";

import React, { useEffect, useRef } from "react";
import {
  LiveAvatarContextProvider,
  useSession,
  useVoiceChat,
} from "../liveavatar";
import { SessionState } from "@heygen/liveavatar-web-sdk";
import { MicIcon, MicOffIcon, CloseIcon } from "./Icons";

const LiveAvatarSessionComponent: React.FC<{
  onSessionStopped: () => void;
}> = ({ onSessionStopped }) => {
  const {
    sessionState,
    isStreamReady,
    startSession,
    stopSession,
    attachElement,
  } = useSession();
  
  const {
    isMuted,
    isActive,
    start,
    mute,
    unmute,
  } = useVoiceChat();

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (sessionState === SessionState.DISCONNECTED) {
      onSessionStopped();
    }
  }, [sessionState, onSessionStopped]);

  useEffect(() => {
    if (isStreamReady && videoRef.current) {
      attachElement(videoRef.current);
    }
  }, [attachElement, isStreamReady]);

  useEffect(() => {
    if (sessionState === SessionState.INACTIVE) {
      startSession();
    }
  }, [startSession, sessionState]);

  useEffect(() => {
    if (sessionState === SessionState.CONNECTED && !isActive) {
      start();
    }
  }, [sessionState, isActive, start]);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black overflow-hidden">
      {/* Full Screen Video Container */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover" // Ensures the video covers the whole screen
      />

      {/* Floating Bottom Controls */}
      <div className="flex items-center gap-6 fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50">
        {/* Mic Toggle Button */}
        <button
          onClick={() => (isMuted ? unmute() : mute())}
          className={`p-4 rounded-full transition-all shadow-lg ${
            isMuted 
              ? "bg-red-500 text-white hover:bg-red-600" 
              : "bg-white text-black hover:bg-gray-200"
          }`}
        >
          {isMuted ? <MicOffIcon size={24} /> : <MicIcon size={24} />}
        </button>

        {/* End Session Button (Working Cancel) */}
        <button
          onClick={() => stopSession()}
          className="bg-red-600 text-white hover:bg-red-700 p-4 rounded-full transition-all shadow-lg border border-white/20"
        >
          <CloseIcon size={24} />
        </button>
      </div>
    </div>
  );
};

export const LiveAvatarSession: React.FC<{
  mode: "FULL" | "CUSTOM";
  sessionAccessToken: string;
  onSessionStopped: () => void;
}> = ({ sessionAccessToken, onSessionStopped }) => {
  return (
    <LiveAvatarContextProvider sessionAccessToken={sessionAccessToken}>
      <LiveAvatarSessionComponent onSessionStopped={onSessionStopped} />
    </LiveAvatarContextProvider>
  );
};