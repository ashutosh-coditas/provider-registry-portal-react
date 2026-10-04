# Provider Portal — Project Context

> Single source of truth for building the Provider Portal. Every phase (boilerplate, design system, app build) must follow this document. If code and this document disagree, update this document first.

---

## 0. Project Phases

| Phase | Scope | Status |
|---|---|---|
| **1** | `CONTEXT.md`: requirements, rules, wireflows, data model | ✅ Done |
| **2** | React boilerplate: tooling, folder structure, routing skeleton, mock storage layer, seed data | ✅ Done |
| **3** | Design system: tokens, light/dark theme, 30 components, app shell, `/design-system` showcase (see §14) | ✅ Done |
| **4** | Full app build: all screens and flows in this document (see §11.4–11.5) | ✅ Done (awaiting confirmation) |

**Rule:** do not start a phase until the owner has confirmed the previous one.

---

## 1. Overview

The Provider Portal is a **registry for doctors (providers)**. Providers register, then complete a 4-step certification questionnaire. Finishing the first questionnaire (the **Initial Certification**) turns a provider into a **Diplomat**. From then on, a Diplomat must recertify once per **3-year cycle** by completing the same questionnaire again.

Admins oversee every provider in a grid, where they can see progress and cycle, and edit or delete providers.

### Constraints
- **Frontend only, built in React.** There is no backend yet.
- **Mock data, persisted in `localStorage`.** All data access goes through a single service layer that mimics an async API (returns Promises and adds a small artificial delay). A real backend can later replace that layer without touching the UI.
- Passwords are stored in plain text in `localStorage`. **This is acceptable only for the mock** and must never ship.

---

## 2. Glossary

| Term | Meaning |
|---|---|
| **Provider** | Any doctor in the system who is not an Admin: a Candidate or a Diplomat. |
| **Admin** | System user who manages providers. Seeded in the system; **never registers**. |
| **Candidate** | A provider who has registered but has **not yet submitted** the Initial Certification. |
| **Diplomat** | A provider who **has submitted** the Initial Certification. |
| **Certification form** | The 4-step, 20-question stepper form. Every certification uses the same questions. |
| **Initial Certification** | **Cycle 1**: the first certification form, which a Candidate completes. Submitting it turns the Candidate into a Diplomat. It is not a separate item from Cycle 1. |
| **Cycle** | A 3-year window with exactly one certification form. Cycle 1 is the Initial Certification and starts on the day it is submitted (`certifiedAt`). Cycle 2, 3, … are recertifications every 3 years after that. |
| **Completion** | Progress on one form, shown as `completedSteps/4` (e.g. `2/4`). |
| **Overdue cycle** | A past cycle whose form was not submitted before the cycle ended. |

---

## 3. User Types & Rules

### 3.1 Admin
- Exists in the seed data only. There is **no admin registration**.
- Logs in and lands on the **Admin Dashboard** (`/admin`).
- Can view, search, filter, edit and delete providers.
- Cannot fill in certification forms.

### 3.2 Candidate
- Created through the **Register** page. Every newly registered user is a Candidate.
- Logs in and lands on the **Candidate Dashboard** (`/candidate`), which contains **one** stepper form: **Cycle 1, the Initial Certification**.
- Can leave at any step. Progress is **auto-saved** and resumes on the last step they were on.
- A Candidate never gets past Cycle 1. Cycle 1 has no dates until it is submitted, and a Candidate who stops at `2/4` stays a Candidate with no further cycles.
- When the Candidate **submits** step 4, they are switched to **Diplomat** immediately, in the same session. They see the success screen and then go to the Diplomat Dashboard.

### 3.3 Diplomat
- Logs in and lands on the **Diplomat Dashboard** (`/diplomat`).
- Has one certification form **per cycle**. Cycle 1 is their Initial Certification (read-only); recertification starts with Cycle 2.
- **Carry-forward rule:** if a cycle ends before its form is submitted, that form stays **open and overdue**. In the next cycle the Diplomat must complete **both** the overdue form(s) and the current cycle's form.
- Can switch between cycles and open the matching form.
- Submitted forms are **read-only**.

### 3.4 Status transitions

```
            register                submit Cycle 1 (Initial Certification)
 (none) ───────────────► CANDIDATE ───────────────────────────────► DIPLOMAT
                            │                                         │
                            │ partial progress (0/4–3/4)               │ Cycle 1 window starts at certifiedAt
                            ▼                                         ▼
                     stays CANDIDATE                       Cycle 1 (done) → Cycle 2 → Cycle 3 … (3 years each)
                     (only Cycle 1)                        each one: not_started → in_progress → submitted
                                                           cycle ends with form not submitted → overdue (still fillable)
```

A Diplomat is **never** demoted back to Candidate. Overdue cycles are flagged, not penalised (see Open Questions).

---

## 4. Cycle Logic (core business rules)

### 4.1 Definitions
- `certifiedAt` is the date Cycle 1 (the Initial Certification) was submitted.
- **Cycle 1 = Initial Certification.** Its form is `cycle-1`. There is no separate "initial" form.
- **Cycle N** (N ≥ 1) covers `[certifiedAt + 3·(N−1) years, certifiedAt + 3·N years)`.
- Cycle label: `Cycle N (YYYY–YYYY)`, using the start and end years. Example: Cycle 1 submitted on 2022-03-10, so Cycle 1 is `2022–2025` (already complete) and the first recertification, Cycle 2, is due within `2025–2028`.
- `today` is the real date, unless a **simulated date** has been set (see 4.4).
- **Current cycle** is the cycle that contains `today`.

