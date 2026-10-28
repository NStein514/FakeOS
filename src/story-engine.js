const ROSTERS = {
  missing: [
    { name: 'Mara Ellison', pronoun: 'she', possessive: 'her' },
    { name: 'Inez Vale', pronoun: 'she', possessive: 'her' },
    { name: 'Jules Mercer', pronoun: 'they', possessive: 'their' },
    { name: 'Nina Solis', pronoun: 'she', possessive: 'her' },
    { name: 'Ari Bell', pronoun: 'they', possessive: 'their' },
    { name: 'Sasha Quinn', pronoun: 'she', possessive: 'her' },
    { name: 'Theo Marlow', pronoun: 'he', possessive: 'his' },
    { name: 'June Park', pronoun: 'she', possessive: 'her' },
    { name: 'Robin Reyes', pronoun: 'they', possessive: 'their' },
    { name: 'Kit Bennett', pronoun: 'he', possessive: 'his' },
    { name: 'Remy Cho', pronoun: 'they', possessive: 'their' },
    { name: 'Leila Frost', pronoun: 'she', possessive: 'her' },
  ],
  ally: ['Rowan Kade', 'Sol Bennett', 'Kit Moreno', 'June Bell', 'Alex Park', 'Sam Navarro', 'Dev Kapoor', 'Ren Okafor', 'Tess Vale', 'Owen Reyes', 'Max Flores', 'Ash Quinn'],
  suspect: ['Rowan Kade', 'Dara Voss', 'Perry Flint', 'Nico Gray', 'Blair Sutton', 'Cleo North', 'Milo Hart', 'Tamsin Reed', 'Rory Price', 'Jae Winter', 'Luca Wynn', 'Emery Cross'],
  correspondent: ['Sol · East Line', 'Kit · Night Desk', 'June · Archives', 'Dev · Switchboard', 'Tess · City Watch', 'Ren · Lost Property', 'Alex · After Hours', 'Sam · Field Notes'],
};

const PLACES = [
  { name: 'the East Line, platform nine', short: 'Platform 9', time: 'the 00:14 train' },
  { name: 'the old switchyard', short: 'Switchyard', time: 'the last train north' },
  { name: 'the closed-down Glass Arcade', short: 'Glass Arcade', time: 'the 23:52 last call' },
  { name: 'the riverside payphone', short: 'Riverside', time: 'the floodgate opening' },
  { name: 'the third-floor archive', short: 'Archive Floor 3', time: 'the midnight shift change' },
  { name: 'the blue door on Aster Street', short: 'Aster Street', time: 'the neighborhood blackout' },
  { name: 'the abandoned weather station', short: 'Weather Station', time: 'the first midnight signal' },
  { name: 'the tunnel beneath West Market', short: 'West Market', time: 'the 00:14 train' },
  { name: 'the locked greenhouse', short: 'Greenhouse', time: 'the night irrigation cycle' },
  { name: 'the municipal radio tower', short: 'Radio Tower', time: 'the last transmission' },
  { name: 'the empty rooms above Oriole Café', short: 'Oriole Café', time: 'the closing bell' },
  { name: 'the forgotten room at Pier 17', short: 'Pier 17', time: 'the tide change' },
];

