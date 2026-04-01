import { useState } from "react";
import { getSeedNotices } from "@/services/firebase/firestore";
import type { Notice } from "@/types";

export const useNotices = () => {
  const [notices] = useState<Notice[]>(getSeedNotices());
  return { notices };
};