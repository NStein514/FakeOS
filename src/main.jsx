import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const STORAGE_KEY = 'afterlight-game-v1';

const CLUES = [
  { id: 'platform', title: 'Platform 9', icon: 'train', line: 'Check the platform with no trains.', note: 'Mara kept writing “nine” in the margins. This city only has eight platforms.' },
  { id: 'violet', title: 'Violet Hour', icon: 'moon', line: 'Meet me when the sky turns violet.', note: 'The backup has a time but no date. Sunset is a better lead than any calendar.' },
  { id: 'frequency', title: '90.4 MHz', icon: 'radio', line: 'The signal only carries after midnight.', note: 'A station frequency, a borrowed receiver, and a voice nobody else can hear.' },
  { id: 'blue', title: 'The Blue Door', icon: 'door', line: 'Not the door we used last time.', note: 'An old message references a blue door. Rowan is the only one who seems to remember it.' },
];

const INITIAL_MESSAGES = [
  { from: 'mara', text: 'if this is really my phone, there’s a backup. NOT in cloud.', time: '11:42 PM' },
  { from: 'me', text: 'Mara? This is Eli. Where are you?', time: '11:43 PM' },
  { from: 'mara', text: 'don’t call. rowan can see incoming calls. i think.', time: '11:44 PM', glitch: true },
  { from: 'mara', text: 'need to get the real story out. start with the file i hid.', time: '11:44 PM' },
];

function newGame() {
  const clue = CLUES[Math.floor(Math.random() * CLUES.length)];
  return {
    seed: Math.random().toString(36).slice(2, 9),
    clue,
    choice: null,
    notes: [],
    liked: false,
    replyPosted: false,
    messages: INITIAL_MESSAGES,
    notification: 'Mara’s phone is back online.',
    startedAt: Date.now(),
  };
}

function loadGame() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const game = JSON.parse(saved);
      if (game?.seed && CLUES.some((clue) => clue.id === game.clue?.id)) return { ...game, clue: CLUES.find((clue) => clue.id === game.clue.id) };
    }
  } catch { /* Start a fresh game if saved progress is unavailable. */ }
  return newGame();
}

const iconShapes = {
  home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" /></>,
  message: <><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 4a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6" /></>,
  contacts: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 8v6m3-3h-6" /></>,
  files: <><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"/></>,
  wave: <><path d="M2 12h3l3-9 5 18 3-9h6" /></>,
  search: <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3" /></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7-.2.1a8 8 0 0 1-1.6.9l-.3.1-.3 1.8h-2.8l-.3-1.8-.3-.1a8 8 0 0 1-1.6-.9l-.2-.1-1.7.7-1.4-2.4L6.5 15l.1-.3a8 8 0 0 1-.3-1.8l-1.6-1v-2.8l1.6-1 .3-.3a8 8 0 0 1 .3-1.8L5.5 5l1.4-2.4 1.7.7.2-.1a8 8 0 0 1 1.6-.9l.3-.1.3-1.8h2.8l.3 1.8.3.1a8 8 0 0 1 1.6.9l.2.1 1.7-.7L21.3 5l-1.4 1.1-.1.3a8 8 0 0 1 .3 1.8l1.6 1V12l-1.6 1a8 8 0 0 1-.3 1.8Z" transform="translate(-1 1) scale(1.06)" /></>,
  back: <><path d="m15 18-6-6 6-6" /></>,
  arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
  chevron: <><path d="m9 18 6-6-6-6" /></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3" /></>,
  unlock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0" /></>,
  heart: <><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8z" /></>,
  send: <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13" /></>,
  pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2"/></>,
  check: <><path d="m5 12 4 4L19 6" /></>,
  moon: <><path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" /></>,
  spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2zM19 14l1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1z" /></>,
  radio: <><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8a6 6 0 0 1 0 8.4m-8.4 0a6 6 0 0 1 0-8.4m11.2-2.8a10 10 0 0 1 0 14m-14 0a10 10 0 0 1 0-14"/></>,
  train: <><rect x="5" y="2" width="14" height="16" rx="3"/><path d="m8 21-1-3m9 3 1-3M8 14h.01M16 14h.01M5 8h14M9 18v1m6-1v1" /></>,
  door: <><path d="M4 21h16M6 21V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17"/><circle cx="15" cy="12" r=".7"/></>,
  clock: <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>,
  wifi: <><path d="M5 12.6a11 11 0 0 1 14.1 0M8.5 16.2a5.5 5.5 0 0 1 7 0M2 9a16 16 0 0 1 20 0"/><path d="M12 20h.01" /></>,
  battery: <><rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 11v2"/></>,
  close: <><path d="m18 6-12 12M6 6l12 12"/></>,
};

