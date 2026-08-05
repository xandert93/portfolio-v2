# Sanity Dataset Management

## Overview

This project uses two Sanity datasets:

- `development` – used for local development and testing.
- `production` – used by the live application.

Occasionally, it's useful to replace the production dataset with the contents of the development dataset (for example after importing new content or rebuilding test data).

---

## Create a backup

Before replacing production, always create a backup.

```bash
sanity dataset export production production-backup.tar.gz
```

This allows the production dataset to be restored if necessary.

---

## Export the development dataset

Create an export of the development dataset.

```bash
sanity dataset export development development.tar.gz
```

---

## Replace the production dataset

Import the development export into production.

```bash
sanity dataset import development.tar.gz production --replace
```

The `--replace` flag deletes all existing documents in the production dataset before importing the new data.

After this completes, the production dataset will be an exact copy of the development dataset.

---

## Full workflow

```bash
# Backup production
sanity dataset export production production-backup.tar.gz

# Export development
sanity dataset export development development.tar.gz

# Replace production
sanity dataset import development.tar.gz production --replace
```

---

## Verify available datasets

To confirm the available datasets for the project:

```bash
sanity dataset list
```

---

## Notes

- This process copies documents and referenced assets.
- Dataset settings, API tokens, CORS configuration, webhooks, and project configuration are **not** copied.
- Always back up production before running an import with `--replace`.