### 4.2 Which forms a Diplomat sees
For every cycle from 1 up to the current cycle:

| Cycle state | Form status | Shown as | Action |
|---|---|---|---|
| Past cycle | `submitted` | ✅ Completed (on time / late) | View (read-only) |
| Past cycle | not submitted | 🔴 **Overdue** (`x/4`) | Continue / Start |
| Current cycle | `submitted` | ✅ Completed | View |
| Current cycle | not submitted | 🟡 Due by `<cycle end>` (`x/4`) | Continue / Start |
| Future cycles | — | Not shown (only the next cycle is shown as a locked "Upcoming" card) | — |

Cycle 1 always appears first, as "Cycle 1 · Initial Certification", **Completed** and read-only. A newly certified Diplomat has nothing due until Cycle 2 opens 3 years later.

### 4.3 Worked examples
1. **Candidate stops at 2/4.** Stays a Candidate. Admin grid shows `Completion 2/4` and `Cycle 1 · Initial`. No later cycles exist.
2. **Candidate submits Cycle 1 on 2022-03-10.** Becomes a Diplomat. Cycle 1 (2022–2025) is complete; Cycle 2 shows as Upcoming and opens on 2025-03-10.
3. **Diplomat completes 2/4 of Cycle 2, then Cycle 2 ends.** On 2028-03-10 Cycle 3 begins. The dashboard shows Cycle 2 as **Overdue 2/4** and Cycle 3 as **Due 0/4**. Both must be completed.
4. **Late submission.** When an overdue form is submitted, it is stored with `submittedAt` after `cycleEnd`, so it shows as "Completed (late)".

### 4.4 Simulating time (mock-only)
Cycles last 3 years, so the demo needs a way to move time forward:
- **Admin → Settings → "Simulated date"**: a date picker stored in `localStorage` (`pp.settings.simulatedDate`). When set, every cycle calculation uses this date instead of the real one. A visible banner reads "Simulated date: YYYY-MM-DD" on every page while it is active.
- Admin **Edit Provider** can also change a Diplomat's `certifiedAt`, which shifts that provider's cycles (see 7.3).

### 4.5 Pre-fill for recertification
When a Diplomat **starts** a new cycle form, its answers are pre-filled from their **most recently submitted** form. Two fields are left blank because they must be answered again for each cycle: **CME credits (Q18)** and **Attestation (Q20)**. The provider still has to step through and save each step for it to count.

---

## 5. Certification Form (4 steps × 5 questions)

Every certification uses the same form: Initial, and every cycle after it.

### 5.1 Step behaviour
- The stepper header shows 4 steps with these states: `completed` ✓, `current`, `upcoming`, `error`.
- **Save & Next** validates the current step. If it is valid, it saves the answers, marks the step completed, and moves forward.
- **Back** moves to the previous step without validating. Unsaved edits are kept as a draft.
- **Save & Exit** is available on every step. It saves a draft of the current step without marking the step complete, then returns to the dashboard.
- Users can click a **completed** step in the header to jump back to it. They cannot jump ahead past the first incomplete step.
- **Auto-save:** while the user types, the draft is saved (debounced, about 800 ms), so closing the tab loses nothing.
- **Completion** = number of steps that passed validation and were saved. Step 4 only counts when the form is **submitted**.
- **Step 4** has a **Review summary** (an accordion of all answers, with "Edit" links back to each step) and a **Submit** button, which asks for confirmation in a modal.
- If an earlier completed step is edited, it must be saved valid again. If it ends up invalid, it returns to `incomplete`.
- After submission the form is locked and read-only.

### 5.2 Questions & validation

All fields are **required** unless marked *(optional)*. Dates use `YYYY-MM-DD`. Validation messages appear inline under each field when it loses focus and again when the user presses Save & Next.

#### Step 1 — Personal & Identity Details
| # | Field | Type | Validation |
|---|---|---|---|
| Q1 | Full legal name | text | 2–100 chars; letters, spaces, `.`, `'`, `-` only |
| Q2 | Date of birth | date | Valid date; age between 24 and 90 on `today` |
| Q3 | Nationality | select (country list) | Must pick a value |
| Q4 | Passport number | text | 6–9 chars, alphanumeric, auto-uppercase |
| Q5 | Passport expiry date | date | Must be at least 6 months after `today` |

#### Step 2 — Medical Education & Licensure
| # | Field | Type | Validation |
|---|---|---|---|
| Q6 | Medical school / university | text | 3–150 chars |
| Q7 | Year of graduation | number | 4 digits; ≥ birth year + 20; ≤ current year |
| Q8 | Medical license number | text | 5–20 chars; alphanumeric and `-` |
| Q9 | Issuing licensing authority / state | text | 2–100 chars |
| Q10 | License expiry date | date | Must be after `today` (an expired license cannot be submitted) |

