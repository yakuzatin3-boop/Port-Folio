export const projectDetails = {
  "commerce-payments": {
    role: "Full-stack developer",
    status: "Live",
    overview:
      "A complete commerce system pairing a responsive storefront with a NestJS backend. It handles authentication, product browsing, checkout and Bakong KHQR payments, then notifies the shop owner through the Telegram Bot API.",
    features: [
      "JWT authentication and role-based authorization",
      "Product, cart and order flows across the storefront and API",
      "Bakong KHQR checkout integration",
      "Telegram Bot API order notifications",
      "Deployed frontend on Vercel with a hosted API",
    ],
  },
  "school-management": {
    role: "Backend developer",
    status: "Completed",
    overview:
      "A production-ready school management REST API built with NestJS and MongoDB. It models the day-to-day operations of a school — users, teachers, students, courses, lessons, rooms, classes, schedules and attendance — behind a typed, role-aware API.",
    features: [
      "JWT authentication with admin, teacher and student roles",
      "Schedule conflict detection for teachers and rooms",
      "Attendance tracking with per-class, student and day uniqueness",
      "Full CRUD across users, classes, courses and enrollment",
      "Seed script plus unit and end-to-end tests",
    ],
  },
  "school-management-api": {
    role: "Full-stack developer",
    status: "In progress",
    overview:
      "A full-stack school platform packaged as a multi-container Docker deployment. The NestJS + TypeORM API covers enrollment, attendance, lessons, assignments, exams, grading, certificates and announcements, with a Vue + Nginx frontend proxying requests to the API.",
    features: [
      "PostgreSQL data model managed with TypeORM",
      "JWT access and refresh tokens with role-based guards",
      "QR-based class registration and enrollment",
      "Exams, grading, certificates and notifications",
      "Docker Compose stack with Nginx and a Vue frontend",
    ],
  },
  "nuxt-admin": {
    role: "Frontend developer",
    status: "Completed",
    overview:
      "A dark-mode-first ecommerce admin dashboard built with Nuxt 3, Vue 3, TypeScript and Tailwind CSS v4. The UI is packaged as a reusable Nuxt module, so the dashboard can be installed into another storefront instead of being rebuilt.",
    features: [
      "Reusable Nuxt module package structure",
      "Product, order and customer management screens",
      "Dashboard charts and data tables",
      "Dark and light themes built with Tailwind v4",
      "TypeScript-first components and composables",
    ],
  },
  "nestjs-ai-api": {
    role: "Full-stack developer",
    status: "Completed",
    overview:
      "A NestJS service that exposes an AI-powered API backed by a Python layer. Feature modules, DTO validation and environment-based configuration keep the integration isolated, typed and ready to scale.",
    features: [
      "AI endpoints backed by a Python service layer",
      "Modular NestJS feature architecture",
      "DTO validation and typed request contracts",
      "Environment-based configuration",
      "Deployment-ready server structure",
    ],
  },
  "course-labs": {
    role: "Instructor & author",
    status: "Ongoing",
    overview:
      "The public curriculum I teach at ETEC Center. Students clone the labs to practise HTML5, CSS3, Bootstrap, JavaScript fundamentals, Tailwind CSS and React through small, focused builds that mirror real classroom exercises.",
    features: [
      "Beginner-friendly HTML, CSS and JavaScript labs",
      "Bootstrap and Tailwind CSS layout exercises",
      "React practice projects",
      "Lesson-ready examples for live coding",
      "Open repositories students can clone and extend",
    ],
  },
  "nestjs-api": {
    role: "Backend developer",
    status: "Completed",
    overview:
      "A scalable NestJS REST API built as a reusable backend foundation. It uses a modular feature layout, DTO validation and a clean deployment-ready structure that can be extended service by service.",
    features: [
      "Feature-based NestJS module architecture",
      "DTO validation with class-validator",
      "RESTful resource endpoints",
      "Environment-based configuration",
      "Production build and deployment setup",
    ],
  },
  "mongo-db-express": {
    role: "Backend developer",
    status: "Completed",
    overview:
      "A focused CRUD application built with MongoDB, Mongoose and Express.js. It demonstrates schema design, clean route handlers and validation for everyday backend data operations.",
    features: [
      "Create, read, update and delete endpoints",
      "Mongoose schema modeling",
      "Express routing and middleware",
      "Request validation and error handling",
      "Simple structure for learning CRUD patterns",
    ],
  },
  "laravel-blade": {
    role: "Full-stack developer",
    status: "Completed",
    overview:
      "A Laravel application built around Blade templates. It showcases routing, layouts and reusable view components while keeping the server-rendered structure clean and easy to extend.",
    features: [
      "Blade layouts and reusable components",
      "Laravel routing and controllers",
      "Server-rendered views",
      "Form handling and validation",
      "Organized frontend asset structure",
    ],
  },
  "tailwindcss-cli": {
    role: "Frontend developer",
    status: "Completed",
    overview:
      "A practical Tailwind CSS v3/v4 CLI workflow for rapid prototyping. The project shows how to configure the CLI, customise the theme and produce minified production CSS without a frontend framework.",
    features: [
      "Tailwind CLI build setup",
      "Custom theme configuration",
      "Tailwind v3 and v4 workflow examples",
      "Production CSS minification",
      "Framework-free HTML prototypes",
    ],
  },
  "laragone-node-express": {
    role: "Backend developer",
    status: "Practice",
    overview:
      "Hands-on Node.js and Express exercises covering REST APIs, middleware, routing and request handling. The repository records my progression from basic servers to structured, testable API code.",
    features: [
      "REST API exercises",
      "Custom Express middleware",
      "Route organisation and request handling",
      "Error-handling practice",
      "Progressive practice from basics to APIs",
    ],
  },
  "express-shop": {
    role: "Backend developer",
    status: "Completed",
    overview:
      "A backend shop API built with Express and Node.js. It covers product management and cart-style routes in a modular structure designed for learning ecommerce backend patterns.",
    features: [
      "Product catalog endpoints",
      "Modular Express routing",
      "Cart and order flows",
      "JSON request validation",
      "Beginner-friendly project structure",
    ],
  },
};

export default projectDetails;
