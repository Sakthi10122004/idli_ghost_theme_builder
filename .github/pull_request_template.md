## 📝 Summary

<!-- In 2–3 sentences, what does this PR do and why? -->

**Closes** #<!-- issue number -->

## 🏷️ Type of change

- [ ] 🐛 Bug fix
- [ ] ✨ New feature
- [ ] 🧩 New or updated block / component
- [ ] ⚙️ Compiler / theme export change
- [ ] 🎨 UI / styling
- [ ] ♻️ Refactor (no behaviour change)
- [ ] 📚 Docs / tooling
- [ ] 💥 Breaking change (existing saved themes or exports affected)

## 🔍 What changed

<!--
List the key changes, e.g.
- Added `newsletter` members-form attributes in `newsletter/compiler.ts`
- Fixed off-by-one in `moveBlock` when dragging down
-->

## 📸 Screenshots

<!--
Required for any visual change. Delete this section if not applicable.
Show before/after; include dark mode and mobile if relevant.

| Before | After |
| :----: | :---: |
| img    | img   |
-->

## ✅ Checklist

**Verification**

- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run test:components`
- [ ] `npm run test:export`
- [ ] `npm run test:compilation`
- [ ] `npm run build`
- [ ] `npm audit` — no new high or critical vulnerabilities _(required if dependencies changed)_

**Ghost theme output** _(compiler / component changes only)_

- [ ] Exported ZIP passes gscan in the builder
- [ ] User input is escaped (`escapeHtml` / `escapeUrl`), no raw values in HBS, CSS or JS
- [ ] Responsive style values are resolved (no `[object Object]`)

**Editor**

- [ ] Tested in Desktop, Tablet and Mobile preview modes
- [ ] Tested in light and dark mode
- [ ] New blocks registered in `registry.ts` and `blockTemplates.ts`

## 💬 Notes for reviewers

<!-- Anything reviewers should focus on, known limitations, or follow-ups. Delete if none. -->
