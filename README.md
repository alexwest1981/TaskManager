# Svelte Task Manager 🚀

En modern och responsiv att-göra-applikation byggd med de senaste webbteknologierna. Projektet fokuserar på snabbhet, användarvänlighet och ett stilrent gränssnitt med stöd för både ljust och mörkt läge.

## ✨ Funktioner

- **Premium Binder UI**: Ett taktilt, mapp-inspirerat gränssnitt med ett avancerat flik-system för sömlös navigation.
- **🤖 AI Briefing**: Dynamiska, reaktiva sammanfattningar av ditt läge byggda med Svelte 5 `$derived.by`.
- **⏱️ Focus Session**: En inbyggd Pomodoro-timer med mekanisk estetik för fokuserat arbete.
- **📜 Aktivitetslogg**: Fullständig historik över alla förändringar i din pärm för total kontroll.
- **🎙️ Röststyrning**: Lägg till uppgifter genom att prata direkt till appen (Web Speech API).
- **📅 Kalendervy**: En visuell månadskalender som mappar dina uppgifter mot datum.
- **☀️ Realtidsväder**: Integrerad väderprognos och klocka för bättre tidskontext.
- **📝 Sticky Notes**: Snabba digitala kom-ihåg-lappar direkt i pärmen.
- **Drag-and-Drop**: Omorganisera dina uppgifter enkelt genom att dra och släppa.
- **Mörkt Läge**: Fullt stöd för mörkt läge (System & Manual).
- **Persistent Lagring**: SQLite-databas via Drizzle ORM.
- **Svelte 5 Runes**: Utnyttjar `$state`, `$derived` och `$effect` för högpresterande reaktivitet.

## 📝 Changelog

### Version 1.1.0 (Nuvarande)
- **Folder Migration**: Hela gränssnittet omstrukturerat till en "mapp-arkitektur" med sidoflikar.
- **Productivity Suite**: Lagt till AI Briefing, Focus Session (Pomodoro) och Aktivitetslogg.
- **Stability Fix**: Åtgärdat 500-fel relaterade till SSR och rensat upp i tunga "Sensory Suite"-moduler för bättre prestanda.
- **UI Polish**: Expanderat "Sticky Notes" och optimerat sidofältet för större skärmar.

### Version 1.0.0
- Initial lansering med röststyrning, kalender och bas-prioritering.

## 🛠 Teknisk Stack

- **Framework**: [SvelteKit 2.x](https://kit.svelte.dev/) & [Svelte 5](https://svelte.dev/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Databas**: [SQLite](https://sqlite.org/) via [LibSQL](https://turso.tech/libsql)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **API**: [Open-Meteo](https://open-meteo.com/) (Väder)
- **Web APIs**: Web Speech API (Röststyrning)
- **Build Tool**: [Vite](https://vitejs.dev/)

## 🚀 Kom igång

### Förutsättningar

- [Node.js](https://nodejs.org/) (version 20 eller senare rekommenderas)
- npm (eller pnpm/yarn)

### Installation

1. Klona repositoryt (om relevant) eller navigera till mappen.
2. Installera beroenden:
   ```bash
   npm install
   ```

### Databas-setup

Innan du startar appen behöver du initiera databasen:

```bash
# Generera migrations
npm run db:generate

# Pusha tabell-strukturen till din lokala local.db
npm run db:push
```

### Utveckling

Starta utvecklingsservern:

```bash
npm run dev

# Eller starta och öppna i webbläsaren direkt
npm run dev -- --open
```

## 📦 Bygge och Produktionssättning

För att skapa en optimerad produktionsversion:

```bash
npm run build
```

Du kan förhandsgranska bygget lokalt med:

```bash
npm run preview
```

## 📜 Skript-referens

- `npm run dev`: Startar Vite i utvecklingsläge.
- `npm run build`: Bygger för produktion.
- `npm run check`: Kör typtestning med `svelte-check`.
- `npm run lint`: Kör Prettier och ESLint.
- `npm run format`: Formaterar koden med Prettier.
- `npm run db:push`: Synkar Drizzle-schemat direkt till databasen.
- `npm run db:studio`: Öppnar Drizzle Studio för att inspektera datan visuellt.

---

Skapad med ❤️ med Svelte 5.