#### Step 3 — Board Certification & Credentials
| # | Field | Type | Validation |
|---|---|---|---|
| Q11 | Primary specialty | select | One of: Anesthesiology, Cardiology, Dermatology, Emergency Medicine, Family Medicine, General Surgery, Internal Medicine, Neurology, Obstetrics & Gynecology, Ophthalmology, Orthopedics, Pediatrics, Psychiatry, Radiology, Dentistry, Other |
| Q12 | Board certificate number | text | Format `BC-` followed by 6 digits (e.g. `BC-123456`) |
| Q13 | NPI number | text | Exactly 10 digits, and the NPI Luhn check digit must be valid |
| Q14 | DEA registration number | text | 2 letters followed by 7 digits (e.g. `AB1234567`), auto-uppercase |
| Q15 | ADA / professional association member ID *(optional)* | text | If filled in: 4–15 alphanumeric chars |

#### Step 4 — Practice, CME & Attestation
| # | Field | Type | Validation |
|---|---|---|---|
| Q16 | Primary practice / hospital name | text | 2–150 chars |
| Q17 | Years in clinical practice | number | Integer 0–60; must be ≤ (current year − graduation year) |
| Q18 | CME credits earned this cycle | number | Integer 0–500; a minimum of **50** is required to submit |
| Q19 | Any malpractice claims or disciplinary actions? | radio Yes / No + textarea | If **Yes**, an explanation of 20–1000 chars is required |
| Q20 | Attestation | checkbox | Must be checked: "I attest that the information provided is true and complete." |

Then the **Review summary** and **Submit** follow.

---

## 6. Screens & Routes

| Route | Screen | Access |
|---|---|---|
| `/login` | Login | Public (logged-in users are redirected to their home) |
| `/register` | Register | Public |
| `/admin` | Admin Dashboard: providers grid | Admin |
| `/admin/settings` | Settings: simulated date, reset demo data | Admin |
| `/candidate` | Candidate Dashboard: Initial Certification stepper | Candidate |
| `/diplomat` | Diplomat Dashboard: cycle overview | Diplomat |
| `/diplomat/forms/:formKey` | Certification stepper for a cycle (`cycle-1`, `cycle-2`, …) or `initial` (read-only) | Diplomat |
| `/certification/:formKey/success` | Submission success | Candidate / Diplomat (the form owner) |
| `*` | 404 Not Found | All |

**Route guards**
- An unauthenticated user goes to `/login`.
- A user on a route for another role is redirected to their own home: Admin to `/admin`, Candidate to `/candidate`, Diplomat to `/diplomat`.
- A Candidate who has just become a Diplomat is moved to the Diplomat routes as soon as the success screen is dismissed.
- A Diplomat opening a form for a future cycle, or a form key that does not exist, is redirected to `/diplomat`.

### 6.1 App shell (all authenticated screens)
```
┌──────────────────────────────────────────────────────────────────────┐
│ [Logo] Provider Portal                     [Role badge] [Avatar ▾]   │  Top bar
├─────────────┬────────────────────────────────────────────────────────┤
│ Sidebar     │  Page title / breadcrumb                               │
│ • Dashboard │                                                        │
│ • Settings* │  Page content                                          │
│             │                                                        │
│ ─────────   │                                                        │
│ Logout      │                                                        │
└─────────────┴────────────────────────────────────────────────────────┘
* Admin only
```
- **Avatar menu (user toggle):** shows name, username and role badge (Admin / Candidate / Diplomat), plus a Logout action.
- **Sidebar:** collapsible (a toggle button). On screens narrower than 768 px it becomes an off-canvas drawer.
- **Sidebar items by role:**
  - Admin: Dashboard, Settings
  - Candidate: Dashboard (Initial Certification)
  - Diplomat: Dashboard, plus a "Certifications" group listing Initial and each cycle with a status dot
- **Simulated-date banner** at the top when a simulated date is active.
- **Demo user switcher** *(mock-only, behind `VITE_SHOW_DEMO_TOOLS`)*: a small dropdown in the top bar that logs in as any seeded user in one click, for quick testing.

---

## 7. Screen-by-Screen Specification

### 7.1 Login (`/login`)
```
┌──────────────────────────────┐
│        Provider Portal       │
│            Login             │
│  Username [______________]   │
│  Password [__________] 👁    │
│  [         Login          ]  │
│  Don't have an account?      │
│  Sign up                     │
└──────────────────────────────┘
```
- **Fields:** Username (required, 3–30 chars), Password (required, with a show/hide toggle).
- **On submit:** look up the user by username (case-insensitive) and compare passwords.
  - If they match, create a session and redirect by role.
  - If they don't, show the inline error "Invalid username or password". Do not reveal which of the two was wrong.
- The Login button is disabled and shows a spinner while the request runs.
- **Sign up** links to `/register`.
- Admin logs in here as well. There is no separate admin login.

### 7.2 Register (`/register`)
```
┌──────────────────────────────┐
│           Register           │
│  Name     [______________]   │
│  Username [______________]   │
│  Password [__________] 👁    │
│  [        Register        ]  │
│  Already have an account?    │
│  Login                       │
└──────────────────────────────┘
```
- **Name:** 2–100 chars; letters, spaces, `.`, `'`, `-`.
- **Username:** 3–30 chars; lowercase letters, digits, `.` and `_`; must start with a letter; **unique** (error: "Username already taken").
- **Password:** 8–64 chars, with at least 1 uppercase letter, 1 lowercase letter, 1 digit and 1 special character. A strength hint is shown.
- **On success:** create the user with `type: 'candidate'` and show the toast "Registration successful. Please log in." Then redirect to `/login` with the username pre-filled. (Auto-login is deliberately skipped, which keeps the flow "register, then log in".)
- The username `admin`, and any username belonging to an existing admin, is blocked.
- **Login** links to `/login`.

