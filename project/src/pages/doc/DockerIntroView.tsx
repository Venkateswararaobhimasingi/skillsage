// src/pages/devops/DockerFundamentalsView.tsx
// --- DockerFundamentalsView.tsx (D-101 & D-201 Module View) ---

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
    Server, // General icon for course modules
    Package, // Icon for container/Docker
    Layers, // Icon for Kubernetes/Orchestration
    Database, // Icon for storage
    GitBranch, // Icon for configuration
} from "lucide-react";

/* -------------------- MOCK UI COMPONENTS (Reused from DSAIntroView) -------------------- */

// Mock Button component
const Button: React.FC<any> = ({ onClick, children, className, variant = "default", size = "default", disabled = false }) => {
    let baseStyle = "px-4 py-2 font-semibold rounded-lg transition-colors shadow-md flex items-center justify-center";
    if (variant === "default") baseStyle += " bg-blue-600 hover:bg-blue-700 text-white";
    if (variant === "outline") baseStyle += " bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700";
    if (variant === "ghost") baseStyle += " bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-white shadow-none";
    if (size === "icon") baseStyle = "p-2 rounded-full " + baseStyle;

    if (disabled) baseStyle = baseStyle.replace(/hover:bg-\w+-\d+/, 'bg-gray-400 cursor-not-allowed');

    return (
        <button onClick={onClick} className={`${baseStyle} ${className || ''}`} disabled={disabled}>
            {children}
        </button>
    );
};

