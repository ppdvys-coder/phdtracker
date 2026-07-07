# 🎓 PhD Journey Tracker

Your PhD dashboard — timeline, interviews, activity log, calendar, tasks, publications,
lecturer record, CV and reports — as a **live app you can open on any device**, with your
data **encrypted before it leaves the browser**.

- **Front-end:** `index.html` + `app.jsx` (host free on GitHub Pages — no build step)
- **Shared store:** Supabase (free tier, no server) — one encrypted row syncs every device
- **Privacy:** everything is encrypted in your browser with a passphrase (AES-GCM). Supabase
  only ever stores ciphertext. There is **no password reset** — if you forget the passphrase,
  the cloud copy can't be decrypted, so keep a JSON backup (see below).

It already works right now in **local-only mode** (this one browser). Do Part A + B once to
make it multi-device.

---

## How it's wired (30-second version)

The app reads and writes through a single `window.storage` object defined at the top of
`index.html`. That shim: encrypts your whole dataset with your passphrase → stores it as
**one row** (`key = "phd-journey-…"`) in a Supabase table. On another device you enter the
same passphrase and it decrypts. The app's built-in **⟳ Sync** button and **Live** checkbox
pull the latest from other devices.

---

## Part A — Make it sync (Supabase, ~4 min, one-time)

1. Go to **https://supabase.com** → sign in → **New project**. Any name + database password,
   free plan. Pick a region near you (London).
2. When it's ready: left sidebar → **SQL Editor** → **New query**, paste this and click **Run**:

   ```sql
   create table phd_state (
     key text primary key,
     value text,
     updated_at timestamptz default now()
   );

   alter table phd_state enable row level security;
   create policy "read"   on phd_state for select using (true);
   create policy "insert" on phd_state for insert with check (true);
   create policy "update" on phd_state for update using (true);
   ```

   > The open policies are fine here **because the `value` is already encrypted** — anyone
   > reaching the row only sees ciphertext, and only your passphrase can decrypt it.

3. Get your keys: sidebar → **Project Settings → API**. Copy:
   - **Project URL** (e.g. `https://abcdxyz.supabase.co`)
   - **anon / public** key (the long one — safe to put in a public page)
4. Open **`index.html`**, find the `CONFIG` block near the bottom, and paste them in:

   ```js
   const SUPABASE_URL      = "https://abcdxyz.supabase.co";
   const SUPABASE_ANON_KEY = "eyJhbGciOi....";   // the anon public key
   ```

That's it — the ⚠ local-only banner disappears and your data now syncs across devices.

> Keep `DOC_ID` as-is. It's your private row id. (Change it only if you ever want to start a
> brand-new, separate store.)

---

## Part B — Put it online (GitHub Pages, free permanent link)

1. Create a **private or public** GitHub repo, e.g. `phd-tracker`.
   *(Public is fine — the data lives encrypted in Supabase, not in the repo. The anon key is
   designed to be public.)*
2. Upload **both** `index.html` and `app.jsx` (drag-drop on github.com, or git below).
3. Repo → **Settings → Pages** → Source **Deploy from a branch** → **main** → **/ (root)** → Save.
4. ~1 min later your link is **`https://<username>.github.io/phd-tracker/`**. Open it on your
   laptop, phone, iPad — enter your passphrase on each. 🎉

### Via command line
```bash
cd phd-tracker
git init && git add . && git commit -m "PhD journey tracker"
git branch -M main
git remote add origin https://github.com/<username>/phd-tracker.git
git push -u origin main
```
Update later: edit the files, then `git commit -am "update" && git push`.

**No-account alternative:** drag the whole `phd-tracker` folder onto
**https://app.netlify.com/drop** for an instant link.

> ⚠ Must be served over **https://** (GitHub Pages / Netlify) or **http://localhost** — browsers
> only allow the encryption on secure origins. Double-clicking the file (`file://…`) won't work.

---

## First run & multiple devices

- **First ever open:** you'll be asked to *create* a passphrase (typed twice). Choose something
  memorable — you'll use it everywhere. Remember: **no reset.**
- **Every other device / browser:** open the same link → *enter* the same passphrase → your data
  decrypts.
- **Pulling changes made elsewhere:** click **⟳ Sync** in the top-right, or tick **Live** to
  auto-refresh every 15s. Your own edits save automatically ~0.6s after you stop typing.
- **🔒 Lock** (bottom-right) reloads and re-locks — handy on a shared computer.

## Backups (do this once you have real data)

Go to the **Add** tab → **Download backup** to save a plain-JSON copy of everything (all tabs +
version history). This is your safety net against a forgotten passphrase. **Restore from file…**
loads it back. Consider downloading a backup every few weeks.

---

## Editing the app

- **Your data** is not in the code — it lives encrypted in Supabase / your browser. Editing the
  files never touches it.
- **`app.jsx`** is the whole dashboard (seed data, tabs, CV baseline). The `seed()` block only
  provides starter content for a brand-new store; once you've saved real data it's ignored.
- **`index.html`** holds the config, the encryption/storage shim, and the passphrase screen.

## Local preview

```bash
cd phd-tracker
python3 -m http.server 4173
# open http://localhost:4173
```