function Icon({ name, size = 20, className = '' }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconShapes[name] || iconShapes.spark}</svg>;
}

const APPS = [
  { id: 'messages', label: 'Messages', icon: 'message', color: 'lavender' },
  { id: 'mail', label: 'Mail', icon: 'mail', color: 'amber' },
  { id: 'contacts', label: 'Contacts', icon: 'contacts', color: 'mint' },
  { id: 'files', label: 'Files', icon: 'files', color: 'blue' },
  { id: 'wave', label: 'Wave', icon: 'wave', color: 'coral' },
];

function useTime() {
  const [date, setDate] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setDate(new Date()), 15000);
    return () => window.clearInterval(timer);
  }, []);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function AppIcon({ app, onClick, small = false, badge = false }) {
  return <button className={`app-icon-wrap ${small ? 'app-icon-wrap--small' : ''}`} onClick={onClick} aria-label={`Open ${app.label}`}>
    <span className={`app-icon app-icon--${app.color}`}><Icon name={app.icon} size={small ? 19 : 23}/>{badge && <span className="app-icon__badge">1</span>}</span>
    <span className="app-icon__label">{app.label}</span>
  </button>;
}

function StatusBar({ time }) {
  return <div className="status-bar"><span>{time}</span><span className="status-bar__right"><Icon name="wifi" size={15}/><span className="signal-bars"><i/><i/><i/><i/></span><Icon name="battery" size={18}/></span></div>;
}

function AppHeader({ icon, title, subtitle, onBack, trailing }) {
  return <div className="app-header">
    {onBack && <button className="icon-button app-header__back" onClick={onBack} aria-label="Go back"><Icon name="back" size={20}/></button>}
    {icon && <span className="app-header__icon"><Icon name={icon} size={19}/></span>}
    <div className="app-header__heading"><h2>{title}</h2>{subtitle && <span>{subtitle}</span>}</div>
    {trailing && <div className="app-header__trailing">{trailing}</div>}
  </div>;
}

