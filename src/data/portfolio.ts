import type { PortfolioData } from "@/types/portfolio";

export const portfolio: PortfolioData = {
  about: {
    name: "Yogananda Govind",
    role: "AI & Cloud Engineer | Technical Founder (Signoff) | AWS Certified Generative AI Developer",
    avatar: "",
    tagline: "Available for Contract | Remote | Hybrid",
    location: "United Kingdom",
    summary: `
AI Platform Engineer and technical founder with 12+ years of experience building large-scale backend systems.

Founder of Signoff (SIGNOFF STUDIO LTD): a Claude-powered subscription product, designed and built single-handedly, that turns UK small businesses' own photos and videos into social posts and Reels, with owner approval before anything is published. Launching with 25 pilot customers in November 2026.

Also architected and launched Autowired.ai, a production serverless AI SaaS platform on AWS, leveraging Bedrock, Textract, Lambda, and DynamoDB.

Currently building a prompt injection detector for LLM agents, focused on AI security for agentic systems.

AWS Certified Generative AI Developer – Professional, AWS Certified Solutions Architect and HashiCorp Certified Terraform Associate, with hands-on experience in cloud-native system design and AI-driven automation.

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
        { name: "Terraform" },
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
        { name: "RAG & Vector Similarity Search" },
        { name: "Human-in-the-Loop AI Workflows" },
        { name: "Prompt Caching & Token Cost Optimisation" },
      ],
    },

    {
      category: "AI Security",
      skills: [
        { name: "Prompt Injection Detection (direct & indirect)" },
        { name: "LLM Agent & MCP Tool-Use Guardrails" },
        { name: "Grounding / Fact Checks on LLM Output" },
        { name: "Tenant Data Isolation for AI Workloads" },
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
        { name: "Framer Motion" },
        { name: "Sanity CMS" },
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
      title: "Founder",
      company: "SIGNOFF STUDIO LTD",
      location: "United Kingdom",
      period: "2026 - Present",

      description:
        "Founded and built Signoff single-handedly: an AI social content assistant for UK small businesses with no marketing team. Also delivers custom websites for UK businesses.",

      contributions: [
        "Designed and built the whole product: architecture, Claude integration, social platform integrations, subscription billing and go-to-market.",

        "Built a Claude-powered assistant that learns a business's brand and drafts posts, carousels, captions and Reels from the owner's own media, checking each draft against the facts the business provided.",

        "Designed a human approval workflow: nothing is published until the owner approves each draft and picks a time.",

        "Lined up 25 pilot customers for launch in November 2026.",

        "Delivered Next.js websites for UK businesses, including Stoneage Properties (with Sanity CMS) and Homely restaurant.",
      ],
    },

    {
      title: "Senior Software Engineer / Team Lead",
      company: "Mphasis UK Limited",
      location: "London, United Kingdom",
      period: "Jan 2019 - Present",

      description:
        "Enterprise welfare platform development for UK Government (DWP) using IBM Cúram Social Program Management (SPM). Projects: Personal Independence Payment (PIP) and Universal Credit.",

      contributions: [
        "Delivered end-to-end Cúram SPM solutions across multiple modules, supporting millions of PIP claims annually.",

        "Led development across Case Management, Financials, Task Management, and Batch Framework, ensuring scalable and maintainable solutions.",

        "Translated complex business and policy requirements into rule-driven system implementations (CER).",

        "Optimised batch processing and SQL queries, improving performance for high-volume workloads (millions of records).",

        "Resolved Sev1/Sev2 production incidents within strict SLA timelines in a high-availability environment.",

        "Contributed to production deployments, go-live support, and post-release validation, ensuring minimal disruption to live services.",

        "Collaborated with BAs, architects, and product owners to deliver iterative enhancements across multiple release cycles.",

        "Established development best practices and conducted code reviews, improving code quality and maintainability.",

        "Leading a team of 3 within a user research-focused squad: MVP delivery, sprint planning, code reviews and mentoring junior developers.",

        "Developed integrations with external systems using REST/SOAP services and custom Java components.",

        "Managed CI/CD pipelines using Jenkins, GitLab, TortoiseGit and SVN, ensuring consistent and reliable deployments.",

        "Conducted R&D and proof-of-concept development to evaluate new features and implementation approaches.",
      ],
    },

    {
      title: "Software Engineer (Delivery)",
      company: "Mphasis Limited",
      location: "India",
      period: "Nov 2014 - Dec 2018",

      description:
        "Full-stack engineer on AIG's large-scale insurance claims management platform.",

      contributions: [
        "Built and maintained features using Java (backend services, REST APIs) and React/Node.js/MongoDB.",

        "Developed modules for claims intake, processing workflows and status tracking in a high-volume claims system.",

        "Designed RESTful APIs across distributed microservices and optimised MongoDB and relational queries for high-throughput claims data.",
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

    {
      name: "Signoff",

      subtitle: "AI Social Content Assistant for UK Small Businesses",

      description: `
Signoff is a subscription service for UK small businesses with no marketing team (trades, hair and beauty, food and drink, shops). The owner answers one weekly question and adds photos; Signoff turns their own media into posts, captions and Reels, and nothing goes out until they approve it.

Founded SIGNOFF STUDIO LTD and designed and built the product single-handedly. Launching with 25 pilot customers in November 2026.
      `,

      features: [
        {
          name: "Claude-powered assistant that learns a business's brand from its website, logo and colours, then drafts posts, carousels, captions and Reels",
        },

        {
          name: "Each draft is checked against the facts the business provided before it reaches the owner",
        },

        {
          name: "Human approval workflow: owner approves each draft and picks a time; nothing is auto-published",
        },

        {
          name: "Publishing to Instagram, Facebook, TikTok, YouTube and Google Business Profile, with per-post reach, views, saves and shares analytics",
        },

        {
          name: "Three-tier monthly subscription with plan quotas (posts, Reels, storage, connected accounts), free trial and self-serve cancellation",
        },

        {
          name: "Customer data stored in London on AWS, with AI drafting in AWS UK/EU regions; each business's media isolated to its own account",
        },
      ],

      architecture: [
        "Web app for owners to upload media, review and approve drafts",

        "Claude drafting pipeline for posts, captions and Reels scripts",

        "Fact-check step on each draft against business-provided details",

        "Approval and scheduling workflow",

        "Social platform publishing integrations and analytics",

        "AWS hosting with data in London",
      ],

      techStack: ["Claude", "AWS", "Next.js", "TypeScript", "Social platform APIs"],

      liveUrl: "https://signoff.uk.com",
    },

    {
      name: "Prompt Injection Detector (in progress)",

      subtitle: "AI Security Guard Layer for LLM Agents",

      description: `
A guard layer, currently being built, that detects indirect prompt injection: instructions hidden in documents, web pages, customer uploads or tool outputs that try to hijack an LLM agent. Motivated by my own products, where untrusted customer content flows into Claude and Bedrock.
      `,

      features: [
        {
          name: "Threat model covering direct overrides, role and system-prompt spoofing, data-exfiltration requests, and hidden or encoded payloads (zero-width characters, HTML comments, Base64)",
        },

        {
          name: "Layered detection: fast rule-based screening, then an LLM classifier that judges whether content is data or an instruction aimed at the model, returning the flagged span, a risk score and a reason",
        },

        {
          name: "Designed as middleware for tool-calling agents and MCP servers: flags, strips or quarantines suspicious content before it reaches a model with tool access, with audit logging",
        },

        {
          name: "Evaluation on a labelled set mixing known injection attacks with benign real-world business content, measuring detection rate against false positives",
        },
      ],

      architecture: [
        "Untrusted input (user text, documents, tool output)",

        "Rule-based screening",

        "LLM classifier",

        "Allow / flag / quarantine decision with audit log",

        "Agent or MCP tool call",
      ],

      techStack: ["TypeScript", "Claude", "Amazon Bedrock", "MCP"],

      liveUrl: "",
    },

    {
      name: "Stoneage Properties",

      subtitle: "Website for a Solihull Design-and-Build Contractor",

      description: `
Client website for a West Midlands design-and-build practice (new builds, extensions, loft conversions, renovations). Built so the client can edit projects, services and journal articles themselves.
      `,

      features: [
        { name: "Sanity CMS so the client self-edits projects, services and journal articles" },

        { name: "Service pages, project case studies and Trustpilot reviews" },

        { name: "Project-brief lead form with email and WhatsApp follow-up opt-in" },
      ],

      architecture: ["Next.js App Router frontend", "Sanity CMS content", "Vercel hosting"],

      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Sanity CMS"],

      liveUrl: "https://www.stoneageproperties.com",
    },

    {
      name: "Homely",

      subtitle: "Website for a South Indian Restaurant in Coventry",

      description: `
Client website for a South Indian restaurant with an upstairs private event hall.
      `,

      features: [
        { name: "Filterable menu (veg, non-veg, spicy) with prices" },

        { name: "Private event-hall enquiry form" },

        { name: "Delivery and collection via Foodhub and Uber Eats" },

        { name: "Google Reviews, Maps and WhatsApp contact" },
      ],

      architecture: ["Next.js frontend", "Third-party ordering platforms", "Google Maps and Reviews"],

      techStack: ["Next.js", "TypeScript", "Tailwind CSS"],

      liveUrl: "https://www.homelydining.co.uk",
    },
  ],

  achievements: [
    {
      description:
        "Founded SIGNOFF STUDIO LTD and single-handedly built Signoff, a Claude-powered social content product for UK small businesses, launching with 25 pilot customers.",
    },

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
      name: "HashiCorp Certified: Terraform Associate",
      status: "Active",
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

    {
      type: "blog",
      label: "Blog",
      value: "dev.to/yogieee",
      url: "https://dev.to/yogieee",
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
