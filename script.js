// =============================================================
//  SMART WAREHOUSE — Full Graph Algorithm Engine + Interactivity
//  Dijkstra | Kruskal | Prim | BFS | DFS | Lookup | Inventory
//  Clickable Nodes | Rack Popup | Dynamic Edge Add | Animations
// =============================================================

// ──────────────── GRAPH DATA ────────────────
const graphData = {
  nodes: [
    { id: 0, x: 15, y: 50, label: "0" },
    { id: 1, x: 42, y: 20, label: "1" },
    { id: 2, x: 42, y: 78, label: "2" },
    { id: 3, x: 75, y: 25, label: "3" },
    { id: 4, x: 75, y: 72, label: "4" }
  ],
  edges: [
    { u: 0, v: 1, w: 10 },
    { u: 0, v: 2, w: 15 },
    { u: 1, v: 2, w: 5  },
    { u: 1, v: 3, w: 20 },
    { u: 2, v: 3, w: 25 },
    { u: 2, v: 4, w: 20 },
    { u: 3, v: 4, w: 10 }
  ]
};

// Inventory per node (simulates BST storage)
const nodeInventories = { 0: [], 1: [], 2: [], 3: [], 4: [] };

// ──────────────── APPLICATION STATE ────────────────
let currentPath = [];
let currentDistance = 0;
let isAnimating = false;
let selectedNodeId = null; // currently selected node for popup

// ──────────────── DOM REFERENCES ────────────────
const nodesContainer = document.getElementById('nodesContainer');
const edgesGroup     = document.getElementById('edgesGroup');
const robot          = document.getElementById('robot');
const activityLog    = document.getElementById('activityLog');
const visBadge       = document.getElementById('visBadge');

const navItems       = document.querySelectorAll('.nav-item');
const viewSections   = document.querySelectorAll('.view-section');

// Stats
const statAlgoValue  = document.getElementById('statAlgoValue');
const statCostValue  = document.getElementById('statCostValue');
const statEdgesValue = document.getElementById('statEdgesValue');
const statNodesValue = document.getElementById('statNodesValue');

// Rack Popup
const rackPopup         = document.getElementById('rackPopup');
const rackPopupTitle     = document.getElementById('rackPopupTitle');
const rackPopupClose     = document.getElementById('rackPopupClose');
const rackStatProducts   = document.getElementById('rackStatProducts');
const rackStatQty        = document.getElementById('rackStatQty');
const rackStatEdges      = document.getElementById('rackStatEdges');
const rackProductList    = document.getElementById('rackProductList');
const rackConnectionList = document.getElementById('rackConnectionList');

// ──────────────── INITIALIZATION ────────────────
function init() {
  createParticles();
  renderGraph();
  setupEventListeners();
  updateNodeLabels();
  updateStats('—', '—');
  typeLog("> System initialized. Click any rack node to inspect it!");
}

// ──────────────── BACKGROUND PARTICLES ────────────────
function createParticles() {
  const container = document.getElementById('bgParticles');
  const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6', '#06b6d4', '#f43f5e'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.background = color;
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (Math.random() * 15 + 10) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.boxShadow = `0 0 ${size * 3}px ${color}`;
    container.appendChild(p);
  }
}

// ──────────────── GRAPH RENDERING ────────────────
function renderGraph() {
  nodesContainer.innerHTML = '';
  edgesGroup.innerHTML = '';

  // Draw edges
  graphData.edges.forEach(edge => {
    const nU = graphData.nodes.find(n => n.id === edge.u);
    const nV = graphData.nodes.find(n => n.id === edge.v);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', `${nU.x}%`);
    line.setAttribute('y1', `${nU.y}%`);
    line.setAttribute('x2', `${nV.x}%`);
    line.setAttribute('y2', `${nV.y}%`);
    line.setAttribute('class', 'edge-line');
    line.setAttribute('id', `edge-${edge.u}-${edge.v}`);
    edgesGroup.appendChild(line);

    // Calculate midpoint
    let midX = (nU.x + nV.x) / 2;
    let midY = (nU.y + nV.y) / 2;
    
    // Calculate direction vector
    let dx = nV.x - nU.x;
    let dy = nV.y - nU.y;
    let len = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate perpendicular normal vector (nx, ny)
    let nx = -dy / len;
    let ny = dx / len;
    
    // Ensure the label always offsets towards the "top" or "left" side consistently
    if (ny > 0 || (Math.abs(ny) < 0.001 && nx < 0)) {
      nx = -nx;
      ny = -ny;
    }
    
    // Set an offset in percentage (adjust as needed for aesthetics)
    let offset = 2.5;

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', `${midX + nx * offset}%`);
    text.setAttribute('y', `${midY + ny * offset}%`); 
    text.setAttribute('dominant-baseline', 'central');
    text.setAttribute('class', 'edge-weight');
    text.setAttribute('id', `weight-${edge.u}-${edge.v}`);
    text.textContent = edge.w;
    edgesGroup.appendChild(text);
  });

  // Draw nodes (with click handlers)
  graphData.nodes.forEach(node => {
    const div = document.createElement('div');
    div.className = 'node';
    div.id = `node-${node.id}`;
    div.style.left = `${node.x}%`;
    div.style.top = `${node.y}%`;
    div.textContent = node.label;
    div.setAttribute('data-rack-label', 'EMPTY');
    div.setAttribute('data-node-id', node.id);

    // CLICKABLE NODE — opens rack popup
    div.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isAnimating) return;
      handleNodeClick(node.id);
    });

    nodesContainer.appendChild(div);
  });
}

