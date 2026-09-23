export type UserRole = "admin" | "employee";

export interface UserRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  photoURL: string | null;
  role?: UserRole;
  createdAt: Date;
}

export interface ProfileUpdateInput {
  firstName: string;
  lastName: string;
  phone: string;
}