function MessagesView({ game, setGame, openApp }) {
  const [reply, setReply] = useState('');
  const [sent, setSent] = useState(false);
  function choose(choice) {
    if (game.choice) return;
    const event = choice === 'trust' ? {
      text: 'I trust you. I’m looking. Send me anything you remember.',
      notification: 'A new contact and a hidden file just surfaced.',
      note: `Mara's backup points to ${game.clue.title}. ${game.clue.note}`,
    } : {
      text: 'Not without proof, Mara. Tell me what you found first.',
      notification: 'A new clue was found in Mara’s messages.',
      note: `Mara was already leaving clues. “${game.clue.line}” The backup mentions ${game.clue.title}.`,
    };
    const follow = choice === 'trust'
      ? { from: 'mara', text: 'good. there’s a person you need to talk to. Rowan isn’t who everyone thinks.', time: '11:48 PM' }
      : { from: 'mara', text: 'fair. i found this in my backup. it’s all backwards, but maybe it helps: ' + game.clue.line, time: '11:48 PM', glitch: true };
    setGame((current) => ({
      ...current,
      choice,
      notes: [...current.notes, event.note],
      notification: event.notification,
      messages: [...current.messages, { from: 'me', text: event.text, time: '11:47 PM' }, follow],
    }));
  }
  function sendReply() {
    if (!reply.trim()) return;
    setGame((current) => ({ ...current, messages: [...current.messages, { from: 'me', text: reply.trim(), time: 'Now' }], notification: 'Message sent to Mara.' }));
    setReply('');
    setSent(true);
    window.setTimeout(() => setSent(false), 1800);
  }
  return <>
    <AppHeader icon="message" title="Messages" subtitle="Mara Ellison · encrypted" trailing={<span className="header-lock"><Icon name="lock" size={13}/> Signal protected</span>}/>
    <div className="conversation-person"><span className="avatar avatar--mara">m<span className="presence-dot"/></span><div><strong>Mara Ellison</strong><span>Last seen today, 11:44 PM</span></div><button className="icon-button" aria-label="View contact" onClick={() => openApp('contacts')}><Icon name="contacts" size={19}/></button></div>
    <div className="conversation-date"><span/>TODAY, OCT 24<span/></div>
    <div className="message-list" aria-live="polite">
      {game.messages.map((msg, index) => <div key={`${index}-${msg.time}`} className={`message-row ${msg.from === 'me' ? 'message-row--mine' : ''}`}>
        {msg.from !== 'me' && <span className="message-avatar">m</span>}
        <div><div className={`message-bubble ${msg.from === 'me' ? 'message-bubble--mine' : ''} ${msg.glitch ? 'message-bubble--glitch' : ''}`}>{msg.text}</div><span className="message-time">{msg.time} {msg.from === 'me' && index === game.messages.length - 1 && sent && <Icon name="check" size={12}/>}</span></div>
      </div>)}
      {!game.choice && <div className="choice-card"><span className="choice-card__eyebrow"><Icon name="spark" size={13}/> YOUR NEXT MOVE</span><strong>Mara is trusting you with something. What do you say?</strong><div className="choice-card__actions"><button className="choice-btn choice-btn--primary" onClick={() => choose('trust')}>I’m with you<Icon name="arrow" size={15}/></button><button className="choice-btn" onClick={() => choose('proof')}>Ask for proof<Icon name="chevron" size={15}/></button></div></div>}
      {game.choice && <div className="reply-indicator"><span className="typing-dots"><i/><i/><i/></span> Mara might reply again…</div>}
    </div>
    <form className="message-composer" onSubmit={(event) => { event.preventDefault(); sendReply(); }}><button type="button" className="composer-plus" aria-label="Add attachment" onClick={() => { openApp('files'); setGame((current) => ({ ...current, notification: 'You looked for something to share.' })); }}>+</button><input value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Message Mara…" aria-label="Message Mara"/><button className={`composer-send ${reply.trim() ? 'composer-send--active' : ''}`} type="submit" disabled={!reply.trim()} aria-label="Send message"><Icon name="send" size={17}/></button></form>
  </>;
}

function MailView({ game, setGame }) {
  const [opened, setOpened] = useState(false);
  return <>
    <AppHeader icon="mail" title="Inbox" subtitle="mara@afterlight.local" trailing={<span className="mail-count">3 MESSAGES</span>}/>
    <div className="mail-folder"><span className="mail-folder__active"><Icon name="mail" size={15}/> All inboxes</span><span>3 unread</span></div>
    <div className="mail-list">
      <button className="mail-item mail-item--unread" onClick={() => setOpened(!opened)}><span className="mail-avatar mail-avatar--orange">M</span><span className="mail-item__body"><span className="mail-item__top"><strong>Mara Ellison</strong><time>11:39 PM</time></span><strong>you were right about the photo</strong><span>if you still have the old camera, check what’s under the sticker.</span><span className="mail-tag">Personal</span></span></button>
      <button className="mail-item" onClick={() => setOpened(!opened)}><span className="mail-avatar mail-avatar--purple">R</span><span className="mail-item__body"><span className="mail-item__top"><strong>Rowan K.</strong><time>Yesterday</time></span><strong>About last night</strong><span>Let’s keep this between the three of us. For once.</span><span className="mail-tag mail-tag--private"><Icon name="lock" size={10}/> Encrypted</span></span></button>
      <button className="mail-item" onClick={() => setOpened(!opened)}><span className="mail-avatar mail-avatar--green">T</span><span className="mail-item__body"><span className="mail-item__top"><strong>Transit Alerts</strong><time>Oct 22</time></span><strong>Service change: East Line</strong><span>Late-night trains suspended between…</span><span className="mail-tag">Updates</span></span></button>
    </div>
    {opened && <div className="mail-expanded"><span className="evidence-label"><Icon name="spark" size={13}/> EMAIL RETRIEVED</span><p>“Under the sticker on the back. I didn’t tell Rowan. I didn’t tell anyone. The picture’s the only proof we were all there.”</p><strong>Attachment: <span>IMG_0041.heic</span></strong><button className="text-action" onClick={() => { setGame((current) => ({ ...current, notes: [...current.notes, 'Mara’s email points to an old photo — IMG_0041.heic — tucked beneath a sticker. Rowan doesn’t know about it.'], notification: 'Saved a clue from Mara’s email.' })); setOpened(false); }}>Save clue to notes <Icon name="arrow" size={14}/></button></div>}
    <div className="mail-bottom-note"><Icon name="lock" size={14}/> Some messages on this phone were remotely erased.</div>
  </>;
}

