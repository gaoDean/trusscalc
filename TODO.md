# Truss Calculator - Project Todo

**Current Status:** Completed

## Todo List

- [x] **Task 1: Data Stores & Persistence**
  - [x] Create Svelte stores for Vertices, Materials, Members, Supports, Loads, and Settings.
  - [x] Implement reactive synchronization with `localStorage`.
- [x] **Task 2: Basic UI Layout**
  - [x] Setup the main page layout (Sidebar for inputs, main area for SVG Canvas).
- [x] **Task 3: Input Panels**
  - [x] Implement Vertices panel.
  - [x] Implement Materials panel.
  - [x] Implement Members panel.
  - [x] Implement Supports and Loads panels.
  - [x] Implement Settings panel (Safety factor).
- [x] **Task 4: Calculation Engine (Solver)**
  - [x] Formulate Direct Stiffness Method using `mathjs`.
  - [x] Build global stiffness matrix $[K]$.
  - [x] Apply boundary conditions.
  - [x] Solve for displacements and calculate internal forces.
- [x] **Task 5: Auto-Sizing Algorithm**
  - [x] Implement tension sizing based on yield strength.
  - [x] Implement compression sizing based on yield and Euler buckling for an I-beam profile.
- [x] **Task 6: Visualization (SVG Canvas)**
  - [x] Draw vertices and supports.
  - [x] Draw members with dynamic stroke width.
  - [x] Apply color mapping (Red for compression, Blue for tension, White/Gray for zero-force).
- [x] **Task 7: Interactivity & Polish**
  - [x] Add hover tooltips on members to show internal forces and required dimensions.
  - [x] Final testing and debugging.
  - [ ] Implement Vertices panel.
  - [ ] Implement Materials panel.
  - [ ] Implement Members panel.
  - [ ] Implement Supports and Loads panels.
  - [ ] Implement Settings panel (Safety factor).
- [ ] **Task 4: Calculation Engine (Solver)**
  - [ ] Formulate Direct Stiffness Method using `mathjs`.
  - [ ] Build global stiffness matrix $[K]$.
  - [ ] Apply boundary conditions.
  - [ ] Solve for displacements and calculate internal forces.
- [ ] **Task 5: Auto-Sizing Algorithm**
  - [ ] Implement tension sizing based on yield strength.
  - [ ] Implement compression sizing based on yield and Euler buckling for an I-beam profile.
- [ ] **Task 6: Visualization (SVG Canvas)**
  - [ ] Draw vertices and supports.
  - [ ] Draw members with dynamic stroke width.
  - [ ] Apply color mapping (Red for compression, Blue for tension, White/Gray for zero-force).
- [ ] **Task 7: Interactivity & Polish**
  - [ ] Add hover tooltips on members to show internal forces and required dimensions.
  - [ ] Final testing and debugging.