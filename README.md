# Dead Letter — FakeOS

A self-contained, responsive, desktop-and-mobile React mystery played through a fictional device. Explore Messages, Mail, Contacts, Files, the Wave social feed, Browser, and Calendar; clues can surface an encrypted contact, recover a hidden backup, expose a planted search result, and alter the feed.

## Afterlight Story Loom

The offline Story Loom composes each episode from a replayable seed and authored characters, factions, locations, artifacts, motives, signals, omens, complications, counter-clues, memory fragments, red herrings, and branching narrative rules. Five main chapters take place across Messages, Wave, Contacts, Mail, and Files. Optional Browser and Calendar investigations add a generated false lead: players can flag its unsourced claim, pursue it and lose time, verify it against the timeline, or trust the anonymous edit and reach a false-trail ending. Four main chapter choices still determine whether the evidence is published, protected, or hidden.

Each ending unlocks an optional, distinct follow-up episode: **The Witness Network**, **The Unwritten Room**, or **The Number That Stayed**. Start the follow-up from the ending card, or begin another mystery instead. The sequel seed is derived from the original seed and ending, so the unlocked arc replays consistently on this device.

The library estimate includes the generated red-herring ingredient alongside the authored story and choice combinations. Generation is deterministic and local; no AI service, API key, or network connection is required.

## Local saves

Progress, messages, discovered evidence, and the notebook save locally in this browser. Starting a new story or follow-up archives the current run (up to eight runs); reopen archived stories from the notebook. Older four-chapter stories are archived on upgrade, and previous five-chapter saves are reconstructed using their existing choices so they gain the new narrative elements without losing progress.

## Run it locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`.
