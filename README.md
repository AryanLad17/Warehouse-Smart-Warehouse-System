# 🏭 Smart Warehouse — Graph-Based Robot Navigation & Optimization

<div align="center">

A fully interactive **warehouse management system** that leverages classical graph algorithms to power robot navigation, network optimization, and real-time inventory operations — brought to life with a stunning glassmorphic web dashboard.

**C++ Backend · Vanilla JS Frontend · SVG Graph Visualization · Live Robot Simulation**

[![Made with C++](https://img.shields.io/badge/Backend-C++-00599C?style=for-the-badge&logo=cplusplus&logoColor=white)](warehouse.cpp)
[![Made with JavaScript](https://img.shields.io/badge/Frontend-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](script.js)
[![CSS3](https://img.shields.io/badge/Styling-CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](style.css)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Algorithms Implemented](#-algorithms-implemented)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Usage Guide](#-usage-guide)
- [Screenshots](#-screenshots)
- [Architecture](#-architecture)
- [Data Structures Used](#-data-structures-used)
- [Contributing](#-contributing)

---

## 🔍 Overview

The **Smart Warehouse System** models a warehouse as a **weighted undirected graph** where:

- **Nodes** represent warehouse racks / storage locations (0–4).
- **Edges** represent physical pathways between racks, weighted by distance or cost.
- **Robots** navigate between racks using computed optimal paths to pick, deliver, and transfer products.

The project consists of two tightly coupled components:

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **C++ Engine** | Console application | Core data structures (BST, Adjacency List, Union-Find) and algorithm implementations |
| **Web Dashboard** | HTML + CSS + JS | Interactive visual frontend with live graph rendering, robot animation, and inventory management |

---

## ✨ Features

### 📦 Inventory Management
- **Insert products** into specific warehouse racks with name, quantity, and location
- **BST-based storage** for efficient product lookup and organization
- **Live inventory display** with per-rack item counts and visual node labels

### 🤖 Robot Navigation & Simulation
- **Dijkstra's shortest path** — Fully corrected and used as the primary pathfinding algorithm. Used for both navigation and transfer operations
- **Animated robot dispatch** — Watch the robot traverse the computed path in real time
- **Cargo visualization** — Robot displays what it's carrying during transfers

### 🌐 Network Optimization (MST)
- **Kruskal's MST** — Greedy edge-sorting with Union-Find for minimum spanning tree
- **Prim's MST** — Vertex-by-vertex tree growth from any root node
- **Animated edge highlighting** with staggered transitions

### 🔍 Graph Traversal
- **Breadth-First Search (BFS)** — Level-by-level sweep with ripple animation
- **Visual traversal order** displayed in real time

### 🏷️ Product Lookup & Update
- **Search by name** across all racks
- **Highlight matching racks** on the graph
- **In-place quantity adjustment** (add/subtract stock)

### 🚚 Product Transfer
- **Robot-powered inter-rack transfer** — Uses shortest path (Dijkstra) with real-time animation between racks
- **Live inventory update** — Correct inventory update after transfer (Source rack decremented, destination rack incremented)
- **Transfer preview panel** — Before/after quantities shown before dispatch
- **Transfer activity log** — Timestamped history of all transfer operations

### 🎨 Premium UI/UX
- **Glassmorphic card design** with color-coded themes per feature
- **Animated background particles** and floating gradient blobs
- **Clickable graph nodes** that open detailed rack inspection popups
- **Dynamic edge creation** — Add or update edges at runtime
- **Button ripple effects**, shake animations, and staggered data transitions
- **Real-time terminal feed** showing all system activity
- **Algorithm stats bar** displaying current algorithm, cost, edges, and nodes
- **Improved edge weight visibility** for vertical edges (1→2, 3→4)
- **Fixed label overlap issues** between nodes and edges

---

## 🧮 Algorithms Implemented

| Algorithm | Time Complexity | Use Case in Project |
|-----------|:-:|---|
| **Dijkstra's Shortest Path** | O(V²) | Corrected implementation with proper initialization, relaxation, and path reconstruction |
| **Kruskal's MST** | O(E log E) | Minimum-cost network wiring/cabling |
| **Prim's MST** | O(V²) | Alternative MST from a specific root |
| **Breadth-First Search** | O(V + E) | Layer-by-layer warehouse scanning |
| **BST Insert/Search/Update** | O(h) | Product inventory management |
| **Union-Find (DSU)** | O(α(n)) | Cycle detection for Kruskal's MST |

---

## 🛠 Tech Stack

| Layer | Technology | Details |
|-------|-----------|---------|
| **Backend** | C++ (STL) | BST, adjacency list, graph algorithms, Union-Find |
| **Frontend** | Vanilla JavaScript | Algorithm engine, DOM manipulation, async animations |
| **Markup** | HTML5 | Semantic structure with SVG graph overlay |
| **Styling** | CSS3 | Custom properties, glassmorphism, keyframe animations |
| **Fonts** | Google Fonts | [Outfit](https://fonts.google.com/specimen/Outfit) (UI) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (code/mono) |

---

## 📁 Project Structure

```
ADS final project/
├── index.html          # Main HTML — layout, forms, SVG graph canvas, rack popup
├── style.css           # Full design system — tokens, glassmorphism, animations (1600+ lines)
├── script.js           # Algorithm engine + interactivity + robot simulation (1237 lines)
├── warehouse.cpp       # C++ backend — BST, adjacency list, graph algorithms (340 lines)
├── a.exe               # Compiled C++ executable (Windows)
└── README.md           # This file
```

### File Breakdown

#### `warehouse.cpp` — C++ Backend
- `struct node` — BST node for product storage (name, quantity, location)
- `struct Edge` — Graph edge representation (u, v, weight)
- `struct node1` — Adjacency list linked-list node
- `class Warehouse` — Core class containing:
  - BST operations: `insert`, `search`, `update`, `findLocation`
  - Graph construction: `add`, `edge`, `displaylist`
  - Algorithms: `dij` (Dijkstra), `kruskalMST`, `primMST`, `bfs`
  - Union-Find: `find` (with path compression), `unite`

#### `script.js` — Frontend Engine
- Graph data model and rendering (SVG edges + DOM nodes)
- Complete reimplementation of all algorithms in JavaScript
- Async robot animation with cubic-bezier easing
- Rack popup system with live data
- Product transfer pipeline with cargo visualization
- Dynamic edge addition and weight updates

#### `style.css` — Design System
- CSS custom properties for 8 color palettes
- Glassmorphic card styles with colored tints
- 15+ keyframe animations (particles, ripples, glow, etc.)
- Responsive node/edge styling with algorithm-specific highlights

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, etc.)
- *(Optional)* A C++ compiler (g++, MSVC) if you want to run the console backend

### Running the Web Dashboard

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AryanLad17/Warehouse-Smart-Warehouse-System.git
   cd Warehouse-Smart-Warehouse-System
   ```

2. **Open `index.html` in your browser:**
   ```bash
   # Simply double-click index.html, or:
   start index.html          # Windows
   open index.html           # macOS
   xdg-open index.html       # Linux
   ```

3. **No build step required** — it's a pure HTML/CSS/JS application.

### Running the C++ Backend (Optional)

```bash
# Compile
g++ -o warehouse warehouse.cpp -std=c++17

# Run
./warehouse        # Linux/macOS
warehouse.exe      # Windows
```

The C++ console provides a menu-driven interface:
```
1.Insert  2.Search  3.Update  4.Edge  5.Display
6.Location  7.BFS  8.Kruskal  9.Dijkstra  10.Prim MST  0.Exit
```

---

## 📘 Usage Guide

### 1. Insert Products
Navigate to the **📦 Inventory** tab, enter a product name, quantity, and rack number (0–4), then click **Insert into Warehouse**. The graph node will flash to confirm.

### 2. Add Graph Edges
Scroll down in the Inventory tab to find the **🔗 Add Edge** section. Specify two nodes and a weight to create or update a connection.

### 3. Find Shortest Path (Dijkstra)
Switch to **🤖 Shortest Path**, set start and destination nodes, then:
- **Find Route** — Highlights the optimal path on the graph
- **Dispatch Robot** — Animates the robot along the path

### 4. Generate MST
- **🌐 Kruskal MST** — One-click MST with animated dashed edges (violet)
- **⚡ Prim MST** — Select a root node, then generate (amber dashed edges)

### 5. Graph Traversal
- **🔍 BFS** — Level-order sweep with ripple animations (rose)

### 6. Product Lookup
Go to **🏷️ Lookup**, search by name — matching racks light up on the graph. Adjust quantities directly from the results.

### 7. Transfer Products
In the **🚚 Transfer** tab:
1. Select source & destination racks
2. Pick a product from the dropdown
3. Set quantity, review the preview
4. Hit **Dispatch Transfer Robot** — watch the robot carry cargo along the shortest path

### 8. Inspect Racks
**Click any node** on the graph to open a detailed popup showing stored products, total quantity, and connected racks.

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────┐
│                   index.html                     │
│  ┌───────────────┐    ┌───────────────────────┐  │
│  │ Control Panel  │    │   Graph Visualization │  │
│  │ ─ Inventory    │    │   ─ SVG Edge Layer    │  │
│  │ ─ Dijkstra     │    │   ─ DOM Node Layer    │  │
│  │ ─ Kruskal      │    │   ─ Robot Indicator   │  │
│  │ ─ Prim         │◄──►│   ─ Rack Popup        │  │
│  │ ─ BFS          │    │   ─ Stats Bar         │  │
│  │ ─ Lookup       │    │                       │  │
│  │ ─ Transfer     │    │                       │  │
│  │ ─ Terminal     │    │                       │  │
│  └───────────────┘    └───────────────────────┘  │
└─────────────────────┬───────────────────────────┘
                      │
          ┌───────────┴───────────┐
          │       script.js       │
          │  ─ Graph Data Model   │
          │  ─ Algorithm Engine   │
          │  ─ Animation System   │
          │  ─ Event Handlers     │
          └───────────┬───────────┘
                      │
          ┌───────────┴───────────┐
          │       style.css       │
          │  ─ Design Tokens      │
          │  ─ Glass Cards        │
          │  ─ Animations (15+)   │
          │  ─ Algorithm Themes   │
          └───────────────────────┘

    ┌─────────────────────────────┐
    │      warehouse.cpp          │
    │  ─ BST (Product Storage)    │
    │  ─ Adjacency List (Graph)   │
    │  ─ Union-Find (Kruskal)     │
    │  ─ All 6 Algorithms         │
    │  (Standalone C++ Backend)   │
    └─────────────────────────────┘
```

---

## 🗃 Data Structures Used

| Data Structure | Implementation | Usage |
|---------------|---------------|-------|
| **Binary Search Tree** | Linked nodes (C++) / Array of objects (JS) | Product insertion, search, and update by name |
| **Adjacency List** | Linked list per vertex (C++) | Graph edge storage and neighbor traversal |
| **Adjacency Matrix** | 2D array `w[5][5]` (C++) | O(1) edge weight lookup for Dijkstra/Prim |
| **Union-Find (DSU)** | Array with path compression | Cycle detection in Kruskal's MST |
| **Priority Queue** | Manual min-extraction (both) | Vertex selection in Dijkstra and Prim |
| **Queue** | STL `queue` (C++) / Array (JS) | BFS traversal |

---

## 🤝 Contributing

Contributions are welcome! Here are some ways you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/new-algorithm`)
3. **Commit** your changes (`git commit -m 'Add A* pathfinding'`)
4. **Push** to the branch (`git push origin feature/new-algorithm`)
5. **Open** a Pull Request

### Ideas for Extension
- Add more nodes (scale beyond 5 racks)
- Implement A* pathfinding with heuristics
- Add WebSocket bridge between C++ backend and web frontend
- Add drag-and-drop node repositioning
- Export/import warehouse configurations as JSON

---

<div align="center">

**Built as a final project for Advanced Data Structures (ADS)**

Made with ❤️ using C++, JavaScript, HTML, and CSS

</div>