const ARTIFACTS = [
  { file: 'voice_memo_03.m4a', icon: 'radio', kind: 'voice memo', detail: 'the third voice memo', quote: 'If they ask who erased it, check who still has the old key.' },
  { file: 'IMG_0041.heic', icon: 'spark', kind: 'photograph', detail: 'the photo under the sticker', quote: 'We were not alone in that picture. Look at the reflection.' },
  { file: 'last_stop.csv', icon: 'train', kind: 'transit log', detail: 'a deleted transit record', quote: 'That train did not appear on the public schedule.' },
  { file: 'weather_00-14.wav', icon: 'moon', kind: 'audio recording', detail: 'a recording hidden in a weather report', quote: 'If you can hear this, I made it past the first door.' },
  { file: 'north_window.jpg', icon: 'door', kind: 'photograph', detail: 'a torn photograph', quote: 'I put the original somewhere the inspection will never find it.' },
  { file: 'receipt_0007.pdf', icon: 'files', kind: 'scanned receipt', detail: 'a carbon copy someone forgot to shred', quote: 'Paid in cash. Signed by the person who said they were not there.' },
  { file: 'signal_fragment.enc', icon: 'radio', kind: 'audio fragment', detail: 'a partial encrypted transmission', quote: 'The signal is still there. Just listen between the announcements.' },
  { file: 'do_not_forward.txt', icon: 'files', kind: 'plain-text file', detail: 'a note marked do not forward', quote: 'I am keeping one copy. Please do not make me the only one.' },
  { file: 'field_recording_2.m4a', icon: 'radio', kind: 'field recording', detail: 'a field recording with the date rubbed out', quote: 'They keep moving the meeting. They cannot move the echo.' },
  { file: 'the_other_key.png', icon: 'door', kind: 'scanned sketch', detail: 'a drawing folded inside an old contact card', quote: 'The lock is simple. It is everyone agreeing not to try that is the problem.' },
  { file: 'outgoing_0003.txt', icon: 'message', kind: 'recovered message', detail: 'a message stuck in the outgoing queue', quote: 'If I do not come back, the message is the map.' },
  { file: 'static_between.wav', icon: 'radio', kind: 'radio recording', detail: 'a ninety-second pocket recording', quote: 'Two taps, a pause, then three. That is not interference.' },
];

const MOTIVES = [
  'proof that an entire night of public records was rewritten',
  'a recording that places an absent witness at the scene',
  'a transit log that was never meant to be publicly accessible',
  'evidence that the blackout was switched on deliberately',
  'an archive showing who changed the official story first',
  'a list of missing people somebody was told to erase',
  'proof that the warning arrived before the incident',
  'an old promise someone powerful insisted never existed',
  'a message that makes every alibi in this circle impossible',
  'a map to the place where the unedited evidence still exists',
  'the name of the person who kept everybody else quiet',
  'a copy of the story the city voted to forget',
];

const SIGNALS = [
  { channel: '90.4 MHz', note: 'a radio station no public receiver is tuned to', wave: 'A late-night frequency has started turning up in old posts.' },
  { channel: '00:14', note: 'the exact minute the East Line timetable skips', wave: 'One minute keeps disappearing from the transit timetable.' },
  { channel: 'four short rings', note: 'a call pattern that never appears in the carrier logs', wave: 'Somebody’s making calls that do not show up on anyone’s bill.' },
  { channel: 'blue light, twice', note: 'a signal hidden between streetlight test cycles', wave: 'Two blue flashes at midnight. Everyone local knows not to ask why.' },
  { channel: 'the third announcement', note: 'a station announcement that was removed from every recording', wave: 'The third announcement is back. Transit insists there are only two.' },
  { channel: 'channel seven', note: 'an unused emergency channel that was never decommissioned', wave: 'Somebody left the emergency-band receiver switched on.' },
  { channel: 'a voice beneath the weather', note: 'a second voice mixed underneath the public forecast', wave: 'Anyone else hear someone talking underneath the forecast?' },
  { channel: 'a half-second of silence', note: 'a gap inserted into the citywide midnight broadcast', wave: 'Every public recording has exactly the same strange half-second gap.' },
  { channel: 'the north-window reflection', note: 'the reflected face missing from the original photograph', wave: 'Photos from that night all lose the same person in the glass.' },
  { channel: 'a paper transfer slip', note: 'the one unscanned record that escaped the archive', wave: 'There is one physical copy left. Everything else is a mirror.' },
  { channel: 'two taps, one pause', note: 'the knocking pattern beneath a noisy voice memo', wave: 'Tap, tap. Wait. The reply comes back from the wrong floor.' },
  { channel: 'a borrowed name', note: 'an alias that nobody in the contact list remembers adding', wave: 'This person has been on the feed for months. Nobody remembers meeting them.' },
];

