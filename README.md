

# 🌐 SyntaxAI — Advanced Syntax Tree Generator App

**SyntaxAI** is an advanced mobile application built with [React Native](https://reactnative.dev/) and powered by [`expo-router`](https://docs.expo.dev/router/introduction/), designed for **linguistic analysis**, **syntax visualization**, and **AI-enhanced explanation** of **phrase structure grammars**.

Users can input complex or simple sentences and receive:
- **Syntactic trees** generated from underlying **grammar rules**
- **Discourse-level analyses** based on multi-clause structures
- **AI explanations** based on linguistic theory (e.g., constituency, dependency grammar)
- Interactive and educational experience for linguists, students, and NLP enthusiasts

---

## 📆 Tech Stack Overview

| Stack | Purpose |
|-------|---------|
| **Expo (React Native)** | Cross-platform app development |
| **Expo Router** | File-based navigation system |
| **Supabase** | Auth, real-time database, secure storage |
| **React Native Paper** | Component library & theming |
| **DeepSeek API** | AI-powered syntactic assistance |
| **TypeScript** | Strongly typed codebase |
| **Custom Grammar Modules** | Core logic for syntax parsing and tree generation |

---

## 🗺️ Project Setup

```bash
npx create-expo-app syntaxai -e with-router
cd syntaxai
npm install
npx expo start
```
---


## 📂 Directory Structure

```bash
app/
├── index.tsx                   # Home screen
├── tree/[sentence].tsx         # Dynamic tree for input sentence

components/
├── TreeView.tsx                # Syntax tree renderer
├── ChatBox.tsx                 # AI explanation chat interface
├── InputField.tsx              # Sentence input

lib/
├── parser.ts                   # Tokenizer + grammar rule logic
├── treeBuilder.ts              # Converts rules into tree nodes
├── aiService.ts                # DeepSeek integration

contexts/
├── AuthContext.tsx             # Authentication state
├── TreeContext.tsx             # Shared tree state
```
# 🧠 Linguistic Features

## ✅ Phrase Structure Grammar (PSG)

SyntaxAI applies **phrase structure rules** like:

S → NP VP
NP → Det N
VP → V NP | V NP PP
PP → P NP

These rules are interpreted and visualized as hierarchical grammar trees through the app’s syntax engine.

---

## 🔀 Sentence Types Supported

- **Simple**: *The dog barked.*
- **Compound**: *The dog barked and the cat meowed.*
- **Complex**: *Although it rained, she played.*
- **Interrogatives**: *What did she say?*
- **Passives**: *The book was read by the teacher.*

---

## 🧩 Discourse Grammar

SyntaxAI supports analysis of:
- Clause segmentation
- Subordination & coordination
- Embedded structures
- Contrastive and topical structures

---

## 🎓 Educational Use

- **Linguistics students** can visualize sentence transformations (e.g., passives, interrogatives).
- **Educators** can create real-time syntactic diagrams for teaching.
- **Developers** can explore syntactic parsing as part of NLP applications.

---

# 🛠️ SyntaxAI Development Roadmap

## 📌 Phase 1: Setup & Infrastructure

- ✅ Initialize with `with-router` template
- ✅ Supabase setup with Row-Level Security (RLS)
- ✅ ESLint + Prettier configuration
- ✅ Git strategy and branching

🗪 *Insert screenshot of Supabase table structure*

---

## 🔐 Phase 2: Authentication

- ✅ Registration, login, and password reset
- ✅ Authentication context setup
- ✅ Profile screen with avatar upload
- ⏳ Language preference selection *(coming soon)*

🎨 *Insert screenshot of login/profile screens*

---

## 🌳 Phase 3: Syntax Tree Generation

### 🖼 Tree Visualization

- Interactive node-based tree rendering
- Zoom, pan, and expand/collapse functionality

### 🧠 Parsing & Tree Logic

- Sentence tokenizer
- Rule matching to generate `TreeNode` objects
- Multi-language grammar support (English live, Russian upcoming)

### 🗃 Tree Management

- Save/load user-specific tree history
- Tree editing mode *(in progress)*
- Export trees as SVG/PNG *(upcoming)*

🌳 *Insert screenshot of tree: “The cat sits on the mat”*

---

## 🤖 Phase 4: AI Integration

### 🔌 DeepSeek API

- Grammar rule explanations via LLM
- Prompt-engineered responses
- Context-aware and adaptive rephrasing

### 💬 Chat Interface

- Real-time syntax assistance via chat
- Chat history with scroll persistence
- Typing indicator for AI response progress

🧠 *Insert screenshot of AI chat explaining a sentence*

---

## 🧪 Phase 5: Testing & Deployment

### ✅ Testing

- Unit tests: UI and tree parsing logic
- Integration tests: Auth + tree save/load
- Performance benchmarks: rendering speed, AI latency

### 🚀 Deployment

- Production-ready Expo configuration
- Crash reporting and monitoring
- Analytics: tree usage, sentence complexity
- Supabase backup and RLS validation

---

# 🔧 Development Standards

## ✅ Code Quality

- Strong TypeScript practices
- Modular, reusable component design
- Shared hooks and services
- Descriptive, clean Git commits

## ⚡ Performance Optimization

- Memoized tree rendering
- Lazy-loading of resource-heavy components
- Optimized parsing cycles and AI API calls

## 🔐 Security

- JWT securely managed in context
- Supabase RLS ensures user-level data access
- No sensitive data stored locally

---

# 📊 Key Metrics of Success

| **Metric**         | **Description**                                |
|--------------------|-------------------------------------------------|
| User Engagement    | Time spent building or analyzing trees          |
| Tree Accuracy      | Match rate to linguistic gold standards         |
| AI Quality         | Relevance and correctness of syntax explanations |
| Retention          | Repeat user percentage                          |
| App Performance    | Rendering and AI response latency               |
| API Health         | Uptime and error rate of Supabase and AI APIs  |

📈 *Insert screenshot: Analytics or Usage Report*

---

# 📚 References

- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [Supabase Docs](https://supabase.com/docs)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [DeepSeek API](https://deepseek.com)
- [X-bar Theory (Linguistics)](https://glossary.sil.org/term/x-bar-theory)
- [Constituency vs Dependency Grammar](https://en.wikipedia.org/wiki/Syntactic_theory)
