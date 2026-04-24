# Truss Calculator Web App - Specification Document

## 1. Overview
A purely client-side JavaScript web application for designing, analyzing, and visualizing 2D pin-jointed trusses. The application will allow users to define truss geometry, assign materials, apply loads and boundary conditions, solve for internal forces using the Direct Stiffness Method, and visualize the results.

## 2. Core Features
*   **Fully Client-Side:** Runs entirely in the browser using HTML/CSS/JavaScript.
*   **Persistent Storage:** Uses browser `localStorage` to automatically save and load the current truss project.
*   **Interactive Visualization:** Renders the truss graphically. Includes color-coded results and interactive tooltips.
*   **Auto-sizing Members:** Automatically calculates the required width (cross-sectional area) of each member to meet a user-defined Safety Factor ($N$) against yielding (tension) and buckling (compression).

## 3. Data Models
The application state will consist of the following entities:

### 3.1. Vertices (Nodes)
*   `id`: Unique identifier.
*   `x`: X-coordinate (spatial).
*   `y`: Y-coordinate (spatial).

### 3.2. Materials
*   `id`: Unique identifier.
*   `name`: Human-readable name (e.g., "Steel A36").
*   `youngsModulus` ($E$): Modulus of elasticity.
*   `yieldStrength` ($\sigma_y$): Stress at which the material yields in tension/compression.

### 3.3. Members (Elements)
*   `id`: Unique identifier.
*   `nodeA`: ID of the starting vertex.
*   `nodeB`: ID of the ending vertex.
*   `materialId`: ID of the assigned material.
*   `profile`: I-beam cross-section parameters (e.g., depth, flange width, thickness). If auto-sized, these maintain a specific ratio.
*   *Computed:* Length, internal force, stress, required cross-section dimensions.

### 3.4. Supports (Boundary Conditions)
*   `nodeId`: ID of the vertex where the support is applied.
*   `fixX`: Boolean, true if restricted from moving in the X direction (e.g., pin or X-roller).
*   `fixY`: Boolean, true if restricted from moving in the Y direction (e.g., pin or Y-roller).

### 3.5. Loads
*   `id`: Unique identifier.
*   `nodeId`: ID of the vertex where the load is applied.
*   `fx`: Force magnitude in the X direction.
*   `fy`: Force magnitude in the Y direction.

### 3.6. Global Settings
*   `safetyFactor` ($N$): Target safety factor for yield and buckling. Default to user input.
*   `unitSystem`: Metric (Distance in meters, Force in Newtons, Stress/Modulus in Pascals).

## 4. User Interface (UI) Modules

### 4.1. Input Panels (Sidebars/Modals)
*   **Vertices Panel:** Table/list to add, edit, or delete vertices ($x, y$).
*   **Materials Panel:** Input for custom materials ($E$, Yield Strength).
*   **Members Panel:** Dropdowns/inputs to connect `nodeA` to `nodeB` and select a material.
*   **Supports Panel:** Toggles for X and Y constraints on specific vertices.
*   **Loads Panel:** Inputs for $F_x$ and $F_y$ on specific vertices.
*   **Settings Panel:** Input for the Safety Factor ($N$).

### 4.2. Results & Visualization Canvas
*   **Rendering:** Uses SVG or HTML5 Canvas for drawing the truss.
*   **Color Mapping:**
    *   🔴 **Red:** Compression members.
    *   🔵 **Blue:** Tension members.
    *   ⚪ **White / Light Gray:** Zero-force or minimally loaded members.
*   **Interactivity:**
    *   Hovering over a member highlights it and displays a tooltip showing:
        *   Member ID / Connected Vertices.
        *   Internal Force (Magnitude & Tension/Compression).
        *   Calculated Width/Area.
*   **Auto-sizing Visuals:** The stroke width of the drawn members will scale proportionally to their calculated required width.

## 5. Calculation Engine (Physics & Mechanics)

### 5.1. Solver
*   Use the **Direct Stiffness Method** for 2D trusses to formulate the global stiffness matrix $[K]$.
*   Apply boundary conditions (Supports) to partition or modify the matrix.
*   Solve $[K]\{U\} = \{F\}$ for nodal displacements $\{U\}$.
*   Calculate internal axial forces for each member based on displacements.

### 5.2. Sizing Algorithm (Auto-Scaling Width)
For each member, calculate the required cross-sectional area ($A$) to satisfy the safety factor $N$:
1.  **Tension Members:**
    *   Required Area $A_{tension} = (Force \times N) / yieldStrength$
2.  **Compression Members:**
    *   Must satisfy both Yielding and Euler Buckling.
    *   Yielding: $A_{yield} = (Force \times N) / yieldStrength$
    *   Buckling: Euler buckling critical load $P_{cr} = (\pi^2 E I) / L^2$.
    *   **Cross-Section:** The solver assumes an **I-beam shape** parameterized by depth, flange width, and thickness. To auto-scale the member while satisfying $P_{cr} / Force \ge N$, the system will proportionally scale the I-beam dimensions (or adjust a primary dimension like depth while keeping thickness ratios constant) to determine the required Moment of Inertia ($I$) and Area ($A$).

## 5.3. Units (Metric)
*   **Distance/Coordinates:** Meters (m)
*   **Force:** Newtons (N)
*   **Pressure/Stress/Modulus:** Pascals (Pa) or Megapascals (MPa) as appropriate in UI, computed in Pa.

## 6. Local Storage Sync
*   On every structural mutation (add/edit/delete vertex, load, member, etc.), serialize the data models to a JSON string.
*   Save to `localStorage.setItem('truss_project', jsonData)`.
*   On page load, attempt to parse `localStorage.getItem('truss_project')` and populate the UI.

## 7. Tech Stack Recommendations
*   **Frontend Framework:** SvelteKit (Minimal setup).
*   **Styling:** Vanilla CSS or Tailwind (if configured in SvelteKit).
*   **Graphics:** SVG for rendering the truss on the client side. Provides native hover events (`onmouseenter`, `onmouseleave`) making tooltips easy to implement.
*   **Math:** `mathjs` for matrix operations (e.g., generating and inverting the global stiffness matrix).