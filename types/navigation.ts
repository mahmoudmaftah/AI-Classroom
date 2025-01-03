// types/navigation.ts
export interface MenuItem {
  name: string;
  icon: string;
  path?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  initials: string;
}