## Sanity TypeGen: why `--enforce-required-fields`

📚 Sanity's `validation: Rule.required()` is a Studio-side editorial rule —
it stops an editor from publishing a document without that field in the
Studio UI. It is **not** a database-level constraint.

Documents can still end up with missing fields via:

- The HTTP API / mutations bypassing Studio validation (e.g. seed data)
- Drafts (which are never validated)
- Older documents created before the field existed or before validation was added

Because of this, Sanity TypeGen is pessimistic by default — every field in
every generated query result type comes out nullable, even "required" ones:

\`\`\`typescript
type USERS_QUERY_RESULT = {
\_id: string
username: string | null
email: string | null
gender: string | null
}
\`\`\`

...instead of the much friendlier:

\`\`\`typescript
type USERS_QUERY_RESULT = {
\_id: string
username: string
email: string
gender: string | null
}
\`\`\`

This forces annoying `?? 'fallback'` handling on the front end for fields
that, in practice, are never missing:

\`\`\`typescript
function UserList({users}: {users: USERS_QUERY_RESULT}) {
return (
<ul>
{users.map((user) => (
<li key={user._id}>
{user.username ?? 'Unknown user'} — {user.email ?? 'no email'}
</li>
))}
</ul>
)
}
\`\`\`

We control 100% of the write path on this project (internal tool, no public
form submissions, no seed scripts that skip validation), so we trust
`required()` to mean "will always be present." The `--enforce-required-fields`
flag (see `package.json` → `typegen` script) tells TypeGen to respect that.

⚠️ If this project ever adds public-facing forms, draft previews on the
front end, or migration scripts that bypass validation — **revisit this**.
The flag stops being safe the moment writes aren't fully controlled.

## Sanity Generated Types & IntelliSense

Sanity's `typegen` outputs query result types like `POST_QUERY_RESULT` into
`src/sanity/generated-types.ts`. These names are accurate but not great for app code,
so we re-export cleaner aliases from `src/types/index.ts`, e.g.:

```ts
export type Post = POST_QUERY_RESULT
```

**Problem:** Because both `generated-types.ts` and `types/index.ts` export a type
related to "Post", Cursor/VS Code's auto-import would suggest both when typing
`Post` in a `.tsx` file — easy to accidentally import the raw generated type
instead of the friendly alias.

**Fix:** Excluded the generated types file from auto-import suggestions via workspace
settings, so it never shows up as an auto-import candidate in editor code — while still
allowing manual/explicit imports (e.g. in seed scripts) when the raw generated types are
genuinely needed.

`.vscode/settings.json`:

```json
{
  "typescript.preferences.autoImportFileExcludePatterns": ["**/sanity/generated-types.ts"]
}
```

After editing this setting, restart
the TS server (Ctrl+Shift+P => `TypeScript: Restart TS Server`) for it to take effect.
