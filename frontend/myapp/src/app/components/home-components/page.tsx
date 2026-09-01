"use client";

import { useState } from "react";

export default function SignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    // Simulate API authentication call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Signing in...
        </span>
      ) : (
        "Sign In"
      )}
    </button>
  );
}