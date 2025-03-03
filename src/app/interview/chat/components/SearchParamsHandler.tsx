"use client";

import { useSearchParams } from "next/navigation";
import { JSX } from "react";

export default function SearchParamsHandler({ children }: { children: (params: { job: string; session: string | null }) => JSX.Element }) {
  const searchParams = useSearchParams();
  const job = searchParams.get("job") || "defaultItem";
  const session = searchParams.get("session") || null;

  return children({ job, session });
}
