import type { PortfolioData } from "@/types/portfolio";

export const portfolio: PortfolioData = {
  about: {
    name: "Yogananda Govind",
    role: "AI & Cloud Engineer | AWS Solutions Architect | Serverless & AI Platform Builder",
    avatar: "",
    tagline: "Available for Contract | Remote | Hybrid",
    location: "United Kingdom",
    summary: `
Enterprise Software Engineer transitioning into AI and Cloud Engineering, with 12+ years of experience building large-scale backend systems.

Recently architected and launched a production serverless AI SaaS platform on AWS, leveraging Bedrock, Textract, Lambda, and DynamoDB.

AWS Certified Solutions Architect and AWS Certified Generative AI Developer – Professional, with hands-on experience in cloud-native system design and AI-driven automation.

Strong background in enterprise system architecture through extensive work with IBM Cúram Social Program Management (SPM) platforms supporting UK Government welfare services.

Extensive experience delivering UK public sector, policy-driven benefit systems in high-availability environments. Experienced transitioning from legacy enterprise systems to cloud-native architectures. Comfortable in remote, distributed teams.
    `,
  },

  skills: [
    {
      category: "Cloud & Serverless Architecture",
      skills: [
        { name: "AWS Lambda" },
        { name: "API Gateway" },
        { name: "DynamoDB" },
        { name: "S3" },
        { name: "Step Functions" },
        { name: "SQS" },
        { name: "EventBridge" },
        { name: "SNS" },
        { name: "SES" },
        { name: "IAM" },
        { name: "CloudWatch" },
        { name: "AWS CDK" },
        { name: "Multi-tenant SaaS Architecture" },
        { name: "Event-Driven Systems" },
        { name: "Cost Optimisation" },
      ],
    },

    {
      category: "AI & Intelligent Automation",
      skills: [
        { name: "Amazon Bedrock" },
        { name: "Amazon Textract" },
        { name: "Bedrock Data Automation" },
        { name: "LLM-Powered Document Intelligence" },
        { name: "AI Workflow Orchestration" },
        { name: "Document Processing Pipelines" },
        { name: "Claude API" },
      ],
    },

    {
      category: "Backend & Distributed Systems",
      skills: [
        { name: "Java" },
        { name: "TypeScript" },
        { name: "Node.js" },
        { name: "Spring Boot" },
        { name: "REST APIs" },
        { name: "SOAP APIs" },
        { name: "Microservices" },
        { name: "High-Volume Data Processing" },
        { name: "Performance Tuning" },
      ],
    },

    {
      category: "Frontend",
      skills: [
        { name: "Next.js" },
        { name: "React" },
        { name: "Tailwind CSS" },
        { name: "Zustand" },
        { name: "React Query" },
      ],
    },

    {
      category: "Databases",
      skills: [
        { name: "DynamoDB" },
        { name: "Oracle" },
        { name: "MongoDB" },
        { name: "PostgreSQL" },
      ],
    },

    {
      category: "DevOps & Delivery",
      skills: [
        { name: "CI/CD Automation" },
        { name: "GitHub Actions" },
        { name: "Jenkins" },
        { name: "GitLab" },
        { name: "SVN" },
        { name: "Vercel" },
        { name: "Agile / Scrum" },
        { name: "Production Support (SLA-driven)" },
      ],
    },

    {
      category: "Enterprise Platforms",
      skills: [
        { name: "IBM Cúram SPM" },
        { name: "CER Rules Engine" },
        { name: "IEG Scripts" },
        { name: "Batch Framework" },
        { name: "Evidence Models" },
      ],
    },
  ],

  experience: [
    {
      title: "Senior Software Engineer",
      company: "Mphasis UK Limited",
      location: "London, United Kingdom",
      period: "2014 - Present",

      description:
        "Enterprise welfare platform development for UK Government departments using IBM Cúram Social Program Management (SPM). Project: Personal Independence Payment (PIP).",

      contributions: [
        "Delivered end-to-end Cúram SPM solutions across multiple modules, supporting millions of PIP claims annually.",

        "Led development across Case Management, Financials, Task Management, and Batch Framework, ensuring scalable and maintainable solutions.",

        "Translated complex business and policy requirements into rule-driven system implementations (CER).",

        "Optimised batch processing and SQL queries, improving performance for high-volume workloads (millions of records).",

        "Resolved Sev1/Sev2 production incidents within strict SLA timelines in a high-availability environment.",

        "Contributed to production deployments, go-live support, and post-release validation, ensuring minimal disruption to live services.",

        "Collaborated with BAs, architects, and product owners to deliver iterative enhancements across multiple release cycles.",

        "Established development best practices and conducted code reviews, improving code quality and maintainability.",

        "Mentored junior developers and supported onboarding, improving team delivery capability.",

        "Developed integrations with external systems using REST/SOAP services and custom Java components.",

        "Managed CI/CD pipelines using Jenkins, GitLab, TortoiseGit and SVN, ensuring consistent and reliable deployments.",

        "Conducted R&D and proof-of-concept development to evaluate new features and implementation approaches.",
      ],
    },
  ],

  projects: [
    {
      name: "Autowired.ai",

      subtitle: "AI-Powered Document Intelligence Platform",

      description: `
Autowired.ai is an intelligent document processing platform that enables businesses to extract structured data from documents using AI-driven templates and LLM orchestration, eliminating manual data entry.

Designed and deployed as a multi-tenant, serverless SaaS platform enabling businesses to extract structured data from documents using AI-driven templates and LLM orchestration.
      `,

      features: [
        {
          name: "Multi-Tenant SaaS Architecture with strict tenant isolation using DynamoDB single-table design with partition key scoping and tenant-aware access control",
        },

        {
          name: "Asynchronous Batch Processing Pipeline using S3 triggers, SQS queues, AWS Lambda, and Step Functions to process high document volumes reliably",
        },

        {
          name: "Token-Aware AI Processing with Amazon Bedrock, controlled prompt orchestration and intelligent caching (24hr TTL) lowering AI costs by ~40%",
        },

        {
          name: "Subscription & Usage-Based Model with Stripe for subscription management, usage limits, and tier-based document processing quotas",
        },

        {
          name: "Cost-Optimised Serverless Design: fully serverless stack (Lambda, DynamoDB, S3, API Gateway) enabling automatic scaling with minimal idle cost",
        },

        {
          name: "Real-time canvas editor built in Next.js with optimised state management (Zustand + React Query)",
        },

        { name: "Export extracted structured data in JSON and XML formats" },

        { name: "Clerk authentication integration" },

        {
          name: "Hybrid deployment: Vercel (frontend) + AWS CDK (backend infrastructure)",
        },
      ],

      architecture: [
        "Next.js 15 Frontend hosted on Vercel",

        "API Gateway exposing REST endpoints for platform APIs",

        "AWS Lambda microservices (15+ functions) handling document processing workflows",

        "S3 for secure document storage with event-driven triggers into processing pipeline",

        "Amazon Textract OCR pipeline for text detection",

        "Amazon Bedrock Data Automation for AI-powered data structuring and validation",

        "DynamoDB single-table design for multi-tenant metadata storage with partition key scoping",

        "SQS queues and Step Functions orchestrating asynchronous batch workflows",

        "SES for transactional email notifications",

        "CloudWatch monitoring and SNS notifications for operational observability",
      ],

      techStack: [
        "Next.js 15",
        "TypeScript",
        "AWS Lambda",
        "API Gateway",
        "DynamoDB",
        "S3",
        "Step Functions",
        "SQS",
        "Textract",
        "Bedrock",
        "SES",
        "AWS CDK",
        "Clerk",
        "Stripe",
        "Tailwind CSS",
      ],

      liveUrl: "https://autowired.ai",
    },
  ],

  achievements: [
    {
      description:
        "Built and launched Autowired.ai, a production-grade multi-tenant serverless AI SaaS platform for intelligent document automation on AWS.",
    },

    {
      description:
        "Reduced document processing time by over 90% compared to manual extraction through automated AI-powered pipelines using Bedrock and Textract.",
    },

    {
      description:
        "Designed a serverless architecture orchestrating 15+ Lambda microservices using event-driven AWS services (S3, SQS, Step Functions, EventBridge).",
    },

    {
      description:
        "Implemented token-aware AI processing with intelligent caching (24hr TTL), reducing AI inference costs by approximately 40%.",
    },

    {
      description:
        "Delivered enterprise welfare system features supporting millions of PIP claims annually for UK Government in high-availability, SLA-driven environments.",
    },
  ],

  certifications: [
    {
      name: "AWS Certified Generative AI Developer – Professional",
      status: "Active",
      period: "2026 - 2029",
    },
    {
      name: "AWS Certified Solutions Architect – Associate",
      status: "Active",
      period: "2025 - 2028",
    },
    {
      name: "AWS Certified Developer – Associate",
      status: "Inactive",
      period: "2021 - 2024",
    },
    {
      name: "IBM Cúram V6 Application Developer",
      status: "Active",
    },
  ],

  contact: [
    {
      type: "phone",
      label: "Phone",
      value: "+44 07365558999",
      url: "tel:+4407365558999",
    },

    {
      type: "email",
      label: "Email",
      value: "yoganand.govind@gmail.com",
      url: "mailto:yoganand.govind@gmail.com",
    },

    {
      type: "linkedin",
      label: "LinkedIn",
      value: "yoganandgovind",
      url: "https://linkedin.com/in/yoganandgovind",
    },

    {
      type: "github",
      label: "GitHub",
      value: "yogieee",
      url: "https://github.com/yogieee",
    },

    {
      type: "portfolio",
      label: "Portfolio",
      value: "yoganandgovind.me",
      url: "https://www.yoganandgovind.me",
    },
  ],

  education: [
    {
      degree: "Master of Computer Application (MCA)",
      year: "2014",
      institution: "Bangalore University, India",
    },
    {
      degree: "Bachelor of Computer Application (BCA)",
      year: "2011",
      institution: "Bangalore University, India",
    },
  ],

  interests: {
    learning:
      "Passionate about designing modern AI-powered cloud platforms. Actively exploring Cloud Computing, AI-driven development, and automation through tech blogs, engineering articles, and emerging practices.",
    hobbies: ["Photography", "Cooking", "Gardening"],
  },
};
