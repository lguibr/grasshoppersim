
<img src="https://github.com/lguibr/grasshoppersim/logo.png" alt="GrasshopperSim" width="100%"/>
# GrasshopperSim

**An Evolutionary Sandbox & Game Theory Visualizer**

[![React Three Fiber](https://img.shields.io/badge/React_Three_Fiber-black?style=flat-square&logo=react&logoColor=61DAFB)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](#)

*A WebGL-powered ecosystem where artificial lifeforms inherit traits, compete for resources, and showcase emergent behavioral strategies over generations.*

---

## 🧬 Theoretical Foundation

GrasshopperSim is not just a visualizer; it is an interactive laboratory exploring the fundamental mechanics of **Evolutionary Algorithms** and **Game Theory**.

### The Evolutionary Engine

Agents in the simulation possess a discrete genome composed of continuous traits:

- **`speed`**: Energy expenditure rate vs. resource acquisition potential.
- **`jumpDistance` & `jumpHeight`**: Physical locomotion strategies.
- **`aggressiveness`**: The propensity to engage in combative interactions over resources.

Through continuous time simulation, agents that secure sufficient resources (`health`) live long enough to pass their optimized trait matrices down to the next `generation`.

### Game Theory in Action: The Hawk-Dove Dynamic

The simulation organically manifests the classic **Hawk-Dove game**. When two agents compete for the same food node, their `aggressiveness` trait dictates the encounter:

- High-aggressiveness ('Hawks') risk fatal damage but gain a monopoly on resources.
- Low-aggressiveness ('Doves') share or flee, ensuring survival but missing optimal energy gains.
Over time, the population approaches an Evolutionary Stable Strategy (ESS), visible in real-time through the metrics dashboard.

---

## 🏗️ System Architecture

Our engine decouples the reactive UI from the dense physics simulation, ensuring stable 60FPS updates even at high population counts.

```mermaid
graph TD
    classDef core fill:#1e1e1e,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef agent fill:#2d3748,stroke:#10b981,stroke-width:2px,color:#fff;
    classDef env fill:#2d3748,stroke:#f59e0b,stroke-width:2px,color:#fff;

    A[Global Simulation Store]:::core -->|State Hydration| B(3D Render Engine)
    A -->|Metrics Polling| C(Telemetry Dashboard)
    
    B --> D[Grasshopper Agents]:::agent
    B --> E[Food Nodes / Terrain]:::env
    
    D -->|Sensory Data| F{Behavioral Heuristics}
    F -->|Action Choice| A
    E -->|Resource Decay/Spawn| A
```

### The Life Cycle Loop

```mermaid
sequenceDiagram
    participant E as Environment
    participant G as Grasshopper (Gen N)
    participant S as Simulation State
    
    E->>G: Spawns Food
    Note right of G: Calculates distance & risk
    G->>S: Move / Attack / Eat
    S-->>G: Updates Health & Energy
    
    alt Energy > Threshold
        G->>E: Lays Egg
        Note right of E: Mutates Traits (Speed, Aggro)
        E->>S: Registers Baby (Gen N+1)
    else Energy < 0
        S->>G: Despawn (Starvation)
    end
```

---

## 🚀 Getting Started

### Local Deployment

Ensure you have Node.js and `npm` installed.

```bash
# Clone the repository
git clone https://github.com/yourusername/grasshoppersim.git

# Install dependencies
npm install

# Instigate the simulation
npm run dev
```

### Build for Production

To bundle the WebGL canvas and React bundle into a unified, high-performance static build:

```bash
npm run build
npm run preview
```

---

## 📊 Telemetry & Observation

The environment heavily features real-time metric tracking via `recharts` and `echarts-gl`:

- **Population Velocity**: Track rapid birth/death spikes in response to environmental carrying capacity constraints.
- **Trait Drift**: Graph average speeds and jump heights as the environment applies selective pressure.
- **Generational Lineage**: Track the longest surviving family names natively generated via the engine.

> **Note:** The simulation state is volatile. Custom logic limits rapid changes to enforce evolutionary limits mathematically.
