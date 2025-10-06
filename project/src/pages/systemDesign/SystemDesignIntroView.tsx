// src/pages/systemdesign/SystemDesignIntroView.tsx
// --- SystemDesignIntroView.tsx (M-101/M-1201 Module View - Full Course System) ---

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import {
    CheckCircle,
    Play,
    ArrowLeft,
    Share2,
    Edit,
    Target,
    Menu,
    X,
    Clock,
    HelpCircle,
    Server,
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from "react-router-dom";

/* -------------------- INTERFACES -------------------- */
interface QuizQuestion { id: string; question: string; options: string[]; answer: number; }
interface DetailedSubmodule { id: string; title: string; content: React.ReactNode; estimatedReadingTime: string; moduleId: string; }
interface ModuleProgress { readProgress: number; isCompleted: boolean; isQuizCompleted: boolean; }
interface CourseViewProps { onBack: () => void; planTitle: string; }

/* -------------------- MOCK ModuleQuiz Component -------------------- */
const ModuleQuiz: React.FC<any> = ({ questions, onComplete, onBackToContent, isPassed, showAnswers }) => {
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
    const [localScore, setLocalScore] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSelect = (qId: string, oIndex: number) => {
        if (isSubmitted || showAnswers) return;
        setSelectedAnswers(prev => ({ ...prev, [qId]: oIndex }));
    };

    const handleSubmit = () => {
        // Simulate score calculation
        // Increased the minimum score slightly to make passing a bit easier for the demo
        const mockScore = Math.floor(Math.random() * 45) + 50;
        const passed = mockScore >= 60;

        setLocalScore(mockScore);
        setIsSubmitted(true);
        setTimeout(() => { onComplete(passed); }, 300);
    };

    if (showAnswers || isSubmitted) {
        return (
            <div className="p-6 border rounded-lg space-y-4 bg-green-50 dark:bg-green-900/10">
                <h3 className="text-2xl font-bold text-green-600">
                    Quiz Review
                    {isPassed
                        ? " (Passed)"
                        : (localScore !== null ? ` (Failed: ${localScore}%)` : " (Review)")}
                </h3>
                <p className="text-sm text-muted-foreground">
                    Review the correct answers in **green** below.
                </p>
                {questions.map((q: any, qIndex: number) => (
                    <div key={q.id} className="p-3 border rounded-md">
                        <p className="font-semibold mb-2">Q{qIndex + 1}: {q.question}</p>
                        <ul className="space-y-1">
                            {q.options.map((option: string, oIndex: number) => {
                                const isCorrect = oIndex === q.answer;
                                return (
                                    <li
                                        key={oIndex}
                                        className={isCorrect ? "text-green-600 font-medium flex items-center" : "text-card-foreground"}
                                    >
                                        {isCorrect && <CheckCircle className="h-3 w-3 mr-2 flex-shrink-0" />}
                                        {option}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
                <Button onClick={onBackToContent} variant="outline" className="mt-4">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Content
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6 border rounded-lg space-y-4">
            <h3 className="text-2xl font-bold">{questions.length > 0 ? questions[0].id.substring(0, 5).toUpperCase() : 'Module'} Quiz</h3>
            <p className="text-muted-foreground">Select one option for each of the {questions.length} questions.</p>
            <div className="space-y-6">
                {questions.map((q: any, qIndex: number) => (
                    <div key={q.id} className="p-3 border rounded-lg">
                        <p className="font-semibold mb-2">Q{qIndex + 1}: {q.question}</p>
                        <ul className="space-y-2">
                            {q.options.map((option: string, oIndex: number) => {
                                const isSelected = selectedAnswers[q.id] === oIndex;
                                return (
                                    <li
                                        key={oIndex}
                                        onClick={() => handleSelect(q.id, oIndex)}
                                        className={`p-2 rounded cursor-pointer transition-colors ${isSelected ? 'bg-primary/20 font-medium' : 'hover:bg-accent'}`}
                                    >
                                        {option}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
            <Button onClick={handleSubmit} className="w-full">
                Submit Answers
            </Button>
            <Button onClick={onBackToContent} variant="outline" className="w-full">
                Cancel
            </Button>
        </div>
    );
};
/* -------------------- END MOCK ModuleQuiz Component -------------------- */


/* -------------------- STATIC CONTENT DATA (Modules M-101 to M-1201) -------------------- */

// --- QUIZ DATA ---
const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
    // M-101 and M-201 kept for context...
    "m-101-final": [
        { id: "m101-q1", question: "What is the primary goal of the high-level design phase in System Design?", options: ["Writing the production-ready code.", "Defining the system's architecture, components, and services.", "Optimizing database queries and indexes.", "Deploying the system to a cloud provider."], answer: 1, },
        { id: "m101-q2", question: "Which of the following is a key characteristic of a **scalable** system component?", options: ["It uses a single, monolithic database.", "It can handle an increasing number of users/requests by adding resources.", "It is entirely composed of legacy class components.", "It prioritizes low latency over high availability."], answer: 1, },
        { id: "m101-q3", question: "In the context of system design, what does **Latency** specifically refer to?", options: ["The number of requests a system handles per second.", "The amount of time it takes for a request to travel from client to server and back.", "The maximum amount of data the system can store.", "The percentage of time the system is operational."], answer: 1, },
        { id: "m101-q4", question: "What is **Availability** in System Design?", options: ["How quickly the system responds to a request.", "The measure of how often the system successfully executes the correct operations.", "The percentage of time the system is fully functional and accessible to users.", "The capacity of the system to manage simultaneous user connections."], answer: 2, },
        { id: "m101-q5", question: "What is the key difference between **High-Level Design (HLD)** and **Low-Level Design (LLD)**?", options: ["HLD uses NoSQL, while LLD uses SQL.", "HLD focuses on the system's overall architecture; LLD focuses on specific component implementation details.", "HLD is done by developers; LLD is done by architects.", "HLD covers security; LLD covers performance."], answer: 1, },
    ],
    "m-201-final": [
        { id: "m201-q1", question: "Which layer of the OSI model primarily deals with Load Balancing and Reverse Proxies?", options: ["Layer 2 (Data Link)", "Layer 3 (Network)", "Layer 4 (Transport)", "Layer 7 (Application)"], answer: 3, },
        { id: "m201-q2", question: "What is the main benefit of using a Content Delivery Network (CDN)?", options: ["Reducing database query latency.", "Enforcing strict security protocols on internal APIs.", "Caching static assets closer to the user to reduce load time and latency.", "Handling large volumes of asynchronous message processing."], answer: 2, },
        { id: "m201-q3", question: "What problem does a **Reverse Proxy** primarily solve?", options: ["It routes traffic from internal servers out to the internet.", "It balances incoming client requests across multiple backend servers, hiding the internal structure.", "It converts SQL queries into NoSQL operations.", "It manages the state between stateless HTTP requests."], answer: 1, },
        { id: "m201-q4", question: "How does **HTTPS** differ fundamentally from **HTTP**?", options: ["HTTPS is a newer version of HTTP/2.", "HTTPS is stateful, while HTTP is stateless.", "HTTPS encrypts communication using TLS/SSL.", "HTTPS uses UDP instead of TCP."], answer: 2, },
        { id: "m201-q5", question: "Which networking component is responsible for translating a human-readable domain name (e.g., google.com) into an IP address?", options: ["Load Balancer", "Reverse Proxy", "DNS (Domain Name System)", "API Gateway"], answer: 2, },
    ],
    // QUIZ FOR M-301
    "m-301-final": [
        { id: "m301-q1", question: "Which scaling strategy involves replacing servers with more powerful hardware?", options: ["Horizontal Scaling", "Vertical Scaling", "Asynchronous Scaling", "Functional Decomposition"], answer: 1, },
        { id: "m301-q2", question: "What is a major trade-off when optimizing a system for extremely low latency?", options: ["Reduced overall cost.", "Potentially lower durability or consistency.", "Higher throughput.", "Simpler system architecture."], answer: 1, },
        { id: "m301-q3", question: "In performance metrics, what is a **99th Percentile Latency** (P99)?", options: ["The fastest 99% of requests.", "The latency at which 99% of requests are faster.", "The latency at which 99% of requests are faster.", "The average latency multiplied by 99."], answer: 2, },
        { id: "m301-q4", question: "What is the primary goal of making a web server **stateless**?", options: ["To prevent SQL injection attacks.", "To ensure data is always stored in the database.", "To allow horizontal scaling by adding more servers easily.", "To reduce network bandwidth consumption."], answer: 2, },
        { id: "m301-q5", question: "Which metric measures the number of operations a system can handle per second?", options: ["Latency", "Availability", "Throughput", "Durability"], answer: 2, },
    ],
    // QUIZ FOR M-401 (Databases)
    "m-401-final": [
        { id: "m401-q1", question: "What core guarantee does **ACID** (in SQL databases) primarily concern?", options: ["High Availability.", "Data Integrity and Reliability.", "Eventual Consistency.", "Low Latency."], answer: 1, },
        { id: "m401-q2", question: "Which NoSQL database type is best suited for social network connections and transit routes?", options: ["Key-Value Store.", "Document Database.", "Graph Database.", "Column-Family Store."], answer: 2, },
        { id: "m401-q3", question: "What is **Database Sharding**?", options: ["Replicating the entire database on multiple machines.", "Splitting a database into smaller, independent partitions (shards).", "Creating a read replica for faster queries.", "Using an ORM to access the database."], answer: 1, },
        { id: "m401-q4", question: "What does **CAP Theorem** state about distributed databases?", options: ["Consistency and Partition Tolerance cannot both be fully achieved.", "Availability and Partition Tolerance cannot both be fully achieved.", "Only two of Consistency, Availability, and Partition Tolerance can be fully achieved simultaneously.", "Databases must be Consistent, Available, and Partition Tolerant."], answer: 2, },
        { id: "m401-q5", question: "In a Master-Slave replication setup, which node handles all write operations?", options: ["The Slave node.", "The Read Replica.", "The Master node.", "The Load Balancer."], answer: 2, },
    ],
    // QUIZ FOR M-501 (Distributed Systems)
    "m-501-final": [
        { id: "m501-q1", question: "What is **Eventual Consistency**?", options: ["All nodes agree on data immediately.", "Data will eventually be consistent across all nodes, given enough time.", "The system will eventually fail if consistency is not maintained.", "Only the Master node maintains consistency."], answer: 1, },
        { id: "m501-q2", question: "What is a common strategy to mitigate a single point of failure (SPOF)?", options: ["Implementing a single, large, central server.", "Using synchronous replication.", "Introducing redundancy and failover mechanisms.", "Prioritizing read operations over write operations."], answer: 2, },
        { id: "m501-q3", question: "Which protocol is commonly used to establish a consensus among a cluster of machines?", options: ["HTTP/2", "TLS/SSL", "Paxos or Raft", "FTP"], answer: 2, },
        { id: "m501-q4", question: "When designing a system, what is the 'Two Generals' Problem' an example of?", options: ["A common database deadlock scenario.", "The difficulty of achieving reliable communication over an unreliable network.", "A complex routing algorithm.", "A conflict between Availability and Consistency."], answer: 1, },
        { id: "m501-q5", question: "What is the key benefit of distributing a system across multiple geographic regions?", options: ["To reduce development cost.", "To ensure data is only available locally.", "To improve disaster recovery and global availability.", "To eliminate the need for load balancing."], answer: 2, },
    ],
    // QUIZ FOR M-601 (Load Balancing & Caching)
    "m-601-final": [
        { id: "m601-q1", question: "Which Load Balancing algorithm distributes requests to the server with the fewest active connections?", options: ["Round Robin", "Least Connections", "IP Hash", "Weighted Round Robin"], answer: 1, },
        { id: "m601-q2", question: "What is a **Cache Stampede**?", options: ["A sudden influx of read requests to the database.", "Multiple clients simultaneously refreshing a single cache entry.", "A cache failure that requires a full system restart.", "When stale data is served from the cache."], answer: 1, },
        { id: "m601-q3", question: "Where is a **CDN** primarily deployed?", options: ["Close to the database server.", "In the core processing datacenter.", "At 'edge' locations close to the end-users.", "Inside the application server process."], answer: 2, },
        { id: "m601-q4", question: "What is the **Cache-Aside** pattern?", options: ["The application directly manages the cache, checking it before querying the database.", "The cache layer sits transparently between the application and the database.", "Data is written directly to both the cache and the database simultaneously.", "Only static assets are allowed in the cache."], answer: 0, },
        { id: "m601-q5", question: "What does Load Balancer **Session Affinity** (Sticky Sessions) ensure?", options: ["All requests from a user go to a single, specific backend server.", "The Load Balancer uses HTTPS.", "The user's session never expires.", "The Load Balancer is highly available."], answer: 0, },
    ],
    // QUIZ FOR M-701 (Microservices & APIs)
    "m-701-final": [
        { id: "m701-q1", question: "What is the primary characteristic of a **Microservice** architecture?", options: ["A single, large codebase (Monolith).", "Services are loosely coupled, independently deployable, and focused on specific business capabilities.", "Services must all use the same database.", "The system runs on a single physical server."], answer: 1, },
        { id: "m701-q2", question: "The **API Gateway** pattern is primarily used to:", options: ["Implement all business logic in one place.", "Provide a single entry point for clients, handling routing, authentication, and rate limiting.", "Completely replace the need for load balancers.", "Only route traffic to a monolithic application."], answer: 1, },
        { id: "m701-q3", question: "What is **Rate Limiting**?", options: ["Reducing the size of API responses.", "Limiting the number of requests a client can make in a given time period.", "Ensuring API responses are delivered in a specific order.", "Calculating the throughput of an API."], answer: 1, },
        { id: "m701-q4", question: "Which is a major challenge of a Microservices architecture?", options: ["Overly simple deployment.", "Increased inter-service communication complexity (e.g., distributed tracing).", "Inability to use different technologies for different services.", "High deployment coupling."], answer: 1, },
        { id: "m701-q5", question: "What is **Service Discovery**?", options: ["The process of locating available service instances on a network.", "The business logic of a service.", "Monitoring the health of a database.", "Identifying user activity."], answer: 0, },
    ],
    // QUIZ FOR M-801 (Messaging & Streaming)
    "m-801-final": [
        { id: "m801-q1", question: "The main benefit of using a **Message Queue** is to enable:", options: ["Synchronous, low-latency communication.", "Direct point-to-point network calls.", "Asynchronous communication and decoupling of services.", "Real-time, two-way data streaming."], answer: 2, },
        { id: "m801-q2", question: "What is the core difference between a Queue (e.g., SQS) and a Stream/Log (e.g., Kafka)?", options: ["Queues are faster than Streams.", "Queues typically offer at-most-once delivery; Streams are durable and allow replaying of events.", "Streams use push communication; Queues use pull.", "Queues are only for internal services."], answer: 1, },
        { id: "m801-q3", question: "What does **Idempotency** mean in the context of message processing?", options: ["Processing the message is guaranteed to be fast.", "Processing the message multiple times has the same result as processing it once.", "The message must be processed at least once.", "The message contains sensitive data."], answer: 1, },
        { id: "m801-q4", question: "Which tool is commonly used for real-time data ingestion and processing?", options: ["MySQL", "Redis", "Kafka", "Nginx"], answer: 2, },
        { id: "m801-q5", question: "In an event-driven architecture, what is an **Event**?", options: ["A user login to the system.", "A significant change in the state of a system.", "A message sent over HTTP.", "A configuration file."], answer: 1, },
    ],
    // QUIZ FOR M-901 to M-1201 (Placeholders)
    "m-901-final": [
        { id: "m901-q1", question: "What is the primary purpose of the **Circuit Breaker** pattern?", options: ["To log errors to a central server.", "To prevent a failing service from continuously overwhelming another service.", "To encrypt inter-service communication.", "To route traffic to the fastest server."], answer: 1, },
        { id: "m901-q2", question: "Which principle is often applied to ensure system components are only responsible for one thing?", options: ["DRY (Don't Repeat Yourself)", "YAGNI (You Aren't Gonna Need It)", "Single Responsibility Principle (SRP)", "Occam's Razor"], answer: 2, },
        { id: "m901-q3", question: "What is **Domain-Driven Design (DDD)** focused on?", options: ["High-performance data access.", "Modeling software to match a specific business domain.", "Designing the network infrastructure.", "Writing clear documentation."], answer: 1, },
    ],
    "m-1001-final": [
        { id: "m1001-q1", question: "What is the risk addressed by **Input Validation**?", options: ["Distributed tracing latency.", "Cross-Site Scripting (XSS) and SQL Injection.", "High database load.", "Slow API response times."], answer: 1, },
        { id: "m1001-q2", question: "What is a **Disaster Recovery Plan**?", options: ["A set of procedures to restore the system after a major, catastrophic failure.", "The budget for server upgrades.", "The plan for a new feature launch.", "A security audit report."], answer: 0, },
        { id: "m1001-q3", question: "What is the function of **TLS/SSL Certificates**?", options: ["To compress network traffic.", "To encrypt communication and verify server identity.", "To handle database connections.", "To manage user sessions."], answer: 1, },
    ],
    "m-1101-final": [
        { id: "m1101-q1", question: "What is the main advantage of using **Containers (e.g., Docker)** in deployment?", options: ["They are cheaper than virtual machines.", "They ensure the application runs consistently across all environments.", "They completely eliminate the need for operating systems.", "They only run Python applications."], answer: 1, },
        { id: "m1101-q2", question: "Which platform is most commonly used for automating the deployment and scaling of containers?", options: ["Git", "Kubernetes", "Redis", "Elasticsearch"], answer: 1, },
        { id: "m1101-q3", question: "What is a **Blue/Green Deployment** strategy?", options: ["Deploying a new version to a separate, identical environment before switching traffic to it.", "Splitting traffic 50/50 between two versions.", "A fast rollback mechanism.", "Testing on a developer's local machine."], answer: 0, },
    ],
    "m-1201-final": [
        { id: "m1201-q1", question: "When designing a large-scale system like Twitter, what is the primary challenge for the 'Timeline Feed' service?", options: ["Minimizing the number of API endpoints.", "Ensuring low latency for read operations (read-heavy).", "Enforcing strong ACID compliance.", "Handling a high volume of synchronous RPC calls."], answer: 1, },
        { id: "m1201-q2", question: "A system with a very high Read-to-Write ratio (e.g., YouTube video views) benefits most from which strategy?", options: ["Read Replicas and heavy Caching/CDNs.", "Vertical scaling of the main write database.", "Strictly transactional consistency.", "Using a simple Key-Value store for all data."], answer: 0, },
        { id: "m1201-q3", question: "What is a key consideration when designing a reliable payment gateway?", options: ["Eventually consistent data.", "Ensuring the system is always in a strongly consistent state (e.g., using two-phase commit).", "Prioritizing high throughput over consistency.", "Using UDP for communication."], answer: 1, },
    ],
};

// --- MODULE CONTENT DATA ---
const MODULE_M101_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-101",
        id: "what-is-sd",
        title: "1.1 What is System Design?",
        estimatedReadingTime: "7 min",
        content: (
            <>
                <p className="mb-4">
                    **System Design** is the process of defining the architecture, modules, interfaces, and data for a system to satisfy specific requirements. It's about figuring out **what** components are needed and **how** they interact to solve a complex problem reliably and at scale.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">The Core Objective:</h4>
                <p>
                    The core objective is to create a robust blueprint that balances conflicting forces like cost, performance, security, and complexity. A good design is one that is **scalable, available, and maintainable**.
                </p>
                <div className="p-3 mt-4 rounded-md bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800">
                    <p className="font-medium text-blue-800 dark:text-blue-200">
                        **Example:** When designing an e-commerce platform, system design determines if you need a single database (simple, low scale) or multiple distributed databases, caching layers, and microservices (complex, high scale).
                    </p>
                </div>
            </>
        ),
    },
    {
        moduleId: "m-101",
        id: "sd-interviews",
        title: "1.2 Importance of System Design in Interviews",
        estimatedReadingTime: "5 min",
        content: (
            <>
                <p className="mb-4">
                    System Design interviews test your ability to think like a senior engineer or architect. They assess your proficiency beyond simple coding tasks.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">What Interviewers Look For:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Structural Thinking:** Can you break a huge problem (like 'Design Twitter') into manageable components?</li>
                    <li>**Trade-off Analysis:** Can you explain *why* you chose NoSQL over SQL for a specific use case?</li>
                    <li>**Scalability & Performance:** Do you know how to handle millions of users and high traffic?</li>
                    <li>**Communication:** Can you clearly articulate and justify your design decisions?</li>
                </ul>
                <div className="p-3 mt-4 rounded-md bg-green-100 dark:bg-green-900/50 border border-green-200 dark:border-green-800">
                    <p className="font-medium text-green-800 dark:text-green-200">
                        **Key Insight:** The interviewer isn't looking for the *perfect* answer, but rather a structured approach and justification for key decisions.
                    </p>
                </div>
            </>
        ),
    },
    {
        moduleId: "m-101",
        id: "types-of-sd",
        title: "1.3 Types of System Design (HLD vs LLD)",
        estimatedReadingTime: "8 min",
        content: (
            <>
                <h4 className="text-xl font-semibold mb-3">High-Level Design (HLD)</h4>
                <p className="mb-4">
                    **HLD** is the **big-picture** view. It outlines the major components, the overall architecture, services, and how they connect.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Low-Level Design (LLD)</h4>
                <p className="mb-4">
                    **LLD** dives into the **details** of specific components. It deals with class structure, data schemas, algorithms, and interface methods.
                </p>
                <div className="p-3 mt-4 rounded-md bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800">
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                        **Analogy:** HLD is the city map, showing where major buildings and roads are. LLD is the blueprint for a specific building, detailing rooms and plumbing.
                    </p>
                </div>
            </>
        ),
    },
    {
        moduleId: "m-101",
        id: "key-components",
        title: "1.4 Key Components of a Scalable System",
        estimatedReadingTime: "10 min",
        content: (
            <>
                <p className="mb-4">
                    A scalable system typically involves several interconnected components designed to distribute load and handle failures:
                </p>
                <ul className="list-disc ml-6 space-y-3">
                    <li>**Load Balancers:** Distribute incoming network traffic across a group of backend servers. (e.g., Round Robin, Least Connections).</li>
                    <li>**Web/App Servers:** Handle business logic and API requests. (Stateless is key for scalability).</li>
                    <li>**Databases (DB):** Persistent storage for data.</li>
                    <li>**Caches (In-Memory Data Store):** Temporarily store frequently accessed data to speed up reads and reduce DB load. (e.g., Redis).</li>
                    <li>**Message Queues:** Enable asynchronous communication between services. (e.g., Kafka).</li>
                </ul>
                <p className="mb-8">
                    Client $\rightarrow$ CDN $\rightarrow$ Load Balancer $\rightarrow$ Web/App Server $\leftrightarrow$ Cache $\leftrightarrow$ Database
                </p>
            </>
        ),
    },
    {
        moduleId: "m-101",
        id: "terminologies",
        title: "1.5 Common Design Terminologies",
        estimatedReadingTime: "7 min",
        content: (
            <>
                <p className="mb-4">
                    Mastering the vocabulary is crucial for effective communication in System Design.
                </p>
                <ul className="list-disc ml-6 space-y-3">
                    <li>**Latency:** The **delay** before a transfer of data begins.</li>
                    <li>**Throughput:** The **number of units** (requests, data) a system can process per time unit.</li>
                    <li>**Availability:** The percentage of time a system is **operational and accessible**.</li>
                    <li>**Scalability:** The ability of a system to **handle increased load** by adding resources.</li>
                    <li>**Durability:** The assurance that data is **safely stored** and will not be lost.</li>
                </ul>
                <p className="mt-4 mb-8">
                    These foundational terms will be referenced throughout the entire course.
                </p>
            </>
        ),
    },
];

const MODULE_M201_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-201",
        id: "m201-basics",
        title: "2.1 Basics of Computer Networks",
        estimatedReadingTime: "8 min",
        content: (
            <>
                <p className="mb-4">
                    System Design is built on top of networking. You need to understand the **OSI model** and the **TCP/IP stack** to grasp how requests travel through your system.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">OSI Model Layers (Focus):</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Layer 4 (Transport):** Deals with segments, port numbers, and protocols like TCP/UDP. Used by L4 Load Balancers.</li>
                    <li>**Layer 7 (Application):** Deals with data formatting (HTTP, REST, JSON) and user interaction. Used by L7 Load Balancers and APIs.</li>
                </ul>
                <div className="p-3 mt-4 rounded-md bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800">
                    <p className="font-medium text-blue-800 dark:text-blue-200">
                        **Deep Dive:** Understanding the difference between **TCP (reliable)** and **UDP (fast, unreliable)** is critical for designing low-latency systems (e.g., real-time gaming or video streaming).
                    </p>
                </div>
            </>
        )
    },
    {
        moduleId: "m-201",
        id: "m201-http",
        title: "2.2 Client-Server Model & HTTP/S",
        estimatedReadingTime: "10 min",
        content: (
            <>
                <p className="mb-4">The **Client-Server model** is the foundation of distributed systems, where the client requests a resource or service, and the server provides it.</p>
                <h4 className="text-xl font-semibold mt-6 mb-3">HTTP, HTTPS, REST, and WebSockets:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**HTTP (Hypertext Transfer Protocol):** The primary protocol for communication, fundamentally **stateless**.</li>
                    <li>**HTTPS:** HTTP secured by **TLS/SSL encryption**. Essential for production systems.</li>
                    <li>**REST:** An architectural style (not a protocol) that uses standard HTTP methods (GET, POST, etc.) for communication. It prioritizes simplicity and statelessness.</li>
                    <li>**WebSockets:** Provides a **full-duplex, persistent connection** over a single TCP connection, ideal for real-time applications like chat or live updates.</li>
                </ul>
            </>
        )
    },
    {
        moduleId: "m-201",
        id: "m201-lb-proxy",
        title: "2.3 Load Balancing and Reverse Proxies",
        estimatedReadingTime: "7 min",
        content: (
            <>
                <p className="mb-4">
                    A **Reverse Proxy** sits in front of one or more web servers, forwarding client requests to one of them. It provides an additional layer of abstraction and security.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Load Balancing (LB):</h4>
                <p>
                    Load balancing is a primary function of a reverse proxy. It distributes network traffic across multiple servers, ensuring no single server is overwhelmed.
                </p>
                <div className="p-3 mt-4 rounded-md bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800">
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                        **Benefit:** Load balancers dramatically increase the **availability** (if one server fails, others take over) and **scalability** (allows adding more servers) of a system.
                    </p>
                </div>
            </>
        )
    },
    {
        moduleId: "m-201",
        id: "m201-cdn",
        title: "2.4 CDN (Content Delivery Networks)",
        estimatedReadingTime: "5 min",
        content: (
            <>
                <p className="mb-4">
                    A **CDN** is a geographically distributed network of proxy servers and their data centers. Their purpose is to provide high availability and high performance by distributing the service spatially relative to end-users.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Edge Caching:</h4>
                <p>
                    CDNs cache static assets (images, CSS, JavaScript) at **edge locations** (Points of Presence) close to the user. This reduces the **latency** for the end-user and significantly offloads traffic from the origin server.
                </p>
            </>
        )
    },
    {
        moduleId: "m-201",
        id: "m201-dns",
        title: "2.5 DNS (Domain Name System)",
        estimatedReadingTime: "6 min",
        content: (
            <>
                <p className="mb-4">
                    The **DNS** is the internet's phonebook. It translates human-friendly domain names (like `example.com`) into computer-friendly **IP addresses** (like `192.0.2.1`).
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Key DNS Role in SD:</h4>
                <p>
                    DNS is the **first step** in almost every web request. Advanced DNS routing techniques (like Geolocation or Weighted Round Robin) can be used for basic **traffic management** even before a Load Balancer is reached.
                </p>
            </>
        )
    },
];

/* -------------------- NEW MODULE CONTENT START HERE -------------------- */

const MODULE_M301_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-301",
        id: "m301-scalability-def",
        title: "3.1 Understanding Scalability: Vertical vs. Horizontal",
        estimatedReadingTime: "10 min",
        content: (
            <>
                <p className="mb-4">
                    **Scalability** is a system's ability to handle a growing amount of work by adding resources. There are two primary ways to scale:
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Vertical Scaling (Scaling Up)</h4>
                <p>
                    This means **adding more power** (CPU, RAM, Disk) to an existing single machine. It's simpler to implement but hits a hard limit on hardware capacity and suffers from a Single Point of Failure (SPOF).
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Horizontal Scaling (Scaling Out)</h4>
                <p>
                    This means **adding more machines** to your pool of resources. This is the preferred method for high-scale, distributed systems, as it allows for near-limitless capacity and built-in redundancy. It requires stateless components and a Load Balancer.
                </p>
                <div className="p-3 mt-4 rounded-md bg-green-100 dark:bg-green-900/50 border border-green-200 dark:border-green-800">
                    <p className="font-medium text-green-800 dark:text-green-200">
                        **Example:** Moving from a single, giant PostgreSQL server (Vertical) to 10 smaller, load-balanced application servers (Horizontal).
                    </p>
                </div>
            </>
        ),
    },
    {
        moduleId: "m-301",
        id: "m301-perf-metrics",
        title: "3.2 Performance Metrics: Latency vs. Throughput",
        estimatedReadingTime: "8 min",
        content: (
            <>
                <p className="mb-4">
                    System performance is measured by two key metrics, which often present a trade-off:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    {/* FIXED: Removed $ delimiters */}
                    <li>**Latency (Response Time):** The time it takes for a request to receive a response. Lower is better. Measured in milliseconds (ms) or seconds (s).</li>
                    <li>**Throughput (QPS/RPS):** The number of requests or transactions processed per unit of time. Higher is better. Measured in Queries per Second (QPS) or Requests per Second (RPS).</li>
                </ul>
                <h4 className="text-xl font-semibold mt-6 mb-3">The Importance of Percentiles (P95, P99)</h4>
                <p>
                    Instead of just using the average (mean) latency, we use percentiles (like **P99** - the 99th percentile) which represents the worst-case response time for 99% of users. This is crucial for catching "long tail" performance issues that affect a small but significant number of users.
                </p>
            </>
        ),
    },
    {
        moduleId: "m-301",
        id: "m301-scaling-laws",
        title: "3.3 Amdahl's Law and Scaling Bottlenecks",
        estimatedReadingTime: "7 min",
        content: (
            <>
                <p className="mb-4">
                    **Amdahl's Law** states that the theoretical speedup of a task is limited by the portion of the task that cannot be parallelized (the sequential part).
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Scaling Bottlenecks:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Database:** Often the first bottleneck due to the difficulty of sharing write operations (statefulness).</li>
                    <li>**Inter-Service Communication:** Network overhead and serialization/deserialization add latency.</li>
                    <li>**Single Point of Failure (SPOF):** Any non-redundant component (like a single database master or a single load balancer) that, if it fails, brings down the entire system.</li>
                </ul>
                <div className="p-3 mt-4 rounded-md bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800">
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                        {/* FIXED: Removed $ delimiters */}
                        **Lesson:** Even if you scale your application servers infinitely, if your database takes 100ms for every request, your best-case latency will still be over 100ms.
                    </p>
                </div>
            </>
        ),
    },
];

const MODULE_M401_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-401",
        id: "m401-sql-nosql",
        title: "4.1 SQL vs. NoSQL: Choosing the Right Store",
        estimatedReadingTime: "12 min",
        content: (
            <>
                <h4 className="text-xl font-semibold mb-3">Relational (SQL) Databases</h4>
                <ul className="list-disc ml-6 space-y-2 mb-4">
                    <li>**Focus:** Data integrity, complex joins, predefined schema.</li>
                    <li>**Key Concept:** **ACID** properties (Atomicity, Consistency, Isolation, Durability) which guarantee reliable transactions.</li>
                    <li>**Use Case:** Financial transactions, user authentication, inventory management.</li>
                </ul>
                <h4 className="text-xl font-semibold mt-6 mb-3">Non-Relational (NoSQL) Databases</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Focus:** Horizontal scalability, flexibility, high performance.</li>
                    <li>**Key Concept:** **BASE** properties (Basically Available, Soft State, Eventual Consistency).</li>
                    <li>**Use Case:** User profiles (Document DB - MongoDB), high-speed logs (Column-Family - Cassandra), caching (Key-Value - Redis), social graphs (Graph DB - Neo4j).</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-401",
        id: "m401-replication",
        title: "4.2 Database Replication and Partitioning (Sharding)",
        estimatedReadingTime: "10 min",
        content: (
            <>
                <h4 className="text-xl font-semibold mb-3">Replication (Master-Slave)</h4>
                <p className="mb-4">
                    Copies data across multiple servers. **Master** handles all writes, and **Slaves** (Read Replicas) handle reads. This dramatically increases read throughput and provides a failover mechanism for the Master.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Partitioning (Sharding)</h4>
                <p>
                    Splitting a single logical database into multiple, independent databases (shards). This solves the problem of a database growing too large to fit on a single server, significantly increasing write and read capacity.
                </p>
                <div className="p-3 mt-4 rounded-md bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800">
                    <p className="font-medium text-blue-800 dark:text-blue-200">
                        **Challenge:** Sharding introduces complexity in data access, cross-shard queries, and maintaining a consistent hashing scheme.
                    </p>
                </div>
            </>
        ),
    },
    {
        moduleId: "m-401",
        id: "m401-cap",
        title: "4.3 The CAP Theorem",
        estimatedReadingTime: "7 min",
        content: (
            <>
                <p className="mb-4">
                    The **CAP Theorem** (Consistency, Availability, Partition Tolerance) states that a distributed data store can only guarantee two out of the three properties:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Consistency (C):** Every read receives the most recent write or an error.</li>
                    <li>**Availability (A):** Every request receives a response (without guarantee that it is the latest write).</li>
                    <li>**Partition Tolerance (P):** The system continues to operate despite arbitrary message loss or failure of parts of the system.</li>
                </ul>
                <h4 className="text-xl font-semibold mt-6 mb-3">The Real-World Choice: CP vs. AP</h4>
                <p>
                    In a distributed system, **Partition Tolerance (P) is mandatory**. You must choose between **Consistency (CP)** or **Availability (AP)**. Databases like traditional SQL tend towards **C**, while systems like Cassandra/DynamoDB prioritize **A** and **P** using eventual consistency.
                </p>
            </>
        ),
    },
];

const MODULE_M501_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-501",
        id: "m501-consistency",
        title: "5.1 Consistency Models (Strong vs. Eventual)",
        estimatedReadingTime: "9 min",
        content: (
            <>
                <p className="mb-4">
                    Consistency defines what data is visible to a user at any given time, especially in a distributed system where data is replicated across multiple nodes.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Strong Consistency:** Once a write is completed, all future reads will see that write. (e.g., Traditional RDBMS, Spanner).</li>
                    <li>**Eventual Consistency:** If no new updates are made, all reads will eventually return the latest value. Reads may see stale data for a period. (e.g., Cassandra, DynamoDB, DNS).</li>
                    <li>**Causal Consistency:** A stricter form of eventual consistency where events that are causally related are seen in the correct order.</li>
                </ul>
                <div className="p-3 mt-4 rounded-md bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800">
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                        **Trade-off:** Strong Consistency implies lower Availability and higher Latency, while Eventual Consistency offers higher Availability and lower Latency.
                    </p>
                </div>
            </>
        ),
    },
    {
        moduleId: "m-501",
        id: "m501-failover",
        title: "5.2 Redundancy, Fault Tolerance, and Failover",
        estimatedReadingTime: "8 min",
        content: (
            <>
                <p className="mb-4">
                    A system is considered **Fault Tolerant** if it can continue to operate despite the failure of one or more of its components.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Key Mechanisms:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Redundancy:** Having backup copies of data (Replication) or multiple instances of a service (Load Balancing).</li>
                    <li>**Failover:** The process of automatically switching to a redundant or standby system when the primary system fails.</li>
                    <li>**Health Checks:** Mechanisms used by Load Balancers and orchestration systems to constantly monitor the responsiveness of services and remove unhealthy ones from the rotation.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-501",
        id: "m501-consensus",
        title: "5.3 Distributed Consensus (Paxos/Raft)",
        estimatedReadingTime: "7 min",
        content: (
            <>
                <p className="mb-4">
                    **Distributed Consensus** is the process of getting all nodes in a cluster to agree on a single value, even if some nodes fail. This is critical for maintaining consistency in distributed state (e.g., who is the Master, cluster configuration).
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Raft:** A protocol designed to be more understandable than Paxos, aiming to ensure all nodes agree on a shared, replicated log.</li>
                    <li>**Zookeeper/etcd:** Services that implement a consensus protocol to store and manage configuration data, naming, and distributed synchronization.</li>
                </ul>
            </>
        ),
    },
];

const MODULE_M601_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-601",
        id: "m601-lb-algorithms",
        title: "6.1 Load Balancer Algorithms and Sticky Sessions",
        estimatedReadingTime: "10 min",
        content: (
            <>
                <p className="mb-4">
                    The algorithm determines how a Load Balancer distributes requests to the backend servers:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Round Robin:** Requests are distributed sequentially (Server 1, Server 2, Server 3, Server 1, ...). Simple and effective if servers have equal processing power.</li>
                    <li>**Least Connections:** Sends the request to the server with the fewest active connections. Best for handling servers with varying loads.</li>
                    <li>**IP Hash:** Uses the client's IP address to consistently route them to the same server. Useful for maintaining session state (**Sticky Sessions**).</li>
                </ul>
                <h4 className="text-xl font-semibold mt-6 mb-3">Sticky Sessions (Session Affinity)</h4>
                <p>
                    A mechanism where all requests from a specific client are directed to the same backend server. This is necessary if the application servers maintain any user-specific session state (stateful). However, it hinders horizontal scaling and can lead to uneven load distribution. **Design Goal:** Strive for statelessness!
                </p>
            </>
        ),
    },
    {
        moduleId: "m-601",
        id: "m601-cache-types",
        title: "6.2 Caching Strategies and Tiering",
        estimatedReadingTime: "9 min",
        content: (
            <>
                <p className="mb-4">
                    Caching is one of the most effective ways to improve system performance (latency) and scalability (offloading the database).
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Caching Tiering:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Client-Side Cache:** Browser cache (HTTP headers). Fastest but least control.</li>
                    <li>**CDN Cache:** Edge locations globally for static and some dynamic content.</li>
                    <li>**Application/Server Cache:** In-memory store (Redis, Memcached) shared by application servers. High-speed and widely used.</li>
                    <li>**Database Cache:** Built-in DB caches (e.g., PostgreSQL buffer cache).</li>
                </ul>
                <h4 className="text-xl font-semibold mt-6 mb-3">Cache Update Strategies:</h4>
                <p>
                    **Cache-Aside:** The application is responsible for reading and writing to the cache, checking the cache *before* going to the database.
                </p>
            </>
        ),
    },
    {
        moduleId: "m-601",
        id: "m601-cache-issues",
        title: "6.3 Cache Invalidation and Pitfalls",
        estimatedReadingTime: "7 min",
        content: (
            <>
                <p className="mb-4">
                    The hardest problem in computer science is cache invalidation. When data changes, the corresponding cache entry must be updated or deleted.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Cache Stampede:** A sudden spike in requests to the database when a popular cached item expires simultaneously. Solved by using **probabilistic expiration** (jitter) or a **lock queue**.</li>
                    <li>**Thundering Herd:** Similar to Stampede, where many processes wait for an expired item to be recalculated, leading to overload.</li>
                    <li>**Cache Miss:** When requested data is not found in the cache, forcing a slower database query. High cache miss rates indicate poor cache utilization.</li>
                </ul>
            </>
        ),
    },
];

const MODULE_M701_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-701",
        id: "m701-monolith-micro",
        title: "7.1 Monolithic vs. Microservices Architecture",
        estimatedReadingTime: "10 min",
        content: (
            <>
                <h4 className="text-xl font-semibold mb-3">Monolith</h4>
                <p className="mb-4">
                    A single, tightly coupled application where all business logic runs in one process. Simple to develop initially, but challenging to scale, deploy, and maintain as the team and codebase grow.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Microservices</h4>
                <p>
                    A collection of small, independent services, each focused on a single business capability. They are loosely coupled, communicate via APIs (often REST or gRPC), and can be deployed and scaled independently.
                </p>
                <div className="p-3 mt-4 rounded-md bg-green-100 dark:bg-green-900/50 border border-green-200 dark:border-green-800">
                    <p className="font-medium text-green-800 dark:text-green-200">
                        **Trade-off:** Microservices solve the complexity of large teams/systems but introduce new operational complexity (networking, monitoring, deployment).
                    </p>
                </div>
            </>
        ),
    },
    {
        moduleId: "m-701",
        id: "m701-api-gateway",
        title: "7.2 API Gateway Pattern",
        estimatedReadingTime: "8 min",
        content: (
            <>
                <p className="mb-4">
                    An **API Gateway** is a single entry point for all client requests. It acts as a facade, hiding the complexity of the microservices architecture behind it.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Key Responsibilities:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Routing:** Directing requests to the appropriate microservice.</li>
                    <li>**Authentication & Authorization:** Verifying client identity before forwarding.</li>
                    <li>**Rate Limiting:** Protecting the backend services from abuse by limiting the number of requests per client.</li>
                    <li>**Protocol Translation:** Converting requests (e.g., from REST to gRPC).</li>
                    <li>**Request Aggregation:** Combining data from multiple services into a single response for the client.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-701",
        id: "m701-rest-rpc",
        title: "7.3 Communication: REST, gRPC, and Asynchronous APIs",
        estimatedReadingTime: "7 min",
        content: (
            <>
                <p className="mb-4">
                    Microservices need to communicate effectively:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**REST (Representational State Transfer):** The most common style, uses standard HTTP verbs (GET, POST). Simple, human-readable, but less efficient due to text (JSON) payloads.</li>
                    <li>**gRPC (Remote Procedure Call):** Uses HTTP/2 and Protocol Buffers for structured, binary data transfer. Much faster and more efficient, ideal for high-throughput, low-latency inter-service communication.</li>
                    <li>**Asynchronous (Messaging):** Communication via Message Queues or Streams (see M-801) is used for tasks that don't require an immediate response, ensuring loose coupling.</li>
                </ul>
            </>
        ),
    },
];

const MODULE_M801_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-801",
        id: "m801-queues-def",
        title: "8.1 Message Queues: Decoupling and Asynchronous Tasks",
        estimatedReadingTime: "9 min",
        content: (
            <>
                <p className="mb-4">
                    **Message Queues** (e.g., RabbitMQ, SQS) provide a buffer for messages between the sending service (Producer) and the receiving service (Consumer).
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Core Benefits:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Decoupling:** Services don't need to know about each other's existence or availability.</li>
                    <li>**Resilience:** If the consumer service is down, the messages wait in the queue.</li>
                    <li>**Rate Limiting/Load Leveling:** Producers can send messages faster than consumers can process them, which smooths out traffic spikes.</li>
                    <li>**Asynchronous Tasks:** Ideal for long-running jobs (e.g., processing a video upload, sending emails).</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-801",
        id: "m801-streaming",
        title: "8.2 Data Streaming and Event-Driven Architecture (Kafka)",
        estimatedReadingTime: "10 min",
        content: (
            <>
                <p className="mb-4">
                    **Data Streaming Platforms** (e.g., Apache Kafka, Kinesis) handle a continuous flow of data (events). They differ from traditional queues by being a persistent, ordered log of events that can be read by multiple consumers simultaneously.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Event-Driven Architecture (EDA)</h4>
                <p>
                    In an EDA, services communicate by producing and consuming immutable **events** (a significant change in state). This allows for highly scalable and decoupled systems where new services can easily tap into existing data streams.
                </p>
                <div className="p-3 mt-4 rounded-md bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800">
                    <p className="font-medium text-blue-800 dark:text-blue-200">
                        **Example:** A `User_Signed_Up` event in an EDA might trigger three different services (Email Service, Analytics Service, Profile Service) without the original User Service knowing about them.
                    </p>
                </div>
            </>
        ),
    },
    {
        moduleId: "m-801",
        id: "m801-guarantees",
        title: "8.3 Delivery Guarantees: At-Most-Once, At-Least-Once, Exactly-Once",
        estimatedReadingTime: "8 min",
        content: (
            <>
                <p className="mb-4">
                    Reliability in messaging is defined by how many times a message is processed:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**At-Most-Once:** The message is delivered zero or one time. Fast, but risks losing messages.</li>
                    <li>**At-Least-Once:** The message is delivered one or more times. Ensures no loss, but requires the consumer to be **idempotent** (processing it multiple times yields the same result). Most common.</li>
                    <li>**Exactly-Once:** The message is delivered and processed exactly one time. Highly complex to implement, often requires strong transactional guarantees across multiple services (Distributed Transactions).</li>
                </ul>
            </>
        ),
    },
];

const MODULE_M901_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-901",
        id: "m901-patterns",
        title: "9.1 Microservice and Resilience Patterns",
        estimatedReadingTime: "10 min",
        content: (
            <>
                <p className="mb-4">
                    Design patterns are repeatable solutions to common problems in software architecture.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Resilience Patterns:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Circuit Breaker:** Prevents cascading failures. If a service calls another that is failing, the circuit breaker "trips," and subsequent calls fail immediately (Fast-Fail), giving the failing service time to recover.</li>
                    <li>**Retry:** Allows an operation to be re-attempted, often with an **Exponential Backoff** to prevent overwhelming the downstream service.</li>
                    <li>**Bulkhead:** Isolates elements of a system into pools so that if one fails, the others can continue operating (like watertight compartments in a ship).</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-901",
        id: "m901-ddd",
        title: "9.2 Domain-Driven Design (DDD) & Bounded Contexts",
        estimatedReadingTime: "8 min",
        content: (
            <>
                <p className="mb-4">
                    **Domain-Driven Design (DDD)** is an approach that models software around core business domains.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Domain:** The subject area to which the software is applied (e.g., E-commerce, Banking).</li>
                    <li>**Bounded Context:** The explicit boundary within which a particular domain model applies. Microservices are typically designed to align with a single Bounded Context.</li>
                    <li>**Ubiquitous Language:** A shared, structured language developed by the team and domain experts for the project, used in all design, code, and communication.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-901",
        id: "m901-tradeoffs",
        title: "9.3 Common Design Trade-offs",
        estimatedReadingTime: "7 min",
        content: (
            <>
                <p className="mb-4">
                    System Design is about choosing the best trade-offs for the requirements:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**CAP Theorem:** Consistency vs. Availability.</li>
                    <li>**Monolith vs. Microservices:** Simplicity vs. Scalability/Independence.</li>
                    <li>**Latency vs. Cost:** Extremely low latency often requires expensive global CDNs or dedicated hardware.</li>
                    <li>**Denormalization vs. Normalization (DB):** Faster reads (denormalized) vs. Faster writes and reduced redundancy (normalized).</li>
                </ul>
            </>
        ),
    },
];

const MODULE_M1001_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-1001",
        id: "m1001-security",
        title: "10.1 Security Fundamentals (Auth, TLS, Validation)",
        estimatedReadingTime: "10 min",
        content: (
            <>
                <p className="mb-4">
                    Security must be considered at every layer of the system design.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Authentication (AuthN):** Verifying the user's identity (e.g., passwords, multi-factor).</li>
                    <li>**Authorization (AuthZ):** Determining what the authenticated user is allowed to do (e.g., Role-Based Access Control).</li>
                    <li>**TLS/SSL:** Encryption of data in transit (HTTPS) to prevent Man-in-the-Middle attacks.</li>
                    <li>**Input Validation:** Sanitize and validate all user input to prevent common attacks like SQL Injection and Cross-Site Scripting (XSS).</li>
                    <li>**Secrets Management:** Never hard-code sensitive data (API keys, database passwords). Use dedicated services (Vault, AWS Secrets Manager).</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-1001",
        id: "m1001-reliability",
        title: "10.2 Reliability, Observability, and Monitoring",
        estimatedReadingTime: "9 min",
        content: (
            <>
                <p className="mb-4">
                    A system is **reliable** if it consistently performs its required functions under stated conditions for a specified period of time.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Monitoring:** Collecting metrics (CPU, Memory, QPS, Latency) to track the system's current state (Prometheus, Datadog).</li>
                    <li>**Logging:** Centralized system to collect and search all application and server logs (ELK Stack/Splunk).</li>
                    <li>**Distributed Tracing:** Following a single request as it hops between multiple microservices (Jaeger, Zipkin) to debug complex latency issues.</li>
                    {/* FIXED: Replaced $500\text{ms}$) with 500ms) and > with &gt; */}
                    <li>**Alerting:** Setting thresholds on metrics (e.g., P99 latency &gt; 500ms) to notify operations teams of issues.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-1001",
        id: "m1001-dr",
        title: "10.3 Disaster Recovery and Backups",
        estimatedReadingTime: "6 min",
        content: (
            <>
                <p className="mb-4">
                    **Disaster Recovery (DR)** is the process of restoring the system after a major event (data center outage, regional failure).
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**RTO (Recovery Time Objective):** The maximum tolerable length of time that a system can be down after a failure.</li>
                    <li>**RPO (Recovery Point Objective):** The maximum tolerable amount of data loss, measured in time (e.g., 5 minutes of data loss is acceptable).</li>
                </ul>
            </>
        ),
    },
];

const MODULE_M1101_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-1101",
        id: "m1101-containers",
        title: "11.1 Containerization (Docker) and Orchestration (Kubernetes)",
        estimatedReadingTime: "10 min",
        content: (
            <>
                <p className="mb-4">
                    **Containers (Docker)** package an application and all its dependencies into a standard unit for development and deployment. This solves the "it works on my machine" problem.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Kubernetes (K8s)</h4>
                <p>
                    **Kubernetes** is an open-source system for automating deployment, scaling, and management of containerized applications. It provides key features for distributed systems:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Service Discovery:** Automatically finds and connects services.</li>
                    <li>**Self-Healing:** Restarts failed containers and replaces failed nodes.</li>
                    <li>**Load Balancing:** Built-in traffic distribution.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-1101",
        id: "m1101-deployment",
        title: "11.2 Deployment Strategies (Blue/Green, Canary)",
        estimatedReadingTime: "8 min",
        content: (
            <>
                <p className="mb-4">
                    Modern systems use advanced deployment methods to minimize downtime and risk:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Rolling Deployment:** Replaces a small number of old instances with new ones, gradually rolling out the change.</li>
                    <li>**Blue/Green Deployment:** Maintain two identical production environments (Blue is old, Green is new). Traffic is fully switched from Blue to Green instantly. Provides fast rollback.</li>
                    <li>**Canary Deployment:** Rolling out a new version to a small subset of users (e.g., 1-5% of traffic). If no errors are detected, the rollout continues. Excellent for testing in a real production environment.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-1101",
        id: "m1101-serverless",
        title: "11.3 Cloud Services and Serverless Architecture",
        estimatedReadingTime: "7 min",
        content: (
            <>
                <p className="mb-4">
                    **Serverless** (e.g., AWS Lambda, Azure Functions) allows developers to build and run applications without managing servers. The cloud provider dynamically manages the allocation of machine resources.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Serverless Pros/Cons:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Pros:** Extreme cost savings (pay-per-use), automatic scaling, zero server maintenance.</li>
                    <li>**Cons:** Vendor lock-in, limited execution duration, and potential latency (Cold Start) when an inactive function is invoked.</li>
                </ul>
            </>
        ),
    },
];

const MODULE_M1201_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-1201",
        id: "m1201-twitter",
        title: "12.1 Case Study: Designing Twitter/X (Read-Heavy Systems)",
        estimatedReadingTime: "15 min",
        content: (
            <>
                <p className="mb-4">
                    The biggest challenge in designing a system like Twitter is the disproportionate volume of reads versus writes (Read-Heavy). The "fan-out" problem requires massive caching.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Key Design Decisions:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Timeline Feed:** Pre-generating the timeline for users (**Fanout-on-Write**) is a key strategy for low-latency reads. When a user posts, their followers' timelines are updated immediately.</li>
                    <li>**Data Storage:** A combination of a durable datastore (sharded SQL or Cassandra) for the actual tweet content and a blazing-fast cache (Redis or Memcached) for the timeline pointers.</li>
                    <li>**WebSockets:** Used for real-time notifications and live updates of the feed.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-1201",
        id: "m1201-url",
        title: "12.2 Case Study: Designing a URL Shortener (Write-Heavy and ID Generation)",
        estimatedReadingTime: "12 min",
        content: (
            <>
                <p className="mb-4">
                    URL shorteners are fundamentally simple but introduce an interesting challenge: generating unique, short IDs at a massive scale.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">ID Generation Strategies:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Auto-Increment (SQL):** Simple, but not scalable in a distributed environment.</li>
                    <li>**UUID:** Globally unique, but too long for a short URL.</li>
                    <li>**Distributed ID Generator (e.g., Snowflake):** Generates time-sortable, globally unique IDs, which can then be Base62 encoded for a short, unique URL.</li>
                    <li>**Load Balancing:** The Redirect service must be extremely fast, leveraging a cache to map the short key to the long URL.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-1201",
        id: "m1201-payments",
        title: "12.3 Case Study: Designing a Payment Processing System (Consistency-Heavy)",
        estimatedReadingTime: "10 min",
        content: (
            <>
                <p className="mb-4">
                    Payment systems prioritize **strong consistency** and **data integrity** (ACID) over availability. Loosing a transaction is unacceptable.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Key Design Decisions:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Strong Consistency:** Use SQL databases or a CP-oriented distributed database.</li>
                    <li>**Two-Phase Commit (2PC):** A protocol used to ensure that all participants in a distributed transaction either commit or abort the transaction. (Often avoided for scale, but essential for core financial guarantees).</li>
                    <li>**Idempotency:** Crucial for handling re-attempts. A unique transaction ID ensures that even if a payment request is sent multiple times due to a network glitch, the transaction only executes once.</li>
                </ul>
            </>
        ),
    },
];

/* -------------------- NEW MODULE CONTENT END HERE -------------------- */


const ALL_COURSE_MODULES = [
    { id: "m-101", title: "M-101: Introduction to System Design", submodules: MODULE_M101_SUBMODULES, quizId: "m-101-final", nextModuleId: "m-201" },
    { id: "m-201", title: "M-201: Networking Fundamentals", submodules: MODULE_M201_SUBMODULES, quizId: "m-201-final", nextModuleId: "m-301" },
    { id: "m-301", title: "M-301: Scalability & Performance", submodules: MODULE_M301_SUBMODULES, quizId: "m-301-final", nextModuleId: "m-401" },
    { id: "m-401", title: "M-401: Databases in System Design", submodules: MODULE_M401_SUBMODULES, quizId: "m-401-final", nextModuleId: "m-501" },
    { id: "m-501", title: "M-501: Distributed Systems Concepts", submodules: MODULE_M501_SUBMODULES, quizId: "m-501-final", nextModuleId: "m-601" },
    { id: "m-601", title: "M-601: Load Balancing & Caching", submodules: MODULE_M601_SUBMODULES, quizId: "m-601-final", nextModuleId: "m-701" },
    { id: "m-701", title: "M-701: Microservices & APIs", submodules: MODULE_M701_SUBMODULES, quizId: "m-701-final", nextModuleId: "m-801" },
    { id: "m-801", title: "M-801: Message Queues & Streaming", submodules: MODULE_M801_SUBMODULES, quizId: "m-801-final", nextModuleId: "m-901" },
    { id: "m-901", title: "M-901: Design Patterns & Principles", submodules: MODULE_M901_SUBMODULES, quizId: "m-901-final", nextModuleId: "m-1001" },
    { id: "m-1001", title: "M-1001: Security & Reliability", submodules: MODULE_M1001_SUBMODULES, quizId: "m-1001-final", nextModuleId: "m-1101" },
    { id: "m-1101", title: "M-1101: Cloud & Deployment", submodules: MODULE_M1101_SUBMODULES, quizId: "m-1101-final", nextModuleId: "m-1201" },
    { id: "m-1201", title: "M-1201: Real-World Case Studies", submodules: MODULE_M1201_SUBMODULES, quizId: "m-1201-final", nextModuleId: null },
];

/* -------------------- LOCAL STORAGE HELPERS (Reused Logic) -------------------- */
const LOCAL_STORAGE_KEY = "fullStackProgress";

const getInitialModuleProgress = (moduleId: string): ModuleProgress => {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        const allProgress = stored ? JSON.parse(stored) : {};

        // Ensure initial progress for M-101's prerequisite (F-201) and M-101 itself
        // M-101 and M-201 are mocked as read-complete to let the user start M-301 easily in this new block
        if (moduleId === "m-101" && !allProgress["f-201"]) {
            allProgress["f-201"] = { readProgress: 100, isCompleted: true, isQuizCompleted: true };
        }
        if (moduleId === "m-201" && !allProgress["m-101"]) {
            allProgress["m-101"] = allProgress["m-101"] || { readProgress: 100, isCompleted: true, isQuizCompleted: true };
        }
        if (moduleId === "m-301" && !allProgress["m-201"]) {
             allProgress["m-201"] = allProgress["m-201"] || { readProgress: 100, isCompleted: true, isQuizCompleted: true };
        }

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allProgress));

        return allProgress[moduleId] || { readProgress: 0, isCompleted: false, isQuizCompleted: false };
    } catch {
        return { readProgress: 0, isCompleted: false, isQuizCompleted: false };
    }
};

