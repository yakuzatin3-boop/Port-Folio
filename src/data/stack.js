import { SiReact, SiNextdotjs, SiJavascript, SiTypescript, SiHtml5, SiCss } from "react-icons/si";
import {
  SiTailwindcss,
  SiBootstrap,
  SiFlutter,
  SiNodedotjs,
  SiExpress,
  SiNestjs,
  SiLaravel,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiCplusplus,
  SiGit,
  SiGithub,
  SiTelegram,
} from "react-icons/si";
import { Code2, Table2, QrCode } from "lucide-react";

export const filters = [
  { id: "all", label: "All" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "database", label: "Database" },
  { id: "tools", label: "Tools" },
];

export const stackGroups = [
  {
    id: "frontend",
    tab: "frontend",
    title: "Frontend & Mobile",
    span: 7,
    items: [
      { name: "React.js", icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", icon: SiNextdotjs, color: "#E5E5E5" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
      { name: "CSS3", icon: SiCss, color: "#1572B6" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "Bootstrap", icon: SiBootstrap, color: "#7952B3" },
      { name: "Flutter (Dart)", icon: SiFlutter, color: "#3CCFCF" },
    ],
  },
  {
    id: "backend",
    tab: "backend",
    title: "Backend",
    span: 5,
    items: [
      { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
      { name: "Express.js", icon: SiExpress, color: "#E5E5E5" },
      { name: "NestJS", icon: SiNestjs, color: "#E0234E" },
      { name: "Laravel", icon: SiLaravel, color: "#FF2D20" },
    ],
  },
  {
    id: "database",
    tab: "database",
    title: "Database",
    span: 4,
    items: [
      { name: "MySQL", icon: SiMysql, color: "#4479A1" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
      { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
    ],
  },
  {
    id: "tools",
    tab: "tools",
    title: "Tools & Systems",
    span: 8,
    items: [
      { name: "C/C++", icon: SiCplusplus, color: "#00599C" },
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "GitHub", icon: SiGithub, color: "#E5E5E5" },
      { name: "VS Code", icon: Code2, color: "#22A6F2" },
      { name: "MySQL Workbench", icon: Table2, color: "#4479A1" },
      { name: "Bakong KHQR API", icon: QrCode, color: "#F97316" },
      { name: "Telegram Bot API", icon: SiTelegram, color: "#29A9EB" },
    ],
  },
];

export const totalTechnologies = stackGroups.reduce((sum, group) => sum + group.items.length, 0);

const rowOne = stackGroups.flatMap((group) => group.items.map((item) => item.name));
const rowTwo = [...rowOne].sort((a, b) => b.length - a.length);

export const marqueeRows = [
  { id: "row-1", items: rowOne },
  { id: "row-2", items: rowTwo },
];

export default stackGroups;