// Render a single new edge (for dynamic Add Edge without full re-render)
function renderSingleEdge(edge) {
  const nU = graphData.nodes.find(n => n.id === edge.u);
  const nV = graphData.nodes.find(n => n.id === edge.v);

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', `${nU.x}%`);
  line.setAttribute('y1', `${nU.y}%`);
  line.setAttribute('x2', `${nV.x}%`);
  line.setAttribute('y2', `${nV.y}%`);
  line.setAttribute('class', 'edge-line edge-new');
  line.setAttribute('id', `edge-${edge.u}-${edge.v}`);
  edgesGroup.appendChild(line);

    // Calculate midpoint
    let midX = (nU.x + nV.x) / 2;
    let midY = (nU.y + nV.y) / 2;
    
    // Calculate direction vector
    let dx = nV.x - nU.x;
    let dy = nV.y - nU.y;
    let len = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate perpendicular normal vector
    let nx = -dy / len;
    let ny = dx / len;
    
    // Ensure the label always offsets towards the top/left consistently
    if (ny > 0 || (Math.abs(ny) < 0.001 && nx < 0)) {
      nx = -nx;
      ny = -ny;
    }
    
    let offset = 2.5;

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', `${midX + nx * offset}%`);
    text.setAttribute('y', `${midY + ny * offset}%`);
    text.setAttribute('dominant-baseline', 'central');
    text.setAttribute('class', 'edge-weight');
    text.setAttribute('id', `weight-${edge.u}-${edge.v}`);
  text.textContent = edge.w;
  text.style.opacity = '0';
  text.style.transition = 'opacity 0.5s ease 0.3s';
  edgesGroup.appendChild(text);

  // Fade in the weight label
  requestAnimationFrame(() => {
    text.style.opacity = '1';
  });

  // Remove the flash class after animation
  setTimeout(() => {
    line.classList.remove('edge-new');
  }, 1500);
}

function updateNodeLabels() {
  graphData.nodes.forEach(n => {
    const div = document.getElementById(`node-${n.id}`);
    const count = nodeInventories[n.id].length;
    div.setAttribute('data-rack-label', count > 0 ? `${count} ITEM${count > 1 ? 'S' : ''}` : 'EMPTY');
  });

  const list = document.getElementById('inventoryList');
  list.innerHTML = '';
  let total = 0;
  for (let i = 0; i < 5; i++) {
    nodeInventories[i].forEach(item => {
      list.innerHTML += `<li>
        <span><span class="inv-rack">Rack ${i}</span> ${item.name}</span>
        <span class="inv-qty">×${item.quantity}</span>
      </li>`;
      total++;
    });
  }
  if (total === 0) {
    list.innerHTML = `<li><span style="color:var(--text-muted)">No items inserted yet.</span></li>`;
  }
}

// ──────────────── NODE CLICK → RACK POPUP ────────────────
function handleNodeClick(nodeId) {
  // Click animation
  const el = document.getElementById(`node-${nodeId}`);
  el.classList.remove('node-clicked');
  void el.offsetWidth;
  el.classList.add('node-clicked');

  // Select the node
  document.querySelectorAll('.node').forEach(n => n.classList.remove('node-selected'));
  el.classList.add('node-selected');
  selectedNodeId = nodeId;

  // Populate popup data
  populateRackPopup(nodeId);

  // Show popup with animation
  rackPopup.classList.add('visible');

  typeLog(`> 📦 Inspecting Rack ${nodeId}. Click ✕ to close.`);
}

function populateRackPopup(nodeId) {
  rackPopupTitle.textContent = `Rack ${nodeId} — Node ${nodeId}`;

  const items = nodeInventories[nodeId];
  const totalQty = items.reduce((sum, p) => sum + p.quantity, 0);

  // Count connections
  const connections = graphData.edges.filter(e => e.u === nodeId || e.v === nodeId);

  // Stats
  rackStatProducts.textContent = items.length;
  rackStatQty.textContent = totalQty;
  rackStatEdges.textContent = connections.length;

  // Reset animations by re-rendering stats
  document.querySelectorAll('.rack-stat').forEach(el => {
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
  });

  // Product list
  rackProductList.innerHTML = '';
  if (items.length === 0) {
    rackProductList.innerHTML = '<li class="rack-empty-msg">No products stored in this rack</li>';
  } else {
    items.forEach((item, idx) => {
      const li = document.createElement('li');
      li.style.animationDelay = `${0.2 + idx * 0.08}s`;
      li.innerHTML = `
        <span class="rack-product-name">${item.name}</span>
        <span class="rack-product-qty">×${item.quantity}</span>
      `;
      rackProductList.appendChild(li);
    });
  }

  // Connection tags
  rackConnectionList.innerHTML = '';
  connections.forEach((edge, idx) => {
    const otherNode = edge.u === nodeId ? edge.v : edge.u;
    const tag = document.createElement('div');
    tag.className = 'rack-connection-tag';
    tag.style.animationDelay = `${0.25 + idx * 0.08}s`;
    tag.innerHTML = `Node ${otherNode} <span class="rack-connection-weight">w:${edge.w}</span>`;
    tag.addEventListener('click', () => {
      closeRackPopup();
      setTimeout(() => handleNodeClick(otherNode), 300);
    });
    rackConnectionList.appendChild(tag);
  });
}

