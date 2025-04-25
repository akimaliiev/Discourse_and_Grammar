

# 🌐 SyntaxAI — Advanced Syntax Tree Generator App

**SyntaxAI** is an advanced mobile application built with [React Native](https://reactnative.dev/) and powered by [`expo-router`](https://docs.expo.dev/router/introduction/), designed for **linguistic analysis**, **syntax visualization**, and **AI-enhanced explanation** of **phrase structure grammars**.

Users can enter complex or simple sentences and receive:
- **Syntactic trees** from underlying **grammar rules**
- **Discourse-level analyses** of multi-clause structures
- **AI explanations** from linguistic theory ( Constituency and dependency grammar)
- Provides a fun and interactive and educational experience for linguists, students and NLP fans.

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

SyntaxAI uses **phrase structure rules** which follow a structure such as:

S → NP VP
NP → Det N
VP → V NP | V NP PP
PP → P NP

These rules are parsed and visualized as hierarchical grammar trees using the application’s syntax engine.

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

- **Linguistics students** can conceptualize transformations on sentences (passive, interrogatives, etc.)
- **Instructors** can create real-time syntactic diagrams while teaching. 
- **Developers** can analyze syntactic parsing for natural language processing (NLP) projects. 

---

# 🛠️ SyntaxAI Development Roadmap

## 📌 Phase 1: Setup & Infrastructure

- ✅ Initialize with `with-router` template
- ✅ Supabase setup with Row-Level Security (RLS)
- ✅ Configuration of ESLint + Prettier
- ✅ Git strategy and branching

🗪 *Insert screenshot of Supabase table structure*

---

## 🔐 Phase 2: Authentication

- ✅ Registration, login, and password reset
- ✅ Authentication context creation
- ✅ Profile screen with an avatar upload
- ⏳ Language preference selection *(coming soon)*

<p align="center">
  <img src="assets/IMG_1780.PNG" alt="Screenshot 1" width="30%" />
  <img src="assets/IMG_1781.PNG" alt="Screenshot 2" width="30%" />
  <img src="assets/IMG_1782.PNG" alt="Screenshot 1" width="30%" />

</p>

---

## 🌳 Phase 3: Syntax Tree Generation

### 🖼 Tree Visualization

- Clickable, node tree visualizer
- Zoom, pan, expand, and collapse capability

### 🧠 Parsing & Tree Logic

- Sentence tokenizer
- TreeNode object creation which does rule matching
- Multi-language grammar support (English, Spanish, Russian. Kazakh coming soon)

### 🗃 Tree Management

- Saving/loading user tree history
- Tree editing mode *(in process)*
- Exporting trees as SVG/PNG *(coming soon)*


<p align="center">
  <img src="assets/IMG_1783.PNG" alt="Screenshot 1" width="30%" />
  <img src="assets/IMG_1784.PNG" alt="Screenshot 2" width="30%" />
  <img src="assets/IMG_1785.PNG" alt="Screenshot 1" width="30%" />

</p>

---

## 🤖 Phase 4: AI Integration

### 🔌 DeepSeek API

- Grammar rule explanations via LLM
- Prompt-engineered responses
- Contextually-aware and adaptive rephrasing

### 💬 Chat Interface

- Real-time syntax support via chat
- Chat history with scroll persistence
- Typing indicator for AI responses.

<p align="center">
  <img src="assets/IMG_1786.PNG" alt="Screenshot 1" width="30%" />
  <img src="assets/IMG_1788.PNG" alt="Screenshot 2" width="30%" />
  <img src="assets/IMG_1787.PNG" alt="Screenshot 1" width="30%" />

</p>

---

## 🧪 Phase 5: Testing & Deployment

### ✅ Testing

- Unit Testing: both the UI and tree parsing logic.
- Integration Testing: Auth + save/load tree.
- Performance Benchmarks: rendering speed, AI latencies.

### 🚀 Deployment

- Production-ready Expo setup.
- Crash reporting and monitoring.
- Analytics (tree usage and sentence complexity).
- Supabase backup and RLS verification.

---

# 🔧 Development Standards

## ✅ Code Quality

- Strong TypeScript execution.
- Modular and reusable component design.
- Shared hooks and services.
- Descriptive and clean Git commits.

## ⚡ Performance Optimization

- Memorized tree renders.
- Lazy-loaded component for resources.
- Using fewest parsing cycles and API calls to the AI.

## 🔐 Security

- JWT handled securely in context.
- Supabase RLS limits user-level access to their data.
- No sensitive data saved locally.

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


---

# 📚 References

- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [Supabase Docs](https://supabase.com/docs)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [DeepSeek API](https://deepseek.com)
- [X-bar Theory (Linguistics)](https://glossary.sil.org/term/x-bar-theory)
- [Constituency vs Dependency Grammar](https://en.wikipedia.org/wiki/Syntactic_theory)
