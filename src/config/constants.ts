import User from "../entities/User";

export const ROLES = {
  company: "Company",
  client: "Client",
  admin: "Admin",
} as const;

export const HEADER_HEIGHT = 80;
export const APPBAR_HEIGHT = 30;

export const LANGUAGES = {
  ar: "العربية",
  en: "English",
} as const;

export const MAX_WEIGHT = {
  general: 25, // Default
  heavy: 35, // Heavy or speacial e.g. electronics, tools
  fragile: 15, // Luxuary or fragile: to minimize damage risks
} as const;

// edit this based on the backend
export interface GetDataResponse<T> {
  data: T | null;
  totalItems?: number | null;
  totalPages?: number | null;
}

export type authObject = {
  token: string | null;
  user: User | null;
}

export type colorsType = { main: string; secondry: string; bodyBG: string; white: string; black: string; grey: { 100: string; 200: string; 300: string; 400: string; 500: string; 600: string; 700: string; 800: string; 900: string; }; primary: { 100: string; 200: string; 300: string; 400: string; 500: string; 600: string; 700: string; 800: string; 900: string; }; greenAccent: { 100: string; 200: string; 300: string; 400: string; 500: string; 600: string; 700: string; 800: string; 900: string; }; redAccent: { 100: string; 200: string; 300: string; 400: string; 500: string; 600: string; 700: string; 800: string; 900: string; }; blueAccent: { 100: string; 200: string; 300: string; 400: string; 500: string; 600: string; 700: string; 800: string; 900: string; }; }

export const egyptianCities = [
  "Cairo",
  "Alexandria",
  "Giza",
  "Shubra El-Kheima",
  "Port Said",
  "Suez",
  "El Mahalla El Kubra",
  "Luxor",
  "Mansoura",
  "Tanta",
  "Asyut",
  "Ismailia",
  "Faiyum",
  "Zagazig",
  "Aswan",
  "Damietta",
  "Damanhur",
  "Minya",
  "Beni Suef",
  "Hurghada",
  "Qena",
  "Sohag",
  "Shibin El Kom",
  "Banha",
  "Arish",
  "Mallawi",
  "10th of Ramadan City",
  "Bilbais",
  "Marsa Matruh",
  "Idfu",
  "Mit Ghamr",
  "Al-Hamidiyah",
  "Desouk",
  "Qalyub",
  "Abu Kabir",
  "Kafr el-Sheikh",
  "Girga",
  "Akhmim",
  "Matareya",
  "Manfalut",
  "Beni Mazar",
  "Tala",
  "Ashmoun",
];

export const TRANSLAITIONS = {
  invalidEntityError: "invalidEntityError",
  requiredEntityError: "requiredEntityError",
  minEntityError: "minEntityError",
  maxEntityError: "maxEntityError",
  passwordUppercaseError: "passwordUppercaseError",
  passwordLowercaseError: "passwordLowercaseError",
  passwordNumberError: "passwordNumberError",
  passwordSpecialCharError: "passwordSpecialCharError",
  passwordNoSpacesError: "passwordNoSpacesError",

  clientRole: "clientRole",
  clientRoleDescription: "clientRoleDescription",
  companyRole: "companyRole",
  companyRoleDescription: "companyRoleDescription",
  
  nameDescription: "nameDescription",
  newOrderSuptitle: "newOrderSuptitle",
  makeOffer: "makeOffer",

  // Meanings - Words
  name: "name",
  mobileNumber: "mobileNumber",
  email: "email",
  password: "password",
  role: "role",
  description: "description",
  from: "from",
  pickupCity: "pickupCity",
  to: "to",
  deliveryCity: "deliveryCity",
  orders: "orders",
  offer: "offer",
  review: "review",
  notifications: "notifications",
  profile: "profile",
  signOut: "signOut",
  login: "login",
  actions: "actions",

  add: "add",
  placeOrder: "Place Order",
  update: "update",
  edit: "edit",
  delete: "delete",
  save: "save",
  cancel: "cancel",

  // topbar
  topbar_changeLanguage_tooltipTitle: "topbar_changeLanguage_tooltipTitle",
  topbar_greeting: "topbar_greeting",
  topbar_orders_tooltipTitle: "topbar_orders_tooltipTitle",
  topbar_profile_tooltipTitle: "topbar_profile_tooltipTitle",
  topbar_notifications_tooltipTitleAllowed:
    "topbar_notifications_tooltipTitleAllowed",
  topbar_notifications_tooltipTitleNotAllowed:
    "topbar_notifications_tooltipTitleNotAllowed",
  "offersMade": "offersMade",
  "newOrder": "newOrder",

  // Login
  login_alreadySignedError: "login_alreadySignedError",
  login_headerTitle: "login_headerTitle",
  login_headerSubtitle: "login_headerSubtitle",
  login_rememberMeLabel: "login_rememberMeLabel",
  login_headToRegisterLink: "login_headToRegisterLink",
  login_loginButton: "login_loginButton",

  // Register
  register_headerTitle: "register_headerTitle",
  register_headerSubtitle: "register_headerSubtitle",
  register_headToLoginLink: "register_headToLoginLink",
  register_registerButton: "register_registerButton",

  // Profile
  profile_headerTitle: "profile_headerTitle",
  profile_updateButton: "profile_updateButton",
};
