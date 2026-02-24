# PageSmith - Setup Instructions

**Cross-Machine Development Setup**

Follow these steps to set up PageSmith on both your Mac Mini and MacBook.

---

## Prerequisites

Make sure you have installed:
- Node.js 18+ (check: `node --version`)
- Git (check: `git --version`)
- GitHub CLI (optional but recommended: `gh --version`)

---

## Initial Setup (Do Once)

### 1. Create GitHub Repository

On your **first machine** (Mac Mini):

```bash
cd /Users/skylarmartinez_macmini/Live_OS/projects/PageSmith

# Create GitHub repo via CLI
gh repo create PageSmith --public --source=. --remote=origin

# Or manually on GitHub.com, then:
git remote add origin https://github.com/skylarmartinex/PageSmith.git
```

### 2. Initial Commit

```bash
git add .
git commit -m "Initial PageSmith setup - architecture and planning docs"
git branch -M main
git push -u origin main
```

---

## Clone on Second Machine

On your **MacBook** (or any other machine):

```bash
cd ~/Live_OS/projects  # or wherever you keep projects
git clone https://github.com/skylarmartinex/PageSmith.git
cd PageSmith
```

---

## Install Dependencies

**After** Antigravity generates the Next.js project with `package.json`:

```bash
npm install
```

---

## Environment Variables

Create `.env.local` in the project root:

```env
# Claude API (Anthropic)
ANTHROPIC_API_KEY=your_claude_api_key_here

# Unsplash
UNSPLASH_ACCESS_KEY=your_unsplash_key_here

# Pexels
PEXELS_API_KEY=your_pexels_key_here

# Optional: Getty Images
GETTY_API_KEY=your_getty_key_here
```

**Important:** `.env.local` is gitignored. You'll need to create it on each machine.

---

## Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## Sync Between Machines

### Push Changes (after working)

```bash
git add .
git commit -m "Description of what you built"
git push
```

### Pull Changes (before working on other machine)

```bash
git pull
npm install  # in case dependencies changed
```

---

## Workflow Tips

1. **Always pull before starting work** on a new machine
2. **Commit frequently** with clear messages
3. **Push after each session** so changes are synced
4. Use feature branches for big changes:
   ```bash
   git checkout -b feature/template-system
   # ... work ...
   git push -u origin feature/template-system
   ```

---

## Antigravity Usage

When building with Antigravity:

1. Tell it to reference `PLAN.md` for feature requirements
2. Ask it to check off items in `PLAN.md` as it completes them
3. Update `PROGRESS.md` with what you completed
4. Commit changes after each session

Example prompt:
```
"Build the Next.js setup for PageSmith. Follow Phase 1 in PLAN.md. 
Check off completed items. Update PROGRESS.md when done."
```

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Dependency Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### Git Conflicts
```bash
git stash        # save your changes
git pull         # get latest
git stash pop    # reapply your changes
# resolve conflicts manually
```

---

## Directory Structure (Expected)

After Antigravity builds the initial setup:

```
PageSmith/
├── PLAN.md              ✅ Created
├── PROGRESS.md          ✅ Created
├── SETUP.md             ✅ Created (this file)
├── README.md            ⏳ To be created
├── package.json         ⏳ To be created
├── tsconfig.json        ⏳ To be created
├── next.config.js       ⏳ To be created
├── tailwind.config.ts   ⏳ To be created
├── .env.local           ⚠️ Create manually (not in git)
├── .gitignore           ⏳ To be created
├── app/                 ⏳ To be created
├── components/          ⏳ To be created
├── lib/                 ⏳ To be created
└── public/              ⏳ To be created
```

---

**You're all set! Start with Phase 1 in PLAN.md.**