const saveModuleProgress = (moduleId: string, newProgress: ModuleProgress) => {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        const allProgress = stored ? JSON.parse(stored) : {};
        allProgress[moduleId] = newProgress;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allProgress));
    } catch {}
};

/* -------------------- MAIN COMPONENT -------------------- */
export const SystemDesignIntroView: React.FC<CourseViewProps> = ({
    onBack,
    planTitle,
}) => {
    const navigate = useNavigate();

    // Initial State: Load progress for all defined modules
    const initialProgress = useMemo(() => {
        const progressMap: Record<string, ModuleProgress> = {};
        ALL_COURSE_MODULES.forEach(mod => {
            progressMap[mod.id] = getInitialModuleProgress(mod.id);
        });
        return progressMap;
    }, []);

    // Set initial module to M-301 for easy testing of the new content
    const [currentModuleId, setCurrentModuleId] = useState<string>(ALL_COURSE_MODULES.find(m => m.id === "m-301") ? "m-301" : ALL_COURSE_MODULES[0].id);
    
    // Fallback to first submodule if M-301 is set
    const initialSubmodule = ALL_COURSE_MODULES.find(m => m.id === currentModuleId)?.submodules[0]?.id || "";
    const [activeSection, setActiveSection] = useState<string>(initialSubmodule);
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isQuizActive, setIsQuizActive] = useState(false);
    const [quizAttemptFailed, setQuizAttemptFailed] = useState(false);
    const [allModuleProgress, setAllModuleProgress] = useState<Record<string, ModuleProgress>>(initialProgress);

    const contentRef = useRef<HTMLDivElement>(null);

    // Dynamic Module/Content lookups
    const currentModule = ALL_COURSE_MODULES.find(m => m.id === currentModuleId)!;
    const currentSubmodules = currentModule.submodules;
    const LAST_SUBMODULE_ID = currentSubmodules.length > 0 ? currentSubmodules[currentSubmodules.length - 1].id : "";
    const moduleProgress = allModuleProgress[currentModuleId] || { readProgress: 0, isCompleted: false, isQuizCompleted: false };


    // --- QUIZ COMPLETION HANDLER ---
    const handleQuizComplete = useCallback((success: boolean) => {
        if (success) {
            setQuizAttemptFailed(false);
            setAllModuleProgress(prev => {
                const newProgress: ModuleProgress = { ...prev[currentModuleId], isQuizCompleted: true };
                saveModuleProgress(currentModuleId, newProgress);
                return { ...prev, [currentModuleId]: newProgress };
            });
            setIsQuizActive(false);
            setTimeout(() => {
                const nextModuleTitle = ALL_COURSE_MODULES.find(m => m.id === currentModule.nextModuleId)?.title;
                alert(`Quiz passed! ${nextModuleTitle ? nextModuleTitle + ' is unlocked.' : 'You finished the course!'}`);
                // Automatically move to the next module's first section upon passing the quiz
                if (currentModule.nextModuleId) {
                    handleSectionChange(currentModule.nextModuleId);
                }
            }, 200);
        } else {
            setQuizAttemptFailed(true);
            alert("Quiz attempt failed. Please review the answers below before attempting again.");
        }
    }, [currentModuleId, currentModule.nextModuleId, ALL_COURSE_MODULES]);

    // --- SCROLL TRACKING LOGIC ---
    const updateScrollProgress = useCallback(() => {
        if (isQuizActive || currentSubmodules.length === 0) return;
        const contentDiv = contentRef.current;
        if (!contentDiv) return;
        const { scrollTop, scrollHeight, clientHeight } = contentDiv;

        const scrollableHeight = scrollHeight - clientHeight;
        const currentModuleProgress = allModuleProgress[currentModuleId];

        if (scrollableHeight <= 0) {
             const isReadCompleted = activeSection === LAST_SUBMODULE_ID;
             if (isReadCompleted && currentModuleProgress.readProgress !== 100) {
                 setAllModuleProgress(prev => {
                     const newProgress: ModuleProgress = { ...currentModuleProgress, readProgress: 100, isCompleted: true };
                     saveModuleProgress(currentModuleId, newProgress);
                     return { ...prev, [currentModuleId]: newProgress };
                 });
             }
             return;
        }

        const currentProgress = Math.min(100, Math.round((scrollTop / scrollableHeight) * 100));

        if (currentProgress !== currentModuleProgress.readProgress) {
            const isReadCompleted = currentProgress >= 95 && activeSection === LAST_SUBMODULE_ID;

            setAllModuleProgress(prev => {
                const newProgress: ModuleProgress = {
                    ...currentModuleProgress,
                    readProgress: currentProgress,
                    isCompleted: currentModuleProgress.isCompleted || isReadCompleted,
                };
                saveModuleProgress(currentModuleId, newProgress);
                return { ...prev, [currentModuleId]: newProgress };
            });
        }
    }, [isQuizActive, activeSection, currentModuleId, LAST_SUBMODULE_ID, allModuleProgress, currentSubmodules.length]);

    useEffect(() => {
        const contentDiv = contentRef.current;
        if (contentDiv) contentDiv.addEventListener("scroll", updateScrollProgress);
        updateScrollProgress();
        return () => {
        if (contentDiv) contentDiv.removeEventListener("scroll", updateScrollProgress);
        };
    }, [updateScrollProgress]);

    // Reset scroll and quiz state when module changes
    useEffect(() => {
        setIsQuizActive(false);
        setQuizAttemptFailed(false);
        if (contentRef.current) contentRef.current.scrollTo(0, 0);
    }, [currentModuleId]);


    // --- NAVIGATION HANDLER ---
    const handleSectionChange = (id: string) => {
        // 1. Check if the ID is a submodule within the current module
        const submodule = currentSubmodules.find((m) => m.id === id);
        if (submodule) {
            setActiveSection(id);
            setIsQuizActive(false);
            setQuizAttemptFailed(false);
            if (contentRef.current) contentRef.current.scrollTo(0, 0);
        }
        // 2. Check if the ID is a major module (M-xxx)
        else if (id.startsWith("m-")) {
            const targetModule = ALL_COURSE_MODULES.find(m => m.id === id);

            if (targetModule && targetModule.id !== currentModuleId) {
                const targetIndex = ALL_COURSE_MODULES.findIndex(m => m.id === targetModule.id);
                const prerequisiteModuleId = ALL_COURSE_MODULES[targetIndex - 1]?.id;

                // Prerequisite check (Must complete the one before it, unless it's the first module)
                if (prerequisiteModuleId && !allModuleProgress[prerequisiteModuleId]?.isQuizCompleted) {
                    alert(`You must complete the previous module (${prerequisiteModuleId}) and pass its quiz before starting ${targetModule.id}!`);
                    return;
                }

                setCurrentModuleId(targetModule.id);
                // Ensure the target module has submodules before trying to navigate
                if (targetModule.submodules.length > 0) {
                    setActiveSection(targetModule.submodules[0].id);
                } else {
                    // This should not happen now that all modules are populated
                    setActiveSection('');
                    alert(`Module ${targetModule.id} is a placeholder and has no content yet!`);
                }
            }
        }
        // 3. Handle external navigation or final checks
        else if (id === "f-201") {
            navigate("/modules/f-201"); // Navigate out to the previous module view
        } else if (id === "final-project") {
            alert("Final Project is locked until all prerequisites are met!");
        }
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    // Handler to launch the quiz
    const handleLaunchQuiz = () => {
        if (!moduleProgress.isCompleted) {
            alert(`Please finish all reading sections in ${currentModuleId} before attempting the quiz.`);
            return;
        }
        setQuizAttemptFailed(false);
        setIsQuizActive(true);
        if (contentRef.current) contentRef.current.scrollTo(0, 0);
    };

    // Handler to go back to content from quiz
    const handleBackToContent = () => {
        setIsQuizActive(false);
        setQuizAttemptFailed(false);
    };

    const currentSubmodule =
        currentSubmodules.find((m) => m.id === activeSection) ||
        currentSubmodules[0];

    // Check if the overall module is complete (Read + Quiz)
    const isModuleFullyComplete = moduleProgress.isCompleted && moduleProgress.isQuizCompleted;

    // --- FRAMER MOTION VARIANT FOR PULSE EFFECT ---
    const pulseVariant = {
        pulse: {
            scale: [1, 1.01, 1],
            boxShadow: ["0 0 0 0 rgba(59,130,246,0.4)", "0 0 0 4px rgba(59,130,246,0)"],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
            }
        }
    };

    // Sidebar Content
    const sidebarContent = (
      <div className="w-full bg-card p-4 space-y-2 h-full overflow-y-auto">
        <Button variant="outline" onClick={onBack} className="w-full mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Progress Card (Dynamic for currentModuleId) */}
        <div className="p-3 border rounded-lg bg-accent/20">
          <h4 className="text-sm font-semibold mb-2">
            {currentModule.id} Read Progress: {moduleProgress.readProgress}%
          </h4>
          <Progress value={moduleProgress.readProgress} className="h-2 mb-2" />
          {moduleProgress.isQuizCompleted && (
            <div className="text-xs text-green-500 font-medium mt-1 flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" /> Quiz Passed!
            </div>
          )}
          {!moduleProgress.isQuizCompleted && moduleProgress.isCompleted && (
               <div className="text-xs text-yellow-500 font-medium mt-1 flex items-center">
               <Clock className="h-3 w-3 mr-1" /> Reading Done, Take Quiz!
             </div>
          )}
          {isModuleFullyComplete && (
            <div className="text-xs text-green-500 font-medium mt-1 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" /> {currentModule.id} Module Fully Completed!
            </div>
          )}
        </div>
        <h3 className="text-lg font-bold mb-3 mt-4">Course Navigation</h3>
        <ul className="space-y-1">
            {/* List all major modules and their submodules */}
            {ALL_COURSE_MODULES.map((mod) => {
                const isPrereqMet = ALL_COURSE_MODULES.findIndex(m => m.id === mod.id) === 0 || allModuleProgress[ALL_COURSE_MODULES[ALL_COURSE_MODULES.findIndex(m => m.id === mod.id) - 1]?.id]?.isQuizCompleted;
                const isCompleted = allModuleProgress[mod.id]?.isQuizCompleted;
                const isCurrent = mod.id === currentModuleId;
                const isClickable = isPrereqMet || isCompleted || isCurrent;

                return (
                <React.Fragment key={mod.id}>
                    {/* Major Module Header - Clickable for navigation */}
                    <motion.li
                        onClick={() => isClickable && handleSectionChange(mod.id)}
                        className={`flex items-center justify-between p-3 rounded-lg transition-colors text-sm font-bold mt-2
                        ${isCurrent ? "bg-primary text-white hover:bg-primary/80" :
                          isCompleted ? "text-green-600 hover:bg-green-50/50" :
                          isPrereqMet ? "cursor-pointer hover:bg-accent text-card-foreground" :
                          "text-muted-foreground cursor-not-allowed"
                        }`}
                        variants={isCurrent && isModuleFullyComplete && currentModule.nextModuleId ? pulseVariant : {}}
                        animate={isCurrent && isModuleFullyComplete && currentModule.nextModuleId ? "pulse" : ""}
                    >
                        <span>{mod.title}</span>
                        {isCompleted ? <CheckCircle className="h-4 w-4 text-green-300" /> : null}
                    </motion.li>

                    {/* Submodules (Only display for the active module) */}
                    {isCurrent && mod.submodules.length > 0 && mod.submodules.map((section) => (
                        <li
                            key={section.id}
                            onClick={() => handleSectionChange(section.id)}
                            className={`flex items-center justify-between pl-6 pr-3 py-2 rounded-lg cursor-pointer transition-colors text-sm
                            ${section.id === activeSection && !isQuizActive
                                ? "bg-primary/20 dark:bg-primary/40 font-semibold text-primary"
                                : "hover:bg-accent text-card-foreground/80"
                            }`}
                        >
                            <span>{section.title}</span>
                        </li>
                    ))}
                    {isCurrent && mod.submodules.length === 0 && (
                        <li className="flex items-center pl-6 pr-3 py-2 text-sm text-red-500">
                            (Content Pending)
                        </li>
                    )}
                </React.Fragment>
            )})}

            <li className="flex items-center p-3 rounded-lg text-sm text-muted-foreground">
                <Target className="h-4 w-4 mr-2" />
                Final Project
            </li>
        </ul>
      </div>
    );


    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col md:flex-row bg-background relative"
      >
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 border-r h-screen sticky top-0">
          {sidebarContent}
        </div>
        {/* Mobile Sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 md:hidden bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
              className="absolute left-0 top-0 w-64 h-full bg-card shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end p-4">
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                <X className="h-6 w-6" />
                </Button>
              </div>
              {sidebarContent}
            </motion.div>
          </div>
        )}
      {/* Main Content Area - Conditionally Renders Quiz or Submodule Content */}
      <div
        ref={contentRef}
        className="flex-1 p-4 md:p-10 overflow-y-scroll max-h-screen"
      >
        <div className="max-w-4xl mx-auto">
            {!isQuizActive && (
                <header className="flex justify-between items-start mb-6">
                    <h1 className="text-3xl font-bold">{currentModule.title}</h1>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden"
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                </header>
            )}

            {isQuizActive ? (
                // --- QUIZ VIEW (Shown when isQuizActive is TRUE) ---
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <header className="flex justify-between items-center mb-6 border-b pb-4">
                        <h1 className="text-3xl font-bold text-primary">{currentModule.id} Final Assessment</h1>
                    </header>
                    <ModuleQuiz
                        questions={QUIZ_QUESTIONS[currentModule.quizId] || []}
                        onComplete={handleQuizComplete}
                        onBackToContent={handleBackToContent}
                        isPassed={moduleProgress.isQuizCompleted}
                        showAnswers={quizAttemptFailed || moduleProgress.isQuizCompleted}
                    />
                </motion.div>
            ) : (
                // --- READING VIEW (Shown when isQuizActive is FALSE) ---
                <>
                    <h2 className="text-2xl font-semibold">{currentSubmodule?.title || "Select a submodule from the sidebar."}</h2>
                    <div className="flex items-center text-sm text-muted-foreground my-4 space-x-4">
                        <span>Reading Time: {currentSubmodule?.estimatedReadingTime || "0 min"}</span>
                        <Share2 className="h-4 w-4 cursor-pointer" />
                        <Edit className="h-4 w-4 cursor-pointer" />
                        <Server className="h-4 w-4 cursor-pointer" />
                    </div>
                    <div className="prose dark:prose-invert max-w-none">
                        {currentSubmodule?.content || <p className="text-lg mt-8 text-muted-foreground">This module content is currently being drafted. Please check back soon!</p>}
                    </div>
                </>
            )}

            {/* === ACTION BUTTON (Always visible if quiz isn't active) === */}
            {!isQuizActive && (
                <div className="mt-10 pt-6 border-t">
                    {isModuleFullyComplete ? (
                        // State 1: Module FULLY complete (Navigation Button, pulsing to next module)
                        currentModule.nextModuleId ? (
                            <motion.div
                                variants={pulseVariant}
                                animate="pulse"
                                className="rounded-md overflow-hidden"
                            >
                                <Button
                                    className="w-full"
                                    variant="default"
                                    onClick={() => handleSectionChange(currentModule.nextModuleId!)} // ACTION: GO TO NEXT MODULE
                                >
                                    <Play className="mr-2 h-4 w-4" /> Go to Next Module: {ALL_COURSE_MODULES.find(m => m.id === currentModule.nextModuleId)?.title}
                                </Button>
                            </motion.div>
                        ) : (
                            <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                                <CheckCircle className="mr-2 h-4 w-4" /> All Modules Complete! Start Final Project!
                            </Button>
                        )
                    ) : (
                        // State 2: Quiz Pending or Reading Pending (Always shows the quiz option)
                        <Button
                            className="w-full"
                            variant="default"
                            onClick={handleLaunchQuiz} // ACTION: LAUNCH QUIZ
                            disabled={!moduleProgress.isCompleted || currentSubmodules.length === 0} // Disable if reading not complete or no content
                        >
                            <HelpCircle className="mr-2 h-4 w-4" /> Start {currentModule.id} Final Quiz
                        </Button>
                    )}
                </div>
            )}
        </div>
      </div>
      </motion.div>
    );
};

export default SystemDesignIntroView;