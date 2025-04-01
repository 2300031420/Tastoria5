import {
  ClockIcon,
  QrCodeIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";

export const featuresData = [
  {
    color: "blue",
    title: "Pre-order Meals",
    icon: ClockIcon,
    description:
      "Skip the wait by pre-ordering your meals. Place your order ahead of time and have it ready when you arrive.",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-500",
    hoverBg: "hover:bg-blue-100",
  },
  {
    color: "purple",
    title: "Scan & Dine",
    icon: QrCodeIcon,
    description:
      "Simply scan the QR code at your table to view the menu, place orders, and make payments seamlessly.",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-500",
    hoverBg: "hover:bg-purple-100",
  },
  {
    color: "teal",
    title: "Table Reservations",
    icon: TableCellsIcon,
    description:
      "Reserve your preferred table in advance. Secure your spot at your favorite restaurants with just a few clicks.",
    bgColor: "bg-teal-50",
    iconColor: "text-teal-500",
    hoverBg: "hover:bg-teal-100",
  },
];

export default featuresData;