function ContactsView({ game, openApp }) {
  const locked = !game.choice;
  const [selected, setSelected] = useState('');
  const people = [
    { initial: 'M', name: 'Mara Ellison', role: 'Original device owner', color: 'avatar--mara', presence: true },
    { initial: 'E', name: 'You', role: 'Emergency contact', color: 'avatar--you' },
    ...(locked ? [{ initial: '?', name: 'Unknown Contact', role: 'Contact card damaged', color: 'avatar--locked', locked: true }] : [{ initial: 'R', name: 'Rowan Kade', role: 'Added from Mara’s backup', color: 'avatar--rowan', unlocked: true }]),
    { initial: 'S', name: 'Sol · East Line', role: 'Transit notices', color: 'avatar--sol' },
  ];
  return <>
    <AppHeader icon="contacts" title="Contacts" subtitle={`${locked ? 3 : 4} people`} trailing={<button className="icon-button" aria-label="Find contact" onClick={() => setSelected(selected ? '' : 'search')}><Icon name="search" size={18}/></button>}/>
    {selected === 'search' && <input className="contact-search" placeholder="Find someone…" aria-label="Search contacts" autoFocus/>}
    <div className="contact-list">{people.map((person) => <button key={person.name} className={`contact-item ${person.locked ? 'contact-item--locked' : ''}`} onClick={() => person.locked ? setGame((current) => ({ ...current, notification: 'This contact is encrypted. The right message could restore it.' })) : person.name === 'Mara Ellison' ? openApp('messages') : setSelected(person.name)}><span className={`avatar contact-item__avatar ${person.color}`}>{person.initial}{person.presence && <span className="presence-dot"/>}{person.unlocked && <span className="contact-unlocked"><Icon name="unlock" size={11}/></span>}</span><span className="contact-item__info"><strong>{person.name}</strong><span>{person.role}</span></span><Icon className="contact-chevron" name={person.locked ? 'lock' : 'chevron'} size={17}/></button>)}</div>
    {selected && selected !== 'search' && <div className="contact-detail"><span className="evidence-label"><Icon name="spark" size={13}/> CONTACT NOTE</span><strong>{selected}</strong><p>{game.choice === 'trust' ? `Mara’s archived contact: “${game.clue.line}”` : 'Mara left an archived clue in this contact card.'}</p></div>}
    {locked && <button className="locked-card-hint" onClick={() => openApp('messages')}><Icon name="lock" size={16}/><span><strong>One contact is encrypted</strong><small>What could Mara’s next message reveal?</small></span><Icon name="arrow" size={16}/></button>}
  </>;
}

