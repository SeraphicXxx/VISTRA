# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## Handling Dependencies

### Installing Missing Dependencies

If you encounter missing dependencies after pulling the latest changes, install them using the appropriate command below.

#### Backend

Navigate to the `VISTRA/backend` directory, then run:

```bash
pip install -r requirements.txt
```

#### Frontend

Navigate to the `VISTRA/frontend` directory, then run:

```bash
npm install
```

> **Note:** Make sure your terminal's current working directory is the correct project folder before running the commands.

---

### Adding New Dependencies

If you install a new library or module, update the project's dependency file before committing your changes so that everyone else can install the new dependency.

#### Backend (Python)

After installing a new package:

```bash
pip install <package-name>
pip freeze > requirements.txt
```

Commit the updated `requirements.txt` along with your code changes.

#### Frontend (Node.js)

Install the package using npm:

```bash
npm install <package-name>
```

The `package.json` and `package-lock.json` files will be updated automatically. Commit both files along with your code changes.
