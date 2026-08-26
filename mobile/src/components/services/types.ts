import { Href } from "expo-router";
import { List, LucideProps } from "lucide-react-native";
import { ReactNode, RefAttributes } from "react";

export type ServiceAttributes = {
  href: Href;
  title: string;
  subtitle: string;
  icon: (props: LucideProps & RefAttributes<SVGSVGElement>) => ReactNode;
};

export const todoService: ServiceAttributes = {
  href: "/todo",
  title: "Todo",
  subtitle: "A basic todo app",
  icon: List,
};

export const services = [todoService];
