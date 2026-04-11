import { createContext } from "react";
import type { UserProfileResponse } from "@/types/user/UserProfileResponse";

export const ProfileContext = createContext<{
  profile: UserProfileResponse | null;
  loading: boolean;
}>({ profile: null, loading: true });