const FACTIONS = [
  'the Night Transit Office', 'the Municipal Memory Board', 'the Lantern Cooperative',
  'the Ninth Platform Union', 'the Department of Unclaimed Names', 'the Glasshouse Trust',
  'the Civic Weather Service', 'the After-Hours Switchboard',
];

const COMPLICATIONS = [
  'the only witness remembers the night in the wrong order',
  'the original file changes whenever it is copied',
  'a public safety alert describes the investigators instead of the incident',
  'the safe meeting place has been quietly demolished',
  'someone has been using the ally’s number to send false instructions',
  'the missing person left two mutually exclusive goodbyes',
  'the suspect is protecting a witness who does not know they are in danger',
  'every copy contains a different final sentence',
];

const COUNTERCLUES = [
  'a timestamp from before the phone was manufactured',
  'a receipt bearing the handwriting of someone who cannot write',
  'a city map with one street removed from every digital copy',
  'a contact photo reflected in a window that was bricked over',
  'an outgoing call logged during a total network outage',
  'a signature matching a person who was never officially born',
  'a train ticket validated at a station with no platform',
  'an empty audio track that still casts a waveform-shaped shadow',
];

const RED_HERRING_CLAIMS = [
  'An archived neighborhood bulletin names a witness at a place they never visited.',
  'A cached transit notice claims the suspect boarded a train that did not run.',
  'An anonymous post says the original was moved to a location missing from the official record.',
  'A duplicated directory entry ties the case to a person with no matching call history.',
  'A corrected timetable points to a meeting that conflicts with every surviving timestamp.',
  'A mirror site repeats a rumor word-for-word, then labels the repetition as corroboration.',
];

const MEMORY_FRAGMENTS = [
  'You promised to come back before the lamps went out.',
  'We said we would remember it differently, not forget it.',
  'If the archive goes quiet, ask who taught it your name.',
  'I left the porch light on for the person I used to be.',
  'Nobody disappears alone; somebody always keeps the place.',
  'The first version was kinder. That is how I know it was false.',
  'Do not trust the map that knows where you are going.',
  'I remember the ending. It is the beginning that keeps changing.',
];

const OMENS = [
  'The city clock shows a minute that never happened.',
  'Someone has put every clock in this block five minutes behind.',
  'An unread message keeps changing its timestamp.',
  'A contact card has a photograph, but nobody in the photo has a face.',
  'The last train keeps arriving after its own departure time.',
  'Every backup ends one sentence before the same name.',
  'A voice memo has your phone model ringing in the background.',
  'A reflection in the photo appears to be holding a second phone.',
  'Three deleted drafts have the same opening line in three different handwriting styles.',
  'A message arrives from somebody whose number was never assigned.',
  'A station notice names a platform that was bricked up years ago.',
  'Someone is replying to posts before anyone publishes them.',
];

const EPITHETS = [
  'The Minute Between Trains', 'A Map of Quiet Things', 'The Last Unlisted Stop',
  'The Static Between Us', 'Every Window Turned Inward', 'A Voice With No Sender',
  'The Unsent Address', 'The Night the Clocks Lied', 'The Blue Door Was Open',
  'Someone Kept the Original', 'Nobody Was Here Alone', 'After the Last Announcement',
];

export function makePicker(seed) {
  let state = 2166136261;
  for (const character of String(seed || 'afterlight')) {
    state ^= character.charCodeAt(0);
    state = Math.imul(state, 16777619) >>> 0;
  }
  if (state === 0) state = 0x6d2b79f5;
  return (size) => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    value = (value ^ (value >>> 14)) >>> 0;
    return value % size;
  };
}

function selectDistinct(choose, collection, excludedNames = []) {
  const excluded = new Set(Array.isArray(excludedNames) ? excludedNames : [excludedNames]);
  const choices = collection.filter((person) => !excluded.has(typeof person === 'string' ? person : person.name));
  const selected = choices[choose(choices.length)];
  return typeof selected === 'string' ? selected : selected.name;
}

