# Lumea Steagurilor

Joc educațional pentru copii (6–12 ani): steaguri, capitale și continente.  
**Versiunea 1** — totul **în română**.

## Rulezi local

```bash
cd lumea-steagurilor   # sau ~/mir-flagov
npm install
npm run dev
```

Deschide linkul din terminal (cu base path: de obicei  
`http://localhost:5173/lumea-steagurilor/`).

```bash
npm run build
npm run preview
```

## Deploy pe GitHub Pages (online)

Repo: **https://github.com/boleacruslan/lumea-steagurilor**

### Pasul 1 — o dată: activează Pages

1. Deschide repo pe GitHub  
2. **Settings** → **Pages** (meniul din stânga)  
3. **Build and deployment** → **Source:** alege **GitHub Actions**  
4. Salvează (dacă e nevoie)

### Pasul 2 — push pe `main`

```bash
cd ~/mir-flagov   # calea ta locală

git add .
git commit -m "Configure GitHub Pages deploy"
git push origin main
```

### Pasul 3 — așteaptă deploy-ul

1. Pe GitHub: tab **Actions**  
2. Workflow **Deploy to GitHub Pages**  
3. Așteaptă până e **verde** (✅)

### Pasul 4 — joacă online

```
https://boleacruslan.github.io/lumea-steagurilor/
```

Dacă linkul 404: Settings → Pages → verifică Source = **GitHub Actions**,  
și că deploy-ul din Actions a reușit.

---

## Ce include v1

- 50 țări de bază + extra la *Greu*
- Moduri: steag, capitală, perechi, puzzle, călătorie
- Stele, colecție, medalii (`localStorage`)
- UI stil quiz + ovozire română (WAV)
- Fundal sunburst animat

## Stack

React + Vite + React Router.