function closeRackPopup() {
  rackPopup.classList.remove('visible');

  // Deselect node
  if (selectedNodeId !== null) {
    const el = document.getElementById(`node-${selectedNodeId}`);
    if (el) el.classList.remove('node-selected', 'node-clicked');
    selectedNodeId = null;
  }
}

// ──────────────── EVENT LISTENERS ────────────────
function setupEventListeners() {
  // Navigation
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      if (isAnimating) return;
      const target = e.currentTarget;
      navItems.forEach(n => n.classList.remove('active'));
      viewSections.forEach(s => { s.classList.remove('active-view'); s.classList.add('hidden-view'); });

      target.classList.add('active');
      const targetId = target.getAttribute('data-target');
      const section = document.getElementById(targetId);
      section.classList.remove('hidden-view');
      section.classList.add('active-view');

      resetVisualization();
      closeRackPopup();
      typeLog(`> Switched to ${target.textContent.trim()} mode.`);

      // Auto-populate transfer dropdown when switching to Transfer tab
      if (targetId === 'view-transfer') {
        populateTransferProducts();
      }
    });
  });

  // Buttons
  document.getElementById('btnInsert').addEventListener('click', handleInsert);
  document.getElementById('btnAddEdge').addEventListener('click', handleAddEdge);
  document.getElementById('btnShortestPath').addEventListener('click', handleFindShortestPath);
  document.getElementById('btnSimulate').addEventListener('click', handleSimulateDijkstra);
  document.getElementById('btnShowKruskal').addEventListener('click', handleShowKruskalMST);
  document.getElementById('btnShowPrimMST').addEventListener('click', handleShowPrimMST);
  document.getElementById('btnRunBFS').addEventListener('click', handleRunBFS);
  document.getElementById('btnLookup').addEventListener('click', handleLookup);
  document.getElementById('btnUpdateQty').addEventListener('click', handleUpdateQty);
  document.getElementById('btnReset').addEventListener('click', () => { resetVisualization(); closeRackPopup(); });

  // Transfer controls
  document.getElementById('btnTransfer').addEventListener('click', handleTransfer);
  document.getElementById('transferFrom').addEventListener('change', populateTransferProducts);
  document.getElementById('transferFrom').addEventListener('input', populateTransferProducts);
  document.getElementById('transferTo').addEventListener('change', updateTransferPreview);
  document.getElementById('transferTo').addEventListener('input', updateTransferPreview);
  document.getElementById('transferProduct').addEventListener('change', updateTransferPreview);
  document.getElementById('transferQty').addEventListener('input', updateTransferPreview);

  // Rack popup close
  rackPopupClose.addEventListener('click', closeRackPopup);

  // Close popup when clicking the backdrop area (not the inner card)
  rackPopup.addEventListener('click', (e) => {
    // Only close if clicked directly on the overlay, not on inner content
    if (e.target === rackPopup) {
      closeRackPopup();
    }
  });

  // Button ripple effects
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', createBtnRipple);
  });
}