// Mock Progress component
const Progress: React.FC<any> = ({ value, className = '' }) => {
    const clampedValue = Math.min(100, Math.max(0, value));
    return (
        <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 ${className}`}>
            <div
                className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                style={{ width: `${clampedValue}%` }}
            ></div>
        </div>
    );
};

/* -------------------- INTERFACES -------------------- */
interface QuizQuestion { id: string; question: string; options: string[]; answer: number; }
interface DetailedSubmodule { id: string; title: string; content: React.ReactNode; estimatedReadingTime: string; moduleId: string; }
interface ModuleProgress { readProgress: number; isCompleted: boolean; isQuizCompleted: boolean; }
interface CourseViewProps { onBack: () => void; planTitle: string; }

/* -------------------- MOCK ModuleQuiz Component (Reused Logic) -------------------- */
const ModuleQuiz: React.FC<any> = ({ questions, onComplete, onBackToContent, isPassed, showAnswers }) => {
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
    const [localScore, setLocalScore] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSelect = (qId: string, oIndex: number) => {
        if (isSubmitted || showAnswers) return;
        setSelectedAnswers(prev => ({ ...prev, [qId]: oIndex }));
    };

    const handleSubmit = () => {
        // Mocked success logic: 75% chance to pass
        const passed = Math.random() > 0.25;
        const mockScore = passed ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 20) + 50;

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
                                        className={`p-2 rounded cursor-pointer transition-colors ${isSelected ? 'bg-blue-600/20 font-medium' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
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


/* -------------------- STATIC CONTENT DATA (Module D-101: Docker Fundamentals) -------------------- */
const D101_MODULE_ID = "d-101";

// --- D-101 QUIZ DATA ---
const D101_QUIZ_QUESTIONS: QuizQuestion[] = [
    { id: "d101-q1", question: "What is the key advantage of a container over a traditional Virtual Machine (VM)?", options: ["Containers run a full separate operating system.", "Containers are lighter and share the host OS kernel.", "Containers offer better hardware isolation.", "Containers require no installation of Docker software."], answer: 1, },
    { id: "d101-q2", question: "What is the primary function of a **Docker Image**?", options: ["To store persistent data (database files).", "To act as a runtime instance of a container.", "To serve as a read-only blueprint containing the application and its dependencies.", "To manage communication between multiple containers."], answer: 2, },
    { id: "d101-q3", question: "Which Dockerfile instruction is used to execute commands during the image build process (e.g., installing packages)?", options: ["COPY", "CMD", "RUN", "EXPOSE"], answer: 2, },
    { id: "d101-q4", question: "What command is used to map port 8080 on the host machine to port 80 inside the container?", options: ["`docker run -p 80:8080`", "`docker run -expose 8080:80`", "`docker run -p 8080:80`", "`docker expose 8080:80`"], answer: 2, },
    { id: "d101-q5", question: "Which method of data persistence is generally recommended for production database data?", options: ["Bind Mounts", "Named Volumes", "Anonymous Volumes", ".dockerignore file"], answer: 1, },
];

// --- D-101 MODULE CONTENT DATA (Complete X.1 to X.7) ---
const MODULE_D101_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: D101_MODULE_ID,
        id: "d101-intro",
        title: "X.1 Introduction to Containerization",
        estimatedReadingTime: "7 min",
        content: (
            <>
                <p className="mb-4">
                    **Containerization** is a method of packaging an application along with all its required dependencies, libraries, and configuration files into a single, isolated unit called a **Container**.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">VMs vs. Containers:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Virtual Machines (VMs):** Each VM runs its own full **Guest OS** (operating system), making them heavy, slow to start, and resource-intensive. VMs offer strong hardware isolation.</li>
                    <li>**Containers:** Share the host operating system's **kernel**. They only package the application, libraries, and binaries, making them lightweight, fast (seconds to start), and highly efficient.</li>
                </ul>
                <h4 className="text-xl font-semibold mt-6 mb-3">Why Docker?</h4>
                <p className="mt-4">
                    Docker is the leading platform for containerization. It provides the tools (like the Docker Engine) to easily build, ship, and run applications as portable containers.
                </p>
                <div className="p-3 mt-4 rounded-md bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800">
                    <p className="font-medium text-blue-800 dark:text-blue-200">
                        **Key Benefit:** Containers solve the "works on my machine" problem, ensuring **consistency** and **portability** from a developer's laptop all the way to a production server.
                    </p>
                </div>
            </>
        ),
    },
    {
        moduleId: D101_MODULE_ID,
        id: "d101-core",
        title: "X.2 Docker Core Concepts",
        estimatedReadingTime: "8 min",
        content: (
            <>
                <h4 className="text-xl font-semibold mb-3">Image, Container, and Registry:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Image:** A read-only **blueprint** or template used to create containers (like a class in OOP). They contain the application, environment, and all dependencies. They are built using a **Dockerfile**.</li>
                    <li>**Container:** A runnable **instance** of an Image (like an object in OOP). It is the isolated, running environment where your application executes.</li>
                    <li>**Registry (Docker Hub):** A central repository for storing and sharing Docker Images (like GitHub for code). You `pull` images from a Registry and `push` your custom images to it.</li>
                </ul>
                <h4 className="text-xl font-semibold mt-6 mb-3">Architecture:</h4>
                <p>
                    Docker operates with a **Client-Server architecture**.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>The **Docker Client** (your terminal) sends commands (e.g., `docker run`, `docker build`) to the Docker Daemon.</li>
                    <li>The **Docker Daemon** (or Docker Engine) is the background service that manages the Images, Containers, Networks, and storage volumes.</li>
                </ul>
                <p className="mt-4">
                    The two communicate using a REST API over a Unix socket or a network interface.
                </p>
            </>
        ),
    },
    {
        moduleId: D101_MODULE_ID,
        id: "d101-build",
        title: "X.3 Building Custom Images (Dockerfile)",
        estimatedReadingTime: "12 min",
        content: (
            <>
                <p className="mb-4">
                    A **Dockerfile** is a text file containing instructions for building a Docker Image. The image build process executes these instructions sequentially.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Essential Dockerfile Instructions:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**FROM:** Specifies the **base image** upon which your image is built (e.g., `FROM node:18-alpine`). It must be the first instruction.</li>
                    <li>**RUN:** Executes commands **during the build** process (e.g., `RUN npm install`, `RUN apt-get update`). **Each RUN command creates a new, read-only image layer.**</li>
                    <li>**COPY:** Copies files from your local build context into the image.</li>
                    <li>**CMD:** Provides defaults for executing a container. Only one `CMD` can be active. Easily overridden when running the container.</li>
                    <li>**ENTRYPOINT:** Configures a container that will run as an executable. Often used with `CMD` to provide default arguments.</li>
                </ul>
                <h4 className="text-xl font-semibold mt-6 mb-3">Layers and Caching:</h4>
                <p>
                    Docker Images are built in layers. When you rebuild, Docker checks if a layer's instruction has changed. If not, it uses the **build cache** for that layer, which significantly speeds up build times. Placing instructions that change less often (like `FROM` or `RUN apt-get update`) earlier in the Dockerfile improves cache usage.
                </p>
                <p className="mt-4">
                    Use **`.dockerignore`** to exclude files (like `.git` or logs) from the build context sent to the Docker daemon. This keeps build times fast and final image sizes small.
                </p>
            </>
        ),
    },
    {
        moduleId: D101_MODULE_ID,
        id: "d101-run",
        title: "X.4 Running Containers & Networking",
        estimatedReadingTime: "9 min",
        content: (
            <>
                <h4 className="text-xl font-semibold mb-3">Basic CLI Commands:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li><code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">docker pull &lt;image&gt;</code>: Downloads an image from a registry.</li>
                    <li><code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">docker run -d &lt;image&gt;</code>: Creates and starts a container in **detached mode** (<code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">-d</code>).</li>
                    <li><code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">docker ps</code>: Lists currently **running** containers. Add <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">-a</code> to see all containers (stopped and running).</li>
                    <li><code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">docker exec -it &lt;id&gt; bash</code>: Executes a command inside a running container (e.g., opening a shell).</li>
                    <li><code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">docker stop &lt;id&gt;</code> and <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">docker rm &lt;id&gt;</code>: Stop and remove a container.</li>
                </ul>
                <h4 className="text-xl font-semibold mt-6 mb-3">Port Publishing (`-p`):</h4>
                <p>
                    By default, containers are isolated and not accessible from the host machine's network. The **Port Publishing** option (`-p`) is crucial for exposing services:
                </p>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
                    <code>
                        {`docker run -p 8080:3000 my-app`}
                    </code>
                </pre>
                <p className="mt-2">
                    The syntax is **<code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">-p HostPort:ContainerPort</code>**. The example above maps **Host Port 8080** to **Container Port 3000**, allowing you to access the app via <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">http://localhost:8080</code>.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Container Networking Basics:</h4>
                <p>
                    Containers on the same host can communicate with each other over an internal network (usually the `bridge` network) even without exposed ports. Docker Compose automatically sets up a custom network for its services.
                </p>
            </>
        ),
    },
    {
        moduleId: D101_MODULE_ID,
        id: "d101-persist",
        title: "X.5 Data Persistence",
        estimatedReadingTime: "10 min",
        content: (
            <>
                <p className="mb-4">
                    All data written within the writable layer of a container is **ephemeral**. To store data permanently (e.g., database files, user uploads), you must use **persistence mechanisms**.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">1. Named Volumes (Recommended for Production):</h4>
                <p>
                    **Named Volumes** are file systems managed entirely by Docker on the host machine. You only refer to them by name (e.g., `my-db-data`).
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Pros:** Easy to backup/migrate, excellent performance, works on all Docker hosts (Linux, Windows, Mac). **Ideal for database and application state.**</li>
                    <li>**Command:** <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">docker run -v my-vol:/app/data &lt;image&gt;</code></li>
                </ul>
                <h4 className="text-xl font-semibold mt-6 mb-3">2. Bind Mounts (Recommended for Local Development):</h4>
                <p>
                    **Bind Mounts** link a specific, user-defined file path on the host machine to a directory inside the container.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Pros:** Allows live code editing on your host, with instant reflection in the container (no rebuild needed). **Ideal for source code, logs, and configuration files in development.**</li>
                    <li>**Command:** <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">docker run -v /path/on/host:/app/code &lt;image&gt;</code></li>
                </ul>
                <p className="mt-4 text-sm text-red-500 dark:text-red-400">
                    **Security Note:** Bind mounts expose the host file system structure, making volumes the preferred choice for production environments.
                </p>
            </>
        ),
    },
    {
        moduleId: D101_MODULE_ID,
        id: "d101-compose",
        title: "X.6 Multi-Container Apps (Docker Compose)",
        estimatedReadingTime: "9 min",
        content: (
            <>
                <p className="mb-4">
                    In real-world applications (e.g., a web server, a database, a cache), you often need to run multiple containers together. **Docker Compose** is the tool designed to simplify this process.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">The `docker-compose.yml` File:</h4>
                <p>
                    Compose uses a YAML file to define your application's services. This configuration file declares:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Services:** The different containers in your application (e.g., `web`, `database`).</li>
                    <li>**Images/Build:** Which Dockerfile to build or which image to pull.</li>
                    <li>**Ports/Volumes:** How to expose ports and which data volumes to use.</li>
                </ul>
                <h4 className="text-xl font-semibold mt-6 mb-3">Key Compose Commands:</h4>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
                    <code>
                        {`# Build, create network, and start all services
docker compose up -d

# Stop and remove containers, networks, and volumes
docker compose down

# View logs for all running services
docker compose logs -f`}
                    </code>
                </pre>
                <h4 className="text-xl font-semibold mt-6 mb-3">Service Discovery:</h4>
                <p>
                    Docker Compose automatically creates a single network for your services. This allows containers to find and communicate with each other using the **service names** defined in the YAML file as hostnames. For example, your `web` service can connect to the database container using the host name `database`.
                </p>
            </>
        ),
    },
    {
        moduleId: D101_MODULE_ID,
        id: "d101-best",
        title: "X.7 Best Practices & Security",
        estimatedReadingTime: "7 min",
        content: (
            <>
                <h4 className="text-xl font-semibold mb-3">Image Optimization:</h4>
                <p>Smaller images deploy faster and are more secure. Follow these steps:</p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Use Minimal Base Images:** Use stripped-down Linux distributions like **Alpine Linux** (`-alpine` tags) instead of full OS images (e.g., Ubuntu).</li>
                    <li>**Consolidate RUN Commands:** Combine multiple `RUN` commands into a single instruction using `&&` and backslashes. This minimizes the number of image layers, which is key for optimization.</li>
                    <li>**Multi-Stage Builds:** Use an initial build stage to compile or bundle assets (which includes large tools), and then copy only the final, necessary artifact into a final, minimal image stage.</li>
                </ul>
                <h4 className="text-xl font-semibold mt-6 mb-3">Security: Run as Non-Root</h4>
                <p>
                    By default, the container process runs as `root`. This is a major security risk. If an attacker gains access to the container, they could potentially exploit kernel vulnerabilities to escalate privileges on the host system.
                </p>
                <div className="p-3 mt-4 rounded-md bg-red-100 dark:bg-red-900/50 border border-red-200 dark:border-red-800">
                    <p className="font-medium text-red-800 dark:text-red-200">
                        **Action:** Always include a non-root user in your Dockerfile and switch to it using the **<code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">USER</code>** instruction (e.g., `USER node`).
                    </p>
                </div>
            </>
        ),
    },
];

