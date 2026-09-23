import type { UserRecord } from "~/types/user";
import { addDays } from "~/utils/date";

export const SESSION_USER_ID = "u-valeria";

// Accepts an Unsplash photo id or a root-relative path to a file under /public.
function portrait(photo: string): string {
  if (photo.startsWith("/")) return photo;
  return `https://images.unsplash.com/photo-${photo}?w=240&h=240&q=75&auto=format&fit=crop&crop=faces`;
}

interface UserSeed {
  id: string;
  firstName: string;
  lastName: string;
  photo?: string;
  role?: UserRecord["role"];
  // How long ago the account was created.
  daysAgo: number;
}

const SEEDS: UserSeed[] = [
  { id: SESSION_USER_ID, firstName: "Valeria", lastName: "Ortiz Mendoza", photo: "/profile-photo-woman.jpg", role: "admin", daysAgo: 540 },
  { id: "u-daniela", firstName: "Daniela", lastName: "Cruz Rivas", photo: "1494790108377-be9c29b29330", role: "employee", daysAgo: 420 },
  { id: "u-marco", firstName: "Marco", lastName: "Salinas Pérez", photo: "1507003211169-0a1dd7228f2d", role: "employee", daysAgo: 390 },
  { id: "u-lucia", firstName: "Lucía", lastName: "Hernández Soto", photo: "1438761681033-6461ffad8d80", daysAgo: 310 },
  { id: "u-andres", firstName: "Andrés", lastName: "Morales Vega", photo: "1500648767791-00dcc994a43e", daysAgo: 288 },
  { id: "u-sofia", firstName: "Sofía", lastName: "Ramírez León", photo: "1544005313-94ddf0286df2", daysAgo: 260 },
  { id: "u-fernanda", firstName: "Fernanda", lastName: "Castillo Ruiz", daysAgo: 241 },
  { id: "u-jorge", firstName: "Jorge", lastName: "Navarro Díaz", daysAgo: 230 },
  { id: "u-mariana", firstName: "Mariana", lastName: "Aguilar Flores", daysAgo: 214 },
  { id: "u-ricardo", firstName: "Ricardo", lastName: "Domínguez Luna", daysAgo: 199 },
  { id: "u-paola", firstName: "Paola", lastName: "Jiménez Torres", daysAgo: 180 },
  { id: "u-camila", firstName: "Camila", lastName: "Vargas Méndez", daysAgo: 162 },
  { id: "u-diego", firstName: "Diego", lastName: "Gutiérrez Silva", daysAgo: 150 },
  { id: "u-renata", firstName: "Renata", lastName: "Chávez Ortega", daysAgo: 133 },
  { id: "u-ximena", firstName: "Ximena", lastName: "Romero Nava", daysAgo: 118 },
  { id: "u-alejandro", firstName: "Alejandro", lastName: "Reyes Campos", daysAgo: 97 },
  { id: "u-regina", firstName: "Regina", lastName: "Mendoza Ibarra", daysAgo: 84 },
  { id: "u-emilio", firstName: "Emilio", lastName: "Fuentes Lara", daysAgo: 66 },
  { id: "u-natalia", firstName: "Natalia", lastName: "Herrera Paz", daysAgo: 52 },
  { id: "u-isabel", firstName: "Isabel", lastName: "Montes Rojas", daysAgo: 37 },
  { id: "u-tomas", firstName: "Tomás", lastName: "Estrada Solís", daysAgo: 21 },
  { id: "u-andrea", firstName: "Andrea", lastName: "Pineda Cortés", daysAgo: 12 },
  { id: "u-gabriela", firstName: "Gabriela", lastName: "Ibáñez Robles", daysAgo: 4 },
];

function slug(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .split(" ")[0]!;
}

export function createMockUsers(now: Date = new Date()): UserRecord[] {
  return SEEDS.map((seed, index) => ({
    id: seed.id,
    firstName: seed.firstName,
    lastName: seed.lastName,
    email: `${slug(seed.firstName)}.${slug(seed.lastName)}@correo-demo.mx`,
    phone: `+52443555${String(1000 + index * 37).slice(-4)}`,
    photoURL: seed.photo ? portrait(seed.photo) : null,
    role: seed.role,
    createdAt: addDays(now, -seed.daysAgo),
  }));
}
