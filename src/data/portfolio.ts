import type { PortfolioData } from "@/types/portfolio";

export const portfolio = {
  about: {
    name: "Yoganand Govind",
    role: "Senior Software Engineer | AI & Cloud Engineer",
    avatar: "",
    tagline: "Building AI powered cloud platforms and automation systems",
    location: "United Kingdom",
    summary:
      "Full-stack engineer with 12+ years of experience building enterprise systems and cloud-native platforms. Currently focused on AI powered automation systems using AWS. Creator of Autowire.ai, an intelligent document processing SaaS platform built with serverless architecture.",
  },

  skills: [
    {
      category: "Languages",
      skills: [
        { name: "Java" },
        { name: "TypeScript" },
        { name: "JavaScript" },
        { name: "SQL" },
      ],
    },
    {
      category: "Frameworks",
      skills: [
        { name: "Next.js" },
        { name: "React" },
        { name: "Spring Boot" },
        { name: "Node.js" },
      ],
    },
    {
      category: "Cloud (AWS)",
      skills: [
        { name: "Lambda" },
        { name: "API Gateway" },
        { name: "S3" },
        { name: "DynamoDB" },
        { name: "Textract" },
        { name: "Bedrock" },
        { name: "CDK" },
        { name: "CloudFormation" },
        { name: "Cognito" },
        { name: "SQS" },
        { name: "SNS" },
        { name: "EventBridge" },
        { name: "CloudWatch" },
        { name: "IAM" },
      ],
    },
    {
      category: "AI & Data",
      skills: [
        { name: "Amazon Bedrock" },
        { name: "Claude API" },
        { name: "Amazon Textract" },
        { name: "LangChain" },
      ],
    },
    {
      category: "DevOps",
      skills: [
        { name: "Docker" },
        { name: "GitHub Actions" },
        { name: "AWS CDK" },
        { name: "CloudFormation" },
        { name: "Terraform" },
      ],
    },
    {
      category: "Databases",
      skills: [
        { name: "DynamoDB" },
        { name: "PostgreSQL" },
        { name: "Oracle" },
        { name: "MySQL" },
      ],
    },
  ],

  experience: [
    {
      title: "Senior Software Engineer",
      company: "Mphasis UK Limited",
      location: "London, United Kingdom",
      period: "2019 - Present",
      description:
        "Enterprise welfare platform for UK Government using IBM Curam SPM",
      contributions: [
        "Led development of enterprise welfare platform serving UK Government departments",
        "Designed and implemented complex business rules engine processing 10,000+ daily transactions",
        "Mentored team of 5 junior developers, establishing code review practices and CI/CD pipelines",
        "Reduced system processing time by 40% through database query optimization and caching strategies",
      ],
    },
  ],

  projects: [
    {
      name: "Autowire.ai",
      subtitle: "AI-Powered Document Extraction SaaS",
      description:
        "Intelligent document processing platform that automates data extraction from complex documents using AI. Built as a multi-tenant SaaS with serverless architecture on AWS.",
      features: [
        { name: "AI-powered document classification and data extraction" },
        { name: "Multi-tenant architecture with isolated data processing" },
        {
          name: "Real-time processing status tracking and notifications",
        },
        { name: "RESTful API with comprehensive SDK for integrations" },
        { name: "Role-based access control with AWS Cognito" },
      ],
      architecture: [
        "Next.js Frontend \u2192 API Gateway \u2192 Lambda Functions",
        "S3 Document Storage \u2192 Textract Processing Pipeline",
        "Bedrock AI Enhancement \u2192 DynamoDB Results Store",
        "EventBridge Orchestration \u2192 SQS Queue Processing",
        "CloudWatch Monitoring \u2192 SNS Alert Notifications",
      ],
      techStack: [
        "Next.js",
        "TypeScript",
        "AWS Lambda",
        "API Gateway",
        "DynamoDB",
        "S3",
        "Textract",
        "Bedrock",
        "CDK",
        "Cognito",
        "EventBridge",
        "SQS",
        "SNS",
      ],
      liveUrl: "https://autowire.ai",
    },
  ],

  achievements: [
    {
      description:
        "Reduced document processing time by 90% through AI-powered automation pipeline",
    },
    {
      description:
        "Achieved 40% cost optimization in AWS infrastructure through serverless architecture redesign",
    },
    {
      description:
        "Built multi-tenant SaaS platform handling 1000+ documents daily across 50+ client organizations",
    },
    {
      description:
        "Orchestrated 15+ Lambda microservices with event-driven architecture using EventBridge and SQS",
    },
    {
      description:
        "Implemented zero-downtime deployment pipeline with AWS CDK and GitHub Actions",
    },
  ],

  certifications: [
    { name: "AWS Solutions Architect Associate", status: "completed" },
    { name: "AWS Generative AI Certification", status: "in-progress" },
  ],

  contact: [
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
    {
      type: "phone",
      label: "Phone",
      value: "+44 07365558999",
      url: "tel:+4407365558999",
    },
  ],
} satisfies PortfolioData;