### 7.3 Admin Dashboard (`/admin`)
```
┌ Providers ──────────────────────────────────────────────────────────────┐
│ [🔍 Search name/username]  [Type: All ▾]  [Status: All ▾]   Total: 12  │
├─────────────────────┬────────────┬─────────────────────────┬────────────┤
│ Name ↕              │ Completion │ Cycle                   │ Actions    │
├─────────────────────┼────────────┼─────────────────────────┼────────────┤
│ Dr. A Mehta         │ ██░░ 2/4   │ —                       │ ✏️  🗑️    │
│  @amehta · Candidate│            │                         │            │
│ Dr. R Shah          │ ████ 4/4   │ Cycle 2 (2025–2028)     │ ✏️  🗑️    │
│  @rshah · Diplomat  │            │                         │            │
│ Dr. K Rao           │ █░░░ 1/4   │ Cycle 2 (2025–2028)     │ ✏️  🗑️    │
│  @krao · Diplomat   │            │ ⚠ 1 overdue             │            │
├─────────────────────┴────────────┴─────────────────────────┴────────────┤
│                                          « 1 2 »   Rows: [10 ▾]         │
└─────────────────────────────────────────────────────────────────────────┘
```
**Columns**
| Column | Candidate | Diplomat |
|---|---|---|
| **Name** | Name, plus `@username` and a type badge underneath | same |
| **Completion** | Initial Certification progress `x/4`, with a mini progress bar | **Current cycle** form progress `x/4` |
| **Cycle** | `Cycle 1 · Initial` (no dates until submitted) | `Cycle N (YYYY–YYYY)`, plus a red "⚠ N overdue" tag when overdue cycles exist |
| **Actions** | Edit, Delete | Edit, Delete |

**Grid features:** search by name or username; filter by Type (All / Candidate / Diplomat) and Status (All / On track / Overdue / Not started); sort by Name and Completion; client-side pagination (10, 25 or 50 rows); an empty state ("No providers found"); a loading skeleton. Admins are never listed.

**Edit (modal)**
| Field | Rule |
|---|---|
| Name | Same validation as Register |
| Username | Same validation, unique |
| Type | Read-only. Type is driven only by submitting the Initial Certification. |
| Certified on (`certifiedAt`) | Diplomats only. A date picker, which cannot be in the future. Changing it recalculates the cycles, so the **Cycle** column changes. |
| Completion | Read-only display, plus a **"Reset current form progress"** action (with confirmation) that clears the current form back to `0/4`. |

Save validates the fields, updates storage, shows a success toast and refreshes the row.

**Delete:** a confirmation modal says "Delete Dr. X? This removes the provider and all their certification data. This cannot be undone." On confirmation, the user and all of their forms are removed, a toast is shown and the row disappears.

### 7.4 Admin Settings (`/admin/settings`)
- **Simulated date:** a date picker plus a Clear button (see 4.4).
- **Reset demo data:** a confirmation modal, after which `localStorage` is wiped and the seed data reloaded.

### 7.5 Candidate Dashboard (`/candidate`)
```
┌ Initial Certification ───────────────────────── Progress 2/4 ─┐
│  (1)✓ Personal ── (2)✓ Education ── (3)● Board ── (4)○ Practice│
│                                                                │
│  Step 3 — Board Certification & Credentials                    │
│  Primary specialty   [ Cardiology ▾ ]                          │
│  Board certificate # [ BC-______ ]                             │
│  NPI number          [ __________ ]                            │
│  DEA number          [ _________ ]                             │
│  ADA / member ID     [ ________ ] (optional)                   │
│                                                                │
│  [Back]                       [Save & Exit]  [Save & Next →]   │
└────────────────────────────────────────────────────────────────┘
```
- An intro card at the top says "Complete your Initial Certification to become a Diplomat." It also shows the last-saved time.
- The form resumes on `currentStep`.
- Step 4 shows the Review summary and the **Submit** button.

### 7.6 Submission Success (`/certification/:formKey/success`)
```
┌──────────────────────────────────────────┐
│                  ✅                      │
│     Certification submitted!             │
│  Initial Certification · 2026-10-01      │
│                                          │
│  🎉 You are now a Diplomat.              │  ← only after the Initial
│  Your Cycle 1 (2026–2029) has begun.     │
│                                          │
│        [ Go to Dashboard ]               │
└──────────────────────────────────────────┘
```
- After the Initial Certification: the user type is already set to `diplomat`, the session is refreshed, and the "Go to Dashboard" button leads to `/diplomat`.
- After a cycle form: "Cycle N certification submitted." If it was submitted after the cycle ended, the screen adds "(submitted late)".

