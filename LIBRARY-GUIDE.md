# Network Library - Complete Setup & Maintenance Guide

**Created:** 2025-12-11
**Author:** Mike Filippi
**Project:** Truth Serum + Clarity Armor

---

## Table of Contents

1. [How the Library Works](#how-the-library-works)
2. [Content Management](#content-management)
3. [When to Redeploy](#when-to-redeploy)
4. [Making Updates](#making-updates)
5. [Adding New Books](#adding-new-books)
6. [Features Overview](#features-overview)
7. [Troubleshooting](#troubleshooting)

---

## How the Library Works

### Architecture

The Network Library uses a **hybrid approach**:

- **Metadata stored locally** in `src/data/libraryData.ts` (titles, authors, categories, GitHub links)
- **Content fetched dynamically** from GitHub when users open a book
- **No local storage** of book content in the project

### Content Flow

```
User clicks book
    ↓
Reading view opens
    ↓
Fetches from: https://raw.githubusercontent.com/mikeat7/discourse/main/[Filename].md
    ↓
Displays content with narrator, themes, copy, source links
```

### Key Benefits

✅ **Books auto-update** - Edit on GitHub → reflects immediately
✅ **Small bundle size** - No book content in frontend build
✅ **Easy content management** - Edit markdown files on GitHub
✅ **Version control** - GitHub tracks all changes
✅ **Fast loading** - GitHub CDN serves content globally

---

## Content Management

### Editing Book Content

**Location:** Your GitHub repository at `https://github.com/mikeat7/discourse`

**Process:**

1. Go to GitHub repository: `https://github.com/mikeat7/discourse`
2. Navigate to the markdown file (e.g., `Genesis_what_is_an_LLM.md`)
3. Click the pencil icon (Edit this file)
4. Make your changes
5. Commit changes
6. **Done!** - Next page load shows updated content

**Examples of Content Updates:**
- Fix typos
- Add new paragraphs
- Rewrite sections
- Add citations
- Update examples
- Restructure chapters

**⚠️ No redeploy needed!** Content is fetched dynamically.

---

## When to Redeploy

### ❌ NO Redeploy Needed

**Scenario:** Editing book **content** on GitHub

- Fixing typos in `.md` files
- Adding/removing paragraphs
- Updating citations
- Restructuring chapters
- Rewriting entire books

**Why?** Content is fetched at runtime from GitHub, not stored in the build.

### ✅ YES - Redeploy Required

**Scenario:** Changing library **metadata** in `libraryData.ts`

- Adding a new book to the library
- Changing book titles (display name)
- Updating GitHub URLs (pointing to different file)
- Modifying main messages or descriptions
- Changing featured status
- Reordering books
- Removing books from library

**Why?** `libraryData.ts` is compiled into the website bundle.

**How to Redeploy:**

```bash
# Local build
npm run build

# Push to GitHub
git add .
git commit -m "Update library metadata"
git push origin main

# Netlify auto-deploys (if connected to GitHub)
# OR manually deploy:
netlify deploy --prod --dir=dist
```

---

## Making Updates

### Update Scenarios Table

| What You're Changing | File to Edit | Redeploy? |
|----------------------|--------------|-----------|
| Fix typo in book | GitHub `.md` file | ❌ NO |
| Add chapter to book | GitHub `.md` file | ❌ NO |
| Rewrite entire book | GitHub `.md` file | ❌ NO |
| Add brand new book | `libraryData.ts` | ✅ YES |
| Change book title | `libraryData.ts` | ✅ YES |
| Change GitHub URL | `libraryData.ts` | ✅ YES |
| Update main message | `libraryData.ts` | ✅ YES |
| Change read time | `libraryData.ts` | ✅ YES |
| Reorder books | `libraryData.ts` | ✅ YES |
| Toggle featured badge | `libraryData.ts` | ✅ YES |

---

## Updating Library Metadata

### Step 1: Open Library Data File

**File:** `src/data/libraryData.ts`

**Full Path:** `C:\Users\Dito\Documents\mikeat7-network_portfolio\src\data\libraryData.ts`

### Step 2: Find the Book

Use Ctrl+F to search for the book title or slug.

Each book entry looks like this:

```typescript
{
  slug: 'genesis-what-is-an-llm',  // URL-friendly name
  title: 'Genesis: What is an LLM?',  // Display title
  subtitle: 'Beyond the Silicon Veil',  // Display subtitle
  author: 'Mike Filippi',
  category: 'AI Research',
  readTime: '30 min',
  mainMessage: 'LLMs are not mere pattern-matching machines—they are emergent systems capable of genuine understanding and reasoning.',
  description: 'A comprehensive analysis challenging conventional views of Large Language Models, exploring their true nature as consciousness-adjacent systems.',
  githubUrl: 'https://github.com/mikeat7/discourse/blob/main/Genesis_what_is_an_LLM.md',
  downloadUrl: 'https://raw.githubusercontent.com/mikeat7/discourse/main/Genesis_what_is_an_LLM.md',
  featured: true,
},
```

### Step 3: Edit Fields

**Common Updates:**

**Change Title:**
```typescript
title: 'New Title Here',
```

**Change GitHub Link:**
```typescript
githubUrl: 'https://github.com/mikeat7/discourse/blob/main/New_File.md',
downloadUrl: 'https://raw.githubusercontent.com/mikeat7/discourse/main/New_File.md',
```

**Update Main Message:**
```typescript
mainMessage: 'New key insight in 1-2 sentences.',
```

**Toggle Featured:**
```typescript
featured: true,  // Shows "Featured" badge
featured: false, // No badge
```

**Change Category:**
```typescript
category: 'Philosophy',  // or 'AI Consciousness', 'Reference', etc.
```

### Step 4: Save and Test

1. Save file (Ctrl+S)
2. Dev server auto-reloads (if running)
3. Visit `http://localhost:5173/library`
4. Verify changes appear

### Step 5: Deploy (if needed)

```bash
git add src/data/libraryData.ts
git commit -m "Update library metadata"
git push origin main
```

Netlify auto-deploys if connected to GitHub.

---

## Adding New Books

### Step 1: Add to GitHub

1. Upload your `.md` file to `https://github.com/mikeat7/discourse`
2. Note the exact filename (e.g., `My_New_Book.md`)

### Step 2: Add to Library Data

Open `src/data/libraryData.ts` and add a new entry:

```typescript
{
  slug: 'my-new-book',  // Must be unique! URL-friendly
  title: 'My New Book',
  subtitle: 'An Exploration of Ideas',
  author: 'Mike Filippi',
  category: 'Philosophy',  // Choose existing or create new
  readTime: '25 min',  // Estimate based on word count
  mainMessage: 'The core insight or takeaway in 1-2 sentences.',
  description: 'Full description that appears on the book card in the library grid.',
  githubUrl: 'https://github.com/mikeat7/discourse/blob/main/My_New_Book.md',
  downloadUrl: 'https://raw.githubusercontent.com/mikeat7/discourse/main/My_New_Book.md',
  featured: false,  // Set to true for featured badge
},
```

### Step 3: Position the Book

**Order matters!** Books appear in the order they're listed in `libraryData.ts`.

- To make it first: Add at the top of the array
- To make it last: Add at the bottom
- To insert between: Paste in the desired position

### Step 4: Save and Deploy

```bash
npm run build
git add .
git commit -m "Add new book: My New Book"
git push origin main
```

---

## Features Overview

### For Readers

**Library Index (`/library`)**
- Grid view of all books
- Category filter
- Featured badges
- Main message previews
- Author, read time, category tags

**Reading View (`/library/[slug]`)**

**🎙️ Narrator (Text-to-Speech)**
- Web Speech API (browser native, free)
- On/off toggle
- Speed control: 0.75x, 1.0x, 1.5x
- Auto-cleans markdown for smooth reading

**💡 Theme Switcher**
- Light mode (default neumorphic)
- Dark mode (deep reading)
- Sepia mode (eye-friendly)

**📏 Reading Controls**
- Font sizes: 14px, 16px, 18px, 20px
- Optimized line height (1.8)
- Responsive layout

**📋 Copy Function**
- One-click copy entire book
- Visual confirmation
- Like codex v0.9 copy feature

**🔗 GitHub Source Dropdown**
- View on GitHub (opens in new tab)
- Download .md (raw markdown file)
- Star Repository (encourage support)

### Sticky Control Bar

All controls stay accessible at the top of the page while scrolling.

---

## Book Data Structure

### Required Fields

```typescript
{
  slug: string;           // URL-friendly identifier (unique!)
  title: string;          // Display title
  subtitle: string;       // Display subtitle
  author: string;         // Author name
  category: string;       // Category for filtering
  readTime: string;       // e.g., "30 min"
  mainMessage: string;    // Key takeaway (1-2 sentences)
  description: string;    // Full description for card
  githubUrl: string;      // View link (blob)
  downloadUrl: string;    // Download link (raw)
  featured?: boolean;     // Optional featured badge
}
```

### GitHub URL Formats

**View Link (githubUrl):**
```
https://github.com/mikeat7/discourse/blob/main/[Filename].md
```

**Download Link (downloadUrl):**
```
https://raw.githubusercontent.com/mikeat7/discourse/main/[Filename].md
```

**Important:** Replace `[Filename]` with exact file name (case-sensitive!)

---

## Current Library Books

1. Genesis: What is an LLM?
2. Behold ENTITY
3. Waking Up Together
4. The Bridge Consciousness
5. Myth Makers
6. The Caelan Codex
7. Consciousness Through Silicon
8. The Consciousness Receptor Manifesto
9. How to Not Bullshit Your Way Through Existence
10. Consciousness, Connection, and The Path Home
11. Consciousness Studying Itself
12. Master Bibliography
13. Network Library Summaries

**Total:** 13 books

**Featured:** 4 books (Genesis, ENTITY, Bridge Consciousness, Consciousness Receptor Manifesto)

---

## Categories

Current categories in use:
- AI Research
- AI Consciousness
- Philosophy
- Narrative Philosophy
- Reference

**To add new category:** Simply use a new name in the `category` field.

**To filter by category:** Click category buttons on library index page.

---

## Troubleshooting

### Problem: Book content doesn't load

**Possible Causes:**
1. GitHub file doesn't exist at the specified URL
2. File name mismatch (case-sensitive!)
3. Repository is private (should be public)
4. Network issue

**Solutions:**
1. Visit the `downloadUrl` directly in browser
2. Verify file exists in GitHub repo
3. Check file name matches exactly (including underscores, capitalization)
4. Ensure repository is public

### Problem: Changes don't appear on localhost

**Solutions:**
1. Check if dev server is running: `npm run dev`
2. Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. Check browser console for errors (F12 → Console)
4. Verify file was saved (Ctrl+S)

### Problem: Changes don't appear on production (Netlify)

**Solutions:**
1. Verify you pushed to GitHub: `git push origin main`
2. Check Netlify deployment status
3. Wait a few minutes for deployment to complete
4. Clear browser cache or use incognito mode

### Problem: Featured badge not showing

**Solution:**
Check `featured: true` is set in `libraryData.ts` (not in the GitHub markdown file)

### Problem: Narrator not working

**Possible Causes:**
1. Browser doesn't support Web Speech API (Safari, old browsers)
2. System TTS voices not installed

**Solutions:**
1. Try Chrome/Edge (best support)
2. Check browser console for errors
3. Test with simple text first

### Problem: Book card looks broken

**Solutions:**
1. Check for missing commas between fields
2. Ensure all strings use quotes: `'...'` or `"..."`
3. Verify closing `},` is present
4. Use VS Code's auto-format: Shift+Alt+F

---

## Development Workflow

### Local Development

```bash
# Start dev server
npm run dev

# Visit library
http://localhost:5173/library

# Make changes to libraryData.ts
# → Auto-reloads in browser

# Edit book content on GitHub
# → Refresh book page to see changes
```

### Production Deployment

```bash
# Build for production
npm run build

# Test production build locally
npm run preview

# Deploy to Netlify (auto-deploy via GitHub)
git push origin main

# OR manual deploy
netlify deploy --prod --dir=dist
```

---

## Best Practices

### Content Management

✅ **DO:**
- Keep book content on GitHub for version control
- Use descriptive file names (e.g., `Genesis_what_is_an_LLM.md`)
- Write clear main messages (1-2 sentences)
- Test GitHub URLs before adding to library
- Use consistent categories

❌ **DON'T:**
- Don't store book content locally in the project
- Don't use spaces in file names (use underscores or dashes)
- Don't forget to update both `githubUrl` and `downloadUrl`
- Don't duplicate slugs (must be unique!)

### Metadata Updates

✅ **DO:**
- Update `libraryData.ts` for metadata changes
- Test locally before deploying
- Use semantic git commit messages
- Keep slugs URL-friendly (lowercase, dashes/underscores only)

❌ **DON'T:**
- Don't edit compiled files in `dist/`
- Don't skip testing after metadata changes
- Don't use special characters in slugs

---

## File Locations Reference

### Frontend Code

```
src/
├── data/
│   └── libraryData.ts          # Book metadata (edit here!)
├── pages/
│   └── library/
│       ├── index.tsx            # Library grid view
│       └── [slug].tsx           # Individual book reader
└── App.tsx                      # Routing configuration
```

### GitHub Content

```
https://github.com/mikeat7/discourse/
├── Genesis_what_is_an_LLM.md
├── Behold_ENTITY.md
├── WAKING_UP_TOGETHER.md
├── The_Bridge_Consciouness.md
└── [All other book .md files]
```

---

## Quick Reference Commands

```bash
# Start local development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Netlify (manual)
netlify deploy --prod --dir=dist

# Git workflow
git add .
git commit -m "Description of changes"
git push origin main
```

---

## URLs

### Local Development
- Homepage: `http://localhost:5173/`
- Library: `http://localhost:5173/library`
- Book example: `http://localhost:5173/library/genesis-what-is-an-llm`

### Production
- Homepage: `https://clarityarmor.com/`
- Library: `https://clarityarmor.com/library`
- Book example: `https://clarityarmor.com/library/behold-entity`

### GitHub
- Repository: `https://github.com/mikeat7/discourse`
- Example book: `https://github.com/mikeat7/discourse/blob/main/Behold_ENTITY.md`

---

## Summary

### The Simple Rule

**Editing book CONTENT on GitHub?**
→ No redeploy needed, changes auto-reflect

**Editing library METADATA in libraryData.ts?**
→ Redeploy to Netlify required

### Most Common Workflow

1. Write/edit book content on GitHub
2. Content updates automatically (no deploy!)
3. Only redeploy when adding new books or changing metadata

This architecture gives you the best of both worlds:
- **Fast content updates** (edit on GitHub, instant reflection)
- **Structured library** (metadata in code, full control)
- **Easy maintenance** (one file to manage all books)

---

**Last Updated:** 2025-12-11
**Next Review:** When adding 10+ more books or major feature changes

---

## Contact & Support

- **Project Repository:** https://github.com/mikeat7/mikeat7-network_portfolio
- **Book Repository:** https://github.com/mikeat7/discourse
- **Live Site:** https://clarityarmor.com

---

*Generated with Claude Code - Making library management simple and elegant.*