// ──────────────── BUTTON RIPPLE EFFECT ────────────────
function createBtnRipple(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'btn-ripple';
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

// ──────────────── 1. INVENTORY INSERT ────────────────
function handleInsert() {
  if (isAnimating) return;
  const name = document.getElementById('invProductName').value.trim();
  const qty  = parseInt(document.getElementById('invQuantity').value);
  const rack = parseInt(document.getElementById('invRack').value);

  if (!name || isNaN(qty) || qty < 1 || isNaN(rack) || rack < 0 || rack > 4) {
    typeLog("> ❌ Error: Invalid product name, quantity, or rack number.");
    shakeElement(document.getElementById('btnInsert'));
    return;
  }

  // Check if product already exists at this rack — update quantity
  const existing = nodeInventories[rack].find(p => p.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    existing.quantity += qty;
    typeLog(`> ✅ Updated "${name}" at Rack ${rack}. New Qty: ${existing.quantity}`);
  } else {
    nodeInventories[rack].push({ name, quantity: qty });
    typeLog(`> ✅ Inserted "${name}" (×${qty}) into Rack ${rack}.`);
  }

  updateNodeLabels();

  // Animated flash on the node
  const el = document.getElementById(`node-${rack}`);
  el.classList.remove('insert-flash', 'active-dest');
  void el.offsetWidth;
  el.classList.add('insert-flash');
  setTimeout(() => el.classList.remove('insert-flash'), 1200);

  // If popup is open for this rack, refresh it
  if (selectedNodeId === rack && rackPopup.classList.contains('visible')) {
    populateRackPopup(rack);
  }

  // Clear input
  document.getElementById('invProductName').value = '';

  // Refresh transfer dropdown if transfer tab is active
  const transferView = document.getElementById('view-transfer');
  if (transferView && transferView.classList.contains('active-view')) {
    populateTransferProducts();
  }
}

// ──────────────── 1b. ADD EDGE (Dynamic) ────────────────
function handleAddEdge() {
  if (isAnimating) return;
  const from   = parseInt(document.getElementById('edgeFrom').value);
  const to     = parseInt(document.getElementById('edgeTo').value);
  const weight = parseInt(document.getElementById('edgeWeight').value);

  if (isNaN(from) || isNaN(to) || isNaN(weight) || from < 0 || from > 4 || to < 0 || to > 4 || from === to || weight < 1) {
    typeLog("> ❌ Invalid edge parameters. Nodes must be 0-4, different, weight > 0.");
    shakeElement(document.getElementById('btnAddEdge'));
    return;
  }

  // Check if edge already exists
  const exists = graphData.edges.find(e =>
    (e.u === from && e.v === to) || (e.u === to && e.v === from)
  );
  if (exists) {
    // Update weight instead
    exists.w = weight;
    // Update visual
    const wgtEl = document.getElementById(`weight-${exists.u}-${exists.v}`) || document.getElementById(`weight-${exists.v}-${exists.u}`);
    if (wgtEl) {
      wgtEl.textContent = weight;
      wgtEl.style.fill = 'var(--emerald-400)';
      setTimeout(() => wgtEl.style.fill = '', 1500);
    }
    const lineEl = document.getElementById(`edge-${exists.u}-${exists.v}`) || document.getElementById(`edge-${exists.v}-${exists.u}`);
    if (lineEl) {
      lineEl.classList.add('edge-new');
      setTimeout(() => lineEl.classList.remove('edge-new'), 1500);
    }
    typeLog(`> ✏️ Edge ${from}↔${to} weight updated to ${weight}.`);
  } else {
    // Add new edge
    const newEdge = { u: from, v: to, w: weight };
    graphData.edges.push(newEdge);
    renderSingleEdge(newEdge);
    typeLog(`> ✅ New edge added: Node ${from} ↔ Node ${to} (weight: ${weight}).`);
  }

  updateStats('—', '—');

  // Flash the connected nodes
  [from, to].forEach(nId => {
    const el = document.getElementById(`node-${nId}`);
    el.classList.remove('insert-flash');
    void el.offsetWidth;
    el.classList.add('insert-flash');
    setTimeout(() => el.classList.remove('insert-flash'), 1200);
  });
}

// ──────────────── 2. DIJKSTRA SHORTEST PATH ────────────────
function handleFindShortestPath() {
  if (isAnimating) return;
  resetVisualization();
  closeRackPopup();

  const startId = parseInt(document.getElementById('startNode').value);
  const destId  = parseInt(document.getElementById('destNode').value);
  if (isNaN(startId) || isNaN(destId) || startId < 0 || destId > 4 || startId === destId) {
    typeLog("> ❌ Invalid nodes. Ensure start ≠ destination, both 0-4.");
    return;
  }

  const result = runDijkstra(startId, destId);
  currentPath = result.path;
  currentDistance = result.dist;

  if (currentPath.length > 0) {
    highlightPath(currentPath, 'path-active');

    // Animate nodes along path with stagger
    currentPath.forEach((nodeId, idx) => {
      setTimeout(() => {
        const el = document.getElementById(`node-${nodeId}`);
        el.classList.add(idx === currentPath.length - 1 ? 'active-dest' : 'active-path');
      }, idx * 200);
    });

    updateStats('Dijkstra', currentDistance);
    typeLog(`> 🗺️ Dijkstra: [${currentPath.join(" → ")}] Distance: ${currentDistance}`);
  } else {
    typeLog("> ⚠️ No path found between the given nodes.");
  }
}

async function handleSimulateDijkstra() {
  if (isAnimating) return;
  if (currentPath.length < 2) {
    typeLog("> ❌ Calculate shortest path first!");
    return;
  }

  isAnimating = true;
  setBadge('RUNNING', true);
  closeRackPopup();
  typeLog(`> 🚀 Dispatching robot along path...`);

  robot.style.transition = 'top 0.8s cubic-bezier(0.16,1,0.3,1), left 0.8s cubic-bezier(0.16,1,0.3,1)';
  robot.classList.remove('hidden');

  for (let i = 0; i < currentPath.length; i++) {
    const nodeId = currentPath[i];
    const nodeObj = graphData.nodes.find(n => n.id === nodeId);
    robot.style.left = `${nodeObj.x}%`;
    robot.style.top  = `${nodeObj.y}%`;

    const el = document.getElementById(`node-${nodeId}`);
    el.classList.add(i === currentPath.length - 1 ? 'active-dest' : 'active-path');

    // Pop animation on each visited node
    el.classList.remove('node-clicked');
    void el.offsetWidth;
    el.classList.add('node-clicked');

    await sleep(900);
  }

  typeLog(`> ✅ Robot arrived at Node ${currentPath[currentPath.length - 1]}.`);
  setBadge('COMPLETE', false);
  isAnimating = false;
}

// ──────────────── 3. KRUSKAL MST ────────────────
function handleShowKruskalMST() {
  if (isAnimating) return;
  resetVisualization();
  closeRackPopup();

  const result = runKruskalMST();
  let totalCost = 0;

  result.forEach((e, idx) => {
    setTimeout(() => {
      let edge = document.getElementById(`edge-${e.u}-${e.v}`) || document.getElementById(`edge-${e.v}-${e.u}`);
      let wgt  = document.getElementById(`weight-${e.u}-${e.v}`) || document.getElementById(`weight-${e.v}-${e.u}`);
      if (edge) edge.classList.add('kruskal-active');
      if (wgt)  wgt.classList.add('kruskal-active');
    }, idx * 300);
    totalCost += e.w;
  });

  updateStats('Kruskal MST', totalCost);
  typeLog(`> 🌐 Kruskal MST: ${result.length} edges, Total cost: ${totalCost}`);
}

// ──────────────── 4. PRIM MST ────────────────
function handleShowPrimMST() {
  if (isAnimating) return;
  resetVisualization();
  closeRackPopup();

  const startId = parseInt(document.getElementById('mstStartNode').value);
  if (isNaN(startId) || startId < 0 || startId > 4) return;

  const result = runPrimMST(startId);
  let totalCost = 0;

  result.forEach((e, idx) => {
    const origEdge = graphData.edges.find(oe =>
      (oe.u === e.u && oe.v === e.v) || (oe.u === e.v && oe.v === e.u)
    );
    if (origEdge) totalCost += origEdge.w;

    setTimeout(() => {
      let edge = document.getElementById(`edge-${e.u}-${e.v}`) || document.getElementById(`edge-${e.v}-${e.u}`);
      let wgt  = document.getElementById(`weight-${e.u}-${e.v}`) || document.getElementById(`weight-${e.v}-${e.u}`);
      if (edge) edge.classList.add('prim-active');
      if (wgt)  wgt.classList.add('prim-active');
    }, idx * 300);
  });

  updateStats("Prim's MST", totalCost);
  typeLog(`> ⚡ Prim's MST from Node ${startId}: ${result.length} edges, Cost: ${totalCost}`);
}

// ──────────────── 5. BFS ────────────────
async function handleRunBFS() {
  if (isAnimating) return;
  resetVisualization();
  closeRackPopup();

  const startId = parseInt(document.getElementById('bfsStartNode').value);
  if (isNaN(startId) || startId < 0 || startId > 4) return;

  isAnimating = true;
  setBadge('RUNNING', true);
  updateStats('BFS', '—');
  typeLog(`> 🔍 BFS sweep from Node ${startId}...`);

  robot.style.transition = 'top 0.5s ease-out, left 0.5s ease-out';
  robot.classList.remove('hidden');

  const visited = new Set();
  const queue = [startId];
  visited.add(startId);
  const order = [];

  while (queue.length > 0) {
    const u = queue.shift();
    const uNode = graphData.nodes.find(n => n.id === u);
    order.push(u);

    robot.style.left = `${uNode.x}%`;
    robot.style.top  = `${uNode.y}%`;
    await sleep(450);

    const el = document.getElementById(`node-${u}`);
    el.classList.add('bfs-ripple');
    typeLog(`> BFS visiting: Node ${u}`);
    await sleep(700);

    // Explore neighbors
    graphData.edges.forEach(e => {
      if (e.u === u && !visited.has(e.v)) {
        visited.add(e.v);
        queue.push(e.v);
        edgeHighlight(e.u, e.v, 'bfs-active-edge');
      } else if (e.v === u && !visited.has(e.u)) {
        visited.add(e.u);
        queue.push(e.u);
        edgeHighlight(e.u, e.v, 'bfs-active-edge');
      }
    });
  }

  updateStats('BFS', `Order: ${order.join('→')}`);
  typeLog(`> ✅ BFS Complete: [${order.join(' → ')}]`);
  setBadge('COMPLETE', false);
  isAnimating = false;
}

// ──────────────── 7. PRODUCT LOOKUP & UPDATE ────────────────
let lastLookupResult = null;

function handleLookup() {
  if (isAnimating) return;
  resetVisualization();

  const name = document.getElementById('lookupProduct').value.trim();
  if (!name) { typeLog("> ❌ Enter a product name to search."); return; }

  const resultDiv = document.getElementById('lookupResult');
  const updateSection = document.getElementById('updateSection');
  resultDiv.classList.remove('hidden', 'found', 'not-found');

  const matches = [];
  for (let rack = 0; rack < 5; rack++) {
    nodeInventories[rack].forEach(item => {
      if (item.name.toLowerCase() === name.toLowerCase()) {
        matches.push({ rack, name: item.name, quantity: item.quantity, ref: item });
      }
    });
  }

  if (matches.length > 0) {
    resultDiv.classList.add('found');
    let html = `<strong>✅ Found "${name}"</strong><br>`;
    matches.forEach(m => {
      html += `📍 Rack ${m.rack} — Qty: <strong>${m.quantity}</strong><br>`;
      const nodeEl = document.getElementById(`node-${m.rack}`);
      nodeEl.classList.add('lookup-highlight');
    });
    resultDiv.innerHTML = html;
    updateSection.style.display = 'flex';
    lastLookupResult = matches;

    updateStats('Lookup', `Found at ${matches.map(m => 'Rack ' + m.rack).join(', ')}`);
    typeLog(`> 🏷️ Product "${name}" found in ${matches.length} location(s).`);
  } else {
    resultDiv.classList.add('not-found');
    resultDiv.innerHTML = `<strong>❌ "${name}" not found</strong> in any rack.`;
    updateSection.style.display = 'none';
    lastLookupResult = null;
    typeLog(`> ⚠️ Product "${name}" not found in warehouse.`);
  }
}

function handleUpdateQty() {
  if (!lastLookupResult || lastLookupResult.length === 0) return;
  const delta = parseInt(document.getElementById('updateQty').value);
  if (isNaN(delta)) { typeLog("> ❌ Invalid quantity value."); return; }

  lastLookupResult.forEach(m => {
    m.ref.quantity += delta;
    if (m.ref.quantity < 0) m.ref.quantity = 0;
  });

  updateNodeLabels();
  typeLog(`> ✏️ Updated quantity by ${delta >= 0 ? '+' : ''}${delta} for "${lastLookupResult[0].name}".`);

  // Flash updated nodes
  lastLookupResult.forEach(m => {
    const el = document.getElementById(`node-${m.rack}`);
    el.classList.remove('insert-flash');
    void el.offsetWidth;
    el.classList.add('insert-flash');
    setTimeout(() => el.classList.remove('insert-flash'), 1200);
  });

  handleLookup();
}

// ──────────────── ALGORITHM IMPLEMENTATIONS ────────────────

// Dijkstra's Shortest Path
function runDijkstra(start, dest) {
  const dist = {};
  const prev = {};
  const pq = new Set(graphData.nodes.map(n => n.id));

  graphData.nodes.forEach(n => { dist[n.id] = Infinity; prev[n.id] = null; });
  dist[start] = 0;

  while (pq.size > 0) {
    let u = null, minD = Infinity;
    pq.forEach(id => { if (dist[id] < minD) { minD = dist[id]; u = id; } });

    if (u === null || u === dest) break;
    pq.delete(u);

    graphData.edges.forEach(edge => {
      let v = null;
      if (edge.u === u && pq.has(edge.v)) v = edge.v;
      else if (edge.v === u && pq.has(edge.u)) v = edge.u;

      if (v !== null) {
        const alt = dist[u] + edge.w;
        if (alt < dist[v]) { dist[v] = alt; prev[v] = u; }
      }
    });
  }

  const path = [];
  let curr = dest;
  if (prev[curr] !== null || curr === start) {
    while (curr !== null) { path.unshift(curr); curr = prev[curr]; }
  }
  return { path, dist: dist[dest] };
}

// Kruskal's MST (Union-Find)
function runKruskalMST() {
  const parent = {};
  const rank = {};
  graphData.nodes.forEach(n => { parent[n.id] = n.id; rank[n.id] = 0; });

  function find(x) {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function unite(x, y) {
    const px = find(x), py = find(y);
    if (px === py) return false;
    if (rank[px] < rank[py]) parent[px] = py;
    else if (rank[px] > rank[py]) parent[py] = px;
    else { parent[py] = px; rank[px]++; }
    return true;
  }

  const sortedEdges = [...graphData.edges].sort((a, b) => a.w - b.w);
  const mst = [];

  for (const edge of sortedEdges) {
    if (unite(edge.u, edge.v)) {
      mst.push(edge);
      if (mst.length === graphData.nodes.length - 1) break;
    }
  }

  return mst;
}

// Prim's MST
function runPrimMST(start) {
  const mstSet = new Set();
  const edgesInMST = [];
  const keys = {};
  const parentMap = {};

  graphData.nodes.forEach(n => keys[n.id] = Infinity);
  keys[start] = 0;
  parentMap[start] = null;

  for (let count = 0; count < graphData.nodes.length; count++) {
    let u = -1, minKey = Infinity;
    graphData.nodes.forEach(n => {
      if (!mstSet.has(n.id) && keys[n.id] < minKey) {
        minKey = keys[n.id];
        u = n.id;
      }
    });

    if (u === -1) break;
    mstSet.add(u);

    if (parentMap[u] !== null && parentMap[u] !== undefined) {
      edgesInMST.push({ u: parentMap[u], v: u });
    }

    graphData.edges.forEach(e => {
      let v = null;
      if (e.u === u) v = e.v;
      else if (e.v === u) v = e.u;

      if (v !== null && !mstSet.has(v) && e.w < keys[v]) {
        keys[v] = e.w;
        parentMap[v] = u;
      }
    });
  }

  return edgesInMST;
}

// ──────────────── HELPER FUNCTIONS ────────────────

function highlightPath(path, className) {
  for (let i = 0; i < path.length - 1; i++) {
    const u = path[i], v = path[i + 1];
    let edge = document.getElementById(`edge-${u}-${v}`) || document.getElementById(`edge-${v}-${u}`);
    let wgt  = document.getElementById(`weight-${u}-${v}`) || document.getElementById(`weight-${v}-${u}`);
    if (edge) edge.classList.add(className);
    if (wgt)  wgt.classList.add(className);
  }
}

function edgeHighlight(u, v, className) {
  let edge = document.getElementById(`edge-${u}-${v}`) || document.getElementById(`edge-${v}-${u}`);
  if (edge) edge.classList.add(className);
}

function resetVisualization() {
  robot.classList.add('hidden');
  robot.style.transition = 'none';
  requestAnimationFrame(() => robot.style.transition = '');

  document.querySelectorAll('.node').forEach(el => {
    el.classList.remove('active-path', 'active-dest', 'bfs-ripple', 'dfs-glow', 'lookup-highlight', 'node-clicked', 'node-selected', 'insert-flash', 'transfer-source', 'transfer-dest', 'qty-decrease', 'qty-increase');
  });
  document.querySelectorAll('.edge-line, .edge-weight').forEach(el => {
    el.classList.remove('path-active', 'kruskal-active', 'prim-active', 'bfs-active-edge', 'dfs-active-edge', 'edge-new', 'transfer-path-active');
  });

  // Remove cargo label
  const cargo = document.getElementById('robotCargo');
  if (cargo) { cargo.classList.remove('visible'); cargo.textContent = ''; }

  // Remove any transfer toast
  document.querySelectorAll('.transfer-complete-toast').forEach(el => el.remove());

  currentPath = [];
  updateNodeLabels();
  setBadge('IDLE', false);
}

function typeLog(message) {
  activityLog.classList.remove('log-line');
  void activityLog.offsetWidth;
  activityLog.textContent = message;
  activityLog.classList.add('log-line');
}

function updateStats(algo, cost) {
  statAlgoValue.textContent = algo;
  statCostValue.textContent = cost;
  statEdgesValue.textContent = graphData.edges.length;
  statNodesValue.textContent = graphData.nodes.length;
}

function setBadge(text, active) {
  visBadge.textContent = text;
  visBadge.classList.toggle('active', active);
}

function shakeElement(el) {
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = 'shake 0.4s ease';
  el.style.setProperty('--shake-keyframes', '');
  setTimeout(() => el.style.animation = '', 400);
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// ──────────────── 8. PRODUCT TRANSFER ────────────────

function populateTransferProducts() {
  const fromRack = parseInt(document.getElementById('transferFrom').value);
  const select = document.getElementById('transferProduct');
  select.innerHTML = '';

  if (isNaN(fromRack) || fromRack < 0 || fromRack > 4 || nodeInventories[fromRack].length === 0) {
    select.innerHTML = '<option value="">— No products in this rack —</option>';
    updateTransferPreview();
    return;
  }

  select.innerHTML = '<option value="">— Select a product —</option>';
  nodeInventories[fromRack].forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.name;
    opt.textContent = `${item.name} (×${item.quantity})`;
    select.appendChild(opt);
  });

  updateTransferPreview();
}

function updateTransferPreview() {
  const body = document.getElementById('transferPreviewBody');
  const fromRack = parseInt(document.getElementById('transferFrom').value);
  const toRack = parseInt(document.getElementById('transferTo').value);
  const productName = document.getElementById('transferProduct').value;
  const qty = parseInt(document.getElementById('transferQty').value);

  if (!productName || isNaN(fromRack) || isNaN(toRack) || isNaN(qty) || qty < 1) {
    body.innerHTML = '<span class="text-muted">Select a product to see preview</span>';
    return;
  }

  const sourceItem = nodeInventories[fromRack]?.find(p => p.name.toLowerCase() === productName.toLowerCase());
  if (!sourceItem) {
    body.innerHTML = '<span class="text-muted">Product not found in source rack</span>';
    return;
  }

  const moveQty = Math.min(qty, sourceItem.quantity);
  const destItem = nodeInventories[toRack]?.find(p => p.name.toLowerCase() === productName.toLowerCase());
  const destQtyBefore = destItem ? destItem.quantity : 0;

  body.innerHTML = `
    <div class="preview-row">
      <span class="preview-label">Product</span>
      <span class="preview-value">${productName}</span>
    </div>
    <div class="preview-row">
      <span class="preview-label">Moving</span>
      <span class="preview-value" style="color:var(--orange-400)">×${moveQty}</span>
    </div>
    <div class="preview-arrow">⬇</div>
    <div class="preview-before">
      <strong>Before:</strong><br>
      Rack ${fromRack} → ${productName}: ${sourceItem.quantity}<br>
      Rack ${toRack} → ${productName}: ${destQtyBefore}
    </div>
    <div class="preview-arrow">⬇ 🚚</div>
    <div class="preview-after">
      <strong>After:</strong><br>
      Rack ${fromRack} → ${productName}: ${sourceItem.quantity - moveQty}<br>
      Rack ${toRack} → ${productName}: ${destQtyBefore + moveQty}
    </div>
  `;
}

function addTransferLog(message) {
  const log = document.getElementById('transferLog');
  const entry = document.createElement('div');
  entry.className = 'transfer-log-entry';
  entry.textContent = message;
  log.prepend(entry);

  // Limit entries
  while (log.children.length > 20) {
    log.removeChild(log.lastChild);
  }
}

async function handleTransfer() {
  if (isAnimating) return;

  const fromRack = parseInt(document.getElementById('transferFrom').value);
  const toRack = parseInt(document.getElementById('transferTo').value);
  const productName = document.getElementById('transferProduct').value;
  const qty = parseInt(document.getElementById('transferQty').value);

  // Validation
  if (isNaN(fromRack) || isNaN(toRack) || fromRack < 0 || fromRack > 4 || toRack < 0 || toRack > 4) {
    typeLog('> ❌ Invalid rack numbers. Must be 0-4.');
    shakeElement(document.getElementById('btnTransfer'));
    return;
  }
  if (fromRack === toRack) {
    typeLog('> ❌ Source and destination must be different.');
    shakeElement(document.getElementById('btnTransfer'));
    return;
  }
  if (!productName) {
    typeLog('> ❌ Select a product to transfer.');
    shakeElement(document.getElementById('btnTransfer'));
    return;
  }
  if (isNaN(qty) || qty < 1) {
    typeLog('> ❌ Quantity must be at least 1.');
    shakeElement(document.getElementById('btnTransfer'));
    return;
  }

  const sourceItem = nodeInventories[fromRack].find(p => p.name.toLowerCase() === productName.toLowerCase());
  if (!sourceItem) {
    typeLog(`> ❌ "${productName}" not found in Rack ${fromRack}.`);
    shakeElement(document.getElementById('btnTransfer'));
    return;
  }

  const moveQty = Math.min(qty, sourceItem.quantity);
  if (moveQty <= 0) {
    typeLog(`> ❌ No quantity available to transfer.`);
    shakeElement(document.getElementById('btnTransfer'));
    return;
  }

  // Find the shortest path between the two racks
  const result = runDijkstra(fromRack, toRack);
  if (result.path.length < 2) {
    typeLog(`> ❌ No path exists between Rack ${fromRack} and Rack ${toRack}.`);
    shakeElement(document.getElementById('btnTransfer'));
    return;
  }

  const path = result.path;

  // ─── Start animation ───
  isAnimating = true;
  resetVisualization();
  closeRackPopup();
  setBadge('TRANSFERRING', true);

  addTransferLog(`[${new Date().toLocaleTimeString()}] Transfer started: ${productName} ×${moveQty} from Rack ${fromRack} → Rack ${toRack}`);
  typeLog(`> 🚚 Dispatching transfer: ${productName} ×${moveQty} | Rack ${fromRack} → Rack ${toRack}`);

  // Highlight path
  highlightPath(path, 'transfer-path-active');

  // Mark source and destination nodes
  document.getElementById(`node-${fromRack}`).classList.add('transfer-source');
  document.getElementById(`node-${toRack}`).classList.add('transfer-dest');

  // Show robot with cargo
  const cargo = document.getElementById('robotCargo');
  cargo.textContent = `📦 ${productName} ×${moveQty}`;
  cargo.classList.add('visible');

  robot.style.transition = 'top 0.9s cubic-bezier(0.16,1,0.3,1), left 0.9s cubic-bezier(0.16,1,0.3,1)';
  robot.classList.remove('hidden');

  // Animate robot along path
  for (let i = 0; i < path.length; i++) {
    const nodeId = path[i];
    const nodeObj = graphData.nodes.find(n => n.id === nodeId);
    robot.style.left = `${nodeObj.x}%`;
    robot.style.top = `${nodeObj.y}%`;

    const el = document.getElementById(`node-${nodeId}`);
    el.classList.remove('node-clicked');
    void el.offsetWidth;
    el.classList.add('node-clicked');

    if (i === 0) {
      addTransferLog(`  📍 Picking up from Rack ${nodeId}...`);
    } else if (i === path.length - 1) {
      addTransferLog(`  📍 Arriving at Rack ${nodeId}...`);
    } else {
      addTransferLog(`  🔄 Passing through Rack ${nodeId}...`);
    }

    typeLog(`> 🤖 Robot at Node ${nodeId}${i === path.length - 1 ? ' (destination)' : ''}`);
    await sleep(1000);
  }

  // ─── Perform the inventory transfer ───
  addTransferLog(`  ⏳ Transferring inventory...`);
  await sleep(400);

  // Decrease from source
  sourceItem.quantity -= moveQty;
  const sourceNode = document.getElementById(`node-${fromRack}`);
  sourceNode.classList.remove('qty-decrease', 'transfer-source');
  void sourceNode.offsetWidth;
  sourceNode.classList.add('qty-decrease');
  setTimeout(() => sourceNode.classList.remove('qty-decrease'), 1000);

  // Remove product from source if quantity is 0
  if (sourceItem.quantity <= 0) {
    const idx = nodeInventories[fromRack].indexOf(sourceItem);
    if (idx > -1) nodeInventories[fromRack].splice(idx, 1);
  }

  // Add to destination
  const destItem = nodeInventories[toRack].find(p => p.name.toLowerCase() === productName.toLowerCase());
  if (destItem) {
    destItem.quantity += moveQty;
  } else {
    nodeInventories[toRack].push({ name: sourceItem.name || productName, quantity: moveQty });
  }

  const destNode = document.getElementById(`node-${toRack}`);
  destNode.classList.remove('qty-increase', 'transfer-dest');
  void destNode.offsetWidth;
  destNode.classList.add('qty-increase');
  setTimeout(() => destNode.classList.remove('qty-increase'), 1000);

  // Update visual labels
  updateNodeLabels();

  // Hide cargo
  cargo.classList.remove('visible');
  cargo.textContent = '';

  await sleep(300);

  // Show completion toast on graph
  showTransferToast(productName, moveQty, fromRack, toRack);

  addTransferLog(`  ✅ Transfer complete! ${productName} ×${moveQty}: Rack ${fromRack} → Rack ${toRack}`);
  typeLog(`> ✅ Transfer complete! ${productName} ×${moveQty} moved to Rack ${toRack}.`);

  updateStats('Transfer', `${productName} ×${moveQty}`);
  setBadge('COMPLETE', false);
  isAnimating = false;

  // Refresh the product dropdown
  populateTransferProducts();
  updateTransferPreview();

  // If popup is open for either rack, refresh
  if (selectedNodeId === fromRack || selectedNodeId === toRack) {
    if (rackPopup.classList.contains('visible')) {
      populateRackPopup(selectedNodeId);
    }
  }
}

function showTransferToast(product, qty, from, to) {
  // Remove any existing toast
  document.querySelectorAll('.transfer-complete-toast').forEach(el => el.remove());

  const toast = document.createElement('div');
  toast.className = 'transfer-complete-toast';
  toast.innerHTML = `
    <div class="transfer-toast-icon">✅</div>
    <div class="transfer-toast-title">Transfer Complete</div>
    <div class="transfer-toast-detail">${product} ×${qty}<br>Rack ${from} → Rack ${to}</div>
  `;

  document.getElementById('graphContainer').appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });
  });

  // Auto-dismiss after 3s
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ──────────────── BOOT ────────────────
window.addEventListener('DOMContentLoaded', init);