export const STORY_CHAPTER_COUNT = 5;
const SECOND_EPISODE_ARCS = {
  'the-open-signal': {
    title: 'The Witness Network',
    teaser: 'The truth went public. Now someone is answering from inside the archive.',
    opening: 'The public record has changed overnight. A reply arrives with a witness list that should not exist.',
    pressure: 'Every repost adds a new witness—and a new person who wants them silenced.',
    legacy: 'The signal you opened becomes a map other people can follow.',
  },
  'the-living-archive': {
    title: 'The Unwritten Room',
    teaser: 'You protected the witnesses. One of them remembers a room that is missing from every map.',
    opening: 'The witnesses kept their copies safe. One copy contains a room none of them remembers entering.',
    pressure: 'The room appears only in private copies; comparing them may destroy the one thing they agree on.',
    legacy: 'The archive you protected has room for one more impossible memory.',
  },
  'the-quiet-door': {
    title: 'The Number That Stayed',
    teaser: 'You erased the trail. At the same minute each night, the disconnected phone rings again.',
    opening: 'The trail went dark. The phone still rings at the same minute, carrying a call from the erased route.',
    pressure: 'Following the ring could reveal who escaped—or rebuild the trail you erased.',
    legacy: 'The silence you chose has started answering back.',
  },
};

const CHARACTER_CONFIGURATIONS = ROSTERS.missing.reduce((total, missing) => total + ROSTERS.ally
  .filter((ally) => ally !== missing.name)
  .reduce((count, ally) => count + ROSTERS.suspect
    .filter((suspect) => suspect !== missing.name && suspect !== ally).length, 0), 0);
export const STORY_TEMPLATE_COUNT = CHARACTER_CONFIGURATIONS * ROSTERS.correspondent.length * PLACES.length * ARTIFACTS.length * MOTIVES.length * SIGNALS.length * OMENS.length * EPITHETS.length * FACTIONS.length * COMPLICATIONS.length * COUNTERCLUES.length * MEMORY_FRAGMENTS.length * RED_HERRING_CLAIMS.length * 2 ** 4 * 3;