### 7.7 Diplomat Dashboard (`/diplomat`)
```
┌ Welcome, Dr. K Rao ─────────────────────────────────────────────────┐
│ Diplomat since 2022-03-10 · Current: Cycle 2 (2025–2028)           │
│ ⚠ You have 1 overdue certification. Please complete it.            │  ← only if overdue
└─────────────────────────────────────────────────────────────────────┘

 Cycle: [ All ▾ ]   (switcher: All / Initial / Cycle 1 / Cycle 2)

┌ Initial Certification ─┐ ┌ Cycle 1 · 2022–2025 ───┐ ┌ Cycle 2 · 2025–2028 ───┐
│ ✅ Completed           │ │ 🔴 Overdue             │ │ 🟡 Due 2028-03-10      │
│ Submitted 2022-03-10   │ │ ██░░ 2/4               │ │ ░░░░ 0/4               │
│ [ View ]               │ │ Ended 2025-03-10       │ │ 892 days left          │
│                        │ │ [ Continue ]           │ │ [ Start ]              │
└────────────────────────┘ └────────────────────────┘ └────────────────────────┘
┌ Cycle 3 · 2028–2031 ───┐
│ 🔒 Upcoming            │
│ Opens 2028-03-10       │
└────────────────────────┘
```
- **Summary header:** Diplomat since, current cycle, and an overdue alert when needed.
- **Cycle switcher:** a select or tabs that filter the cards. Choosing a cycle and pressing its CTA opens `/diplomat/forms/:formKey`.
- **Cards** are ordered: Initial, then the cycles in order. Overdue cards are highlighted.
- **CTA text by state:** `View` (submitted), `Start` (0/4 and not started), `Continue` (in progress).
- **Empty or edge cases:** a provider certified today shows Initial ✅ and Cycle 1 at 0/4.

### 7.8 Diplomat Certification Form (`/diplomat/forms/:formKey`)
- Same stepper component as the Candidate's form.
- **Header:** form title (e.g. "Cycle 1 Recertification · 2022–2025"), a status badge (Due / Overdue / Completed), and an inline **cycle switcher dropdown** to jump to another cycle's form.
- If the form is **submitted** or is `initial`, it is read-only: all steps can be viewed, every input is disabled, and there is no Submit button.
- New forms are pre-filled as described in 4.5.

### 7.9 404 Page
A "Page not found" message with a button back to the user's home page.

---

## 8. End-to-End Wireflows

### 8.1 Auth
```
/login ──[Sign up]──► /register ──[Register ✓]──► /login (toast, username prefilled)
   │                     └──[Login link]──► /login
   └──[Login ✓]──► role?
                    ├─ admin     ──► /admin
                    ├─ candidate ──► /candidate
                    └─ diplomat  ──► /diplomat
```

### 8.2 Candidate
```
/candidate (resume at currentStep)
  Step1 ─Save&Next─► Step2 ─Save&Next─► Step3 ─Save&Next─► Step4 (+Review)
    ▲   ◄──Back────    ▲   ◄──Back────    ▲   ◄──Back────     │
    └──── Save & Exit / Logout at any step: progress is kept ─┘
                                                             [Submit] → confirm modal
                                                                │
                              user.type = 'diplomat', certifiedAt = today
                                                                ▼
                                         /certification/initial/success ──► /diplomat
```

### 8.3 Diplomat
```
/diplomat ──[switch cycle / pick card]──► /diplomat/forms/cycle-N
     ▲                                         │ (same stepper; pre-filled)
     │                                         ├─ Save & Exit ──► /diplomat
     │                                         └─ Submit ──► /certification/cycle-N/success
     └──────────────────────────────────────────────────────────────┘
```

### 8.4 Admin
```
/admin ── search / filter / sort / paginate
   ├─ ✏️ Edit ──► modal ──Save──► toast, row refreshed
   ├─ 🗑 Delete ──► confirm ──► toast, row removed
   └─ Sidebar ▸ Settings ──► simulated date / reset demo data
```

### 8.5 Logout
Avatar menu or Sidebar, then **Logout**. This clears the session (drafts stay saved) and returns to `/login`.

---

## 9. Data Model (localStorage)

All keys use the prefix `pp.` and each value is JSON. Key `pp.version` stores a schema version, so the seed can be reloaded when the schema changes.

```ts
// pp.users
type UserType = 'admin' | 'candidate' | 'diplomat';
interface User {
  id: string;              // uuid
  name: string;
  username: string;        // unique, lowercase
  password: string;        // MOCK ONLY: plain text
  type: UserType;
  certifiedAt: string | null; // ISO date; set when the Initial is submitted (diplomats only)
  createdAt: string;
  updatedAt: string;
}

// pp.forms  → Record<userId, Record<FormKey, CertificationForm>>
type FormKey = 'initial' | `cycle-${number}`;
type FormStatus = 'not_started' | 'in_progress' | 'submitted';
interface CertificationForm {
  formKey: FormKey;
  status: FormStatus;
  currentStep: 1 | 2 | 3 | 4;
  completedSteps: number[];       // e.g. [1,2] → completion 2/4
  answers: Partial<Answers>;      // Q1..Q20 (saved + draft values)
  startedAt: string | null;
  updatedAt: string | null;
  submittedAt: string | null;
}

// pp.session (client side). The token is a MOCK bearer token: `mock-token.<userId>`
interface Session { token: string; userId: string; loggedInAt: string; }

// pp.settings
interface Settings { simulatedDate: string | null; }
```

**Derived values (computed, never stored):**
- `completion(form) = form.completedSteps.length` (out of 4)
- `cycles(user, today)`: the list of `{ n, start, end, label, state: 'past' | 'current' | 'upcoming' }`
- `currentCycle(user, today)`, `overdueCycles(user, today)`
- A cycle form record is created **lazily** the first time it is opened. A missing record counts as `not_started 0/4`.

