# 🏭 Smart Warehouse — Graph-Based Robot Navigation & Optimization

<div align="center">

A fully interactive **warehouse automation system** powered by graph algorithms, enabling intelligent robot navigation, network optimization, and real-time inventory management — visualized through a modern glassmorphic dashboard.

**C++ Backend · JavaScript Frontend · Live Robot Simulation**

[![Live Demo](https://img.shields.io/badge/Live-Demo-green?style=for-the-badge)](https://smart-warehouse-robot.vercel.app/)
[![Backend C++](https://img.shields.io/badge/Backend-C++-00599C?style=for-the-badge\&logo=cplusplus\&logoColor=white)](warehouse.cpp)
[![Frontend JS](https://img.shields.io/badge/Frontend-JavaScript-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black)](script.js)
[![CSS3](https://img.shields.io/badge/Styling-CSS3-1572B6?style=for-the-badge\&logo=css3\&logoColor=white)](style.css)

</div>

---

## 📖 Table of Contents

* [Overview](#-overview)
* [Features](#-features)
* [Algorithms Implemented](#-algorithms-implemented)
* [Tech Stack](#-tech-stack)
* [Project Structure](#-project-structure)
* [Getting Started](#-getting-started)
* [Usage Guide](#-usage-guide)
* [Architecture](#-architecture)
* [Data Structures Used](#-data-structures-used)
* [Conclusion](#-conclusion)
* [Contributing](#-contributing)

---

## 🔍 Overview

The **Smart Warehouse System** models a warehouse as a **weighted undirected graph**, where:

* **Nodes** represent storage racks (0–4)
* **Edges** represent pathways with associated distances
* **Robots** navigate efficiently using shortest-path algorithms

The system integrates:

| Component         | Technology            | Role                                       |
| ----------------- | --------------------- | ------------------------------------------ |
| **C++ Engine**    | Console-based         | Core data structures & algorithm execution |
| **Web Dashboard** | HTML, CSS, JavaScript | Interactive visualization & simulation     |

This combination bridges **theoretical algorithms with real-world application** in warehouse automation.

---

## ✨ Features

### 📦 Inventory Management

* Insert products with name, quantity, and rack location
* Efficient storage using **Binary Search Tree (BST)**
* Dynamic inventory updates

---

### 🤖 Robot Navigation

* Shortest path using **Dijkstra’s Algorithm**
* Real-time animated robot movement
* Visual path highlighting

---

### 🚚 Intelligent Product Transfer (Key Feature)

* Robot performs **real-time inter-rack transfer**

* Uses **shortest path (Dijkstra)** for movement

* Carries product visually during traversal

* Automatically updates inventory:

  * Source rack → quantity decreases
  * Destination rack → quantity increases

* Includes:

  * Transfer preview panel
  * Live animation
  * Activity log with timestamps

This simulates **real warehouse logistics**, not just algorithm execution.

---

### 🌐 Graph Optimization

* **Kruskal’s Algorithm** (Minimum Spanning Tree)
* **Prim’s Algorithm** (Alternative MST)

---

### 🔍 Graph Traversal

* **BFS (Breadth First Search)**
* **DFS (Depth First Search)**

---

### 🖱️ Interactive UI

* Clickable racks to view stored products
* Dynamic graph updates
* Animated transitions and effects

---

## 🧮 Algorithms Implemented

| Algorithm  | Complexity | Purpose                            |
| ---------- | ---------- | ---------------------------------- |
| Dijkstra   | O(V²)      | Shortest path for robot navigation |
| Kruskal    | O(E log E) | Minimum cost network               |
| Prim       | O(V²)      | MST from selected node             |
| BFS        | O(V + E)   | Level-wise traversal               |
| DFS        | O(V + E)   | Deep traversal                     |
| BST Ops    | O(h)       | Product management                 |
| Union-Find | ~O(1)      | Cycle detection                    |

---

## 🛠 Tech Stack

### 🔹 Backend

* **C++** (STL, Data Structures, Algorithms)

### 🔹 Frontend

* **HTML**
* **CSS**
* **JavaScript**

### 🔹 Visualization

* DOM-based Node System

### 🔹 Deployment

* Vercel

---

## 📁 Project Structure

```
ADS final project/
├── index.html
├── style.css
├── script.js
├── warehouse.cpp
└── README.md
```

---

## 🚀 Getting Started

### Run Web UI

```bash
git clone https://github.com/AryanLad17/Warehouse-Smart-Warehouse-System.git
cd Warehouse-Smart-Warehouse-System
```

Open:

```bash
index.html
```

---

### Run C++ Backend (Optional)

```bash
g++ -o warehouse warehouse.cpp
./warehouse
```

---

## 📘 Usage Guide

1. Insert products into racks
2. Add edges between racks
3. Find shortest path
4. Dispatch robot
5. Transfer products
6. Click nodes to inspect racks

---

## 🏗 Architecture

```
Frontend (HTML/CSS/JS)
        ↓
Graph Visualization + Animation
        ↓
Algorithm Execution (JS / C++)
        ↓
Data Structures (BST + Graph)
```

---

## 🗃 Data Structures Used

| Data Structure | Usage                    |
| -------------- | ------------------------ |
| BST            | Product storage & search |
| Graph          | Warehouse layout         |
| Adjacency List | Edge storage             |
| Matrix         | Distance lookup          |
| Union-Find     | Cycle detection          |
| Queue          | BFS                      |
| Stack          | DFS                      |

---

## 🎯 Conclusion

This project demonstrates how multiple **data structures and algorithms** can be integrated to build a real-world system for warehouse automation.

> This project goes beyond visualization by simulating real-world warehouse operations, combining algorithmic efficiency with interactive system design.

---

## 🙌 Author

**Aryan Lad**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