export function createStory(seed) {
  const normalizedSeed = String(seed || 'afterlight').slice(0, 80);
  const choose = makePicker(normalizedSeed);
  const missingCharacter = ROSTERS.missing[choose(ROSTERS.missing.length)];
  const missing = { ...missingCharacter };
  const ally = { name: selectDistinct(choose, ROSTERS.ally, missing.name) };
  const suspect = { name: selectDistinct(choose, ROSTERS.suspect, [ally.name, missing.name]) };
  const correspondent = { name: selectDistinct(choose, ROSTERS.correspondent, '') };
  const place = PLACES[choose(PLACES.length)];
  const artifact = ARTIFACTS[choose(ARTIFACTS.length)];
  const motive = MOTIVES[choose(MOTIVES.length)];
  const signal = SIGNALS[choose(SIGNALS.length)];
  const omen = OMENS[choose(OMENS.length)];
  const episodeTitle = EPITHETS[choose(EPITHETS.length)];
  const faction = FACTIONS[choose(FACTIONS.length)];
  const complication = COMPLICATIONS[choose(COMPLICATIONS.length)];
  const counterclue = COUNTERCLUES[choose(COUNTERCLUES.length)];
  const memoryFragment = MEMORY_FRAGMENTS[choose(MEMORY_FRAGMENTS.length)];
  const redHerring = {
    person: selectDistinct(choose, ROSTERS.suspect, [missing.name, ally.name, suspect.name]),
    place: PLACES.filter((candidate) => candidate.name !== place.name)[choose(PLACES.length - 1)],
    claim: RED_HERRING_CLAIMS[choose(RED_HERRING_CLAIMS.length)],
  };

  return {
    seed: normalizedSeed,
    episodeTitle,
    missing,
    ally,
    suspect,
    correspondent,
    place,
    artifact,
    motive,
    signal,
    omen,
    faction,
    complication,
    counterclue,
    memoryFragment,
    redHerring,
    episodeNumber: 1,
    chapters: [
      {
        title: 'The message that arrived late',
        app: 'Messages',
        icon: 'message',
        summary: `${missing.name} is missing. A message on their own phone arrived after the number was disconnected. It contains a clue pointing to ${place.name}. ${memoryFragment}`,
        prompt: `A message from ${missing.name} appears on a disconnected number. What do you do?`,
        choices: [
          { id: 'trust', label: `Trust ${missing.name}`, description: 'Reply before the signal disappears.', message: `I believe you. What can I do?` },
          { id: 'verify', label: 'Ask for proof', description: 'Get something concrete before you commit.', message: 'I need proof. Tell me something only you know.' },
        ],
      },
      {
        title: 'The signal underneath',
        app: 'Wave',
        icon: 'wave',
        summary: `A Wave post leads to ${signal.note}. Meanwhile, ${correspondent} confirms that ${place.time} is the last chance to get there. ${faction} has quietly removed every public mention of the signal.`,
        prompt: `The signal is ${signal.channel}. Do you leave a trace, or keep the trail invisible?`,
        choices: [
          { id: 'broadcast', label: 'Echo the signal', description: 'Leave one person a way to find the evidence.', message: 'Wave picks up your echo. The wrong people may hear it, too.' },
          { id: 'archive', label: 'Keep it off the feed', description: 'Save the signal privately and trust nobody.', message: 'The post stays quiet. The trail is yours alone.' },
        ],
      },
      {
        title: 'A name in the margins',
        app: 'Contacts',
        icon: 'contacts',
        summary: `The backup restores two contact cards: ${ally.name}, an old friend, and ${suspect.name}, who was last seen near ${place.name}. Both know about ${motive}. The trail is complicated: ${complication}.`,
        prompt: `Two people claim they can help. Who gets the whole truth?`,
        choices: [
          { id: 'trust-ally', label: `Call ${ally.name}`, description: 'Trust the friend who stayed out of the records.', message: `${ally.name} answers on the first ring. “I kept the original safe.”` },
          { id: 'confront-suspect', label: `Confront ${suspect.name}`, description: 'Ask the person who can explain the missing records.', message: `${suspect.name} is quiet for a long time. Then: “You should not have that file.”` },
        ],
      },
      {
        title: 'The message in the outbox',
        app: 'Mail',
        icon: 'mail',
        summary: `${ally.name} left an unsent email explaining how ${suspect.name} tracked the original. Its headers expose a route to ${place.name}; forwarding it would make the route easier to follow. One detail contradicts the story: ${counterclue}.`,
        prompt: 'The unsent email could get help to the witnesses—or put the original in danger. What do you do?',
        choices: [
          { id: 'forward-email', label: 'Forward the unedited thread', description: 'Give the correspondent the full context, including the trail.', message: 'I am forwarding the whole thread. The original should not stay with one person.' },
          { id: 'seal-email', label: 'Seal the thread', description: 'Remove identifying headers and share only what the witnesses need.', message: 'I am keeping the route private. The evidence can travel without the names.' },
        ],
      },
      {
        title: 'The last copy',
        app: 'Files',
        icon: 'files',
        summary: `The file ${artifact.file} contains ${motive}. It implicates ${faction}, but ${complication}. The next choice decides whether anyone else will ever see it.`,
        prompt: 'One file. One decision. Where does the truth go?',
        choices: [
          { id: 'publish', label: 'Send it to everyone', description: 'The truth will survive, even if it costs you.', message: 'The message leaves the outbox. Its recipients cannot be recalled.' },
          { id: 'protect', label: 'Give it to the witnesses', description: 'Keep the evidence intact. Protect the people in it.', message: 'You put a copy in the hands of people the story belongs to.' },
          { id: 'vanish', label: 'Erase the trail', description: 'Keep everyone safe by ending the search.', message: 'The file goes dark. The people it protected stay unnamed.' },
        ],
      },
    ],
    endings: {
      publish: { id: 'the-open-signal', title: 'The Open Signal' },
      protect: { id: 'the-living-archive', title: 'The Living Archive' },
      vanish: { id: 'the-quiet-door', title: 'The Quiet Door' },
    },
  };
}

