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
  SiPostman,
  SiPostgresql,
  SiMongodb,
  SiCplusplus,
  SiGit,
  SiGithub,
} from "react-icons/si";
import { Code2, Table2, QrCode } from "lucide-react";

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/";

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
    eyebrow: "Interface",
    span: 7,
    items: [
      { name: "React.js", icon: SiReact, color: "#61DAFB", img: DEVICON + "react/react-original.svg" },
      { name: "Next.js", icon: SiNextdotjs, color: "#0B0B0B", img: DEVICON + "nextjs/nextjs-original.svg", darkInvert: true },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E", img: DEVICON + "javascript/javascript-original.svg" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6", img: DEVICON + "typescript/typescript-original.svg" },
      { name: "HTML5", icon: SiHtml5, color: "#E34F26", img: DEVICON + "html5/html5-original.svg" },
      { name: "CSS3", icon: SiCss, color: "#1572B6", img: DEVICON + "css3/css3-original.svg" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4", img: DEVICON + "tailwindcss/tailwindcss-original.svg" },
      { name: "Bootstrap", icon: SiBootstrap, color: "#7952B3", img: DEVICON + "bootstrap/bootstrap-original.svg" },
      { name: "Flutter (Dart)", icon: SiFlutter, color: "#0175C2", img: DEVICON + "flutter/flutter-original.svg" },
    ],
  },
  {
    id: "backend",
    tab: "backend",
    title: "Backend",
    eyebrow: "Server",
    span: 5,
    items: [
      { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E", img: DEVICON + "nodejs/nodejs-original.svg" },
      { name: "Express.js", icon: SiExpress, color: "#0B0B0B", img: DEVICON + "express/express-original.svg", darkInvert: true },
      { name: "NestJS", icon: SiNestjs, color: "#E0234E", img: DEVICON + "nestjs/nestjs-original.svg" },
      { name: "Laravel", icon: SiLaravel, color: "#FF2D20", img: DEVICON + "laravel/laravel-original.svg" },
    ],
  },
  {
    id: "database",
    tab: "database",
    title: "Database",
    eyebrow: "Data layer",
    span: 4,
    items: [
      { name: "MySQL", icon: SiMysql, color: "#4479A1", img: DEVICON + "mysql/mysql-original.svg" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1", img: DEVICON + "postgresql/postgresql-original.svg" },
      { name: "MongoDB", icon: SiMongodb, color: "#47A248", img: DEVICON + "mongodb/mongodb-original.svg" },
    ],
  },
  {
    id: "tools",
    tab: "tools",
    title: "Tools & Systems",
    eyebrow: "Workflow",
    span: 8,
    items: [
      { name: "C/C++", icon: SiCplusplus, color: "#00599C", img: DEVICON + "cplusplus/cplusplus-original.svg" },
      { name: "Git", icon: SiGit, color: "#F05032", img: DEVICON + "git/git-original.svg" },
      { name: "GitHub", icon: SiGithub, color: "#181717", img: DEVICON + "github/github-original.svg", darkInvert: true },
      { name: "VS Code", icon: Code2, color: "#007ACC", img: DEVICON + "vscode/vscode-original.svg" },
      { name: "MySQL Workbench", icon: Table2, color: "#4479A1", img: DEVICON + "mysql/mysql-original.svg" },
      { name: "Bakong KHQR API", icon: QrCode, color: "#F97316", img: "" },
      { name: "Postman", icon: SiPostman, color: "#FF6C37", img: DEVICON + "postman/postman-original.svg" },
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
