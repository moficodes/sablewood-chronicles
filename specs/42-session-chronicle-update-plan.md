# Update Session Chronicle Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update campaign chronicle data (`data/campaign.yml`) using the `bun run agent` CLI to reflect the events of the latest session (night travel, reunion with Tyrion Lannister, rescue of the missing Hush children, arrival at Hush during the festival, and staying at an inn).

---

### Planned Updates

#### 1. Timeline Events (`agent event add`)
- **Event 1:** `evt-rescue-hush-children`
  - **Title:** "Rescue of the Hush Children"
  - **Type:** `combat`
  - **Description:** "During late-night travel towards Hush while Orna rested in the carriage, the party reconnected with their old friend Tyrion Lannister, a giant bard searching for missing village children who strayed too far from safety. Working with Tyrion, the party tracked the children down, fought off attacking monstrosities, and rescued them."
- **Event 2:** `evt-arrival-in-hush`
  - **Title:** "Arrival at Hush"
  - **Type:** `location_change`
  - **Description:** "The party returned to the village of Hush in the dead of night. They found Hush actively celebrating a festival with many villagers still awake. The group quickly secured lodging at a local inn to rest for the night."

#### 2. Quests (`agent quest add` / `agent quest update`)
- **Add Side Quest:** "Rescue the Missing Children of Hush"
  - **Status:** `completed`
  - **Location:** `hush`
  - **Description:** "Assisted Tyrion Lannister in finding and rescuing children from Hush who wandered too far from the village and were hunted by monstrosities."
- **Update Active Quest:** "Deliver the Box to Hush"
  - **Status:** `active`
  - **Location:** `hush`
  - **Description:** "King Emeris tasked Orna Kaan and her companions to deliver a mysterious box from Solitaire to Hush. The party has safely arrived in Hush amidst a festival and is staying at an inn overnight."

#### 3. Location (`agent location update`)
- **Location ID:** `hush`
  - **Description:** "A village currently celebrating a lively late-night festival. The party arrived here after rescuing missing children on the road with Tyrion Lannister and is staying at a local inn."

---

### Execution Steps

- [ ] **Task 1: Execute agent CLI updates**
  - Add `evt-rescue-hush-children` event via `bun run agent event add`
  - Add `evt-arrival-in-hush` event via `bun run agent event add`
  - Add completed quest `Rescue the Missing Children of Hush` via `bun run agent quest add`
  - Update quest `Deliver the Box to Hush` via `bun run agent quest update`
  - Update location `hush` via `bun run agent location update`

- [ ] **Task 2: Verification**
  - Verify `data/campaign.yml` data using `bun run agent` list commands
  - Run type checking and build (`bun run lint && bun run build`) to ensure website renders without errors