/* -------------------- STATIC CONTENT DATA (Module D-201: Kubernetes Basics) -------------------- */
const D201_MODULE_ID = "d-201";

// --- D-201 QUIZ DATA ---
const D201_QUIZ_QUESTIONS: QuizQuestion[] = [
    { id: "d201-q1", question: "What problem does Kubernetes primarily solve?", options: ["Automated code compilation.", "Manual management of single containers.", "Orchestrating, scaling, and managing containerized applications.", "Developing container images."], answer: 2, },
    { id: "d201-q2", question: "In Kubernetes, what is the smallest deployable unit that can contain one or more containers?", options: ["Node", "Cluster", "Service", "Pod"], answer: 3, },
    { id: "d201-q3", question: "Which component is responsible for maintaining the desired state of the cluster (e.g., ensuring 3 replicas of a Pod are always running)?", options: ["Kubelet", "Control Plane (Master)", "Worker Node", "API Server"], answer: 1, },
    { id: "d201-q4", question: "What is the primary function of a Kubernetes **Service**?", options: ["To define a network policy.", "To store application configuration.", "To provide a stable, internal network endpoint for a set of Pods.", "To define the scaling logic."], answer: 2, },
    { id: "d201-q5", question: "How does Kubernetes inject configuration data (like API keys) into a running Pod?", options: ["Through Persistent Volumes.", "Through ConfigMaps and Secrets.", "Through LoadBalancers.", "Through ReplicaSets."], answer: 1, },
];

