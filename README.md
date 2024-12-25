# Core Project

This is a Next.js project configured with Yarn as the package manager, along with ESLint for linting, Prettier for code formatting, and Husky for Git hooks.

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 12.22.0 or later)
- [Yarn](https://yarnpkg.com/) (recommended for package management)

### Installation

1. Install the dependencies using Yarn:

   ```bash
   yarn install
   ```

### Running the Development Server

To start the development server, run:

```bash
yarn dev
```

The application will be available at `http://localhost:3000`.

### Linting and Formatting

This project uses ESLint and Prettier for maintaining code quality and consistency.

- To run ESLint, use:

  ```bash
  yarn lint
  ```

### Git Hooks with Husky

Husky is set up to run scripts on certain Git hooks. For example, before committing, Husky will run ESLint to ensure that the code adheres to the specified linting rules.

### Scripts

Here are some of the scripts available in this project:

- `yarn dev`: Start the development server.
- `yarn build`: Build the application for production.
- `yarn start`: Start the production server.
- `yarn lint`: Run ESLint to check for code quality.
- `yarn format`: Format code with Prettier.