function FilesView({ game, setGame }) {
  const [selectedFile, setSelectedFile] = useState('');
  const secretUnlocked = Boolean(game.choice);
  const files = [
    { name: 'Read me first.txt', meta: 'Plain text · 2 KB', icon: 'files', color: 'file-icon--teal', preview: 'If you found this, you were looking. Good. Don’t assume the person who gave you this phone wanted it back.' },
    { name: 'voice_memo_03.m4a', meta: 'Audio recording · 0:38', icon: 'radio', color: 'file-icon--orange', preview: 'A breath, then a voice: “...Platform nine. Same place as the first time. After the last train.”' },
    ...(secretUnlocked ? [{ name: `${game.clue.id}_backup.enc`, meta: 'Recovered · encrypted note', icon: game.clue.icon, color: 'file-icon--purple', preview: game.clue.note }] : [{ name: 'missing_fragment.enc', meta: 'Encrypted · 1 fragment missing', icon: 'lock', color: 'file-icon--locked', locked: true }]),
    { name: 'IMG_0041.heic', meta: 'Photo · Oct 21', icon: 'spark', color: 'file-icon--pink', preview: 'Three shadows in a train window. The fourth person’s reflection is facing the wrong way.' },
  ];
  return <>
    <AppHeader icon="files" title="Files" subtitle="On this device" trailing={<span className="mail-count">{secretUnlocked ? '4 FILES' : '3 FILES'}</span>}/>
    <div className="storage-card"><div className="storage-card__top"><span><Icon name="files" size={15}/> Internal storage</span><span>8.2 of 32 GB</span></div><div className="storage-bar"><span/></div><div className="storage-card__bottom"><span>26% used</span><span>Last synced: unknown</span></div></div>
    <div className="section-caption">RECENTLY MODIFIED</div>
    <div className="file-list">{files.map((file) => <button className={`file-item ${file.locked ? 'file-item--locked' : ''}`} key={file.name} onClick={() => { if (file.locked) { openApp('messages'); setGame((current) => ({ ...current, notification: 'Mara may know how to recover this file.' })); } else setSelectedFile(selectedFile === file.name ? '' : file.name); }}><span className={`file-item__icon ${file.color}`}><Icon name={file.icon} size={18}/></span><span className="file-item__details"><strong>{file.name}</strong><span>{file.meta}</span></span><Icon name={file.locked ? 'lock' : 'chevron'} size={16}/>{selectedFile === file.name && <span className="file-preview">{file.preview}{file.name === 'Read me first.txt' && <span className="file-preview__cta" onClick={(event) => { event.stopPropagation(); setGame((current) => ({ ...current, notes: [...current.notes, file.preview], notification: 'Saved the readme clue to notes.' })); }}>Save to notes <Icon name="arrow" size={13}/></span>}</span>}</button>)}</div>
    <div className="file-privacy"><Icon name="lock" size={14}/> Some files were restored from local cache.</div>
  </>;
}

function WaveView({ game, setGame }) {
  return <>
    <AppHeader icon="wave" title="Wave" subtitle="Your small corner of the internet" trailing={<span className="live-tag"><span/> LIVE</span>}/>
    <div className="feed-status"><Icon name="spark" size={14}/> <span>The feed changes when you do.</span></div>
    <article className="post-card"><div className="post-author"><span className="avatar avatar--rowan">R</span><span><strong>rowan.k</strong><small>@rowank · 14m</small></span><button className="post-more" aria-label="More post options">···</button></div><p>Some things are easier when everyone agrees to <em>forget.</em></p>{game.choice === 'trust' && <div className="post-context post-context--new"><Icon name="spark" size={14}/> Is this about the same place Mara mentioned?</div>}{game.choice === 'proof' && <div className="post-context"><Icon name="lock" size={14}/> This post is missing its original photo.</div>}<div className="post-actions"><button className={game.liked ? 'post-action--liked' : ''} onClick={() => setGame((current) => ({ ...current, liked: !current.liked, notification: current.liked ? 'You removed your reaction.' : 'Rowan noticed your reaction.' }))}><Icon name="heart" size={17}/><span>{game.liked ? '13' : '12'}</span></button><button onClick={() => { setGame((current) => ({ ...current, replyPosted: true, notification: 'A reply from Mara changed the conversation.' })); }}><Icon name="message" size={16}/><span>{game.replyPosted ? '4' : '3'}</span></button><span className="post-action-save">{game.liked ? 'Rowan noticed' : '2 people you know'}</span></div></article>
    <article className={`post-card post-card--second ${game.replyPosted ? 'post-card--revealed' : ''}`}><div className="post-author"><span className="avatar avatar--sol">s</span><span><strong>sol.in.transit</strong><small>@s0l · 1h</small></span><button className="post-more" aria-label="More post options">···</button></div><p>The 00:14 East Line is the last one. There will not be another.</p>{game.replyPosted && <div className="new-reply"><span className="avatar avatar--mara">m</span><p><strong>mara.e</strong> Funny. Last time, there was.</p><span className="new-reply__tag">NEW</span></div>}<div className="post-actions"><button onClick={() => setGame((current) => ({ ...current, notes: current.notes.includes('Sol confirms the last East Line train leaves at 00:14.') ? current.notes : [...current.notes, 'Sol confirms the last East Line train leaves at 00:14.'], notification: 'Saved Sol’s transit post as a clue.' }))}><Icon name="heart" size={17}/><span>8</span></button><button onClick={() => openSocialReply(setGame)}><Icon name="message" size={16}/><span>{game.replyPosted ? '1' : '0'}</span></button><span className="post-action-save">East Line · 00:14</span></div></article>
    {!game.replyPosted && <button className="wave-hidden" onClick={() => openSocialReply(setGame)}><Icon name="lock" size={15}/> One reply has been hidden <span>Reveal it <Icon name="arrow" size={13}/></span></button>}
    <div className="wave-footer">Your feed. A story that moves with you.</div>
  </>;
}
function openSocialReply(setGame) {
  setGame((current) => ({ ...current, replyPosted: true, notes: current.notes.includes(`Mara replied: “${current.clue.line}”`) ? current.notes : [...current.notes, `Mara replied: “${current.clue.line}”`], notification: 'A hidden reply from Mara is now visible.' }));
}

