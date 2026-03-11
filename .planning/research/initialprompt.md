You are a senior full-stack engineer, software architect, and UI/UX designer.

Your task is to build a modern interactive developer portfolio website that presents my professional profile as an AI powered developer console.

The portfolio should allow recruiters and engineers to explore my experience, skills, and projects through a terminal-style interface.

The UI must look like a modern developer tool rather than a traditional portfolio.

---

TECH STACK

Frontend
Next.js 14+ (App Router)
React
TypeScript
TailwindCSS
shadcn/ui
Framer Motion

Optional
Lucide icons
React type animation

---

DESIGN GOAL

The portfolio should look like:

Developer Terminal
AI Assistant
Cloud Engineering Dashboard

Dark theme.

Use subtle glowing accents and monospace fonts.

The UI should feel like an engineering console.

---

APPLICATION LAYOUT

Create a two-panel layout.

LEFT PANEL
Developer Profile Card

RIGHT PANEL
Interactive Developer Terminal

---

LEFT PANEL (PROFILE CARD)

Create a floating developer ID card.

Include:

Profile picture
Name
Role
Short professional tagline
Location
Download Resume button
Social icons

Profile Information:

Name:
Yogananda Govind

Role:
Senior Software Engineer | AI & Cloud Engineer

Tagline:
Building AI powered cloud platforms and automation systems

Location:
United Kingdom

Contact:

LinkedIn
https://www.linkedin.com/in/yoganandgovind

Email
Yoganand.Govind@gmail.com

Phone
+44 07365558999

Design style:

Glassmorphism card
Rounded corners
Soft shadow
Floating animation
Minimal modern UI

---

RIGHT PANEL (DEVELOPER TERMINAL)

Create a terminal style interface.

Terminal header:

Yogi Dev Console v1.0

Include:

Command history
Terminal prompt
Command suggestions
Scrollable output window

Example prompt:

>

---

TERMINAL COMMAND SYSTEM

Create a command parser.

Supported commands:

help
about
skills
experience
projects
architecture
achievements
certifications
contact
resume
clear

---

COMMAND OUTPUT

help

Display available commands.

about

Display professional summary.

Output example:

Yogananda Govind
Senior Software Engineer | AI & Cloud Engineer

Full-stack engineer with 12+ years of experience building enterprise systems and cloud-native platforms.

Currently focused on AI powered automation systems using AWS.

Creator of Autowire.ai, an intelligent document processing SaaS platform built with serverless architecture.

---

skills

Display skills grouped by categories.

Languages

Java
TypeScript
JavaScript
SQL

Frameworks

Spring Boot
React
Next.js
REST APIs

Cloud

AWS
Lambda
API Gateway
S3
DynamoDB
Step Functions
SQS
SES

AI & Data

Amazon Textract
Amazon Bedrock
Document Intelligence
RAG systems
AI workflow orchestration

DevOps

CI/CD
Jenkins
Git
Vercel
AWS CDK

Databases

Oracle
MongoDB
SQL performance optimization

---

experience

Display career timeline.

Example:

Senior Software Engineer
Mphasis UK Limited
London, United Kingdom
2019 – Present

Worked on enterprise welfare platform for the UK Government using IBM Cúram SPM.

Key contributions:

Architected and developed multiple modules including workflows, evidence models, and financial components.

Led development across major functional areas including IEG, Case Management, Batch Framework, and Task Management.

Collaborated with architects, product owners, and BA teams to deliver business critical enhancements.

Implemented TDD practices using JUnit improving system reliability.

---

projects

Display project cards.

Project 1

Autowire.ai
AI Powered Document Extraction Platform

Description:

SaaS platform that allows businesses to extract structured data from documents using visual templates and AI powered extraction.

Key features:

Visual template based document extraction
Serverless processing pipeline
Multi-tenant architecture
Batch document processing

Architecture:

Next.js frontend
AWS Lambda backend
API Gateway
DynamoDB
S3 storage
Step Functions orchestration
Textract OCR
Bedrock AI processing

Tech stack:

Next.js
TypeScript
AWS Lambda
Textract
Bedrock
Stripe
Clerk
Tailwind

Live:

https://autowired.ai

---

architecture

Display architecture diagram explanation.

Example output:

Autowire.ai Architecture

Client (Next.js)
↓
API Gateway
↓
AWS Lambda Microservices
↓
Step Functions Orchestration
↓
SQS Queue
↓
Document Processing Pipeline
↓
Amazon Textract OCR
↓
Amazon Bedrock AI Processing
↓
DynamoDB Metadata Storage
↓
S3 Document Storage

---

achievements

Display key achievements.

Reduced document processing time by 90 percent using automated extraction.

Optimised AI processing costs by 40 percent using caching strategies.

Designed multi-tenant SaaS architecture with strong tenant isolation.

Delivered scalable serverless backend with 15+ Lambda services.

---

certifications

AWS Solutions Architect Associate

Generative AI Certification (in progress)

---

contact

Display contact details.

Email
LinkedIn
GitHub

---

resume

Provide download resume link.

---

TERMINAL UX FEATURES

Implement:

Typing animation for responses

Command history (arrow up/down)

Blinking cursor

Auto scroll terminal

Formatted output blocks

---

UI ANIMATIONS

Use Framer Motion for:

Terminal message animation
Profile card floating effect
Smooth transitions

---

RESPONSIVE DESIGN

Desktop
Tablet
Mobile

On mobile:

Profile card moves to top
Terminal becomes full width

---

OPTIONAL AI FEATURE

Add toggle:

Terminal Mode
AI Mode

In AI mode send user questions to an API endpoint.

Example:

> ask "Explain Yogi's experience with AI"

This endpoint can later integrate with AWS Bedrock Claude.

---

PROJECT STRUCTURE

/app
/components
/components/profile
/components/terminal
/data
/lib
/hooks
/styles

Components:

ProfileCard.tsx
Terminal.tsx
CommandParser.ts
CommandInput.tsx
CommandOutput.tsx
CommandHistory.tsx

---

DELIVERABLE

Generate:

Complete Next.js project
All components
Tailwind styling
Terminal command system
Portfolio data

Ensure code is modular and production ready.
