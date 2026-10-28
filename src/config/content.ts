export const serviceIds = ["supply", "modern", "repair", "maintain"] as const;
export const buildingIds = ["residential", "villa", "office", "mall", "hospital", "industrial", "other"] as const;
export const applicationIds = ["residential", "villa", "office", "mall", "hospital", "industrial"] as const;
export const navIds = ["home", "about", "services", "projects", "contact"] as const;

export const governorateIds = [
  "cairo",
  "giza",
  "alexandria",
  "dakahlia",
  "red-sea",
  "beheira",
  "fayoum",
  "gharbia",
  "ismailia",
  "monufia",
  "minya",
  "qalyubia",
  "new-valley",
  "sharqia",
  "suez",
  "aswan",
  "asyut",
  "beni-suef",
  "port-said",
  "damietta",
  "south-sinai",
  "north-sinai",
  "kafr-el-sheikh",
  "matrouh",
  "luxor",
  "qena",
  "sohag",
  "new-capital",
] as const;

export const services = [
  { id: "supply", image: "/images/service-supply.jpg" },
  { id: "modern", image: "/images/service-modern.jpg" },
  { id: "repair", image: "/images/service-repair.jpg" },
  { id: "maintain", image: "/images/service-maintain.jpg" },
] as const;

export const applications = [
  { id: "residential", image: "/images/app-residential.jpg" },
  { id: "villa", image: "/images/app-villa.jpg" },
  { id: "office", image: "/images/app-office.jpg" },
  { id: "mall", image: "/images/app-mall.jpg" },
  { id: "hospital", image: "/images/app-hospital.jpg" },
  { id: "industrial", image: "/images/app-industrial.jpg" },
] as const;

export const projects = [
  { id: 1, count: 33 },
  { id: 2, count: 2 },
  { id: 3, count: 1 },
  { id: 4, count: 2 },
  { id: 5, count: 3 },
  { id: 6, count: 2 },
  { id: 7, count: 24 },
  { id: 8, count: 1 },
  { id: 9, count: 1 },
  { id: 10, count: 3 },
  { id: 11, count: 16 },
  { id: 12, count: 6 },
  { id: 13, count: 2 },
  { id: 14, count: 1 },
  { id: 15, count: 1 },
] as const;