function NotesPanel({ game, setGame, onClose }) {
  return <div className="notes-overlay" onClick={onClose}><section className="notes-panel" onClick={(event) => event.stopPropagation()}><div className="notes-panel__top"><span className="eyebrow">ON THIS DEVICE</span><button className="icon-button" onClick={onClose} aria-label="Close notes"><Icon name="close" size={20}/></button></div><h2>Your notes<span className="notes-count">{game.notes.length}</span></h2><p className="notes-subtitle">Clues you’ve pieced together. They only exist on this phone.</p>{game.notes.length ? <div className="notes-list">{game.notes.map((note, index) => <article className="note-card" key={`${game.seed}-${index}`}><span>0{index + 1}</span><p>{note}</p></article>)}</div> : <div className="notes-empty"><Icon name="files" size={23}/><strong>A blank page. For now.</strong><span>Save a clue from Mail, Files, or Wave.</span></div>}<button className="notes-new-game" onClick={() => setGame(newGame())}>Start a new story <Icon name="arrow" size={14}/></button></section></div>;
}

function HomeView({ game, setGame, openApp, time, onOpenNotes }) {
  return <>
    <div className="home-greeting"><div><span className="eyebrow">SATURDAY, OCTOBER 24</span><h2>Good evening,<br/><span>Eli.</span></h2></div><button className="icon-button home-notes-btn" aria-label="Open notes" onClick={onOpenNotes}><Icon name="files" size={18}/>{game.notes.length > 0 && <span className="notes-indicator"/>}</button></div>
    <button className="mystery-card" onClick={() => openApp('messages')}><span className="mystery-card__top"><span className="mystery-card__avatar">m</span><span className="mystery-card__meta"><span>UNKNOWN NUMBER</span><time>11:44 PM</time></span><span className="mystery-card__unread">1</span></span><strong>I think they know I’m here.</strong><span className="mystery-card__bottom">Mara · Messages <Icon name="arrow" size={14}/></span><span className="mystery-card__glow"/></button>
    <div className="home-widget-row"><button className="widget-card widget-card--moon" onClick={() => openApp('files')}><span className="widget-card__icon"><Icon name="moon" size={17}/></span><span className="widget-card__label">GOOD NIGHT</span><strong>Clear skies</strong><span className="widget-card__detail">Somewhere, in this city</span></button><button className="widget-card widget-card--time" onClick={() => openApp('wave')}><span className="widget-card__icon"><Icon name="clock" size={17}/></span><span className="widget-card__label">NEXT TRAIN</span><strong>00:14 <span>· East Line</span></strong><span className="widget-card__detail">One service remaining tonight</span></button></div>
    <div className="home-apps-heading"><span>YOUR APPS</span><span>5 installed</span></div>
    <div className="home-app-grid">{APPS.map((app) => <AppIcon key={app.id} app={app} badge={app.id === 'messages' && !game.choice} onClick={() => openApp(app.id)}/>)}</div>
    <button className="device-footer" onClick={() => setGame((current) => ({ ...current, notification: `Device: ${time} · Build ${current.seed} · Offline.` }))}><span>mara’s phone</span><span>Build {game.seed} <i/> Local only</span></button>
  </>;
}

