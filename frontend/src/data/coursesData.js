// Centralized mock data for all 6 courses on NxtLearnn
export const COURSES = [
  {
    id: 1,
    slug: 'full-stack-nextjs',
    title: 'Full-Stack Next.js 15',
    subtitle: 'Build a modern web app with Next.js, Prisma, and PostgreSQL',
    shortTitle: 'Full-Stack Next.js',
    description: 'Master production full-stack engineering with Next.js App Router, Server Actions, NextAuth.js authentication, and Prisma ORM backed by PostgreSQL.',
    category: 'Full-Stack',
    level: 'Intermediate',
    price: '₹2,499',
    priceNumber: 2499,
    duration: '14.5 hours',
    lessonsCount: 12,
    badge: 'Popular',
    rating: 4.9,
    studentsCount: 1840,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    tags: ['Next.js 15', 'Prisma', 'PostgreSQL', 'Tailwind CSS'],
    instructor: {
      name: 'Alex Rivera',
      role: 'Staff Full-Stack Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      bio: 'Ex-Vercel engineering team member. Has shipped scalable platforms to 10M+ users.'
    },
    codeFile: 'auth.ts',
    codeFolder: 'fullstack-nextjs/src/lib',
    codeSnippet: `import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import type { Session } from "next-auth";

export async function getSession(): Promise<Session | null> {
  return await getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }
  return session;
}`,
    sections: [
      {
        id: 'getting-started',
        title: 'Getting Started',
        lessons: [
          {
            id: 1,
            title: 'Course introduction',
            duration: '03:24',
            description: 'Overview of what we will build throughout this comprehensive Full-Stack Next.js 15 course.',
            learningGoals: [
              'Understand the full application architecture',
              'Tour the finished production project demo',
              'Set up development prerequisites'
            ]
          },
          {
            id: 2,
            title: 'Setting up your environment',
            duration: '08:12',
            description: 'Configure Node.js, TypeScript, Tailwind CSS, and VS Code extensions for maximum productivity.',
            learningGoals: [
              'Initialize the Next.js 15 project with App Router',
              'Configure ESLint, Prettier, and path aliases',
              'Setup local PostgreSQL database container'
            ]
          },
          {
            id: 3,
            title: 'Next.js fundamentals',
            duration: '12:45',
            description: 'Deep dive into React Server Components, client components, and nested layouts.',
            learningGoals: [
              'Master React Server Components vs Client Components',
              'Construct flexible nested layouts and loading states',
              'Explore error boundaries and suspense streaming'
            ]
          },
          {
            id: 4,
            title: 'Project structure',
            duration: '07:18',
            description: 'Organize features, reusable components, utilities, and server actions cleanly.',
            learningGoals: [
              'Design feature-first directory modularity',
              'Setup component abstractions and design system tokens',
              'Configure environment variable typing'
            ]
          }
        ]
      },
      {
        id: 'building-the-app',
        title: 'Building the App',
        lessons: [
          {
            id: 5,
            title: 'Database setup',
            duration: '11:02',
            description: 'Initialize Prisma ORM and establish connection pooling with serverless PostgreSQL.',
            learningGoals: [
              'Initialize Prisma schema and client generation',
              'Configure PostgreSQL connection pooling',
              'Execute initial migrations'
            ]
          },
          {
            id: 6,
            title: 'Creating the data models',
            duration: '11:23',
            description: 'Architect scalable database schemas for users, courses, subscriptions, and progress.',
            learningGoals: [
              'Model Users, Accounts, Sessions, and Verifications',
              'Establish one-to-many and many-to-many relations',
              'Add compound indexes for high-query performance'
            ]
          },
          {
            id: 7,
            title: 'Setting up authentication',
            duration: '32:10',
            description: "In this lesson, we'll set up NextAuth.js to handle user authentication in our application. You'll learn how to configure providers, create auth options, and protect your routes.",
            learningGoals: [
              'Configuring NextAuth.js with Google and GitHub OAuth providers',
              'Protecting API routes and Server Actions with session validation',
              'Creating custom sign-in and registration pages with Tailwind CSS',
              'Managing JWT session tokens and user state synchronization'
            ]
          },
          {
            id: 8,
            title: 'Building the UI',
            duration: '18:45',
            description: 'Build responsive, accessible user interfaces using Tailwind CSS and Radix UI primitives.',
            learningGoals: [
              'Build interactive navigation and sidebar drawers',
              'Construct animated course cards and video players',
              'Implement smooth dark and light mode theme transitions'
            ]
          },
          {
            id: 9,
            title: 'API routes',
            duration: '14:32',
            description: 'Build resilient REST endpoints with strict validation using Zod schemas.',
            learningGoals: [
              'Implement route handlers for student telemetry',
              'Add rate limiting and CORS validation',
              'Handle standard error response formats'
            ]
          },
          {
            id: 10,
            title: 'Server actions',
            duration: '16:21',
            description: 'Mutate database records directly from React components with zero boilerplate API calls.',
            learningGoals: [
              'Write type-safe Server Actions with useActionState',
              'Handle optimistic UI updates',
              'Revalidate cached paths and tags seamlessly'
            ]
          },
          {
            id: 11,
            title: 'Deploying to Vercel',
            duration: '09:15',
            description: 'Configure automated CI/CD pipeline, environment secrets, and custom domains on Vercel.',
            learningGoals: [
              'Connect GitHub repository to Vercel preview environments',
              'Configure production environment variables and database branching',
              'Audit Core Web Vitals and edge caching'
            ]
          },
          {
            id: 12,
            title: 'Final touches',
            duration: '17:16',
            description: 'Optimize bundle size, add OpenGraph metadata, and harden security headers.',
            learningGoals: [
              'Dynamic OG image generation for social previews',
              'Security headers, Content Security Policy, and rate limiting',
              'Course graduation certificate generation'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    slug: 'react-fastapi-production-mastery',
    title: 'React + FastAPI Production Mastery',
    subtitle: 'Enterprise web apps with React, Vite, and async Python FastAPI',
    shortTitle: 'FastAPI Production Mastery',
    description: 'Build enterprise-grade web applications using React, Vite, and Python FastAPI with asyncpg on Neon PostgreSQL and JWT authentication.',
    category: 'Full-Stack',
    level: 'Intermediate - Advanced',
    price: '₹2,499',
    priceNumber: 2499,
    duration: '14.5 hours',
    lessonsCount: 10,
    badge: 'Bestseller',
    rating: 4.95,
    studentsCount: 2420,
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    tags: ['FastAPI', 'Python 3.11', 'React', 'Neon Postgres'],
    instructor: {
      name: 'Vikram Seth',
      role: 'Principal Backend Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      bio: 'Author of high-throughput Python backends serving 50k requests/sec.'
    },
    codeFile: 'main.py',
    codeFolder: 'fastapi-backend/app',
    codeSnippet: `from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User

app = FastAPI(title="Production Engine API")

@app.get("/api/v1/telemetry", response_model=dict)
async def get_telemetry(db: AsyncSession = Depends(get_db)):
    result = await db.execute("SELECT count(*) FROM students")
    count = result.scalar()
    return {"status": "healthy", "active_students": count}`,
    sections: [
      {
        id: 'fastapi-core',
        title: 'FastAPI Architecture & Setup',
        lessons: [
          {
            id: 1,
            title: 'FastAPI 0.115 Async Fundamentals',
            duration: '14:20',
            description: 'Understanding event loops, ASGI servers, and async request concurrency.',
            learningGoals: ['Async def vs def in FastAPI', 'Pydantic v2 data validation', 'Uvicorn standard worker tuning']
          },
          {
            id: 2,
            title: 'Async SQLAlchemy 2.0 & asyncpg',
            duration: '22:15',
            description: 'Building non-blocking connection pools on Neon Serverless PostgreSQL.',
            learningGoals: ['AsyncSession mechanics', 'Connection pooling best practices', 'Handling database reconnections']
          },
          {
            id: 3,
            title: 'JWT Authentication & OAuth2',
            duration: '28:40',
            description: 'Secure token issuance, password hashing with bcrypt, and refresh token rotation.',
            learningGoals: ['OAuth2PasswordBearer workflow', 'Stateless JWT verification', 'Role-based access control (RBAC)']
          }
        ]
      },
      {
        id: 'react-frontend-integration',
        title: 'React 18 & Vite Frontend Sync',
        lessons: [
          {
            id: 4,
            title: 'Vite Setup & Proxy Configuration',
            duration: '11:15',
            description: 'Configuring development proxies, Tailwind styling tokens, and Lucide icons.',
            learningGoals: ['Vite dev proxy setup', 'Context-driven theme persistence', 'Axios and Fetch abstractions']
          },
          {
            id: 5,
            title: 'Global Auth State Machine in React',
            duration: '18:50',
            description: 'Persistent sessions, protected route guards, and automatic token refresh.',
            learningGoals: ['AuthContext architecture', 'Silent token renewal', 'Preventing route flashing']
          },
          {
            id: 6,
            title: 'Real-time WebSocket Progress Sync',
            duration: '21:30',
            description: 'Synchronize video timestamps and classroom progress across multiple active tabs.',
            learningGoals: ['FastAPI WebSocket endpoints', 'React useWebSocket hooks', 'Heartbeat reconnection handling']
          },
          {
            id: 7,
            title: 'ImageKit Signed HLS Streaming',
            duration: '25:10',
            description: 'Generate time-limited signed tokens and render adaptive bitrate video with Hls.js.',
            learningGoals: ['HMAC signed HLS tokens', 'Hls.js event listeners', 'Dynamic quality switching']
          },
          {
            id: 8,
            title: 'Docker Compose Local Stacks',
            duration: '15:20',
            description: 'Orchestrate FastAPI, PostgreSQL, Redis, and Vite in an identical production container.',
            learningGoals: ['Multi-stage Dockerfiles', 'Healthchecks and volume mounts', 'Zero-downtime reloads']
          },
          {
            id: 9,
            title: 'Polar Payments Webhook Integration',
            duration: '19:45',
            description: 'Cryptographically verify Polar subscription and single course purchase webhooks.',
            learningGoals: ['HMAC SHA-256 signature verification', 'Idempotent database logging', 'Instant student provisioning']
          },
          {
            id: 10,
            title: 'Production Deployment & Monitoring',
            duration: '16:30',
            description: 'Deploy to cloud infrastructure with Sentry error logging and Prometheus metrics.',
            learningGoals: ['Automated database migrations', 'Structured JSON logging', 'Production deployment checklist']
          }
        ]
      }
    ]
  },
  {
    id: 3,
    slug: 'system-design-microservices-python',
    title: 'High-Concurrency Microservices with Python',
    subtitle: 'Architect distributed systems capable of handling 100k+ requests/sec',
    shortTitle: 'Microservices & System Design',
    description: 'Master large-scale distributed architectures, event-driven pipelines, Redis caching clusters, Kafka event streams, and consensus algorithms.',
    category: 'Backend & Systems',
    level: 'Advanced',
    price: '₹2,999',
    priceNumber: 2999,
    duration: '12.0 hours',
    lessonsCount: 8,
    badge: 'Architecture',
    rating: 4.92,
    studentsCount: 1650,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    tags: ['System Design', 'Redis', 'Kafka', 'Async Python'],
    instructor: {
      name: 'Rohan Deshmukh',
      role: 'Staff Infrastructure Architect',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      bio: 'Engineered message brokers processing 500 million daily events at hyper-scale.'
    },
    codeFile: 'dispatcher.py',
    codeFolder: 'services/broker',
    codeSnippet: `import asyncio
import aioredis

async def dispatch_event(stream_key: str, payload: dict):
    redis = await aioredis.from_url("redis://localhost:6379")
    msg_id = await redis.xadd(stream_key, payload)
    print(f"Dispatched event {msg_id} on {stream_key}")
    await redis.close()`,
    sections: [
      {
        id: 'distributed-foundations',
        title: 'Distributed Foundations',
        lessons: [
          {
            id: 1,
            title: 'CAP Theorem in the Real World',
            duration: '18:10',
            description: 'Consistency, Availability, and Partition Tolerance tradeoffs across real cloud databases.',
            learningGoals: ['Strict vs Eventual consistency', 'Split-brain resolution strategies', 'Designing for failure']
          },
          {
            id: 2,
            title: 'High-Throughput In-Memory Caching with Redis',
            duration: '24:35',
            description: 'Cache-aside, write-through, cache stampede prevention, and Redis cluster sharding.',
            learningGoals: ['Preventing thundering herd with distributed locks', 'Redis probabilistic data structures (HyperLogLog, Bloom Filters)', 'LRU eviction policies']
          },
          {
            id: 3,
            title: 'Message Queues vs Event Streams',
            duration: '21:15',
            description: 'Comparing RabbitMQ AMQP broker semantics against Apache Kafka append-only logs.',
            learningGoals: ['Consumer groups and partition offsets', 'Idempotency and at-least-once delivery', 'Backpressure management']
          }
        ]
      },
      {
        id: 'scale-patterns',
        title: 'Scale & Resilience Patterns',
        lessons: [
          {
            id: 4,
            title: 'Distributed Rate Limiting (Token Bucket & Leaky Bucket)',
            duration: '19:40',
            description: 'Building global Redis-backed sliding window rate limiters protecting against DDoS.',
            learningGoals: ['Sliding window log vs counter', 'Lua scripting in Redis for atomic checks', 'HTTP 429 Retry-After headers']
          },
          {
            id: 5,
            title: 'Database Sharding & Consistent Hashing',
            duration: '27:00',
            description: 'Horizontally partitioning relational databases with minimal key rebalancing.',
            learningGoals: ['Virtual nodes in consistent hashing rings', 'Cross-shard queries and fan-out joins', 'Schema migration across shards']
          },
          {
            id: 6,
            title: 'Circuit Breaker & Bulkhead Patterns',
            duration: '16:50',
            description: 'Isolating downstream microservice failures with automatic fallbacks.',
            learningGoals: ['Closed, Open, Half-Open state machines', 'Thread pool bulkheading', 'Synthetic health checks']
          },
          {
            id: 7,
            title: 'Distributed Tracing with OpenTelemetry',
            duration: '22:10',
            description: 'Trace requests across microservice hops using Jaeger and correlation IDs.',
            learningGoals: ['W3C trace context propagation', 'Span attributes and baggage', 'Root-cause anomaly detection']
          },
          {
            id: 8,
            title: 'Zero-Downtime Blue/Green & Canary Deployments',
            duration: '20:15',
            description: 'Route live traffic progressively while running health metrics comparisons.',
            learningGoals: ['Weighted DNS and Envoy routing', 'Automated canary rollback heuristics', 'Database backward compatibility']
          }
        ]
      }
    ]
  },
  {
    id: 4,
    slug: 'modern-frontend-engineering-react-tailwind',
    title: 'Modern Frontend Engineering with React & Tailwind',
    subtitle: 'Craft stunning, ultra-fast web user interfaces with state machines',
    shortTitle: 'Modern Frontend Engineering',
    description: 'Level up from basic component styling to world-class interface engineering. Master Framer Motion animations, accessible design systems, and micro-interactions.',
    category: 'Frontend',
    level: 'All Levels',
    price: '₹1,999',
    priceNumber: 1999,
    duration: '9.2 hours',
    lessonsCount: 8,
    badge: 'Design System',
    rating: 4.88,
    studentsCount: 1290,
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    tags: ['React 18', 'Tailwind CSS', 'Framer Motion', 'Accessibility'],
    instructor: {
      name: 'Elena Rostova',
      role: 'Staff Design Technologist',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      bio: 'Award-winning UI/UX engineer with designs featured on Awwwards and ProductHunt.'
    },
    codeFile: 'Button.tsx',
    codeFolder: 'design-system/components',
    codeSnippet: `import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-semibold transition-all cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-sky-500 text-white hover:bg-sky-400 shadow-lg shadow-sky-500/25",
        glass: "bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-md",
      },
      size: { sm: "px-4 py-2 text-xs", md: "px-6 py-2.5 text-sm" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);`,
    sections: [
      {
        id: 'foundations',
        title: 'Design Tokens & Architecture',
        lessons: [
          {
            id: 1,
            title: 'Design Systems from Scratch',
            duration: '15:10',
            description: 'Building cohesive token palettes, typography scales, and component interfaces.',
            learningGoals: ['CSS variables and HSL palette math', 'Tailwind configuration customization', 'Strict component props']
          },
          {
            id: 2,
            title: 'Micro-Animations with Framer Motion',
            duration: '21:30',
            description: 'Physics-based layout transitions, spring physics, and gesture controls.',
            learningGoals: ['Layout animation magic with layoutId', 'Variants and staggered list transitions', 'Drag, hover, and tap micro-interactions']
          },
          {
            id: 3,
            title: 'Glassmorphism & Celestial Aesthetics',
            duration: '18:45',
            description: 'Crafting glowing horizons, radiant blur filters, and multi-layered backdrop blurs.',
            learningGoals: ['Backdrop-filter performance optimization', 'Multi-layer box shadows and ambient lights', 'Seamless light and dark mode contrasts']
          }
        ]
      },
      {
        id: 'advanced-patterns',
        title: 'Advanced UX Patterns',
        lessons: [
          {
            id: 4,
            title: 'State Machines with XState in React',
            duration: '22:15',
            description: 'Eliminate impossible UI states with deterministic finite state machines.',
            learningGoals: ['Modeling complex multi-step wizards', 'Guards, actions, and services in XState', 'Decoupled presentation from state logic']
          },
          {
            id: 5,
            title: 'Accessible Dialogs, Drawers & Modals',
            duration: '19:10',
            description: 'Complete keyboard navigation, focus trapping, and ARIA attributes.',
            learningGoals: ['Focus trap and restore mechanics', 'Screen reader announcements with live regions', 'Scroll locking without layout shift']
          },
          {
            id: 6,
            title: 'High-Performance Virtualized Lists',
            duration: '16:40',
            description: 'Render 100,000 items at 60 FPS using TanStack Virtual.',
            learningGoals: ['Dynamic row measurement', 'Overscan rendering buffers', 'Smooth scroll restoration']
          },
          {
            id: 7,
            title: 'Compound Component Architecture',
            duration: '17:20',
            description: 'Building intuitive APIs like Tabs, Accordions, and Command Palettes.',
            learningGoals: ['React Context sharing between subcomponents', 'Slot pattern and polymorphic as props', 'Inversion of control']
          },
          {
            id: 8,
            title: 'Production Performance Audits',
            duration: '14:50',
            description: 'Eliminate layout thrashing, reduce bundle size, and achieve 100 Lighthouse score.',
            learningGoals: ['React DevTools Profiler deep-dive', 'Dynamic code splitting and bundle analyzers', 'Critical rendering path optimization']
          }
        ]
      }
    ]
  },
  {
    id: 5,
    slug: 'cloud-native-devops-docker-kubernetes',
    title: 'Cloud-Native DevOps: Docker & Kubernetes',
    subtitle: 'Containerization, Kubernetes clusters, and automated CI/CD pipelines',
    shortTitle: 'DevOps & Kubernetes',
    description: 'Master containerization, multi-stage Docker builds, Kubernetes manifests, Helm charts, ingress controllers, and GitHub Actions CI/CD workflows.',
    category: 'DevOps & Cloud',
    level: 'Intermediate - Advanced',
    price: '₹2,799',
    priceNumber: 2799,
    duration: '11.5 hours',
    lessonsCount: 7,
    badge: 'DevOps',
    rating: 4.91,
    studentsCount: 1120,
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
    tags: ['Docker', 'Kubernetes', 'CI/CD', 'Linux'],
    instructor: {
      name: 'Marcus Vance',
      role: 'DevOps & Site Reliability Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      bio: 'Oversees 200+ Kubernetes microservice nodes across global AWS and GCP regions.'
    },
    codeFile: 'deployment.yaml',
    codeFolder: 'k8s/production',
    codeSnippet: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: nxtlearnn-api
  labels:
    app: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: nxtlearnn/api:v1.0.0
        ports:
        - containerPort: 8001`,
    sections: [
      {
        id: 'docker-mastery',
        title: 'Production Docker Engineering',
        lessons: [
          {
            id: 1,
            title: 'Optimizing Multi-Stage Dockerfiles',
            duration: '18:25',
            description: 'Slash container sizes from 1.2GB to 45MB with Alpine and distroless bases.',
            learningGoals: ['Cache layer optimization', 'Non-root user security hardening', 'Docker buildkit cache mounts']
          },
          {
            id: 2,
            title: 'Production Compose Orchestration',
            duration: '19:40',
            description: 'Orchestrating databases, caching, background workers, and healthchecks.',
            learningGoals: ['Compose networking and bridge isolation', 'Named volume persistent storage', 'Secrets injection']
          }
        ]
      },
      {
        id: 'kubernetes-cloud',
        title: 'Kubernetes Cluster Architecture',
        lessons: [
          {
            id: 3,
            title: 'Pods, ReplicaSets, and Deployments',
            duration: '26:15',
            description: 'Core Kubernetes declarative model, rolling update strategies, and rollbacks.',
            learningGoals: ['Liveness and Readiness probes', 'Resource requests vs limits', 'Pod disruption budgets']
          },
          {
            id: 4,
            title: 'Services, Ingress, and TLS Termination',
            duration: '22:30',
            description: 'Exposing services to the public internet using NGINX Ingress and Cert-Manager.',
            learningGoals: ['ClusterIP, NodePort, and LoadBalancer', 'Automated Let’s Encrypt SSL/TLS certificates', 'Path-based routing']
          },
          {
            id: 5,
            title: 'ConfigMaps, Secrets & External Secrets',
            duration: '17:45',
            description: 'Injecting environment configuration securely without rebuilding images.',
            learningGoals: ['Opaque secrets and base64 security', 'AWS Secrets Manager integration', 'Mounting config as volume files']
          },
          {
            id: 6,
            title: 'Helm Charts for Enterprise Packaging',
            duration: '23:10',
            description: 'Templating repeatable Kubernetes releases across staging and production.',
            learningGoals: ['Values.yaml abstraction', 'Helm helpers and conditional logic', 'Release rollback management']
          },
          {
            id: 7,
            title: 'GitHub Actions Continuous Delivery',
            duration: '21:00',
            description: 'Automate linting, unit testing, image pushing, and GitOps deployments.',
            learningGoals: ['Matrix test runners', 'Docker hub / ECR image pushes', 'ArgoCD GitOps synchronization']
          }
        ]
      }
    ]
  },
  {
    id: 6,
    slug: 'ai-agents-llm-engineering',
    title: 'AI Agents & Full-Stack LLM Engineering',
    subtitle: 'Build autonomous multi-agent systems with Python, LangChain, and Vector DBs',
    shortTitle: 'AI Agents & LLMs',
    description: 'Learn to build production AI applications. Master retrieval-augmented generation (RAG), tool calling, autonomous agent loops, vector search, and evaluation pipelines.',
    category: 'AI & Data',
    level: 'Intermediate - Advanced',
    price: '₹3,499',
    priceNumber: 3499,
    duration: '13.0 hours',
    lessonsCount: 8,
    badge: 'AI Mastery',
    rating: 4.98,
    studentsCount: 3100,
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    tags: ['AI Agents', 'LangChain', 'Python', 'Vector DB', 'RAG'],
    instructor: {
      name: 'Dr. Priya Sharma',
      role: 'Principal AI Research Engineer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      bio: 'PhD in NLP. Leads production LLM agent architectures for autonomous workflow automation.'
    },
    codeFile: 'agent_runner.py',
    codeFolder: 'ai_engine/agents',
    codeSnippet: `from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o", temperature=0.0)
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an autonomous engineering subagent with tool access."),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}"),
])
agent = create_tool_calling_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)`,
    sections: [
      {
        id: 'rag-foundations',
        title: 'Vector Embeddings & RAG Foundations',
        lessons: [
          {
            id: 1,
            title: 'Vector Embeddings & Semantic Search',
            duration: '19:15',
            description: 'How high-dimensional embedding spaces work and calculating cosine similarities.',
            learningGoals: ['Text chunking strategies (Recursive vs Semantic)', 'Generating embeddings with OpenAI & HuggingFace', 'pgvector in PostgreSQL']
          },
          {
            id: 2,
            title: 'Production RAG Architectures',
            duration: '26:40',
            description: 'Hybrid search (Dense + BM25 sparse keyword), re-ranking with Cohere, and citations.',
            learningGoals: ['Reciprocal Rank Fusion (RRF)', 'Re-ranking retrieved context', 'Mitigating hallucinations with strict groundings']
          },
          {
            id: 3,
            title: 'Context Window Management & Caching',
            duration: '17:30',
            description: 'Semantic prompt caching and managing long token contexts efficiently.',
            learningGoals: ['Redis semantic cache for LLM queries', 'Token usage budgeting and cost minimization', 'Dynamic context pruning']
          }
        ]
      },
      {
        id: 'autonomous-agents',
        title: 'Autonomous Tool-Calling Agents',
        lessons: [
          {
            id: 4,
            title: 'Tool Calling & Structured Outputs',
            duration: '22:10',
            description: 'Teaching models to invoke Python functions and return typed Pydantic objects.',
            learningGoals: ['OpenAI tool call schemas', 'Validation error self-correction loops', 'Pydantic output parsing']
          },
          {
            id: 5,
            title: 'Multi-Agent Collaboration Networks',
            duration: '28:50',
            description: 'Orchestrating planner agents, researcher agents, and code reviewer agents with LangGraph.',
            learningGoals: ['Stateful agent graph construction', 'Human-in-the-loop approval checkpoints', 'Subagent task delegation']
          },
          {
            id: 6,
            title: 'Memory & State Synchronization',
            duration: '20:15',
            description: 'Episodic vs semantic memory and persisting conversation state across sessions.',
            learningGoals: ['Thread memory in PostgreSQL', 'Summarization memory compression', 'User profile state injection']
          },
          {
            id: 7,
            title: 'Streaming Responses with FastAPI & SSE',
            duration: '18:40',
            description: 'Server-Sent Events (SSE) token-by-token streaming to modern React frontends.',
            learningGoals: ['Async token generators in FastAPI', 'ReadableStream consumption in React', 'Markdown streaming parser']
          },
          {
            id: 8,
            title: 'Evals & LLM Observability',
            duration: '21:00',
            description: 'Evaluating agent output quality, latency, and cost with LangSmith and TruLens.',
            learningGoals: ['RAG Triad metrics (Context Relevance, Groundedness, Answer Relevance)', 'Automated evaluation test suites', 'Tracing production latency bottlenecks']
          }
        ]
      }
    ]
  }
];
