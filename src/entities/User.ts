import { ROLES } from "../config/constants";

export default interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string | null;
  password: string;
  role: typeof ROLES.client | typeof ROLES.company | typeof ROLES.admin;
};