export function makeStorySeed() {
  const bytes = new Uint32Array(2);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
    return [...bytes].map((part) => part.toString(36).padStart(7, '0')).join('').slice(0, 12);
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`.slice(0, 12);
}

export function createStoryState(seed = makeStorySeed()) {
  return {
    seed,
    story: createStory(seed),
    chapter: 1,
    choices: {},
    ending: null,
    discoveries: [],
    investigation: { browser: null, calendar: null },
  };
}

export function recordInvestigationChoice(progress, app, choice) {
  const allowed = {
    browser: ['pursue', 'flag'],
    calendar: ['verify', 'trust'],
  };
  if (!progress?.story || !allowed[app]?.includes(choice) || progress.investigation?.[app]) return progress;
  return {
    ...progress,
    investigation: { browser: null, calendar: null, ...progress.investigation, [app]: choice },
  };
}

export function chooseStoryBranch(progress, branchId) {
  if (!progress?.story || progress.ending || progress.chapter < 1 || progress.chapter > STORY_CHAPTER_COUNT) return null;
  const chapter = progress.story.chapters[progress.chapter - 1];
  const selected = chapter.choices.find((choice) => choice.id === branchId);
  if (!selected) return null;
  const choices = { ...progress.choices, [progress.chapter]: branchId };
  const result = {
    ...progress,
    choices,
    chapter: progress.chapter === STORY_CHAPTER_COUNT ? STORY_CHAPTER_COUNT : progress.chapter + 1,
    ending: progress.chapter === STORY_CHAPTER_COUNT ? createEnding(progress.story, branchId, choices, progress.investigation) : null,
  };
  return { progress: result, selected, chapter };
}

function attachFollowUp(ending, story, endingId) {
  if (story.episodeNumber !== 1) return ending;
  return { ...ending, followUp: SECOND_EPISODE_ARCS[ending.id] };
}

export function createSequelStory(parentStory, ending) {
  const arc = SECOND_EPISODE_ARCS[ending?.id];
  if (!parentStory || parentStory.episodeNumber !== 1 || parentStory.chapters?.length !== STORY_CHAPTER_COUNT || !arc || ending.followUp?.title !== arc.title) return null;
  const sequel = createStory(`${parentStory.seed}-episode-two-${ending.id}`);
  const chapters = sequel.chapters.map((chapter, index) => ({
    ...chapter,
    title: [
      'The answer after the ending',
      'A signal with witnesses',
      'The names the archive missed',
      'A second message in the outbox',
      'What the next copy costs',
    ][index],
    summary: [
      `${arc.opening} ${sequel.memoryFragment} The new trace points to ${sequel.place.name}.`,
      `${arc.legacy} ${sequel.faction} has noticed the new ${sequel.signal.channel} signal. ${arc.pressure}`,
      `${sequel.ally.name} and ${sequel.suspect.name} disagree about ${sequel.complication}. Both have seen ${sequel.counterclue}.`,
      `${sequel.ally.name} sends a new unsent thread about ${sequel.counterclue}. ${arc.pressure}`,
      `The new evidence is ${sequel.artifact.file}. It may expose ${sequel.motive}; ${arc.legacy}`,
    ][index],
    prompt: index === 0 ? `After ${ending.title}, do you trust the new message or ask how it found you?` : chapter.prompt,
  }));
  return {
    ...sequel,
    episodeNumber: 2,
    episodeTitle: `${arc.title}: ${sequel.episodeTitle}`,
    parentEndingId: ending.id,
    parentEndingTitle: ending.title,
    arc,
    chapters,
  };
}

function endingTitleForInvestigation(ending, investigation) {
  const followedFalseLead = investigation.calendar === 'trust'
    || (investigation.browser === 'pursue' && investigation.calendar !== 'verify');
  return followedFalseLead ? { ...ending, title: `${ending.title} — False Trail` } : ending;
}

function createEnding(story, endingId, choices, investigation = {}) {
  const { missing, ally, suspect, place, motive } = story;
  const correspondent = story.correspondent.name;
  const signalIsPublic = choices[2] === 'broadcast';
  const trustWasEarned = choices[1] === 'verify';
  const witness = choices[3] === 'confront-suspect' ? suspect.name : ally.name;
  const emailWasForwarded = choices[4] === 'forward-email';
  const investigationDetail = investigation.calendar === 'trust'
    ? `An anonymous calendar edit led the search to ${story.redHerring.place.name}, costing the witnesses precious time.`
    : investigation.browser === 'pursue' && investigation.calendar !== 'verify'
      ? `The cached lead sent the search toward ${story.redHerring.place.name} and delayed the recovery.`
      : investigation.browser === 'pursue' && investigation.calendar === 'verify'
        ? `The calendar check exposed the cached claim about ${story.redHerring.person} as false before it could derail the search.`
        : investigation.browser === 'flag'
          ? `You marked the claim about ${story.redHerring.person} unverified and kept the team on the real trail.`
          : '';

  if (endingId === 'publish') {
    const chain = signalIsPublic
      ? `The signal leads ${correspondent} to the original`
      : `${witness} secretly delivers the original to ${correspondent}`;
    const emailDetail = emailWasForwarded
      ? `The forwarded thread gives the city the unedited trail, too.`
      : `The sealed email keeps the witnesses’ identities out of the public record.`;
    const factionDetail = `The evidence implicates ${story.faction}, and ${story.counterclue} survives as independent corroboration.`;
    return attachFollowUp({
      ...endingTitleForInvestigation(story.endings.publish, investigation),
      line: `At ${place.name}, ${chain}. By morning the city can see ${motive}. ${investigationDetail} ${trustWasEarned ? `${missing.name}'s evidence stands up to every question` : `the message ${missing.name} sent finally makes sense`}. ${emailDetail} ${factionDetail} ${suspect.name} goes on record. The signal stays open.`,
    }, story, endingId);
  }

  if (endingId === 'protect') {
    const emailDetail = emailWasForwarded
      ? `The forwarded thread lets the witnesses verify every handoff.`
      : `The sealed thread leaves no identifying route behind.`;
    return attachFollowUp({
      ...endingTitleForInvestigation(story.endings.protect, investigation),
      line: `${signalIsPublic ? `${correspondent} joins ` : ''}${witness} brings the original to ${place.name} and puts it in the witnesses’ hands. It proves ${motive}. ${investigationDetail} ${trustWasEarned ? `${missing.name} confirms it in ${missing.pronoun} own words` : `${missing.name} agrees the truth belongs to its witnesses`}. ${emailDetail} ${story.faction} cannot erase ${story.counterclue} from the witnesses’ copies. Nobody gets to edit the original again.`,
    }, story, endingId);
  }

  const emailDetail = emailWasForwarded
    ? `The forwarded headers expose the route, so ${missing.name} burns the trail before it can be followed.`
    : `The sealed thread leaves no route to follow.`;
  return attachFollowUp({
    ...endingTitleForInvestigation(story.endings.vanish, investigation),
    line: `By ${place.time}, ${missing.name} is somewhere ${suspect.name} will never think to look. ${investigationDetail} ${signalIsPublic ? `The public signal becomes a decoy; the original disappears at ${place.name}.` : `With no signal to follow, nobody can trace the original to ${place.name}.`} ${emailDetail} You keep the secret about ${motive}. ${story.complication} ${trustWasEarned ? `${missing.name} chose to leave, knowing the evidence survived somewhere safe` : `${missing.name} leaves without a name attached`}.`,
  }, story, endingId);
}

export function discoverStoryEvidence(progress, evidenceId) {
  if (!progress?.story || !evidenceId || progress.discoveries.includes(evidenceId)) return progress;
  return { ...progress, discoveries: [...progress.discoveries, evidenceId] };
}