// --- D-201 MODULE CONTENT DATA (Expanded Y.1 to Y.7) ---
const MODULE_D201_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: D201_MODULE_ID,
        id: "d201-intro",
        title: "Y.1 Introduction to Orchestration",
        estimatedReadingTime: "6 min",
        content: (
            <>
                <p className="mb-4">
                    While Docker allows you to run a single container, modern applications require running **hundreds or thousands of containers** across many machines. **Orchestration** is the automated management, deployment, scaling, and networking of these containers.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">The Need for Kubernetes:</h4>
                <p>
                    Once you move beyond a single Docker Compose instance, you need a system that can handle:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**High Availability:** Automatically restarting failed containers or nodes.</li>
                    <li>**Scaling:** Easily deploying more instances (replicas) to handle traffic spikes.</li>
                    <li>**Load Balancing:** Distributing traffic across all running container instances.</li>
                </ul>
                <p className="mt-4">
                    **Kubernetes (K8s)** is the open-source industry standard for container orchestration, developed by Google.
                </p>
            </>
        ),
    },
    {
        moduleId: D201_MODULE_ID,
        id: "d201-arch",
        title: "Y.2 Kubernetes Cluster Architecture",
        estimatedReadingTime: "10 min",
        content: (
            <>
                <p className="mb-4">
                    A Kubernetes cluster is composed of two main types of nodes (virtual or physical machines): the **Control Plane** and **Worker Nodes**.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">The Control Plane (Master):</h4>
                <p>
                    This is the "brain" of the cluster. It makes global decisions and maintains the cluster's desired state.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**API Server:** The frontend for the Control Plane. All communication (internal and external) goes through the API Server.</li>
                    <li>**etcd:** A consistent, highly available key-value store used to save the cluster's entire configuration and state.</li>
                    <li>**Scheduler:** Watches for new Pods and assigns them to a healthy Worker Node.</li>
                </ul>
                <h4 className="text-xl font-semibold mt-6 mb-3">Worker Nodes:</h4>
                <p>
                    These are the machines that run your containerized applications.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Kubelet:** An agent running on each worker node that communicates with the Control Plane, ensuring the containers described in Pods are running and healthy.</li>
                    <li>**Container Runtime:** The software (like Docker) used to run the containers.</li>
                    <li>**Kube-proxy:** Manages networking rules to enable communication inside and outside the cluster.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: D201_MODULE_ID,
        id: "d201-pod",
        title: "Y.3 Pods: The Smallest Unit",
        estimatedReadingTime: "8 min",
        content: (
            <>
                <p className="mb-4">
                    In Kubernetes, you don't typically manage individual containers directly. The smallest deployable unit is a **Pod**.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Key Features of a Pod:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Shared Context:** Containers within a single Pod share the same network namespace (IP address and ports) and storage volumes.</li>
                    <li>**Co-location:** Containers that need to work closely together (e.g., a web application and a logging sidecar) are grouped into a single Pod and guaranteed to run on the same Worker Node.</li>
                    <li>**Ephemeral:** Pods are designed to be disposable. If a Pod fails, it is not restarted; instead, a completely new replacement Pod is created by the controller.</li>
                </ul>
                <h4 className="text-xl font-semibold mt-6 mb-3">YAML Definition:</h4>
                <p>
                    All Kubernetes resources are defined using configuration files, typically in YAML format, which is a declarative approach.
                </p>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
                    <code>
                        {`# Example Pod definition
apiVersion: v1
kind: Pod
metadata:
  name: web-pod
spec:
  containers:
  - name: my-nginx
    image: nginx:latest
    ports:
    - containerPort: 80`}
                    </code>
                </pre>
            </>
        ),
    },
    {
        moduleId: D201_MODULE_ID,
        id: "d201-deploy",
        title: "Y.4 Deployments and Services",
        estimatedReadingTime: "11 min",
        content: (
            <>
                <h4 className="text-xl font-semibold mb-3">Deployments: Managing State</h4>
                <p>
                    A **Deployment** is a resource that defines the desired state for your application, usually by managing a set of identical Pods.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**ReplicaSets:** Deployments automatically manage a ReplicaSet, ensuring a specified number of Pod replicas (e.g., 3) are running at all times.</li>
                    <li>**Rollouts and Rollbacks:** Deployments manage application updates, allowing you to gradually replace old Pods with new ones (rolling update) and easily revert to a previous version if an issue occurs.</li>
                </ul>
                <h4 className="text-xl font-semibold mt-6 mb-3">Services: Stable Networking</h4>
                <p>
                    Pods are ephemeral and get new IP addresses when they are recreated. A **Service** provides a permanent, stable way to access a set of Pods.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Load Balancer:** A Service automatically load-balances traffic across all healthy Pods it manages.</li>
                    <li>**Internal DNS:** Services get an internal DNS name (e.g., `my-service`), allowing other Pods to communicate with them reliably, regardless of the underlying Pod IPs.</li>
                    <li>**Types:** Common types include **ClusterIP** (internal access only), **NodePort** (exposes the service on a static port on each Node), and **LoadBalancer** (integrates with cloud provider load balancers).</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: D201_MODULE_ID,
        id: "d201-config",
        title: "Y.5 Configuration and Secrets",
        estimatedReadingTime: "7 min",
        content: (
            <>
                <p className="mb-4">
                    Configuration data and sensitive information (like API keys) should not be hardcoded into container images. Kubernetes uses specialized resources to inject this data at runtime.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">ConfigMaps: Non-Sensitive Data</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Purpose:** Store non-sensitive key-value pairs or configuration files (e.g., database hostnames, environment flags).</li>
                    <li>**Injection:** Data from a ConfigMap can be injected into a Pod as environment variables or mounted as configuration files within the container's filesystem.</li>
                </ul>
                <h4 className="text-xl font-semibold mt-6 mb-3">Secrets: Sensitive Data</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Purpose:** Store sensitive data like passwords, OAuth tokens, and SSH keys.</li>
                    <li>**Handling:** Secrets are base64 encoded by default (not truly encrypted), but they are handled by the API server and kubelet more carefully than ConfigMaps. They are mounted into Pods as files, generally in a temporary file system.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: D201_MODULE_ID,
        id: "d201-storage",
        title: "Y.6 Persistent Storage",
        estimatedReadingTime: "8 min",
        content: (
            <>
                <p className="mb-4">
                    Just like Docker containers, Kubernetes Pods are ephemeral, and their disk storage is deleted upon termination. For databases or file storage, we need **Persistent Storage**.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Abstracting Storage with PVCs:</h4>
                <p>
                    Kubernetes abstracts the underlying storage infrastructure using three key objects:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**PersistentVolume (PV):** A piece of storage in the cluster (e.g., a Google Compute Engine Persistent Disk or AWS EBS volume). Managed by the administrator.</li>
                    <li>**PersistentVolumeClaim (PVC):** A request for storage by a user/application. The PVC links the Pod to a PV.</li>
                    <li>**StorageClass:** Defines different types of storage available (e.g., fast SSD storage, cheap archival storage) and allows storage to be dynamically provisioned on demand.</li>
                </ul>
                <p className="mt-4">
                    This abstraction means your Pod definition is portable; it requests storage via a PVC and doesn't need to know if it's running on AWS, Azure, or locally.
                </p>
            </>
        ),
    },
    {
        moduleId: D201_MODULE_ID,
        id: "d201-scale",
        title: "Y.7 Scaling and Health Checks",
        estimatedReadingTime: "10 min",
        content: (
            <>
                <p className="mb-4">
                    The core benefit of Kubernetes is its ability to automatically manage scale and maintain application health.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Auto-Scaling:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Horizontal Pod Autoscaler (HPA):** Automatically scales the number of Pod replicas (managed by a Deployment) up or down based on observed metrics like CPU utilization or custom metrics.</li>
                    <li>**Cluster Autoscaler:** Scales the size of the cluster (adding or removing Worker Nodes) when the HPA requires more resources than are currently available.</li>
                </ul>
                <h4 className="text-xl font-semibold mt-6 mb-3">Health Probes:</h4>
                <p>
                    Kubernetes uses probes to determine the health and readiness of your Pods:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Liveness Probe:** Checks if the container is running and healthy. If the probe fails, Kubernetes kills the container and restarts it (its default restart policy).</li>
                    <li>**Readiness Probe:** Checks if the container is ready to serve traffic. If this probe fails, the Pod's IP is temporarily removed from the Service endpoints, meaning no traffic is sent to it until it becomes ready again. This prevents sending users to a still-initializing application.</li>
                </ul>
            </>
        ),
    },
];

// --- COURSE STRUCTURE ---
const ALL_COURSE_MODULES = [
    { id: D101_MODULE_ID, title: "D-101: Docker Fundamentals", submodules: MODULE_D101_SUBMODULES, quizId: "d-101-final", nextModuleId: D201_MODULE_ID },
    { id: D201_MODULE_ID, title: "D-201: Kubernetes Basics", submodules: MODULE_D201_SUBMODULES, quizId: "d-201-final", nextModuleId: null },
];

const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
    "d-101-final": D101_QUIZ_QUESTIONS,
    "d-201-final": D201_QUIZ_QUESTIONS,
};


/* -------------------- LOCAL STORAGE HELPERS -------------------- */
const LOCAL_STORAGE_KEY = "devopsProgress";

const getInitialModuleProgress = (moduleId: string): ModuleProgress => {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        const allProgress = stored ? JSON.parse(stored) : {};
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
export const DockerIntroView: React.FC<CourseViewProps> = ({
    onBack,
    planTitle,
}) => {
    const initialProgress = useMemo(() => {
        const progressMap: Record<string, ModuleProgress> = {};
        ALL_COURSE_MODULES.forEach(mod => {
            progressMap[mod.id] = getInitialModuleProgress(mod.id);
        });
        return progressMap;
    }, []);

    // Start with the first module's ID, or attempt to load from local storage if needed.
    const [currentModuleId, setCurrentModuleId] = useState<string>(
        ALL_COURSE_MODULES[0].id
    );
    // Determine the initial active section based on the current module's content
    const initialSubmodules = ALL_COURSE_MODULES.find(m => m.id === currentModuleId)?.submodules || [];
    const [activeSection, setActiveSection] = useState<string>(initialSubmodules.length > 0 ? initialSubmodules[0].id : "");

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
            setTimeout(() => alert(`Quiz passed! ${currentModule.nextModuleId ? ALL_COURSE_MODULES.find(m => m.id === currentModule.nextModuleId)?.title + ' is unlocked.' : 'Congratulations! You finished the entire course.'}`), 200);
        } else {
            setQuizAttemptFailed(true);
            alert("Quiz attempt failed. Please review the answers below before attempting again.");
        }
    }, [currentModuleId, currentModule.nextModuleId]);

    // --- SCROLL/READING TRACKING LOGIC ---
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
        const submodule = currentSubmodules.find((m) => m.id === id);
        if (submodule) {
            setActiveSection(id);
            setIsQuizActive(false); 
            setQuizAttemptFailed(false);
            if (contentRef.current) contentRef.current.scrollTo(0, 0);
        } 
        else if (id.startsWith("d-")) {
            const targetModule = ALL_COURSE_MODULES.find(m => m.id === id);
            
            if (targetModule && targetModule.id !== currentModuleId) {
                const targetIndex = ALL_COURSE_MODULES.findIndex(m => m.id === targetModule.id);
                const prerequisiteModuleId = ALL_COURSE_MODULES[targetIndex - 1]?.id;

                // Prerequisite check (Mocked to only check the immediate previous module)
                if (prerequisiteModuleId && !allModuleProgress[prerequisiteModuleId]?.isQuizCompleted) {
                    alert(`You must complete the previous module (${prerequisiteModuleId}) and pass its quiz before starting ${targetModule.id}!`);
                    return;
                }

                setCurrentModuleId(targetModule.id);
                if (targetModule.submodules.length > 0) {
                    setActiveSection(targetModule.submodules[0].id);
                } else {
                    setActiveSection(''); 
                    alert(`Module ${targetModule.id} is a placeholder and has no content yet!`);
                }
            }
        } 
        else if (id === "final-project") {
            // Check if all modules are complete before allowing access to the final project
            const allModulesComplete = ALL_COURSE_MODULES.every(mod => allModuleProgress[mod.id]?.isQuizCompleted);
            if (allModulesComplete) {
                alert("Navigating to Final Project...");
                // In a real application, you would navigate to the final project view
            } else {
                alert("Final Project is locked until all modules and quizzes are completed!");
            }
        } else {
             onBack(); // Navigate back to the dashboard if module ID is unknown
        }
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    // Handler to launch the quiz
    const handleLaunchQuiz = () => {
        if (!moduleProgress.isCompleted) {
            alert(`Please finish all reading sections in ${currentModuleId} before attempting the quiz.`);
            return;
        }
        if (!QUIZ_QUESTIONS[currentModule.quizId] || QUIZ_QUESTIONS[currentModule.quizId].length === 0) {
             alert(`Quiz for ${currentModuleId} is not yet available.`);
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
      <div className="w-full bg-white dark:bg-gray-900 p-4 space-y-2 h-full overflow-y-auto">
        <Button variant="outline" onClick={onBack} className="w-full mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        {/* Progress Card (Dynamic for currentModuleId) */}
        <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <h4 className="text-sm font-semibold mb-2">
            {currentModule.id} Read Progress: {moduleProgress.readProgress}%
          </h4>
          <Progress value={moduleProgress.readProgress} className="h-2 mb-2" />
          {moduleProgress.isQuizCompleted && (
            <div className="text-xs text-green-600 font-medium mt-1 flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" /> Quiz Passed!
            </div>
          )}
          {!moduleProgress.isQuizCompleted && moduleProgress.isCompleted && (
             <div className="text-xs text-yellow-600 font-medium mt-1 flex items-center">
              <Clock className="h-3 w-3 mr-1" /> Reading Done, Take Quiz!
            </div>
          )}
          {isModuleFullyComplete && (
            <div className="text-xs text-green-600 font-medium mt-1 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" /> {currentModule.id} Module Fully Completed!
            </div>
          )}
        </div>
        <h3 className="text-lg font-bold mb-3 mt-4">Course Navigation</h3>
        <ul className="space-y-1">
            {/* List all major modules and their submodules */}
            {ALL_COURSE_MODULES.map((mod) => {
                const index = ALL_COURSE_MODULES.findIndex(m => m.id === mod.id);
                const prereqId = index > 0 ? ALL_COURSE_MODULES[index - 1].id : null;
                const isPrereqMet = prereqId === null || allModuleProgress[prereqId]?.isQuizCompleted;
                const isCompleted = allModuleProgress[mod.id]?.isQuizCompleted;
                const isCurrent = mod.id === currentModuleId;
                const isClickable = isPrereqMet || isCompleted || isCurrent;
                
                return (
                <React.Fragment key={mod.id}>
                    {/* Major Module Header - Clickable for navigation */}
                    <motion.li
                        onClick={() => isClickable && handleSectionChange(mod.id)}
                        className={`flex items-center justify-between p-3 rounded-lg transition-colors text-sm font-bold mt-2 
                        ${isCurrent ? "bg-blue-600 text-white hover:bg-blue-700" : 
                          isCompleted ? "text-green-600 hover:bg-green-50/50" :
                          isPrereqMet ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-white" : 
                          "text-gray-400 dark:text-gray-600 cursor-not-allowed"
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
                                ? "bg-blue-100 dark:bg-blue-800/50 font-semibold text-blue-800 dark:text-blue-200"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
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

          <li 
            onClick={() => handleSectionChange("final-project")}
            className={`flex items-center p-3 rounded-lg text-sm 
              ${ALL_COURSE_MODULES.every(mod => allModuleProgress[mod.id]?.isQuizCompleted) 
                ? 'text-purple-600 font-bold hover:bg-purple-50 cursor-pointer' 
                : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'}`}
          >
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
        className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 relative"
      >
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 border-r dark:border-gray-800 h-screen sticky top-0">
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
              className="absolute left-0 top-0 w-64 h-full bg-white dark:bg-gray-900 shadow-xl"
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{currentModule.title}</h1>
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
                    <header className="flex justify-between items-center mb-6 border-b pb-4 dark:border-gray-700">
                        <h1 className="text-3xl font-bold text-blue-600">{currentModule.id} Final Assessment</h1>
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
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{currentSubmodule?.title || "Select a submodule from the sidebar."}</h2>
                    <div className="flex items-center text-sm text-gray-500 my-4 space-x-4">
                        <span>Reading Time: {currentSubmodule?.estimatedReadingTime || "0 min"}</span>
                        <Share2 className="h-4 w-4 cursor-pointer" />
                        <Edit className="h-4 w-4 cursor-pointer" />
                        {/* Dynamic icon based on module ID */}
                        {currentModule.id === D101_MODULE_ID ? (
                             <Package className="h-4 w-4 cursor-pointer" /> 
                        ) : (
                             <Layers className="h-4 w-4 cursor-pointer" /> 
                        )}
                    </div>
                    <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                        {currentSubmodule?.content || <p className="text-lg mt-8 text-gray-500">This module content is currently being drafted. Please select a module topic from the sidebar to begin!</p>}
                    </div>
                </>
            )}
            
            {/* === ACTION BUTTON (Always visible if quiz isn't active) === */}
            {!isQuizActive && (
                <div className="mt-10 pt-6 border-t dark:border-gray-700">
                    {isModuleFullyComplete ? (
                        // State 1: Module FULLY complete (Navigation Button, pulsing to next module)
                        currentModule.nextModuleId ? (
                            <motion.div
                                variants={pulseVariant}
                                animate="pulse"
                                className="rounded-md overflow-hidden" 
                            >
                                <Button
                                    className="w-full bg-green-600 hover:bg-green-700 text-white" 
                                    variant="default" 
                                    onClick={() => handleSectionChange(currentModule.nextModuleId!)} // ACTION: GO TO NEXT MODULE 
                                >
                                    <Play className="mr-2 h-4 w-4" /> Go to Next Module: {ALL_COURSE_MODULES.find(m => m.id === currentModule.nextModuleId)?.title}
                                </Button>
                            </motion.div>
                        ) : (
                            <Button 
                                className="w-full bg-green-600 hover:bg-green-700 text-white" 
                                onClick={() => handleSectionChange("final-project")}
                            >
                                <CheckCircle className="mr-2 h-4 w-4" /> All Modules Complete! Start Final Project!
                            </Button>
                        )
                    ) : (
                        // State 2: Quiz Pending or Reading Pending (Always shows the quiz option)
                        <Button
                            className="w-full"
                            variant="default" 
                            onClick={handleLaunchQuiz} // ACTION: LAUNCH QUIZ
                            disabled={!moduleProgress.isCompleted || currentSubmodules.length === 0 || !QUIZ_QUESTIONS[currentModule.quizId]} // Disable if reading not complete or no quiz
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

export default DockerIntroView;