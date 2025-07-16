# 🧠 Jarvis - A Minimal Git-like Version Control System in Node.js

Jarvis is a lightweight version control system built in Node.js that mimics essential Git functionality such as staging, committing, and logging. It's a great way to understand how Git works under the hood.

---

## 🔍 How Git Works (Core Concepts)

### 1. **Working Directory**
The place where you create and modify files — your actual project folder.

### 2. **Staging Area (Index)**
A holding area where you add files before committing. It allows you to prepare exactly what goes into the next commit.

### 3. **Commit**
A snapshot of your project's current state. It records what files were changed and includes a message describing the change.

### 4. **.git Directory**
A hidden folder where Git stores everything: commits, objects, references, etc.

### 5. **Remote Repository**
A shared repo (like on GitHub) where multiple people can collaborate by pushing and pulling changes.

---

## 🛠 Prerequisites

Before using Jarvis, install the following:

### ✅ [Node.js (v18+)](https://nodejs.org/en/download)

Check installation:

```bash
node -v
npm -v
```

---

## 📦 Clone the Repository and Setup

### 1. Clone the Project

```bash
git clone https://github.com/Locheir/Jarvis-Git-Clone.git
cd jarvis-vcs
```

### 2. Install Required Node Packages

Jarvis depends on the following packages:
- [`commander`](https://www.npmjs.com/package/commander) – CLI framework
- [`chalk`](https://www.npmjs.com/package/chalk) – Colored terminal output
- [`diff`](https://www.npmjs.com/package/diff) – To show line-level diffs

Install them using:

```bash
npm install commander chalk diff
```

Or use this to initialize with a `package.json`:

```bash
npm init -y
npm install commander chalk diff
```

---

## 🚀 Usage

Make sure you're in the root of your project where you want to use version control.

### 1. Initialize Jarvis

```bash
node jarvis.mjs init
```

Creates a `.jarvis/` folder with:
- `HEAD` – latest commit reference
- `index` – staging area
- `objects/` – all file versions and commits

---

### 2. Add Files to Staging

```bash
node jarvis.mjs add <file>
```

Example:
```bash
node jarvis.mjs add hello.txt
```

---

### 3. Commit Staged Files

```bash
node jarvis.mjs commit "<your message>"
```

Example:
```bash
node jarvis.mjs commit "Added hello.txt"
```

---

### 4. View Commit History

```bash
node jarvis.mjs log
```

Displays all previous commits with their hash, timestamp, and message.

---

### 5. Show Commit Differences

```bash
node jarvis.mjs show <commitHash>
```

Displays file contents and a line-by-line diff between the commit and its parent.

---

## 🧪 Example Workflow

```bash
echo "Hello" > hello.txt

node jarvis.mjs init
node jarvis.mjs add hello.txt
node jarvis.mjs commit "Initial commit"

echo "Hello, World!" > hello.txt
node jarvis.mjs add hello.txt
node jarvis.mjs commit "Updated greeting"

node jarvis.mjs log
node jarvis.mjs show <second_commit_hash>
```

---

## 📁 Internal Structure

```
.jarvis/
│
├── HEAD           # Points to the latest commit
├── index          # Tracks staged files
└── objects/       # Stores file blobs and commit snapshots
```

---

## 📚 Future Enhancements

- `status` command for unstaged/staged changes
- `.jarvisignore` support
- `reset`, `remove`, and `checkout`
- Branching and merging support
- Remote repository support

---

## 🤝 Contributing

If you'd like to enhance this project or fix issues, feel free to fork and send a pull request.

---


---

## 📺 Tutorials Followed

This project was created by following excellent tutorials by **Sanket Singh**:

- [How Git Works Internally (Full Project Tutorial)](https://youtu.be/SEc5PFVSfms?si=kbm-SlhKTG8kIh4j)
- [How Git Internally Works (Conceptual Explanation)](https://youtu.be/8IuY73q3dNU?si=00Hc2sV7766-9KzQ)

Big thanks to him for explaining complex concepts in a simple and engaging way!


## 📄 License

This project is open-sourced under the [MIT License](LICENSE).

---

## 👤 Author

Built with ❤️ by Locheir
GitHub: [https://github.com/Locheir](https://github.com/Locheir)
