import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { chooseStoryBranch, createSequelStory, createStoryState, discoverStoryEvidence, makeStorySeed, recordInvestigationChoice, STORY_CHAPTER_COUNT, STORY_TEMPLATE_COUNT } from './story-engine.js';

const STORAGE_KEY = 'afterlight-game-v1';
const ARCHIVE_LIMIT = 8;
const APP_ROUTES = { Messages: 'messages', Mail: 'mail', Contacts: 'contacts', Files: 'files', Wave: 'wave', Browser: 'browser', Calendar: 'calendar' };
const APPS = [
  { id: 'messages', label: 'Messages', icon: 'message', color: 'lavender' },
  { id: 'mail', label: 'Mail', icon: 'mail', color: 'amber' },
  { id: 'contacts', label: 'Contacts', icon: 'contacts', color: 'mint' },
  { id: 'files', label: 'Files', icon: 'files', color: 'blue' },
  { id: 'wave', label: 'Wave', icon: 'wave', color: 'coral' },
  { id: 'browser', label: 'Browser', icon: 'browser', color: 'blue' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar', color: 'amber' },
];
const ICONS = {
  home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></>,
  message: <><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 4a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
  contacts: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 8v6m3-3h-6"/></>,
  files: <><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"/></>,
  wave: <><path d="M2 12h3l3-9 5 18 3-9h6"/></>,
  browser: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18m-13 4h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"/></>,
  arrow: <><path d="M7 17 17 7M7 7h10v10"/></>, chevron: <><path d="m9 18 6-6-6-6"/></>, close: <><path d="m18 6-12 12M6 6l12 12"/></>,
  spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2zM19 14l1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1z"/></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/></>, check: <><path d="m5 12 4 4L19 6"/></>, warning: <><path d="M10.3 3.9 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 4h.01"/></>, heart: <><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></>, send: <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
  radio: <><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8a6 6 0 0 1 0 8.4m-8.4 0a6 6 0 0 1 0-8.4m11.2-2.8a10 10 0 0 1 0 14m-14 0a10 10 0 0 1 0-14"/></>,
  train: <><rect x="5" y="2" width="14" height="16" rx="3"/><path d="m8 21-1-3m9 3 1-3M8 14h.01M16 14h.01M5 8h14"/></>,
  pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2"/></>,
  moon: <><path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/></>, wifi: <><path d="M5 12.6a11 11 0 0 1 14.1 0M8.5 16.2a5.5 5.5 0 0 1 7 0M2 9a16 16 0 0 1 20 0"/><path d="M12 20h.01"/></>, battery: <><rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 11v2"/></>, search: <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>,
};
function Icon({ name, size = 20 }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[name] || ICONS.spark}</svg>; }
function makeGame(archive = []) {
  const progress = createStoryState(makeStorySeed());
  return { ...progress, archive, messages: [{ from: 'mara', text: `This is ${progress.story.missing.name}. I know this number looks impossible. ${progress.story.artifact.quote}`, time: '11:44 PM' }], notes: [], discoveries: [], liked: false, replyPosted: false, notification: 'An original new mystery is waiting for you.' };
}
function upgradeLegacyRun(run) {
  const legacyChapterCount = run?.story?.chapters?.length;
  if (![STORY_CHAPTER_COUNT - 1, STORY_CHAPTER_COUNT].includes(legacyChapterCount)) return run;
  if (legacyChapterCount === STORY_CHAPTER_COUNT && run.story.faction) return run;
  let progress = createStoryState(run.seed);
  for (let chapter = 1; chapter <= STORY_CHAPTER_COUNT; chapter += 1) {
    let branchId = run.choices?.[chapter];
    if (legacyChapterCount === STORY_CHAPTER_COUNT - 1 && chapter === 4 && run.ending) branchId = 'seal-email';
    if (legacyChapterCount === STORY_CHAPTER_COUNT - 1 && chapter === 5) branchId = run.ending?.id === 'the-open-signal' ? 'publish' : run.ending?.id === 'the-living-archive' ? 'protect' : run.ending?.id === 'the-quiet-door' ? 'vanish' : null;
    if (!branchId) break;
    const result = chooseStoryBranch(progress, branchId);
    if (!result) break;
    progress = result.progress;
  }
  return { ...run, ...progress, archive: Array.isArray(run.archive) ? run.archive : [], messages: Array.isArray(run.messages) ? run.messages : [], notes: Array.isArray(run.notes) ? run.notes : [], discoveries: Array.isArray(run.discoveries) ? run.discoveries : [], notification: `Your story ${progress.story.episodeTitle} is saved.` };
}
function beginFollowUp(game, setGame) {
  const story = createSequelStory(game.story, game.ending);
  if (!story) return;
  const previousRun = { ...game, archive: [], notification: 'Archived before the follow-up episode.' };
  const archive = [previousRun, ...(game.archive || []).filter((run) => run.seed !== game.seed)].slice(0, ARCHIVE_LIMIT);
  const progress = createStoryState(story.seed);
  setGame({ ...progress, story, archive, messages: [{ from: 'mara', fromName: story.missing.name, text: story.chapters[0].summary, time: '12:01 AM' }], notes: [], discoveries: [], liked: false, replyPosted: false, notification: `Optional episode unlocked: ${story.arc.title}.` });
}
function loadGame() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const validSave = saved?.story?.seed === saved.seed && saved.choices && !Array.isArray(saved.choices);
    if (validSave && saved.story.chapters?.length === STORY_CHAPTER_COUNT) {
      const run = upgradeLegacyRun(saved);
      const archive = Array.isArray(saved.archive) ? saved.archive.slice(0, ARCHIVE_LIMIT).map(upgradeLegacyRun) : [];
      return { ...run, archive, notification: `Your story ${run.story.episodeTitle} is saved.` };
    }
    if (validSave && saved.story.chapters?.length === STORY_CHAPTER_COUNT - 1) {
      const archived = { ...upgradeLegacyRun(saved), archive: [], notification: 'Archived before the Story Loom chapter update.' };
      const archive = [archived, ...(Array.isArray(saved.archive) ? saved.archive.filter((run) => run.seed !== saved.seed).map(upgradeLegacyRun) : [])].slice(0, ARCHIVE_LIMIT);
      return makeGame(archive);
    }
  } catch { /* Invalid, old, or unavailable local save: generate a new episode. */ }
  return makeGame();
}
function archiveAndStart(game, setGame) {  const archive = [{ ...game, archive: [], notification: 'Archived on this device.' }, ...(game.archive || []).filter((story) => story.seed !== game.seed)].slice(0, ARCHIVE_LIMIT); setGame(makeGame(archive)); }
function advance(game, branchId) {
  const result = chooseStoryBranch(game, branchId);
  if (!result) return null;
  const { progress, selected, chapter } = result;
  const discoveries = [...game.discoveries];
  for (const id of [`chapter-${chapter.title}-${game.seed}`, ...(chapter.app === 'Wave' ? [`signal-${game.seed}`] : []), ...(chapter.app === 'Mail' ? [`email-thread-${game.seed}`] : []), ...(chapter.app === 'Files' ? [`original-${game.seed}`] : [])]) if (!discoveries.includes(id)) discoveries.push(id);
  const selectedContact = chapter.app === 'Contacts' ? (branchId === 'trust-ally' ? game.story.ally.name : game.story.suspect.name) : game.selectedContact;
  if (chapter.app === 'Contacts') discoveries.push(`contact-${selectedContact}-${game.seed}`);
  const speaker = chapter.app === 'Contacts' ? selectedContact : game.story.missing.name;
  const reply = chapter.app === 'Files' ? progress.ending.line : chapter.app === 'Mail' ? (branchId === 'forward-email' ? 'The thread is on its way. They will know how we found the original.' : 'The identifying headers are gone. The witnesses can read it safely.') : chapter.app === 'Contacts' ? `${selected.message} “${game.story.artifact.quote}”` : chapter.app === 'Wave' ? game.story.signal.wave : `I got your reply. ${game.story.artifact.quote}`;
  const messages = [...game.messages, { from: 'me', text: selected.message, time: `Chapter ${game.chapter}` }, { from: 'mara', fromName: speaker, text: reply, time: `Chapter ${game.chapter}`, glitch: chapter.app === 'Wave' }];
  return { ...progress, selectedContact, messages, discoveries: [...new Set(discoveries)], notes: [...game.notes, `${chapter.title}: ${selected.label}. ${chapter.summary}`], replyPosted: game.replyPosted || chapter.app === 'Wave', notification: progress.ending ? `${progress.ending.title} · ending unlocked.` : `Chapter ${game.chapter} completed. ${progress.story.chapters[progress.chapter - 1].title} is waiting.` };
}
function saveEvidence(game, setGame, id, text) { const key = `${id}-${game.seed}`; if (game.discoveries.includes(key)) { setGame({ ...game, notification: 'You already saved this clue.' }); return; } const updated = discoverStoryEvidence(game, key); setGame({ ...game, discoveries: updated.discoveries, notes: [...game.notes, text], notification: 'Evidence saved. Check how it changes the other apps.' }); }
function StatusBar({ time }) { return <div className="status-bar"><span>{time}</span><span className="status-bar__right"><Icon name="wifi" size={15}/><Icon name="battery" size={18}/></span></div>; }
function Header({ icon, title, subtitle, trailing }) { return <div className="app-header"><span className="app-header__icon"><Icon name={icon} size={18}/></span><div className="app-header__heading"><h2>{title}</h2><span>{subtitle}</span></div><div className="app-header__trailing">{trailing}</div></div>; }
function ChoiceCard({ game, app, setGame, navigate }) {
  const chapter = game.story.chapters[game.chapter - 1];
  if (game.ending || !chapter || chapter.app !== app || game.choices[game.chapter]) return null;
  return <div className="story-choice-card"><span className="choice-card__eyebrow"><Icon name={chapter.icon} size={14}/> CHAPTER {game.chapter} OF {STORY_CHAPTER_COUNT} · {app.toUpperCase()}</span><strong>{chapter.prompt}</strong><p>{chapter.summary}</p><div className="story-choices">{chapter.choices.map((choice, index) => <button key={choice.id} className={`story-choice ${index === 0 ? 'story-choice--primary' : ''}`} onClick={() => { const next = advance(game, choice.id); if (!next) return; setGame(next); if (!next.ending) navigate((next.story.chapters[next.chapter - 1].app === 'Contacts' && !next.selectedContact ? 'contacts' : APP_ROUTES[next.story.chapters[next.chapter - 1].app]) || 'messages'); else navigate('messages'); }}><span><strong>{choice.label}</strong><small>{choice.description}</small></span><Icon name="chevron" size={15}/></button>)}</div></div>;
}
function FollowUpUnlock({ game, setGame }) {
  const arc = game.ending?.followUp;
  if (!arc) return null;
  return <section className="archive-chapter follow-up-unlock"><span className="evidence-label"><Icon name="spark" size={13}/> OPTIONAL EPISODE UNLOCKED</span><strong>{arc.title}</strong><p>{arc.teaser}</p><button className="notes-new-game" onClick={() => beginFollowUp(game, setGame)}>Begin follow-up <Icon name="arrow" size={14}/></button></section>;
}
function Messages({ game, setGame, navigate }) {
  const [reply, setReply] = useState('');
  const chapter = game.story.chapters[game.chapter - 1];
  const speaker = game.selectedContact && (game.story.chapters[game.chapter - 2]?.app === 'Contacts' || game.ending) ? game.selectedContact : game.story.missing.name;
  return <><Header icon="message" title="Messages" subtitle={`${speaker} · encrypted`} trailing={<span className="header-lock"><Icon name="lock" size={12}/> LOCAL & PRIVATE</span>}/><div className="conversation-person"><span className="avatar avatar--mara">{speaker[0]}</span><div><strong>{speaker}</strong><span>Chapter {game.chapter} of {STORY_CHAPTER_COUNT} · {game.ending ? 'mystery solved' : chapter.app}</span></div></div><div className="conversation-date"><span/>EPISODE {game.seed.toUpperCase()} · PRIVATE<span/></div><div className="message-list">{game.messages.map((message, index) => <div key={`${game.seed}-${index}`} className={`message-row ${message.from === 'me' ? 'message-row--mine' : ''}`}>{message.from !== 'me' && <span className="message-avatar">{(message.fromName || game.story.missing.name)[0]}</span>}<div><div className={`message-bubble ${message.from === 'me' ? 'message-bubble--mine' : ''} ${message.glitch ? 'message-bubble--glitch' : ''}`}>{message.text}</div><span className="message-time">{message.time}</span></div></div>)}{game.ending ? <div className="story-choice-card ending-card"><span className="choice-card__eyebrow"><Icon name="spark" size={14}/> ENDING · {game.story.episodeTitle.toUpperCase()}</span><strong>{game.ending.title}</strong><p>{game.ending.line}</p><FollowUpUnlock game={game} setGame={setGame}/><button className="notes-new-game" onClick={() => archiveAndStart(game, setGame)}>Generate another story <Icon name="arrow" size={14}/></button></div> : <ChoiceCard game={game} app="Messages" setGame={setGame} navigate={navigate}/>}</div>{!game.ending && <form className="message-composer" onSubmit={(event) => { event.preventDefault(); if (!reply.trim()) return; setGame({ ...game, messages: [...game.messages, { from: 'me', text: reply.trim(), time: 'Now' }], notification: 'Your message stays on this device.' }); setReply(''); }}><button type="button" className="composer-plus" onClick={() => navigate(APP_ROUTES[chapter.app])}>+</button><input value={reply} onChange={(event) => setReply(event.target.value)} placeholder={`Message ${speaker}…`}/><button className={`composer-send ${reply.trim() ? 'composer-send--active' : ''}`} disabled={!reply.trim()} aria-label="Send"><Icon name="send" size={16}/></button></form>}</>;
}
function Mail({ game, setGame, navigate }) {
  const [opened, setOpened] = useState('');
  const story = game.story;
  const mail = [
    { id: 'missing', sender: story.missing.name, color: 'mail-avatar--orange', subject: `i found something near ${story.place.short}`, preview: story.artifact.quote, body: `${story.missing.name} saved ${story.artifact.detail} to show the truth about ${story.motive}. “${story.artifact.quote}”`, attachment: story.artifact.file },
    { id: 'contact', sender: story.correspondent.name, color: 'mail-avatar--green', subject: `RE: ${story.signal.channel}`, preview: `${story.signal.wave} ${story.place.time}.`, body: `Meet at ${story.place.name}. ${story.signal.note}. Keep the signal off the public schedule.`, attachment: `${story.seed}_signal.enc` },
    ...(game.chapter >= STORY_CHAPTER_COUNT - 1 ? [{ id: 'thread', sender: story.ally.name, color: 'mail-avatar--purple', subject: game.choices[4] === 'forward-email' ? `forwarded: route to ${story.place.short}` : game.choices[4] === 'seal-email' ? `sealed: route to ${story.place.short}` : `unsent: route to ${story.place.short}`, preview: game.choices[4] === 'forward-email' ? 'Full headers forwarded with the evidence.' : game.choices[4] === 'seal-email' ? 'Identifying headers removed before sharing.' : 'The headers show how they tracked the original.', body: `${story.ally.name} left this thread unsent: ${story.suspect.name} tracked the original through the identifying headers. The route leads to ${story.place.name}. ${game.choices[4] === 'forward-email' ? 'You forwarded the complete thread, preserving the trail and exposing the witnesses.' : game.choices[4] === 'seal-email' ? 'You sealed the thread, removing identifying headers before the evidence travels.' : 'Forwarding the thread preserves the trail but exposes the witnesses; sealing it removes the names.'}`, attachment: game.choices[4] ? 'unsent_thread.eml · action recorded' : 'unsent_thread.eml' }] : [{ id: 'ally', sender: story.ally.name, color: 'mail-avatar--purple', subject: 'a copy, and a question', preview: `About ${story.missing.name}. What we promised not to lose.`, body: `${story.ally.name} knows why ${story.suspect.name} was at ${story.place.name}. The proof shows ${story.motive}.`, attachment: 'recovery.vcf' }]),
  ];
  return <><Header icon="mail" title="Inbox" subtitle={`${story.episodeTitle} · local archive`} trailing={<span className="mail-count">{story.seed}</span>}/><div className="mail-folder"><span className="mail-folder__active"><Icon name="mail" size={14}/> Episode evidence</span><span>{mail.length} messages</span></div><div className="mail-list">{mail.map((item) => <button key={item.id} className="mail-item" onClick={() => setOpened(opened === item.id ? '' : item.id)}><span className={`mail-avatar ${item.color}`}>{item.sender[0]}</span><span className="mail-item__body"><span className="mail-item__top"><strong>{item.sender}</strong><time>{opened === item.id ? 'OPEN' : '11:44 PM'}</time></span><strong>{item.subject}</strong><span>{item.preview}</span><span className="mail-tag">{item.attachment}</span></span></button>)}</div>{opened && <div className="mail-expanded"><span className="evidence-label"><Icon name="spark" size={13}/> GENERATED FOR THIS EPISODE</span><p>{mail.find((item) => item.id === opened)?.body}</p><button className="text-action" onClick={() => saveEvidence(game, setGame, `mail-${opened}`, mail.find((item) => item.id === opened)?.body || '')}>Save connected clue <Icon name="arrow" size={13}/></button></div>}<ChoiceCard game={game} app="Mail" setGame={setGame} navigate={navigate}/><div className="mail-bottom-note"><Icon name="lock" size={13}/> Saved locally · never sent to a server.</div></>;
}
function Contacts({ game, setGame, navigate }) {
  const story = game.story;
  const contacts = [{ name: story.missing.name, role: 'Last message received · offline', color: 'avatar--mara' }, ...(game.chapter >= 3 ? [{ name: story.ally.name, role: 'Friend · recovered backup', color: 'avatar--rowan' }, { name: story.suspect.name, role: 'Named in a deleted record', color: 'avatar--sol' }] : [{ name: 'Encrypted witness', role: 'Hidden in the recovered backup', color: 'avatar--locked', locked: true }]), { name: story.correspondent.name, role: `Local contact · ${story.signal.channel}`, color: 'avatar--you' }];
  const [selected, setSelected] = useState('');
  return <><Header icon="contacts" title="Contacts" subtitle={`${contacts.length} episode contacts`} trailing={<Icon name="search" size={18}/>}/><div className="contact-list">{contacts.map((person) => <button key={person.name} className={`contact-item ${person.locked ? 'contact-item--locked' : ''}`} onClick={() => { if (person.locked) { navigate('files'); setGame({ ...game, notification: 'The original evidence is encrypted in Files.' }); } else if (person.name === story.missing.name) navigate('messages'); else setSelected(selected === person.name ? '' : person.name); }}><span className={`avatar contact-item__avatar ${person.color}`}>{person.locked ? '?' : person.name[0]}</span><span className="contact-item__info"><strong>{person.name}</strong><span>{person.role}</span></span><Icon name={person.locked ? 'lock' : 'chevron'} size={16}/></button>)}</div>{selected && <div className="contact-detail"><span className="evidence-label"><Icon name="spark" size={13}/> GENERATED CONTACT</span><strong>{selected}</strong><p>{selected === story.ally.name ? `Trust ${story.ally.name} to protect ${story.artifact.detail}.` : `${story.suspect.name} is connected to ${story.motive}.`}</p><button className="text-action" onClick={() => saveEvidence(game, setGame, `contact-${selected}`, `${selected} appears in the case file: ${story.motive}.`)}>Save to notes <Icon name="arrow" size={13}/></button></div>}<ChoiceCard game={game} app="Contacts" setGame={setGame} navigate={navigate}/></>;
}
function Files({ game, setGame, navigate }) {
  const story = game.story;
  const [opened, setOpened] = useState('');
  const files = [
    { id: 'original', name: story.artifact.file, meta: `${story.artifact.kind} · ${story.seed}`, icon: story.artifact.icon, color: 'file-icon--pink', text: `${story.artifact.detail}. “${story.artifact.quote}” ${story.missing.name} connects this evidence to ${story.place.name} and ${story.motive}.` },
    { id: 'readme', name: 'Read me first.txt', meta: 'Generated episode notes · 2 KB', icon: 'files', color: 'file-icon--teal', text: `${story.missing.name} went missing at ${story.place.name}. A clue appears when ${story.signal.note}.` },
    { id: 'signal', name: `${story.seed}_fragment.enc`, meta: `${story.signal.channel} · recovered`, icon: 'radio', color: 'file-icon--orange', text: `${story.signal.wave} ${story.place.time}. ${story.artifact.quote}` },
    ...(game.chapter >= STORY_CHAPTER_COUNT ? [{ id: 'evidence', name: 'THE_LAST_COPY.enc', meta: 'Original evidence · recovered', icon: 'lock', color: 'file-icon--purple', text: `Proof that ${story.motive}. ${story.suspect.name} tried to erase it.` }] : []),
  ];
  return <><Header icon="files" title="Files" subtitle={`${story.episodeTitle} · this device`} trailing={<span className="mail-count">{files.length} FILES</span>}/><div className="storage-card"><div className="storage-card__top"><span><Icon name="files" size={14}/> Episode evidence</span><span>{game.discoveries.length} clues</span></div><div className="storage-bar"><span style={{ width: `${Math.min(100, 15 + game.discoveries.length * 16)}%` }}/></div><div className="storage-card__bottom"><span>Generated locally · private</span><span>{story.place.short}</span></div></div><div className="section-caption">SEED {story.seed.toUpperCase()} · {story.episodeTitle.toUpperCase()}</div><div className="file-list">{files.map((file) => <button key={file.id} className="file-item" onClick={() => setOpened(opened === file.id ? '' : file.id)}><span className={`file-item__icon ${file.color}`}><Icon name={file.icon} size={17}/></span><span className="file-item__details"><strong>{file.name}</strong><span>{file.meta}</span></span><Icon name="chevron" size={15}/>{opened === file.id && <span className="file-preview">{file.text}{!game.discoveries.includes(`${file.id}-${story.seed}`) && <span className="file-preview__cta" role="button" tabIndex={0} onClick={(event) => { event.stopPropagation(); saveEvidence(game, setGame, file.id, file.text); }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); saveEvidence(game, setGame, file.id, file.text); } }}>Recover evidence <Icon name="arrow" size={13}/></span>}</span>}</button>)}</div><ChoiceCard game={game} app="Files" setGame={setGame} navigate={navigate}/><div className="file-privacy"><Icon name="lock" size={13}/> Your evidence never leaves this browser.</div></>;
}
function Wave({ game, setGame, navigate }) {
  const story = game.story;
  const publicChoice = game.choices[2] === 'broadcast';
  const replyVisible = game.replyPosted || game.discoveries.includes(`hidden-reply-${story.seed}`);
  return <><Header icon="wave" title="Wave" subtitle={`${story.episodeTitle} · regenerated feed`} trailing={<span className="live-tag"><span/> LIVE</span>}/><div className="feed-status"><Icon name="spark" size={13}/> <span>{story.omen}</span></div><article className="post-card"><div className="post-author"><span className="avatar avatar--rowan">{story.suspect.name[0]}</span><span><strong>{story.suspect.name.toLowerCase().replaceAll(' ', '.')}</strong><small>@{story.signal.channel.replaceAll(' ', '').toLowerCase()} · 14m</small></span><span className="post-more">···</span></div><p>Not sure why anybody still cares about <em>{story.place.short}.</em> Some files should stay lost.</p>{game.discoveries.some((clue) => clue.startsWith(`original-${story.seed}`)) && <div className="post-context post-context--new"><Icon name="spark" size={13}/> You found the file they wanted erased.</div>}{publicChoice && <div className="post-context post-context--new"><Icon name="wave" size={13}/> Your signal is public. Someone just answered.</div>}<div className="post-actions"><button onClick={() => setGame({ ...game, liked: !game.liked, notification: 'The suspect noticed your public reaction.' })} className={game.liked ? 'post-action--liked' : ''}><Icon name="heart" size={16}/><span>{game.liked ? 13 : 12}</span></button><span className="post-action-save">{story.place.short}</span></div></article><article className="post-card post-card--second"><div className="post-author"><span className="avatar avatar--sol">{story.correspondent.name[0]}</span><span><strong>{story.correspondent.name.toLowerCase().replaceAll(' ', '.')}</strong><small>@afterhours · 1h</small></span><span className="post-more">···</span></div><p>{story.signal.wave} At {story.place.name}, {story.place.time}.</p>{replyVisible && <div className="new-reply"><span className="avatar avatar--mara">{story.missing.name[0]}</span><p><strong>{story.missing.name.split(' ')[0].toLowerCase()}</strong> {story.artifact.quote}</p><span className="new-reply__tag">NEW</span></div>}<div className="post-actions"><button onClick={() => setGame({ ...game, replyPosted: !replyVisible, discoveries: !replyVisible && !game.discoveries.includes(`hidden-reply-${story.seed}`) ? [...game.discoveries, `hidden-reply-${story.seed}`] : game.discoveries, notification: !replyVisible ? `${story.missing.name} surfaced on the public feed.` : 'The reply was hidden again.' })}><Icon name="message" size={15}/><span>{replyVisible ? 1 : 0}</span></button><button onClick={() => saveEvidence(game, setGame, 'wave-reply', `${story.correspondent.name} linked ${story.signal.channel} to ${story.place.name}.`)}><Icon name="heart" size={15}/><span>Save clue</span></button><span className="post-action-save">{story.signal.channel}</span></div></article>{!replyVisible && <button className="wave-hidden" onClick={() => setGame({ ...game, replyPosted: true, discoveries: game.discoveries.includes(`hidden-reply-${story.seed}`) ? game.discoveries : [...game.discoveries, `hidden-reply-${story.seed}`], notification: `${story.missing.name.split(' ')[0]} reappeared in the deleted replies.` })}><Icon name="lock" size={14}/> A deleted reply · {story.seed}<span>Recover it <Icon name="arrow" size={13}/></span></button>}<ChoiceCard game={game} app="Wave" setGame={setGame} navigate={navigate}/><div className="wave-footer">Generated on your device · seed {story.seed}</div></>;
}
function Browser({ game, setGame }) {
  const result = game.investigation?.browser;
  const clue = game.story.redHerring;
  const chooseLead = (choice) => {
    if (game.ending) return;
    const updated = recordInvestigationChoice(game, 'browser', choice);
    if (updated === game) return;
    setGame({ ...updated, notification: choice === 'pursue' ? 'You followed the cached lead. Check Calendar before acting on it.' : 'The search result is marked unverified; the original trail stays intact.' });
  };
  return <><Header icon="browser" title="Browser" subtitle="Local cache · no network" trailing={<span className="mail-count">UNVERIFIED</span>}/><div className="browser-address"><Icon name="lock" size={13}/><span>archive-cache.local/search?q={game.story.seed}</span></div><div className="archive-chapter browser-result"><span className="evidence-label"><Icon name="search" size={13}/> CACHED RESULT · SOURCE UNKNOWN</span><strong>{clue.person} · {clue.place.short}</strong><p>{clue.claim} The result names {clue.person} and points to {clue.place.name}.</p><span className="browser-warning">This copy has no original timestamp or source signature.</span></div>{result ? <div className="investigation-result"><span className="evidence-label"><Icon name={result === 'pursue' ? 'pin' : 'check'} size={13}/> DECISION RECORDED</span><strong>{result === 'pursue' ? 'Lead marked for follow-up' : 'Claim marked unverified'}</strong><p>{result === 'pursue' ? 'Compare the cached claim with the case timeline in Calendar before committing to it.' : 'You kept the unsourced result separate from verified evidence.'}</p></div> : <div className="story-choice-card"><span className="choice-card__eyebrow"><Icon name="spark" size={14}/> OPTIONAL INVESTIGATION · BROWSER</span><strong>Search results can be planted. How do you handle this lead?</strong><div className="story-choices"><button className="story-choice story-choice--primary" onClick={() => chooseLead('pursue')}><span><strong>Follow the lead</strong><small>Investigate {clue.place.short}; it may cost time if the source is false.</small></span><Icon name="chevron" size={15}/></button><button className="story-choice" onClick={() => chooseLead('flag')}><span><strong>Flag it as unverified</strong><small>Do not let an anonymous cache outrank the original evidence.</small></span><Icon name="chevron" size={15}/></button></div></div>}</>;
}
function Calendar({ game, setGame }) {
  const result = game.investigation?.calendar;
  const clue = game.story.redHerring;
  const browserChoice = game.investigation?.browser;
  const chooseTimeline = (choice) => {
    if (game.ending) return;
    const updated = recordInvestigationChoice(game, 'calendar', choice);
    if (updated === game) return;
    const notification = choice === 'verify'
      ? browserChoice === 'pursue' ? 'Timeline check: the cached lead conflicts with the verified case timestamps.' : 'Timeline checked. The original evidence remains your strongest lead.'
      : 'You accepted the anonymous calendar edit without checking its source.';
    setGame({ ...updated, notification });
  };
  return <><Header icon="calendar" title="Calendar" subtitle="Recovered device timeline" trailing={<span className="mail-count">11:44 PM</span>}/><div className="calendar-day"><span>TONIGHT</span><strong>{game.story.place.time}</strong><small>Verified lead · {game.story.place.short}</small></div><div className="calendar-event"><span className="calendar-event__time">11:08 PM</span><div><strong>Original evidence last confirmed</strong><p>{game.story.place.name} · cross-referenced with the recovered file.</p></div><Icon name="check" size={15}/></div><div className="calendar-event calendar-event--unverified"><span className="calendar-event__time">11:08 PM</span><div><strong>Anonymous edit · {clue.place.short}</strong><p>Claims {clue.person} was at {clue.place.name}. No author or edit history.</p></div><Icon name="spark" size={15}/></div>{result ? <div className="investigation-result"><span className="evidence-label"><Icon name={result === 'verify' ? 'check' : 'warning'} size={13}/> DECISION RECORDED</span><strong>{result === 'verify' ? 'Timeline verified' : 'Unverified edit accepted'}</strong><p>{result === 'verify' ? `The claim points to ${clue.place.short}, but its timestamp duplicates the verified event. It is a red herring.` : 'The anonymous entry becomes part of your working theory, even though its source cannot be checked.'}</p></div> : <div className="story-choice-card"><span className="choice-card__eyebrow"><Icon name="calendar" size={14}/> OPTIONAL INVESTIGATION · CALENDAR</span><strong>{browserChoice === 'pursue' ? 'The browser lead points here. Do you check its timestamp?' : 'An anonymous edit competes with the verified case timeline.'}</strong><div className="story-choices"><button className="story-choice story-choice--primary" onClick={() => chooseTimeline('verify')}><span><strong>Verify against the original</strong><small>Compare the calendar edit with the recovered evidence.</small></span><Icon name="chevron" size={15}/></button><button className="story-choice" onClick={() => chooseTimeline('trust')}><span><strong>Trust the anonymous edit</strong><small>Act on the new location without checking the source.</small></span><Icon name="chevron" size={15}/></button></div></div>}</>;
}
function StoryArchive({ archive, setGame, onClose }) { if (!archive?.length) return null; return <section className="story-archive"><span className="eyebrow">YOUR STORY ARCHIVE · {archive.length}</span>{archive.map((run) => { const restored = upgradeLegacyRun(run); return <button key={run.seed} onClick={() => { setGame({ ...restored, notification: `${restored.story.episodeTitle} reopened.` }); onClose(); }}><span><strong>{restored.story.episodeTitle}</strong><small>{restored.ending?.title || `Chapter ${restored.chapter} · ${restored.seed}`}</small></span><Icon name="chevron" size={14}/></button>; })}</section>; }
function Notes({ game, setGame, close }) { const story = game.story; return <div className="notes-overlay" onClick={close}><section className="notes-panel" onClick={(event) => event.stopPropagation()}><div className="notes-panel__top"><span className="eyebrow">AFTERLIGHT STORY STUDIO · SEED {game.seed.toUpperCase()}</span><button className="icon-button" onClick={close} aria-label="Close"><Icon name="close" size={19}/></button></div><h2>{story.episodeTitle}<span className="notes-count">{game.chapter}/{STORY_CHAPTER_COUNT}</span></h2><p className="notes-subtitle">The Story Loom assembles episodes locally from characters, factions, places, artifacts, motives, signals, complications, counter-clues, memories, red herrings, and branching choices. Browser and Calendar add an optional investigation: a seeded false lead can waste time if you trust it, or be exposed by checking the timeline. No AI service or network is required.</p><div className="archive-chapter"><span className="evidence-label"><Icon name="spark" size={13}/> {game.ending ? 'ENDING UNLOCKED' : `CHAPTER ${game.chapter} · ${story.chapters[game.chapter - 1]?.app}`}</span><strong>{game.ending?.title || story.chapters[game.chapter - 1]?.title}</strong><p>{game.ending?.line || story.chapters[game.chapter - 1]?.summary}</p></div>{game.ending?.followUp && <FollowUpUnlock game={game} setGame={setGame}/>}<div className="story-choices-summary"><span className="eyebrow">YOUR BRANCHING PATH · {STORY_CHAPTER_COUNT} CHAPTERS</span>{story.chapters.map((chapter, index) => <div key={chapter.title} className={`story-choice-summary ${game.choices[index + 1] ? 'story-choice-summary--set' : ''}`}><span>0{index + 1}</span><p><strong>{chapter.title}</strong><small>{chapter.choices.find((choice) => choice.id === game.choices[index + 1])?.label || 'Still to come'}</small></p></div>)}</div><span className="eyebrow notes-evidence-heading">INVESTIGATOR’S NOTEBOOK · {game.notes.length}</span><div className="notes-list">{game.notes.length ? game.notes.map((note, index) => <article className="note-card" key={`${game.seed}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><p>{note}</p></article>) : <div className="notes-empty"><Icon name="files" size={22}/><strong>Plenty still to discover.</strong><span>Open each app. Choices echo through the whole phone.</span></div>}</div><div className="archive-chapter"><span className="evidence-label">PROCEDURAL STORY LIBRARY</span><strong>{STORY_TEMPLATE_COUNT.toLocaleString()} authored combinations</strong><p>The Story Loom recombines its narrative grammar and authored story elements locally. Seeds replay identically; no AI service or network is needed.</p></div><button className="notes-new-game" onClick={() => archiveAndStart(game, setGame)}>Generate a new story <Icon name="arrow" size={14}/></button><StoryArchive archive={game.archive} setGame={setGame} onClose={close}/></section></div>; }
function DesktopDock({ app, navigate, showDesktop }) {
  return <nav className="desktop-dock" aria-label="Computer OS applications"><button className={`desktop-dock__item ${app === 'home' ? 'desktop-dock__item--active' : ''}`} onClick={showDesktop} aria-label="Show desktop"><span className="desktop-dock__glyph">A</span><small>Desktop</small></button>{APPS.map((item) => <button key={item.id} className={`desktop-dock__item ${app === item.id ? 'desktop-dock__item--active' : ''}`} onClick={() => navigate(item.id)} aria-label={`Open ${item.label}`}><span className={`app-icon app-icon--${item.color}`}><Icon name={item.icon} size={19}/></span><small>{item.label}</small></button>)}</nav>;
}
function ApplicationContent({ id, game, setGame, navigate }) {
  if (id === 'messages') return <Messages game={game} setGame={setGame} navigate={navigate}/>;
  if (id === 'mail') return <Mail game={game} setGame={setGame} navigate={navigate}/>;
  if (id === 'contacts') return <Contacts game={game} setGame={setGame} navigate={navigate}/>;
  if (id === 'files') return <Files game={game} setGame={setGame} navigate={navigate}/>;
  if (id === 'wave') return <Wave game={game} setGame={setGame} navigate={navigate}/>;
  if (id === 'browser') return <Browser game={game} setGame={setGame}/>;
  if (id === 'calendar') return <Calendar game={game} setGame={setGame}/>;
  return null;
}
function DesktopWindow({ window: item, game, setGame, navigate, onFocus, onDrag, onClose, onMinimize, onMaximize }) {
  const app = APPS.find((entry) => entry.id === item.id);
  if (item.minimized) return null;
  return <section className={`desktop-window ${item.maximized ? 'desktop-window--maximized' : ''}`} style={{ left: item.x, top: item.y, zIndex: item.z }} onPointerDown={() => onFocus(item.id)} aria-label={`${app.label} window`}>
    <header className="desktop-window__titlebar" onPointerDown={(event) => onDrag(event, item.id)}>
      <div className="desktop-window__controls"><button className="desktop-window__control desktop-window__control--close" onClick={() => onClose(item.id)} aria-label={`Close ${app.label}`}/><button className="desktop-window__control desktop-window__control--minimize" onClick={() => onMinimize(item.id)} aria-label={`Minimize ${app.label}`}/><button className="desktop-window__control desktop-window__control--maximize" onClick={() => onMaximize(item.id)} aria-label={`${item.maximized ? 'Restore' : 'Maximize'} ${app.label}`}/></div>
      <span className="desktop-window__title"><span className={`connection-icon connection-icon--${app.color}`}><Icon name={app.icon} size={14}/></span>{app.label}<span className="desktop-window__episode">· {game.story.episodeTitle}</span></span><span className="desktop-window__seed">{game.seed.toUpperCase()}</span>
    </header>
    <div className="desktop-window__body"><div className="screen-content"><ApplicationContent id={item.id} game={game} setGame={setGame} navigate={navigate}/></div></div>
  </section>;
}
function DesktopWorkspace({ game, windows, openWindow, setGame, navigate, onFocus, onDrag, onClose, onMinimize, onMaximize }) {
  return <div className="desktop-workspace"><div className="desktop-workspace__icons" aria-label="Desktop applications">{APPS.map((item) => <button key={item.id} className="desktop-icon" onClick={() => openWindow(item.id)}><span className={`app-icon app-icon--${item.color}`}><Icon name={item.icon} size={23}/></span><span>{item.label}</span></button>)}</div><section className="desktop-widget"><span className="eyebrow">AFTERLIGHT · LOCAL DEVICE</span><strong>{game.story.episodeTitle}</strong><span>{game.ending?.title || `Chapter ${game.chapter} · ${game.story.chapters[game.chapter - 1]?.title}`}</span><button onClick={() => openWindow('messages')}>Continue case <Icon name="arrow" size={13}/></button></section>{windows.map((item) => <DesktopWindow key={item.id} window={item} game={game} setGame={setGame} navigate={navigate} onFocus={onFocus} onDrag={onDrag} onClose={onClose} onMinimize={onMinimize} onMaximize={onMaximize}/>)}<div className="desktop-workspace__footer"><span>AFTERLIGHT DESKTOP</span><span>{game.discoveries.length} CLUES RECOVERED · SEED {game.seed.toUpperCase()}</span></div></div>;
}
function App() {
  const [game, setGame] = useState(loadGame);
  const [app, setApp] = useState('home');
  const [windows, setWindows] = useState([]);
  const [drag, setDrag] = useState(null);
  const [notes, setNotes] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(true);
  const notificationTouchStart = useRef(null);
  const [time, setTime] = useState(() => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 781px)').matches);
  useEffect(() => { const media = window.matchMedia('(min-width: 781px)'); const update = () => setIsDesktop(media.matches); update(); media.addEventListener('change', update); return () => media.removeEventListener('change', update); }, []);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(game)); } catch { /* Continue if browser storage is unavailable. */ } }, [game]);
  useEffect(() => {
    setNotificationVisible(Boolean(game.notification));
    if (!game.notification) return undefined;
    const timeout = setTimeout(() => setNotificationVisible(false), 3000);
    return () => clearTimeout(timeout);
  }, [game.notification]);
  useEffect(() => { const timer = setInterval(() => setTime(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })), 15000); return () => clearInterval(timer); }, []);
  const focusWindow = (id) => setWindows((current) => {
    const top = current.reduce((highest, item) => Math.max(highest, item.z), 0) + 1;
    return current.map((item) => item.id === id ? { ...item, z: top, minimized: false } : item);
  });
  const openWindow = (id) => {
    if (id === 'home') { setApp('home'); return; }
    setWindows((current) => {
      const top = current.reduce((highest, item) => Math.max(highest, item.z), 0) + 1;
      const existing = current.find((item) => item.id === id);
      if (existing) return current.map((item) => item.id === id ? { ...item, z: top, minimized: false } : item);
      const offset = current.filter((item) => !item.minimized).length % 5;
      return [...current, { id, x: 86 + offset * 34, y: 42 + offset * 30, z: top, minimized: false, maximized: false }];
    });
  };
  const navigate = (id) => {
    if (window.matchMedia('(min-width: 781px)').matches) { openWindow(id); return; }
    setApp(id);
  };
  const showDesktop = () => {
    setApp('home');
    setWindows((current) => current.map((item) => ({ ...item, minimized: true })));
  };
  const story = game.story;
  const chapter = story.chapters[game.chapter - 1];
  const active = APPS.find((item) => item.id === app);
  const reset = () => { archiveAndStart(game, setGame); setApp('home'); setWindows([]); setNotes(false); };
  const startDrag = (event, id) => {
    if (!window.matchMedia('(min-width: 781px)').matches || event.target.closest('button')) return;
    const rect = event.currentTarget.getBoundingClientRect();
    focusWindow(id);
    setDrag({ id, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top });
    event.preventDefault();
  };
  const closeWindow = (id) => setWindows((current) => current.filter((item) => item.id !== id));
  const minimizeWindow = (id) => setWindows((current) => current.map((item) => item.id === id ? { ...item, minimized: true } : item));
  const toggleMaximize = (id) => setWindows((current) => current.map((item) => item.id === id ? { ...item, maximized: !item.maximized } : item));
  const restoreOrFocus = (id) => {
    const windowItem = windows.find((item) => item.id === id);
    if (windowItem && !windowItem.minimized && desktopActiveApp === id) minimizeWindow(id);
    else openWindow(id);
  };
  const desktopActiveApp = [...windows].filter((item) => !item.minimized).sort((a, b) => b.z - a.z)[0]?.id || 'home';
  useEffect(() => {
    if (!drag) return undefined;
    const move = (event) => setWindows((current) => current.map((item) => item.id === drag.id && !item.maximized ? { ...item, x: Math.max(8, Math.min(window.innerWidth - 260, event.clientX - drag.offsetX)), y: Math.max(58, Math.min(window.innerHeight - 120, event.clientY - drag.offsetY - 52)) } : item));
    const stop = () => setDrag(null);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop, { once: true });
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', stop); };
  }, [drag]);
  useEffect(() => {
    if (isDesktop && app !== 'home') openWindow(app);
    if (!isDesktop) setApp(desktopActiveApp);
  }, [isDesktop]);
  useEffect(() => {
    if (isDesktop && app !== 'home') openWindow(app);
    if (!isDesktop) setApp(desktopActiveApp);
  }, [isDesktop]);
  const continueStory = () => navigate(APP_ROUTES[chapter?.app] || 'messages');
  return <main className="site-shell fakeos-shell"><header className="topbar"><a className="wordmark" href="#home" onClick={(event) => { event.preventDefault(); navigate('home'); }}><span className="wordmark__symbol">a<span/></span><span>AFTERLIGHT<small>INTERACTIVE STORY</small></span></a><div className="topbar__center"><span className="topbar__status"/><span className="phone-mode-label">PHONE OS</span><span className="computer-mode-label">COMPUTER OS</span><span className="topbar__divider"/> SEED {game.seed.toUpperCase()}</div><button className="topbar__restart" onClick={reset}><Icon name="spark" size={15}/> New story</button></header><section className="experience"><aside className="story-sidebar"><div className="story-kicker"><span>0{game.chapter}</span><span className="story-kicker__line"/> {game.ending ? 'STORY COMPLETE' : `A FOUND PHONE · ${story.episodeTitle.toUpperCase()}`}</div><h1>Dead<br/><em>Letter.</em></h1><p className="story-intro">A missing friend. A phone that isn’t yours. And a message sent from somewhere it shouldn’t be.</p><div className="story-divider"/><div className="chapter-row"><div className="chapter-icon"><Icon name={game.ending ? 'check' : chapter.icon} size={17}/></div><div><span>SEED {game.seed.toUpperCase()} · CHAPTER {game.chapter}/{STORY_CHAPTER_COUNT}</span><strong>{game.ending?.title || chapter.title}</strong></div><span className="chapter-live">{game.ending ? 'DONE' : 'LIVE'}</span></div><p className="sidebar-copy">{game.ending?.line || chapter.summary}</p><button className="story-mini story-mini--active" onClick={game.ending ? () => setNotes(true) : continueStory}><span className="story-mini__icon"><Icon name={game.ending ? 'check' : chapter.icon} size={16}/></span><span><strong>{game.ending?.title || `Continue · Chapter ${game.chapter}`}</strong><small>{game.ending ? story.episodeTitle : `Open ${chapter.app} · ${story.episodeTitle}`}</small></span></button><button className="notes-link" onClick={() => setNotes(true)}><span><Icon name="files" size={15}/> Your notebook <span className="notes-link__count">{game.notes.length || '—'}</span></span><Icon name="arrow" size={14}/></button><div className="sidebar-bottom"><span><Icon name="lock" size={12}/> YOUR STORY IS PRIVATE</span><button onClick={() => setNotes(true)}>ABOUT THIS DEVICE</button></div></aside><section className="device-stage" id="home"><div className="ambient ambient--one"/><div className="ambient ambient--two"/><div className="stage-label"><span className="stage-label__dot"/> INTERACTIVE STORY · GENERATED LOCALLY <span>↗</span></div><div className="phone computer-window"><div className="phone__bezel-top"><span className="computer-window-controls" aria-hidden="true"><i/><i/><i/></span><span className="computer-window-title">{active?.label || 'Desktop'} <span>·</span> {story.episodeTitle}</span><span className="computer-window-seed">{game.seed.toUpperCase()}</span><span className="phone__speaker"/><span className="phone__camera"/></div><StatusBar time={time}/><div className="phone-screen"><div className={`screen-content ${app === 'home' ? 'screen-content--home' : ''}`} key={app}>{app === 'home' && <><div className="home-greeting"><div><span className="eyebrow">{story.episodeTitle.toUpperCase()} · SEED {game.seed.toUpperCase()}</span><h2>Good evening,<br/><span>Eli.</span></h2></div><button className="icon-button" aria-label="Open notebook" onClick={() => setNotes(true)}><Icon name="files" size={18}/></button></div><button className="mystery-card" onClick={() => navigate('messages')}><span className="mystery-card__top"><span className="mystery-card__avatar">{story.missing.name[0].toLowerCase()}</span><span className="mystery-card__meta"><span>{game.ending ? 'ENDING UNLOCKED' : `${story.episodeTitle.toUpperCase()} · ${story.missing.name.toUpperCase()}`}</span><time>11:44 PM</time></span><span className="mystery-card__unread">{game.ending ? '✓' : '1'}</span></span><strong>{game.ending?.title || chapter.summary.split('. ')[0]}</strong><span className="mystery-card__bottom">{story.missing.name} · {game.ending ? 'Final chapter' : chapter.title}<Icon name="arrow" size={14}/></span></button><div className="home-widget-row"><button className="widget-card widget-card--moon" onClick={() => navigate('wave')}><span className="widget-card__icon"><Icon name="radio" size={17}/></span><span className="widget-card__label">THE SIGNAL</span><strong>{story.signal.channel}</strong><span className="widget-card__detail">{story.signal.note}</span></button><button className="widget-card widget-card--time" onClick={() => navigate('files')}><span className="widget-card__icon"><Icon name="pin" size={17}/></span><span className="widget-card__label">LOOK HERE</span><strong>{story.place.short}</strong><span className="widget-card__detail">{story.place.time} · the last lead</span></button></div><div className="home-apps-heading"><span>YOUR APPS</span><span>{APPS.length} installed</span></div><div className="home-app-grid">{APPS.map((item) => <button key={item.id} className="app-icon-wrap" onClick={() => navigate(item.id)} aria-label={`Open ${item.label}`}><span className={`app-icon app-icon--${item.color}`}><Icon name={item.icon} size={22}/>{item.id === APP_ROUTES[chapter.app] && !game.ending && <span className="app-icon__badge">1</span>}</span><span className="app-icon__label">{item.label}</span></button>)}</div><button className="device-footer" onClick={() => setGame({ ...game, notification: `${story.episodeTitle} · Seed ${game.seed} · Saved locally.` })}><span>{story.missing.name}’s device</span><span>Seed {game.seed} <i/> PRIVATE</span></button></>}{app === 'messages' && <Messages game={game} setGame={setGame} navigate={navigate}/>}{app === 'mail' && <Mail game={game} setGame={setGame} navigate={navigate}/>}{app === 'contacts' && <Contacts game={game} setGame={setGame} navigate={navigate}/>}{app === 'files' && <Files game={game} setGame={setGame} navigate={navigate}/>}{app === 'wave' && <Wave game={game} setGame={setGame} navigate={navigate}/ >}{app === 'browser' && <Browser game={game} setGame={setGame}/ >}{app === 'calendar' && <Calendar game={game} setGame={setGame}/ >}</div><div className="bottom-nav">{['home', ...APPS.map((item) => item.id)].map((id) => <button key={id} onClick={() => navigate(id)} className={`bottom-nav__item ${app === id ? 'bottom-nav__item--active' : ''}`} aria-label={`Open ${id === 'home' ? 'home' : APPS.find((item) => item.id === id).label}`}><Icon name={id === 'home' ? 'home' : APPS.find((item) => item.id === id).icon} size={19}/>{id === APP_ROUTES[chapter?.app] && !game.ending && <span className="nav-unread"/>}</button>)}</div></div><div className="phone__bezel-bottom"><span/></div></div><div className="device-caption"><span>EPISODE {game.seed.toUpperCase()}</span><span>{active?.label.toUpperCase() || 'HOME'} / {story.missing.name.toUpperCase()}’S DEVICE</span><span>{game.ending ? game.ending.title.toUpperCase() : `CHAPTER ${game.chapter}/{STORY_CHAPTER_COUNT}`}</span></div></section><aside className="intel-sidebar"><div className="intel-heading"><span className="eyebrow">FIELD NOTES</span><span className="intel-heading__count">{String(game.discoveries.length).padStart(2, '0')} <span>/ {STORY_TEMPLATE_COUNT.toLocaleString('en-US')}</span></span></div><h2>{story.episodeTitle.split(' ').slice(0, 2).join(' ')}<br/>in the <em>small things.</em></h2><p className="intel-intro">A story assembled on this device. Every app is part of the case file. Your decisions change who answers.</p><div className="story-progress"><div className="story-progress__top"><span>EPISODE PROGRESS</span><span>{game.ending ? STORY_CHAPTER_COUNT : game.chapter} / {STORY_CHAPTER_COUNT}</span></div><div className="progress-track"><span style={{ width: `${game.ending ? 100 : ((game.chapter - 1) / STORY_CHAPTER_COUNT) * 100 + 8}%` }}/></div></div><div className="cross-links-heading"><span>THE STORY TOUCHES</span><Icon name="arrow" size={13}/></div><div className="cross-link-list">{[{ id: 'messages', icon: 'message', title: story.missing.name, subtitle: 'An impossible message' }, { id: 'mail', icon: 'mail', title: 'Archived email', subtitle: `${story.motive.slice(0, 35)}…` }, { id: 'contacts', icon: 'contacts', title: `${story.ally.name} + ${story.suspect.name.split(' ')[0]}`, subtitle: 'Two people · one original' }, { id: 'files', icon: 'files', title: story.artifact.file, subtitle: story.artifact.kind }, { id: 'wave', icon: 'wave', title: story.signal.channel, subtitle: 'The feed remembers everything' }, { id: 'browser', icon: 'browser', title: 'Cached search result', subtitle: 'An unverified lead' }, { id: 'calendar', icon: 'calendar', title: story.redHerring.place.short, subtitle: 'Conflicting timeline edit' }].map((link) => <button key={link.id} onClick={() => navigate(link.id)}><span className={`connection-icon connection-icon--${APPS.find((item) => item.id === link.id).color}`}><Icon name={link.icon} size={15}/></span><span><strong>{link.title}</strong><small>{link.subtitle}</small></span><span className={`connection-dot ${app === link.id ? 'connection-dot--on' : ''}`}/></button>)}</div><button className="open-notes" onClick={() => setNotes(true)}><span><Icon name="files" size={15}/><strong>Story + branching path</strong><span className="open-notes__count">{game.notes.length}</span></span><Icon name="arrow" size={15}/></button><div className="intel-footer"><span>AFTERLIGHT STORY STUDIO</span><span>{STORY_TEMPLATE_COUNT.toLocaleString()} OFFLINE STORIES</span></div></aside></section>{isDesktop && <DesktopWorkspace game={game} windows={windows} openWindow={openWindow} setGame={setGame} navigate={navigate} onFocus={focusWindow} onDrag={startDrag} onClose={closeWindow} onMinimize={minimizeWindow} onMaximize={toggleMaximize}/>}<DesktopDock app={isDesktop ? desktopActiveApp : app} navigate={isDesktop ? restoreOrFocus : navigate} showDesktop={showDesktop}/><div className="mobile-story-bar"><span className="mobile-story-dot"/><span>{game.notification}</span><button onClick={() => setNotes(true)}><Icon name="files" size={15}/><span>{game.notes.length || ''}</span></button></div>{notes && <Notes game={game} setGame={setGame} close={() => setNotes(false)}/>}{notificationVisible && <div className="toaster" key={game.notification} onTouchStart={(event) => { notificationTouchStart.current = event.touches[0]?.clientY ?? null; }} onTouchEnd={(event) => { const endY = event.changedTouches[0]?.clientY; if (notificationTouchStart.current !== null && endY - notificationTouchStart.current > 40) setNotificationVisible(false); notificationTouchStart.current = null; }}><span><Icon name={game.ending ? 'spark' : 'moon'} size={15}/></span>{game.notification}<button onClick={() => setNotificationVisible(false)} aria-label="Dismiss notification"><Icon name="close" size={14}/></button></div>}</main>;
}
createRoot(document.getElementById('root')).render(<App/>);
