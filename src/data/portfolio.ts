import type { PortfolioData } from "@/types/portfolio";

export const portfolio: PortfolioData = {
  about: {
    name: "Yoganand Govind",
    role: "Senior Software Developer | Cloud & AI Platform Engineer",
    avatar: "",
    tagline:
      "Designing AI-powered cloud platforms and enterprise automation systems",

    location: "United Kingdom",

    summary: `
Full-stack engineer with 12+ years of experience building enterprise applications, now focused on cloud-native AI solutions with AWS.

Recently designed and launched Autowired.ai, a serverless SaaS platform for intelligent document processing using Amazon Textract and Bedrock Data Automation.

AWS Solutions Architect Associate certified with strong experience creating scalable, cost-efficient cloud systems.

Strong background in enterprise system architecture through extensive work with IBM Cúram Social Program Management (SPM) platforms supporting UK Government welfare services.

Experienced across full-stack development, cloud infrastructure, event-driven microservices, and AI-integrated workflows.
    `,
  },

  skills: [
    {
      category: "Programming Languages",
      skills: [
        { name: "Java" },
        { name: "TypeScript" },
        { name: "JavaScript" },
        { name: "SQL" },
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
      category: "Backend",
      skills: [
        { name: "Spring Boot" },
        { name: "Node.js" },
        { name: "REST APIs" },
        { name: "SOAP APIs" },
        { name: "Microservices" },
      ],
    },

    {
      category: "Cloud (AWS)",
      skills: [
        { name: "AWS Lambda" },
        { name: "API Gateway" },
        { name: "DynamoDB" },
        { name: "S3" },
        { name: "Step Functions" },
        { name: "EventBridge" },
        { name: "SQS" },
        { name: "SNS" },
        { name: "SES" },
        { name: "IAM" },
        { name: "CloudWatch" },
        { name: "CDK" },
      ],
    },

    {
      category: "AI & Data Platforms",
      skills: [
        { name: "Amazon Bedrock" },
        { name: "Bedrock Data Automation" },
        { name: "Claude API" },
        { name: "Amazon Textract" },
        { name: "LLM Applications" },
        { name: "Document AI Pipelines" },
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
      category: "DevOps & Infrastructure",
      skills: [
        { name: "AWS CDK" },
        { name: "GitHub Actions" },
        { name: "Jenkins" },
        { name: "GitLab" },
        { name: "SVN" },
        { name: "Vercel" },
        { name: "CI/CD Pipelines" },
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
      period: "Jan 2019 - Present",

      description:
        "Enterprise welfare platform development for UK Government departments using IBM Cúram Social Program Management (SPM). Project: Personal Independence Payment (PIP).",

      contributions: [
        "Architected, designed, and developed core Cúram SPM modules, UIM pages, IEG scripts, evidence, workflows, and backend services, delivering end-to-end functionality aligned with PIP business processes and legislative changes.",

        "Led feature development across multiple Cúram functional areas, including IEG, Batch Framework, Case & Participant Management, Financials, Task Management, Evidence Models, CER Rules, UIM Components, Codetables, and system administration modules.",

        "Collaborated closely with BAs, architects, testers, and product owners to prioritise, refine, and deliver business-critical PIP enhancements across multiple release cycles.",

        "Delivered high-quality, test-driven solutions using JUnit and TDD practices, improving reliability, regression coverage, and maintainability.",

        "Conducted R&D, proof-of-concept prototyping, and UI wireframing for new capability ideas; built sandbox implementations allowing stakeholders to trial new features and provide early feedback.",

        "Followed Agile/Scrum practices for sprint planning, grooming, technical design, development, and release execution.",

        "Performed in-depth code reviews, established Cúram best practices, and provided continuous technical mentorship to junior developers and new joiners.",

        "Diagnosed and resolved complex production incidents, performance bottlenecks, and system defects, delivering hotfixes and stability improvements within tight operational timelines.",

        "Participated in production deployments, supporting go-live activities, monitoring, and post-release validation to ensure minimal disruption to PIP service users.",

        "Managed version control and CI/CD pipelines using GitLab, SVN, and Jenkins, ensuring automated builds, consistent deployments, and controlled release processes.",

        "Administered and optimised Oracle and MongoDB databases, wrote advanced SQL queries, performed indexing, query tuning, and data analysis to support high-volume PIP workloads.",

        "Developed scalable integrations using REST/SOAP services, facade classes, and custom Java components for external assessment, payment, and compliance systems.",

        "Delivered knowledge-sharing sessions, onboarding guides, and technical documentation, improving team capability and cross-functional understanding.",
      ],
    },
    {
      title: "Software Developer",
      company: "Mphasis (India)",
      location: "India",
      period: "2014 - Dec 2018",

      description:
        "Software development on IBM Cúram SPM enterprise welfare platform before transitioning to the UK division.",

      contributions: [
        "Developed and maintained IBM Cúram SPM modules for enterprise welfare applications.",
        "Built backend services and integration layers using Java/J2EE.",
        "Contributed to database management and SQL performance optimisation with Oracle.",
        "Participated in Agile sprint cycles, code reviews, and technical documentation.",
      ],
    },
  ],

  projects: [
    {
      name: "Autowired.ai",

      subtitle: "AI-Powered Document Extraction Platform",

      description: `
Autowired.ai is an intelligent document processing platform that enables businesses to extract structured data from PDFs and images using visual templates and AI-powered automation, eliminating manual data entry.

The platform enables users to define document fields visually, run batch extraction pipelines, and export structured JSON/XML data.
      `,

      features: [
        {
          name: "Real-time canvas editor built in Next.js 15 with optimised state management (Zustand + React Query)",
        },

        {
          name: "AI-powered document processing pipeline using Amazon Bedrock Data Automation and Amazon Textract",
        },

        {
          name: "Serverless batch processing architecture using AWS Step Functions and SQS for reliable document handling",
        },

        {
          name: "Multi-tenant SaaS architecture with strict tenant-level data isolation",
        },

        { name: "Real-time processing status updates and batch notifications" },

        { name: "Export extracted structured data in JSON and XML formats" },

        { name: "Stripe subscription billing and Clerk authentication integration" },

        { name: "Hybrid deployment: Vercel (frontend) + AWS CDK (backend infrastructure)" },
      ],

      architecture: [
        "Next.js 15 Frontend hosted on Vercel",

        "API Gateway exposing REST endpoints for platform APIs",

        "AWS Lambda microservices (15+ functions) handling document processing workflows",

        "S3 for secure document storage and processing pipeline input",

        "Amazon Textract OCR pipeline for text detection",

        "Amazon Bedrock Data Automation for AI-powered data structuring and validation",

        "DynamoDB single-table design for multi-tenant metadata storage",

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
        "Built and launched a cloud-native AI SaaS platform (Autowired.ai) for intelligent document automation.",
    },

    {
      description:
        "Reduced document processing time by over 90% compared to manual extraction through automated AI-powered pipelines.",
    },

    {
      description:
        "Designed a serverless architecture orchestrating 15+ Lambda microservices using event-driven AWS services.",
    },

    {
      description:
        "Implemented cost optimisation strategies including BDA caching (24 hr TTL), reducing AI processing costs by approximately 40%.",
    },

    {
      description:
        "Delivered enterprise welfare system features supporting large-scale government services in the UK.",
    },
  ],

  certifications: [
    {
      name: "AWS Certified Solutions Architect – Associate",
      status: "Active",
      period: "2025 - 2029",
    },
    {
      name: "AWS Certified Developer – Associate",
      status: "Inactive",
      period: "2021 - 2024",
    },
    {
      name: "IBM Cúram V6.0.4 Application Developer",
      status: "Active",
    },
    {
      name: "AWS Generative AI Certification",
      status: "In Progress",
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
      value: "Yoganand.Govind@gmail.com",
      url: "mailto:Yoganand.Govind@gmail.com",
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
      "Passionate about designing modern, user-centric web applications. Actively exploring Cloud Computing, AI-driven development, and automation through tech blogs, engineering articles, and emerging practices.",
    hobbies: ["Photography", "Cooking", "Gardening"],
  },
};