**Invariants**
- `type === 'diplomat'` ⇔ `forms[userId].initial.status === 'submitted'` ⇔ `certifiedAt !== null`
- Admins have no forms.
- Deleting a user deletes `forms[userId]`, and the session too if it belongs to that user.

---

## 10. Seed Data

Seeded on first load, or after "Reset demo data". Dates are **relative to today**, so the demo always shows every state.

| Username | Password | Type | Scenario |
|---|---|---|---|
| `admin` | `Admin@123` | admin | System admin |
| `cand.new` | `Pass@123` | candidate | Registered, Cycle 1 (Initial) 0/4 |
| `cand.partial` | `Pass@123` | candidate | Cycle 1 (Initial) 2/4: a stuck candidate |
| `cand.ready` | `Pass@123` | candidate | Cycle 1 (Initial) 3/4: one step from Diplomat |
| `dip.fresh` | `Pass@123` | diplomat | Cycle 1 submitted 2 months ago; Cycle 2 upcoming |
| `dip.ontrack` | `Pass@123` | diplomat | Certified about 4 years ago; now in Cycle 2 at 2/4 |
| `dip.overdue` | `Pass@123` | diplomat | Certified about 7 years ago; Cycle 2 at 2/4 (**overdue**); Cycle 3 at 0/4 |
| `dip.veteran` | `Pass@123` | diplomat | Certified about 10 years ago; Cycles 1–3 submitted; Cycle 4 at 1/4 |

Seeded answers use realistic, valid values (they pass validation).

---

## 11. Tech Stack & Architecture (Phase 2, in place)

### 11.1 Stack
| Area | Choice |
|---|---|
| Build | **Vite 8** + **React 19** + **TypeScript** (strict) |
| Styling | **SCSS modules** (component styles, compiled with `sass`) + **Tailwind CSS v4** (layout and spacing utilities) |
| Icons | **@phosphor-icons/react**, through the `Icon` registry (only registered icons are bundled) |
| Forms | **react-hook-form** + **zod** (via `@hookform/resolvers`) |
| Routing | **React Router** (`createBrowserRouter`, lazy route modules) |
| API | **axios** + **RTK Query** (`axiosBaseQuery`). A mock axios adapter answers every request from `localStorage`. |
| State | **Redux Toolkit** for complex or global state (auth session); `useState` for simple local state |
| Dates | `date-fns` |
| Quality | `oxlint`, Prettier, `tsc -b` (`npm run lint`, `npm run format`, `npm run typecheck`) |

### 11.2 Folder structure
```
src/
  main.tsx, App.tsx          # Redux Provider + RouterProvider
  router/
    index.tsx                # main router: only plugs in the module routes
    paths.ts                 # ROUTES, buildPath, HOME_BY_ROLE
  pages/                     # one folder per module; each owns its routes
    auth/      Login/ Register/                      auth.routes.tsx
    admin/     AdminDashboard/ AdminSettings/        admin.routes.tsx
    candidate/ CandidateDashboard/                   candidate.routes.tsx
    diplomat/  DiplomatDashboard/ DiplomatCertification/  diplomat.routes.tsx
    certification/ CertificationSuccess/             certification.routes.tsx
    misc/      NotFound/                             misc.routes.tsx
    design-system/ DesignSystem/ components/         design-system.routes.tsx (demo only)
    admin/components/    EditProviderModal/
    diplomat/components/ CycleCard/
  components/                # shared components
    ui/        design-system components (see §14)
    certification/ CertificationForm/ StepForm/ QuestionField/ CertificationReview/ CertificationStatusBadge/
    guards/    RequireRole/ GuestOnly/ RoleRedirect/
    layouts/   RootLayout/ AuthLayout/ AppShell/ Sidebar/ Topbar/ DemoSwitcher/
  services/                  # module-based API layer
    api/       client.ts (axios), axiosBaseQuery.ts, baseApi.ts (RTK Query root)
    mock/      mockServer.ts (axios adapter), db.ts, seed.ts, handlers.ts, mock.utils.ts (getNow)
    auth/ providers/ certification/ settings/   each: *.api.ts, *.mock.ts, *.types.ts
  store/       index.ts, hooks.ts, listeners.ts, slices/{auth, ui (theme), toast}/
  hooks/       useAuth, useAuthBootstrap, useAutoSave, useTheme, useToast, useDisclosure, useClickOutside, useMediaQuery
  constants/   env, roles, storageKeys, demo, certification (the 20 questions, specialties, countries)
  types/       user, certification, app (session, settings)
  utils/       storage, validators, apiError, theme, dates, cycles (cycle rules), certificationSchema (step zod schemas), npi
  styles/      tailwind.css, globals.scss, tokens/ (primitives, theme, scale), abstracts/ (variables, mixins)
```

### 11.3 Conventions
1. **Pages** live in `pages/<module>/<Page>/`. **Shared components** live in `components/`.
2. **Component decomposition.** Each component is a folder containing:
   - `X.tsx`: the template only (JSX, no logic)
   - `X.state.ts`: a `useXState()` hook with all the logic, which the template destructures
   - `X.module.scss`: styles
   - `X.types.ts`: props, interfaces and zod schemas
   - `index.ts`: the public exports

   A file is created only when it has content. For example, a stateless layout has no `.state.ts`, and a component with no props has no `.types.ts`. A state file is `.state.tsx` when it builds JSX, such as table column renderers.
