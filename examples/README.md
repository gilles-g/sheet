# stimulus-sheet Examples

This directory contains working examples demonstrating how to use the `stimulus-sheet` component in various environments.

## 🐳 Symfony with Docker & MariaDB

A complete, production-ready example that you can clone and run immediately.

**Location:** [`symfony/`](./symfony/)

**Features:**
- ✅ Symfony 7.1 framework
- ✅ Docker Compose setup
- ✅ MariaDB database
- ✅ Complete CRUD functionality
- ✅ Form validation
- ✅ Turbo Streams integration
- ✅ One-command setup

**Quick Start:**

```bash
cd examples/symfony
docker compose up -d
./docker-setup.sh
```

Then visit: http://localhost:8000

**Installation Method:** This example uses GitHub installation by default. For local/offline installation using the zip file, see the [Local Installation Guide](../docs/LOCAL_INSTALLATION.md).

**[📖 Read the full documentation →](./symfony/README.md)**

---

## Other Integration Examples

For other frameworks and setups, see the documentation:

- **[CodePen Demo](../docs/CODEPEN_DEMO.md)** - Try it online with interactive examples
- **[Vite Integration](../docs/VITE_INTEGRATION.md)** - Setup with Vite and Turbo
- **[Symfony Integration Guide](../docs/SYMFONY_INTEGRATION.md)** - Detailed integration guide

## Contributing

Have an example for another framework or setup? Contributions are welcome! Please open a pull request.
