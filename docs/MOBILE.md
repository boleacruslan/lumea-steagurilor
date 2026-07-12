# Mobil — Capacitor (Android / iOS)

Aplicația **Lumea Steagurilor** rulează ca app nativ prin Capacitor (același cod web).

## Ce e deja în proiect

- `capacitor.config.json` — appId: `com.lumeasteagurilor.app`
- foldere `android/` și `ios/`
- scripturi npm pentru build + sync

## Cerințe pe Mac

### Android (recomandat primul)

1. **Android Studio** (Ladybug sau mai nou)  
   https://developer.android.com/studio  
2. La instalare: Android SDK, emulator  
3. **JDK 21** (Android Studio adesea îl aduce)  
4. Variabile (opțional, în `~/.zshrc`):

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools
```

### iOS

1. **Xcode** din App Store (nu doar Command Line Tools)  
2. Deschide Xcode o dată, acceptă licența  
3. Pentru telefon real: Apple ID în Xcode → Signing

## Comenzi utile

```bash
cd ~/mir-flagov

# 1) Construiește web-ul pentru mobil (cale relative ./) + copiază în android/ios
npm run build:mobile

# 2) Deschide Android Studio
npm run cap:android

# sau Xcode
npm run cap:ios
```

În Android Studio: alege emulator / telefon → **Run ▶**.

## Workflow de dezvoltare

1. Schimbi codul React în `src/`  
2. `npm run build:mobile` (sau `npx cap sync` după `VITE_BASE=./ npm run build`)  
3. Rulezi din Android Studio / Xcode  

Pentru hot-reload pe device (avansat): live reload cu `server.url` în `capacitor.config` — opțional mai târziu.

## Build-uri diferite

| Comandă | La ce |
|---------|--------|
| `npm run build` / `build:web` | GitHub Pages (`/lumea-steagurilor/`) |
| `npm run build:mobile` | App Capacitor (`./`) |

## Test pe telefon Android (USB)

1. Pe telefon: Opțiuni dezvoltator → **USB debugging**  
2. Cablu USB → acceptă debugging  
3. `npm run cap:android` → selectează device → Run  

APK de test (din Android Studio): **Build → Build Bundle(s) / APK(s) → Build APK(s)**.

## GitHub

Poți face push la `main` cu folderele `android/` și `ios/`.  
**Nu** se rulează app-ul pe github.io — acolo rămâne doar **web**.  
App-ul se testează local / pe device.

## ID aplicație

- **appId:** `com.lumeasteagurilor.app`  
- **Nume:** Lumea Steagurilor  

Schimbă în `capacitor.config.json` dacă vrei alt package name (înainte de publicare în store).