3. **Routing.** Each module exports a `RouteObject` from `<module>.routes.tsx` that holds its own guard (`RequireRole`), its layout (`AppShell`) and its lazy-loaded pages. `router/index.tsx` only composes these.
4. **API calls.** Each service module has three parts:
   - `*.api.ts`: RTK Query endpoints, added with `baseApi.injectEndpoints`
   - `*.mock.ts`: the mock route handlers for those endpoints
   - `*.types.ts`: request and response types

   The UI never reads `localStorage` directly. Only the mock layer does.
5. **Swapping in a real backend.** Set `VITE_USE_MOCK_API=false` and `VITE_API_BASE_URL`. The endpoints and UI stay the same.
6. **State.** Use RTK slices for cross-cutting state such as the auth session. Side effects (persisting or clearing the session, resetting the API cache) live in `store/listeners.ts`, so reducers stay pure. Server data lives in the RTK Query cache. Local UI state uses `useState`.
7. **Memoization.** Use `useCallback`, `useMemo` and `memo` sparingly: only when profiling or referential stability actually requires it.
8. **Custom hooks.** Reusable logic goes in `hooks/` (e.g. `useAuth`). Component logic goes in `.state.ts`.
9. **Styles.** The Sass abstracts (variables and mixins) are auto-injected into every `.scss` file by `vite.config.ts`, so never `@use` them manually. Colors, spacing and type always come from `--pp-*` tokens (§14) and never from raw hex values. Use Tailwind utilities for layout and spacing in templates, and SCSS modules for component styling. Don't set the same property on the same element with both.
10. **Forms.** react-hook-form with `zodResolver`. Shared field rules live in `utils/validators.ts`. Each form's schema lives in its `.types.ts`.

