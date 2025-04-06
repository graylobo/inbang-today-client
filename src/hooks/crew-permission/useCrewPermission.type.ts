export interface CrewPermission {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
  };
  crew: {
    id: number;
    name: string;
    description: string;
    iconUrl: string;
  };
}

export interface PermissionCheck {
  hasPermission: boolean;
}

export interface Crew {
  id: number;
  name: string;
  description: string;
  iconUrl?: string;
}
