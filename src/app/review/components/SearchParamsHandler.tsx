"use client";

import { useSearchParams } from "next/navigation";
import { JSX } from "react";

export default function SearchParamsHandler({ children }: { children: (params: { sessionId: string | null }) => JSX.Element }) {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  return children({ sessionId });
}