### 11.4 Mock API
| Endpoint | Who | Purpose |
|---|---|---|
| `POST /auth/login`, `POST /auth/register`, `GET /auth/me`, `POST /auth/logout` | Public / any user | Session |
| `GET /providers` | Admin | Grid rows: current-form completion, cycle label, overdue count, status |
| `PATCH /providers/:id` | Admin | Edit name, username, certified-on date (409 on a duplicate username) |
| `DELETE /providers/:id` | Admin | Delete a provider and their forms |
| `POST /providers/:id/reset-progress` | Admin | Clear the current form back to 0/4 |
| `GET /certifications` | Provider | Overview: Initial + cycles 1…current + the locked next cycle |
| `GET /certifications/:formKey` | Provider | One form. New cycle forms come pre-filled (404 if locked or not the user's) |
| `PUT /certifications/:formKey/draft` | Provider | Auto-save, Back, Save & Exit (can mark a step incomplete again) |
| `POST /certifications/:formKey/steps/:step` | Provider | Save & Next for steps 1–3 |
| `POST /certifications/:formKey/submit` | Provider | Submit (needs steps 1–3). For the Initial, it promotes the candidate to diplomat |
| `GET /settings`, `PUT /settings` | Any user / Admin | Simulated date |
| `POST /admin/reset-demo` | Admin | Reload the seed data (ends the session) |

All date rules on the mock "server" use `getNow()`, which returns the simulated date when one is set. The cycle rules live in pure functions (`utils/cycles.ts`) that the mock API uses. The UI only shows what the API returns. Submitted and locked forms reject writes with 409.

The certification questions are **config-driven**. `constants/certification.ts` defines the steps and questions, and `utils/certificationSchema.ts` defines the zod rule for each step. Rules that span steps, such as graduation year vs date of birth or years in practice vs graduation year, read the saved answers. The stepper, the fields, the review summary and the read-only view all render from the config.

### 11.5 Verification
- `npm run typecheck`, `npm run lint` and `npm run build` are clean.
- The seed answers pass the real step schemas (0 failures).
- An end-to-end run in headless Chrome passes 42 of 42 checks (including a check that the modal is centered): route guards; registration (validation, duplicate username, prefilled login); stepper validation rules, auto-save with resume after reload, Back and Save & Exit; Candidate → Diplomat on submit; overdue carry-forward; pre-fill; read-only and locked forms; admin search, filter, edit (future date rejected, cycle moves), delete; simulated date; mobile with no overflow; logout; demo reset. There were no browser console errors.

---

## 12. Non-Functional Requirements
- **Responsive:** desktop first; the layout works down to 360 px wide. On mobile the sidebar becomes a drawer and the grid scrolls horizontally.
- **Accessibility:** labelled inputs, `aria-invalid` and `aria-describedby` on errors, keyboard-navigable stepper and modals, visible focus, contrast of at least WCAG AA.
- **Feedback:** loading skeletons or spinners, success and error toasts, confirmation for destructive actions.
- **Resilience:** corrupted `localStorage` falls back to the seed data. Every read is wrapped in try/catch.

---

## 13. Assumptions & Open Questions

Assumptions made in this document. Please confirm or correct them:

1. **Cycle anchoring:** cycles start on each provider's `certifiedAt` date, not on fixed calendar years shared by everyone.
2. **Cycle 1 starts immediately** when a provider becomes a Diplomat. The Initial Certification is separate from Cycle 1.
3. **Overdue Diplomats stay Diplomats**: they are flagged, never demoted. Should overdue status ever revoke Diplomat status?
4. **Admin "Completion" for Diplomats** shows the *current* cycle's progress, with overdue cycles flagged in the Cycle column.
5. **Admin edit** can change Name, Username and Certified-on date (which moves the cycle), and can reset the current form's progress. Admin cannot edit form answers or force a completion such as 4/4.
6. **Register does not auto-login**: the user is sent back to Login.
7. **Pre-fill from the previous submission** for cycle forms (except CME and Attestation).
8. **Simulated date** in Admin Settings plus a **demo user switcher**, so all states can be demoed without waiting 3 years.
9. **TypeScript** (rather than plain JavaScript): fine?
10. Should the Admin be able to **create** providers, or **view** a provider's answers (a read-only drawer)? Neither is in scope right now.

---

## 14. Design System (Phase 3, in place)

Live reference: **`/design-system`**. It is public in demo builds (`VITE_SHOW_DEMO_TOOLS=true`) and shows every token and component in both themes.

### 14.1 Visual language
- **Palette:** Coditas. The primary color is purple `#5d5df6`, with graphite neutrals, a purple-tinted page background (`#f5f5fb`), and a brand gradient (`#ab00ff → #00c8eb`). The gradient is reserved for the logo and the final **Submit certification** button.
- **Type:** **Urbanist** for headings and **Inter** for body text, loaded from Google Fonts.
- **Shape:** cards 16 px, buttons 12 px, controls 8 px, badges round. Shadows are a soft purple glow.
- **Themes:** light and dark. The OS preference applies until the user toggles; the choice is saved per browser in `pp.theme`. An inline script in `index.html` applies it before first paint, so there is no flash.

### 14.2 Tokens (`src/styles/tokens/`)
| Tier | File | Examples | Who uses it |
|---|---|---|---|
| Primitives | `_primitives.scss` | `--pp-purple-700`, `--pp-graphite-500`, `--pp-gradient-brand` | Only the semantic tier |
| Semantic | `_theme.scss` (light and dark) | `--pp-bg-surface`, `--pp-text-secondary`, `--pp-primary`, `--pp-danger-subtle`, `--pp-shadow-md`, `--pp-focus-ring` | Components and pages |
| Scale | `_scale.scss` | `--pp-space-4`, `--pp-radius-xl`, `--pp-control-md`, `--pp-z-modal`, `--pp-duration-base` | Components and pages |

Tailwind's theme maps onto the same variables (`bg-surface`, `text-secondary`, `rounded-xl`…), so utilities switch theme too.

Sass mixins (auto-injected): `respond-to('md')`, `respond-below('md')`, `heading('h3')`, `text('sm', weight)`, `label-caps`, `control`, `surface`, `focus-ring`, `truncate`, `reset-button`.

### 14.3 Components (`src/components/ui/`)
| Group | Components | Used for |
|---|---|---|
| Actions | `Button` (primary, brand, secondary, outline, ghost, danger, dangerOutline, link · sm, md, lg · loading), `IconButton`, `LinkButton` | All CTAs, table row actions, router links styled as buttons |
| Form controls | `Field`, `TextField`, `PasswordField`, `SearchField`, `Select`, `Textarea` (counter), `Checkbox`, `RadioGroup` | Login, Register, the 20 certification questions, admin edit, grid search |
| Display | `Badge`, `ProgressBar`, `Card` (tones, dashed), `Avatar`, `DescriptionList`, `Accordion`, `PageHeader`, `Logo` | Roles and statuses, x/4 completion, cycle cards, review summary, read-only answers |
| Feedback | `Alert`, `Toast` + `ToastViewport` (`useToast()`), `EmptyState`, `Spinner`, `Skeleton` | Overdue and simulated-date banners, save confirmations, empty grid, 404 and success screens, loading |
| Navigation | `Stepper`, `Tabs` (underline, pills), `Pagination`, `Menu` | Certification steps, diplomat cycle switcher, admin grid paging, account menu |
| Data | `Table` (typed columns, sortable, skeleton rows, empty state) | Admin providers grid |
| Overlays | `Modal` (native `<dialog>`), `ConfirmDialog` | Admin edit, delete confirmation, submit confirmation |
| App | `ThemeToggle`; layouts `AppShell` → `Sidebar` (collapsible rail on desktop, drawer below 1024 px) + `Topbar` (theme toggle and account menu); `AuthLayout` (brand panel and form card) | Every screen |

### 14.4 Rules for Phase 4
1. Build screens only from `components/ui` and the tokens. Add any missing piece to the design system first.
2. One `primary` button per view. Use `brand` only for **Submit certification**, and `danger` only for destructive actions, which always go through a `ConfirmDialog`.
3. Status always shows as a shape plus a color: `Badge` with an icon for Completed, Due, Overdue and Upcoming; `ProgressBar` tone for completion; a `danger` tone `Card` for overdue cycles.
4. Feedback: a `toast` after a successful action, an `Alert` for page-level problems, and inline field errors for validation.
5. Icons come only from the `Icon` registry (`<Icon name="edit" />`). Register a new icon before using it.
6. Accessibility comes built in: labels, `aria-invalid` and `aria-describedby` wiring, focus rings, keyboard support in tabs, menus and dialogs, and a skip link. Keep it intact when composing.
