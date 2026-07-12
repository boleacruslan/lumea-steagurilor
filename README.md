# Lumea Steagurilor

Joc educațional pentru copii (6–12 ani): steaguri, capitale și continente.

**Versiunea 1** — interfață, conținut și voce **în română**.

## Cum rulezi

```bash
cd mir-flagov
npm install
npm run dev
```

Deschide adresa din terminal (de obicei `http://localhost:5173`).

```bash
npm run build    # build pentru producție
npm run preview  # previzualizare build
```

## Ce include v1

- **50 de țări** de bază + **~50 extra** la dificultate *Greu*
- Moduri: Ghicește steagul, Ghicește capitala, Potrivește perechile, Puzzle steag, Călătorie pe continente
- Stele, colecție de steaguri, realizări (salvate local)
- Animații: steag care flutură, confetti, „deflate” la greșit, ridicare pe catarg
- Voce română (Web Speech API) + sunete UI
- Fără cont / internet pentru logică (date și emoji steaguri sunt în app)

## GitHub

```bash
git init
git add .
git commit -m "Lumea Steagurilor v1 — web RO"
# creează repo pe GitHub, apoi:
git remote add origin https://github.com/USER/mir-flagov.git
git push -u origin main
```

## Stack

React + Vite + React Router. Progres în `localStorage`.
