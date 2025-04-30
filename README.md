# SnappShare - Frontend

SnappShare is a secure file-sharing platform that supports chunked and resumable uploads using the power of Nuxt 3, Pinia, and IndexedDB. The frontend app is optimized for user experience, resiliency, and real-time feedback during large file uploads.

---

## 🌐 Tech Stack

- **Nuxt 3** - Vue 3-powered SSR and client-side rendering
- **TypeScript** - Fully typed codebase
- **Pinia** - Store and state management
- **IndexedDB** - Local persistence for uploads
- **idb-keyval** - Lightweight IndexedDB wrapper
- **TailwindCSS** - Utility-first design
- **DotLottieVue** - Animated feedback
- **Lottie** - Visual loading/error cues

---

## 📁 Project Structure

```
- composables/          # Upload logic (runners, hashing, db interaction)
- stores/               # File upload Pinia store
- pages/files/[id].vue  # File detail viewer (with progress, resume support)
- services/             # API abstraction for all network calls
- workers/              # Hashing logic in web workers
- types/                # Central TS types
```

---

## 🚀 Features

- ✅ Resumable chunk uploads
- ✅ Hashing via web worker
- ✅ IndexedDB persistence across refreshes
- ✅ Realtime progress + chunk retry logic
- ✅ File expiration & finalization detection
- ✅ Skeleton loaders + animation feedback

---

## 🛠️ Setup

```bash
git clone https://github.com/Freeman-md/SnappshareWeb.git
cd SnappshareWeb
npm install

# Copy env and set your API base URL
cp .env.example .env
```

Update `.env`:
```env
NUXT_PUBLIC_API_BASE=http://localhost:5028
```

---

## 🧪 Dev Server
```bash
yarn dev
```

---

## 🔧 Build
```bash
yarn build && yarn preview
```

---

## 🧠 Concepts

- Files are split into 5MB chunks
- Hash is computed before initiating upload
- If file already exists in local state or remote, it resumes
- Chunk upload happens in batches of 3 with retries
- Finalization is triggered after all chunks succeed

---

## 📌 TODO

- [ ] Auth integration
- [ ] Admin dashboard

---

## 🙌 Contributing

1. Fork repo
2. Create feature branch
3. Commit & PR with context

---

## 📜 License

MIT © 2025 Freeman (Freemancodz)