function UnlockBanner({ game, openApp }) {
  if (!game.choice) return <div className="story-mini story-mini--quiet"><span className="story-mini__icon"><Icon name="moon" size={16}/></span><span><strong>The night is still unfolding.</strong><small>Some things stay hidden until you ask.</small></span></div>;
  return <div className="story-mini story-mini--active"><span className="story-mini__icon"><Icon name="unlock" size={16}/></span><span><strong>Three new things surfaced.</strong><small>A contact, a file, and a different feed.</small></span><button onClick={() => openApp('contacts')} aria-label="See unlocked items"><Icon name="arrow" size={15}/></button></div>;
}

function App() {
  const [game, setGame] = useState(loadGame);
  const [activeApp, setActiveApp] = useState('home');
  const [notesOpen, setNotesOpen] = useState(false);
  const time = useTime();
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(game)); } catch { /* Play remains available without local storage. */ }
  }, [game]);
  function openApp(id) { setActiveApp(id); }
  function resetGame() { setGame(newGame()); setActiveApp('home'); setNotesOpen(false); }
  const appInfo = APPS.find((app) => app.id === activeApp);
  const statusNotification = game.notification;
  return <main className="site-shell">
    <header className="topbar"><a className="wordmark" href="#home" onClick={(event) => { event.preventDefault(); openApp('home'); }}><span className="wordmark__symbol">a<span/></span><span>AFTERLIGHT<small>INTERACTIVE STORY</small></span></a><div className="topbar__center"><span className="topbar__status"/><span>LOCAL DEVICE</span><span className="topbar__divider"/><span>SESSION {game.seed.toUpperCase()}</span></div><button className="topbar__restart" onClick={resetGame}><Icon name="spark" size={15}/> New story</button></header>
    <section className="experience">
      <aside className="story-sidebar"><div className="story-kicker"><span>01</span><span className="story-kicker__line"/> A FOUND PHONE</div><h1>Dead<br/><em>Letter.</em></h1><p className="story-intro">A missing friend. A phone that isn’t yours. And a message sent from somewhere it shouldn’t be.</p><div className="story-divider"/><div className="chapter-row"><div className="chapter-icon"><Icon name="moon" size={17}/></div><div><span>TONIGHT, 11:44 PM</span><strong>The phone wakes up.</strong></div><span className="chapter-live">LIVE</span></div><p className="sidebar-copy">Mara’s last message is on this phone. Each app holds a different piece of the story. Look around. Pay attention to what changes.</p><UnlockBanner game={game} openApp={openApp}/><button className="notes-link" onClick={() => setNotesOpen(true)}><span><Icon name="files" size={15}/> Your notebook <span className="notes-link__count">{game.notes.length || '—'}</span></span><Icon name="arrow" size={14}/></button><div className="sidebar-bottom"><span><Icon name="lock" size={12}/> A SELF-CONTAINED STORY</span><button onClick={() => setNotesOpen(true)}>ABOUT THIS DEVICE</button></div></aside>
      <section className="device-stage" id="home"><div className="ambient ambient--one"/><div className="ambient ambient--two"/><div className="stage-label"><span className="stage-label__dot"/> INTERACTIVE EXPERIENCE <span>↗</span></div><div className="phone"><div className="phone__bezel-top"><span className="phone__speaker"/><span className="phone__camera"/></div><StatusBar time={time}/><div className="phone-screen"><div className="screen-content" key={activeApp}>
        {activeApp === 'home' && <HomeView game={game} setGame={setGame} openApp={openApp} time={time} onOpenNotes={() => setNotesOpen(true)}/>}
        {activeApp === 'messages' && <MessagesView game={game} setGame={setGame} openApp={openApp}/>}
        {activeApp === 'mail' && <MailView game={game} setGame={setGame}/>}
        {activeApp === 'contacts' && <ContactsView game={game} openApp={openApp}/>}
        {activeApp === 'files' && <FilesView game={game} setGame={setGame} openApp={openApp}/>}
        {activeApp === 'wave' && <WaveView game={game} setGame={setGame}/>}
      </div><div className="bottom-nav">{['home', 'messages', 'mail', 'contacts', 'files', 'wave'].map((id) => {const app = APPS.find((item) => item.id === id);return <button key={id} onClick={() => openApp(id)} className={`bottom-nav__item ${activeApp === id ? 'bottom-nav__item--active' : ''}`} aria-label={`Open ${id === 'home' ? 'home' : app.label}`} aria-current={activeApp === id ? 'page' : undefined}><Icon name={id === 'home' ? 'home' : app.icon} size={19}/>{id === 'messages' && !game.choice && <span className="nav-unread"/>}</button>;})}</div></div><div className="phone__bezel-bottom"><span/></div></div><div className="device-caption"><span>FIG. 01</span><span>{appInfo ? `${appInfo.label.toUpperCase()} / ` : ''}MARA ELLISON’S DEVICE</span><span>BUILD {game.seed.toUpperCase()}</span></div></section>
      <aside className="intel-sidebar"><div className="intel-heading"><span className="eyebrow">FIELD NOTES</span><span className="intel-heading__count">0{Math.max(game.notes.length, 0)} <span>/ 04</span></span></div><h2>A story told<br/>in the <em>small things.</em></h2><p className="intel-intro">Messages, files, and posts are all connected. The things you say matter.</p><div className="story-progress"><div className="story-progress__top"><span>STORY PROGRESS</span><span>{game.choice ? '02' : '01'} / 04</span></div><div className="progress-track"><span style={{ width: game.choice ? '52%' : '18%' }}/></div></div><div className="cross-links-heading"><span>WHAT’S CONNECTED</span><Icon name="arrow" size={13}/></div><div className="cross-link-list"><button onClick={() => openApp('messages')}><span className="connection-icon connection-icon--lavender"><Icon name="message" size={15}/></span><span><strong>Mara’s messages</strong><small>Where it all begins</small></span><span className="connection-state">OPEN</span></button><button onClick={() => openApp('files')}><span className={`connection-icon connection-icon--blue ${!game.choice ? 'connection-icon--dim' : ''}`}><Icon name={!game.choice ? 'lock' : 'files'} size={15}/></span><span><strong>Hidden backup</strong><small>{game.choice ? 'New evidence found' : 'Waiting to be recovered'}</small></span><span className={`connection-dot ${game.choice ? 'connection-dot--on' : ''}`}/></button><button onClick={() => openApp('contacts')}><span className={`connection-icon connection-icon--mint ${!game.choice ? 'connection-icon--dim' : ''}`}><Icon name={!game.choice ? 'lock' : 'contacts'} size={15}/></span><span><strong>Rowan’s contact</strong><small>{game.choice ? 'Reconnected just now' : 'Contact card damaged'}</small></span><span className={`connection-dot ${game.choice ? 'connection-dot--on' : ''}`}/></button><button onClick={() => openApp('wave')}><span className="connection-icon connection-icon--coral"><Icon name="wave" size={15}/></span><span><strong>Wave social feed</strong><small>{game.replyPosted ? 'Mara just posted a reply' : 'Someone’s being watched'}</small></span><span className={`connection-dot ${game.replyPosted ? 'connection-dot--on' : ''}`}/></button></div><button className="open-notes" onClick={() => setNotesOpen(true)}><span><Icon name="files" size={15}/><strong>Open your notebook</strong>{game.notes.length > 0 && <span className="open-notes__count">{game.notes.length}</span>}</span><Icon name="arrow" size={15}/></button><div className="intel-footer"><span>AFTERLIGHT STUDIOS</span><span>AN INTERACTIVE FICTION · {new Date().getFullYear()}</span></div></aside>
    </section>
    <div className="mobile-story-bar"><span className="mobile-story-dot"/><span>{statusNotification}</span><button onClick={() => setNotesOpen(true)}><Icon name="files" size={15}/><span>{game.notes.length || ''}</span></button></div>
    {notesOpen && <NotesPanel game={game} setGame={setGame} onClose={() => setNotesOpen(false)}/>}
    <div className="toaster" key={statusNotification}><span><Icon name={game.choice || game.liked || game.replyPosted ? 'spark' : 'moon'} size={15}/></span>{statusNotification}<button aria-label="Dismiss notification" onClick={() => setGame((current) => ({ ...current, notification: 'Device notifications are muted.' }))}><Icon name="close" size={14}/></button></div>
  </main>;
}

createRoot(document.getElementById('root')).render(<App/>);
