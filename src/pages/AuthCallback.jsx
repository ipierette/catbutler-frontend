import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// This page handles the Supabase OAuth callback and redirects to home after session is loaded
export default function AuthCallback() {
  const navigate = useNavigate();
  const { initializeAuth, loadUserProfile } = useAuth();

  useEffect(() => {
    // Re-initialize auth to ensure session/profile is loaded and created
    (async () => {
      await initializeAuth?.();
      // Try to create/load profile after session
      await loadUserProfile?.(window?.supabase?.auth?.user ?? undefined);
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 500);
    })();
    // eslint-disable-next-line
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <i className="fa-solid fa-spinner fa-spin text-3xl text-blue-500 mb-4"></i>
        <p className="text-gray-600 dark:text-gray-400">Processando login social...</p>
      </div>
    </main>
  );
}