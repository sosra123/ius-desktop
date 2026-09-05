const { useState, useEffect, useRef } = React;
const h = React.createElement;

// ---------- design tokens / themes ----------
const THEMES = {
  dark: {
    bg: "#000000",
    surface: "#141414",
    surfaceRaised: "#1c1c1c",
    border: "#262626",
    accent: "#0A66FB",
    accentDim: "#0B2A63",
    text: "#F5F5F5",
    textDim: "#8A8A8A",
    textFaint: "#4A4A4A",
  },
  light: {
    bg: "#FFFFFF",
    surface: "#F1F4F9",
    surfaceRaised: "#E6EBF3",
    border: "#DCE2EC",
    accent: "#0A66FB",
    accentDim: "#D9E6FF",
    text: "#12161C",
    textDim: "#626D7A",
    textFaint: "#9AA4B1",
  },
};
const COLORS = { ...THEMES.dark };
function applyTheme(name) {
  const t = THEMES[name] || THEMES.dark;
  Object.assign(COLORS, t);
}
const FONT_DISPLAY = "'Space Grotesk', 'Helvetica Neue', sans-serif";
const FONT_BODY = "'Inter', 'Helvetica Neue', sans-serif";

// ---------- tiny icon set (inline SVG, no deps) ----------
function Icon(path, props = {}) {
  const { size = 20, color = "currentColor", fill = "none", strokeW = 2 } = props;
  return h(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill,
      stroke: color,
      strokeWidth: strokeW,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    path
  );
}
const IconChat = (p) =>
  Icon(h("path", { d: "M21 11.5a8.38 8.38 0 0 1-9 8.5A8.5 8.5 0 1 1 21 11.5z" }), p);
const IconNote = (p) =>
  Icon(
    [
      h("path", { key: 1, d: "M12 20h9" }),
      h("path", { key: 2, d: "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" }),
    ],
    p
  );
const IconMusic = (p) =>
  Icon(
    [
      h("path", { key: 1, d: "M9 18V5l12-2v13" }),
      h("circle", { key: 2, cx: 6, cy: 18, r: 3 }),
      h("circle", { key: 3, cx: 18, cy: 16, r: 3 }),
    ],
    p
  );
const IconSend = (p) => Icon(h("path", { d: "M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" }), p);
const IconPlus = (p) =>
  Icon([h("path", { key: 1, d: "M12 5v14" }), h("path", { key: 2, d: "M5 12h14" })], p);
const IconTrash = (p) =>
  Icon(
    [
      h("path", { key: 1, d: "M3 6h18" }),
      h("path", { key: 2, d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }),
      h("path", { key: 3, d: "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" }),
    ],
    p
  );
const IconPlay = (p) => Icon(h("polygon", { points: "6 3 20 12 6 21 6 3" }), { ...p, fill: p.color || COLORS.text });
const IconPause = (p) =>
  Icon(
    [
      h("rect", { key: 1, x: 6, y: 4, width: 4, height: 16 }),
      h("rect", { key: 2, x: 14, y: 4, width: 4, height: 16 }),
    ],
    { ...p, fill: p.color || COLORS.text }
  );
const IconSkipBack = (p) =>
  Icon(
    [
      h("polygon", { key: 1, points: "19 20 9 12 19 4 19 20" }),
      h("line", { key: 2, x1: 5, y1: 19, x2: 5, y2: 5 }),
    ],
    { ...p, fill: p.color || COLORS.text }
  );
const IconSkipForward = (p) =>
  Icon(
    [
      h("polygon", { key: 1, points: "5 4 15 12 5 20 5 4" }),
      h("line", { key: 2, x1: 19, y1: 5, x2: 19, y2: 19 }),
    ],
    { ...p, fill: p.color || COLORS.text }
  );
const IconBack = (p) =>
  Icon([h("path", { key: 1, d: "M19 12H5" }), h("path", { key: 2, d: "M12 19l-7-7 7-7" })], p);
const IconX = (p) =>
  Icon([h("path", { key: 1, d: "M18 6 6 18" }), h("path", { key: 2, d: "M6 6l12 12" })], p);
const IconUser = (p) =>
  Icon(
    [
      h("path", { key: 1, d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
      h("circle", { key: 2, cx: 12, cy: 7, r: 4 }),
    ],
    p
  );
const IconCamera = (p) =>
  Icon(
    [
      h("path", {
        key: 1,
        d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z",
      }),
      h("circle", { key: 2, cx: 12, cy: 13, r: 4 }),
    ],
    p
  );
const IconCheck = (p) => Icon(h("path", { d: "M20 6 9 17l-5-5" }), p);
const IconTikTok = (p) => {
  const { size = 20, color = "currentColor" } = p;
  return h(
    "svg",
    { width: size, height: size, viewBox: "0 0 24 24", fill: "none" },
    h("path", {
      d: "M16.5 2c.3 2.1 1.6 3.8 3.7 4.3v2.9c-1.4.1-2.6-.3-3.7-1.1v6.6c0 3.3-2.4 5.7-5.6 5.7-3.1 0-5.6-2.4-5.6-5.6 0-3.1 2.6-5.7 5.9-5.5v3c-1.4-.2-2.7.8-2.7 2.3 0 1.4 1.1 2.5 2.5 2.5 1.5 0 2.7-1.2 2.7-2.9V2h2.8z",
      fill: color,
    })
  );
};
const IconChannel = (p) =>
  Icon(
    [
      h("path", { key: 1, d: "M3 11l18-7-4 18-6-6-4 4v-6z" }),
    ],
    p
  );
const IconBell = (p) =>
  Icon(
    [
      h("path", { key: 1, d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" }),
      h("path", { key: 2, d: "M10.3 21a1.94 1.94 0 0 0 3.4 0" }),
    ],
    p
  );
const IconClosed = (p) =>
  Icon(
    [
      h("circle", { key: 1, cx: 12, cy: 12, r: 9 }),
      h("path", { key: 2, d: "M9 9l6 6M15 9l-6 6" }),
    ],
    p
  );
const IconMic = (p) =>
  Icon(
    [
      h("rect", { key: 1, x: 9, y: 2, width: 6, height: 12, rx: 3 }),
      h("path", { key: 2, d: "M5 10v1a7 7 0 0 0 14 0v-1" }),
      h("path", { key: 3, d: "M12 18v4" }),
      h("path", { key: 4, d: "M8 22h8" }),
    ],
    p
  );
const IconMore = (p) =>
  Icon(
    [
      h("circle", { key: 1, cx: 12, cy: 5, r: 1.3, fill: p.color || "currentColor" }),
      h("circle", { key: 2, cx: 12, cy: 12, r: 1.3, fill: p.color || "currentColor" }),
      h("circle", { key: 3, cx: 12, cy: 19, r: 1.3, fill: p.color || "currentColor" }),
    ],
    p
  );
const IconLock = (p) =>
  Icon(
    [
      h("rect", { key: 1, x: 5, y: 11, width: 14, height: 10, rx: 2 }),
      h("path", { key: 2, d: "M8 11V7a4 4 0 0 1 8 0v4" }),
    ],
    p
  );
const IconSlash = (p) =>
  Icon([h("circle", { key: 1, cx: 12, cy: 12, r: 9 }), h("path", { key: 2, d: "M6 6l12 12" })], p);
const IconFlag = (p) =>
  Icon(
    [
      h("path", { key: 1, d: "M4 22V4" }),
      h("path", { key: 2, d: "M4 4h13l-2.5 4L17 12H4" }),
    ],
    p
  );
const IconLogout = (p) =>
  Icon(
    [
      h("path", { key: 1, d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }),
      h("path", { key: 2, d: "M16 17l5-5-5-5" }),
      h("path", { key: 3, d: "M21 12H9" }),
    ],
    p
  );

// ---------- sound / ringtone helpers ----------
function playDefaultBeep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    [880, 1180].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.16);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + i * 0.16 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.16 + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.16);
      osc.stop(ctx.currentTime + i * 0.16 + 0.24);
    });
  } catch (e) {}
}

function playRingtone(ringtoneBase64) {
  if (ringtoneBase64) {
    try {
      const audio = new Audio(ringtoneBase64);
      audio.volume = 0.85;
      audio.play().catch(() => playDefaultBeep());
      return;
    } catch (e) {}
  }
  playDefaultBeep();
}

function randomIusId() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ---------- blob logo ----------
const PETAL_POINTS = [
  "100,73 99.3,77.9 97.5,82 94.6,84.6 91,85.1 87.3,83.3 84,79.2 81.3,73 79.9,65.2 79.9,56.5 81.4,47.8 84.5,39.9 88.8,33.6 94.2,29.6 100,28.2 105.8,29.6 111.2,33.6 115.5,39.9 118.6,47.8 120.1,56.5 120.1,65.2 118.7,73 116,79.2 112.7,83.3 109,85.1 105.4,84.6 102.5,82 100.7,77.9 100,73",
  "125.7,91.7 120.8,92.5 116.3,92 113,90.1 111.4,86.9 111.9,82.8 114.8,78.3 119.9,73.9 126.9,70.1 135.1,67.4 143.9,66.2 152.3,66.7 159.7,68.9 165.2,72.7 168.3,77.8 168.8,83.8 166.6,90.1 161.9,96.2 155.4,101.6 147.6,105.7 139.3,108.4 131.4,109.4 124.7,108.8 119.8,106.9 116.9,103.9 116.4,100.4 117.9,96.9 121.2,93.8 125.7,91.7",
  "115.9,121.8 113.5,117.5 112.7,113.1 113.5,109.3 116,106.8 120,106 125.2,107.4 131,110.9 136.7,116.3 141.8,123.3 145.7,131.3 147.9,139.5 148,147.1 146.1,153.5 142.2,158.1 136.7,160.4 130,160.2 122.7,157.7 115.6,153.1 109.3,147 104.2,140 100.8,132.8 99.2,126.2 99.6,120.9 101.5,117.3 104.7,115.7 108.5,116.1 112.5,118.3 115.9,121.8",
  "84.1,121.8 87.5,118.3 91.5,116.1 95.3,115.7 98.5,117.3 100.4,120.9 100.8,126.2 99.2,132.8 95.8,140 90.7,147 84.4,153.1 77.3,157.7 70,160.2 63.3,160.4 57.8,158.1 53.9,153.5 52,147.1 52.1,139.5 54.3,131.3 58.2,123.3 63.3,116.3 69,110.9 74.8,107.4 80,106 84,106.8 86.5,109.3 87.3,113.1 86.5,117.5 84.1,121.8",
  "74.3,91.7 78.8,93.8 82.1,96.9 83.6,100.4 83.1,103.9 80.2,106.9 75.3,108.8 68.6,109.4 60.7,108.4 52.4,105.7 44.6,101.6 38.1,96.2 33.4,90.1 31.2,83.8 31.7,77.8 34.8,72.7 40.3,68.9 47.7,66.7 56.1,66.2 64.9,67.4 73.1,70.1 80.1,73.9 85.2,78.3 88.1,82.8 88.6,86.9 87,90.1 83.7,92 79.2,92.5 74.3,91.7",
];
function Blob({ size = 28 }) {
  return h(
    "svg",
    { width: size, height: size, viewBox: "0 0 200 200", fill: "none" },
    PETAL_POINTS.map((pts, i) =>
      h("polygon", { key: i, points: pts, fill: COLORS.accent })
    )
  );
}

// ---------- seed data ----------
const INITIAL_CHATS = [
  {
    id: "c1",
    name: "Мира",
    avatarColor: "#00F5E0",
    messages: [
      { id: 1, from: "them", text: "Ты видел новый логотип?", t: "10:02" },
      { id: 2, from: "me", text: "Да, бирюзовая клякса огонь", t: "10:03" },
    ],
  },
  {
    id: "c2",
    name: "Дэн",
    avatarColor: "#7CFFF3",
    messages: [{ id: 1, from: "them", text: "Плеер уже работает?", t: "09:14" }],
  },
  {
    id: "c3",
    name: "Команда ius",
    avatarColor: "#00A99A",
    messages: [{ id: 1, from: "them", text: "Сборка прошла успешно ✅", t: "Вчера" }],
  },
];
const INITIAL_NOTES = [
  { id: "n1", title: "Идея", body: "Назвать приложение ius." },
  { id: "n2", title: "Логотип", body: "Бирюзовая клякса на чёрном фоне." },
];
const INITIAL_TRACKS = [
  { id: "t1", title: "Пустота", artist: "null.exe", duration: 187 },
  { id: "t2", title: "Блэкаут", artist: "ius session", duration: 214 },
  { id: "t3", title: "Три плашки", artist: "ius session", duration: 156 },
];
const REPLIES = ["Принято 👍", "Ок, гляну позже", "Интересно, расскажи подробнее", "😄", "Согласен"];
const RANDOM_NOTIF_MESSAGES = [
  "Привет! Как дела?",
  "Ты как, свободен?",
  "Напиши, когда сможешь",
  "Видел новости?",
  "Го созвон вечером?",
  "Скинь фото, когда будет время",
  "😄",
  "Кстати, ты был прав",
  "Не забудь про встречу",
  "Как продвигается?",
];

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ---------- Messenger ----------
// ---------- Voice message bubble ----------
function VoiceBubble({ message, isMe }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  function toggle() {
    if (!audioRef.current) {
      audioRef.current = new Audio(message.audio);
      audioRef.current.onended = () => setPlaying(false);
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  }

  return h(
    "div",
    { style: { display: "flex", alignItems: "center", gap: 10, minWidth: 150 } },
    h(
      "button",
      {
        onClick: toggle,
        "aria-label": playing ? "Пауза" : "Играть",
        style: {
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: isMe ? "rgba(0,0,0,0.15)" : COLORS.accent,
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        },
      },
      playing
        ? IconPause({ size: 13, color: isMe ? "#000" : "#000" })
        : IconPlay({ size: 13, color: isMe ? "#000" : "#000" })
    ),
    h(
      "div",
      { style: { display: "flex", alignItems: "center", gap: 2, flex: 1 } },
      Array.from({ length: 18 }).map((_, i) =>
        h("div", {
          key: i,
          style: {
            width: 2,
            height: 6 + ((i * 37) % 13),
            background: isMe ? "rgba(0,0,0,0.35)" : COLORS.textDim,
            borderRadius: 1,
          },
        })
      )
    ),
    h(
      "span",
      { style: { fontSize: 11, opacity: 0.7, flexShrink: 0 } },
      formatTime(message.duration || 0)
    )
  );
}

function Messenger({ chats, setChats, ringtone }) {
  const [activeId, setActiveId] = useState(null);
  const [draft, setDraft] = useState("");
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("chat");
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportFlash, setReportFlash] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const scrollRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const recTimerRef = useRef(null);
  const active = chats.find((c) => c.id === activeId);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [active]);

  function send() {
    if (!draft.trim() || !active || active.blocked) return;
    const now = new Date();
    const t = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;
    const myMsg = { id: Date.now(), from: "me", text: draft.trim(), t };
    setChats((prev) =>
      prev.map((c) => (c.id === active.id ? { ...c, messages: [...c.messages, myMsg] } : c))
    );
    setDraft("");
    if (active.type === "channel") return;
    setTimeout(() => {
      const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)];
      const now2 = new Date();
      const t2 = `${now2.getHours()}:${now2.getMinutes().toString().padStart(2, "0")}`;
      setChats((prev) =>
        prev.map((c) =>
          c.id === active.id
            ? { ...c, messages: [...c.messages, { id: Date.now() + 1, from: "them", text: reply, t: t2 }] }
            : c
        )
      );
    }, 900);
  }

  function startRecording() {
    if (!active || active.blocked) return;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Микрофон недоступен в этом браузере");
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        chunksRef.current = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };
        recorder.onstop = () => {
          stream.getTracks().forEach((tr) => tr.stop());
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          const reader = new FileReader();
          reader.onload = () => {
            sendVoice(reader.result, recSeconds);
          };
          reader.readAsDataURL(blob);
        };
        recorder.start();
        recorderRef.current = recorder;
        setRecSeconds(0);
        setRecording(true);
        recTimerRef.current = setInterval(() => setRecSeconds((s) => s + 1), 1000);
      })
      .catch(() => alert("Нет доступа к микрофону"));
  }

  function stopRecording(cancel) {
    clearInterval(recTimerRef.current);
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      if (cancel) recorderRef.current.onstop = null;
      recorderRef.current.stop();
    }
    setRecording(false);
  }

  function sendVoice(audioBase64, seconds) {
    if (!active) return;
    const now = new Date();
    const t = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;
    const myMsg = { id: Date.now(), from: "me", type: "voice", audio: audioBase64, duration: seconds, t };
    setChats((prev) =>
      prev.map((c) => (c.id === active.id ? { ...c, messages: [...c.messages, myMsg] } : c))
    );
  }

  function toggleBlock() {
    setChats((prev) => prev.map((c) => (c.id === active.id ? { ...c, blocked: !c.blocked } : c)));
    setMenuOpen(false);
  }

  function report() {
    setMenuOpen(false);
    setReportFlash(true);
    setTimeout(() => setReportFlash(false), 2500);
  }

  function deleteChat() {
    setChats((prev) => prev.filter((c) => c.id !== active.id));
    setMenuOpen(false);
    setActiveId(null);
  }

  function createChat(type) {
    const name = newName.trim();
    if (!name) return;
    const id = "c" + Date.now();
    const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    const newChat = { id, name, avatarColor: color, messages: [], type: type || "chat" };
    setChats((prev) => [newChat, ...prev]);
    setNewName("");
    setCreating(false);
    setActiveId(id);
  }

  if (active) {
    return h(
      "div",
      { style: { display: "flex", flexDirection: "column", height: "100%" } },
      h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 16px",
            borderBottom: `1px solid ${COLORS.border}`,
          },
        },
        h(
          "button",
          {
            onClick: () => setActiveId(null),
            style: { background: "none", border: "none", color: COLORS.text, padding: 4 },
            "aria-label": "Назад",
          },
          IconBack({ size: 20 })
        ),
        h(
          "div",
          {
            style: {
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: active.avatarColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              color: "#000",
              fontFamily: FONT_DISPLAY,
            },
          },
          active.type === "channel" ? IconChannel({ size: 16, color: "#000" }) : active.name[0]
        ),
        h("span", { style: { fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 16 } }, active.name),
        active.type === "channel" &&
          h(
            "span",
            {
              style: {
                fontFamily: FONT_BODY,
                fontSize: 10,
                color: COLORS.textDim,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 8,
                padding: "2px 7px",
              },
            },
            "канал"
          ),
        h(
          "div",
          { style: { marginLeft: "auto", position: "relative" } },
          h(
            "button",
            {
              onClick: () => setMenuOpen((v) => !v),
              style: { background: "none", border: "none", color: COLORS.text, padding: 4 },
              "aria-label": "Меню",
            },
            IconMore({ size: 18, color: COLORS.text })
          ),
          menuOpen &&
            h(
              "div",
              {
                style: {
                  position: "absolute",
                  top: 32,
                  right: 0,
                  background: COLORS.surfaceRaised,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 12,
                  overflow: "hidden",
                  zIndex: 20,
                  minWidth: 190,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                },
              },
              h(
                "button",
                {
                  onClick: toggleBlock,
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    width: "100%",
                    padding: "11px 14px",
                    background: "none",
                    border: "none",
                    color: COLORS.text,
                    fontFamily: FONT_BODY,
                    fontSize: 13,
                    textAlign: "left",
                  },
                },
                active.blocked ? IconSlash({ size: 15 }) : IconLock({ size: 15 }),
                active.blocked ? "Разблокировать" : "Заблокировать"
              ),
              h(
                "button",
                {
                  onClick: report,
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    width: "100%",
                    padding: "11px 14px",
                    background: "none",
                    border: "none",
                    borderTop: `1px solid ${COLORS.border}`,
                    color: COLORS.text,
                    fontFamily: FONT_BODY,
                    fontSize: 13,
                    textAlign: "left",
                  },
                },
                IconFlag({ size: 15 }),
                "Пожаловаться"
              ),
              h(
                "button",
                {
                  onClick: deleteChat,
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    width: "100%",
                    padding: "11px 14px",
                    background: "none",
                    border: "none",
                    borderTop: `1px solid ${COLORS.border}`,
                    color: "#FF6B6B",
                    fontFamily: FONT_BODY,
                    fontSize: 13,
                    textAlign: "left",
                  },
                },
                IconTrash({ size: 15, color: "#FF6B6B" }),
                "Удалить чат"
              )
            )
        )
      ),
      reportFlash &&
        h(
          "div",
          {
            style: {
              padding: "8px 16px",
              background: COLORS.accentDim,
              color: COLORS.accent,
              fontFamily: FONT_BODY,
              fontSize: 12.5,
              textAlign: "center",
            },
          },
          "Жалоба отправлена — мы её рассмотрим"
        ),
      active.blocked &&
        h(
          "div",
          {
            style: {
              padding: "8px 16px",
              background: COLORS.surface,
              color: COLORS.textDim,
              fontFamily: FONT_BODY,
              fontSize: 12.5,
              textAlign: "center",
            },
          },
          "Пользователь заблокирован"
        ),
      h(
        "div",
        {
          ref: scrollRef,
          style: { flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 8 },
        },
        active.messages.map((m) =>
          h(
            "div",
            {
              key: m.id,
              style: {
                alignSelf: m.from === "me" ? "flex-end" : "flex-start",
                maxWidth: "78%",
                background: m.from === "me" ? COLORS.accent : COLORS.surfaceRaised,
                color: m.from === "me" ? "#000" : COLORS.text,
                padding: "9px 13px",
                borderRadius: 16,
                borderBottomRightRadius: m.from === "me" ? 4 : 16,
                borderBottomLeftRadius: m.from === "me" ? 16 : 4,
                fontFamily: FONT_BODY,
                fontSize: 14.5,
                lineHeight: 1.4,
              },
            },
            m.type === "voice" ? h(VoiceBubble, { message: m, isMe: m.from === "me" }) : m.text,
            h(
              "div",
              { style: { fontSize: 10, opacity: 0.55, marginTop: 3, textAlign: "right" } },
              m.t
            )
          )
        )
      ),
      h(
        "div",
        { style: { display: "flex", gap: 8, padding: 12, borderTop: `1px solid ${COLORS.border}`, alignItems: "center" } },
        recording
          ? h(
              "div",
              {
                style: {
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: COLORS.surfaceRaised,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 20,
                  padding: "8px 14px",
                },
              },
              h("div", {
                style: {
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "#FF6B6B",
                  animation: "none",
                },
              }),
              h(
                "span",
                { style: { fontFamily: FONT_BODY, fontSize: 13, color: COLORS.text, flex: 1 } },
                "Запись… " + formatTime(recSeconds)
              ),
              h(
                "button",
                {
                  onClick: () => stopRecording(true),
                  "aria-label": "Отменить",
                  style: { background: "none", border: "none", color: COLORS.textDim },
                },
                IconX({ size: 17 })
              )
            )
          : h("input", {
              value: draft,
              onChange: (e) => setDraft(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && send(),
              placeholder: active.blocked ? "Пользователь заблокирован" : "Сообщение…",
              disabled: active.blocked,
              style: {
                flex: 1,
                background: COLORS.surfaceRaised,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 20,
                padding: "10px 16px",
                color: COLORS.text,
                fontFamily: FONT_BODY,
                fontSize: 14,
                outline: "none",
                opacity: active.blocked ? 0.5 : 1,
              },
            }),
        recording
          ? h(
              "button",
              {
                onClick: () => stopRecording(false),
                "aria-label": "Отправить голосовое",
                style: {
                  background: COLORS.accent,
                  border: "none",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                },
              },
              IconCheck({ size: 17, color: "#000" })
            )
          : draft.trim()
          ? h(
              "button",
              {
                onClick: send,
                style: {
                  background: COLORS.accent,
                  border: "none",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                },
                "aria-label": "Отправить",
              },
              IconSend({ size: 17, color: "#000" })
            )
          : h(
              "button",
              {
                onClick: startRecording,
                disabled: active.blocked,
                style: {
                  background: COLORS.accent,
                  border: "none",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  opacity: active.blocked ? 0.5 : 1,
                },
                "aria-label": "Голосовое сообщение",
              },
              IconMic({ size: 17, color: "#000" })
            )
      )
    );
  }

  return h(
    "div",
    { style: { padding: "8px 4px", position: "relative", height: "100%", overflowY: "auto" } },
    creating &&
      h(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: "10px 16px",
            borderBottom: `1px solid ${COLORS.border}`,
          },
        },
        h(
          "div",
          { style: { display: "flex", gap: 8 } },
          [
            { id: "chat", label: "Чат" },
            { id: "channel", label: "Канал" },
          ].map((opt) =>
            h(
              "button",
              {
                key: opt.id,
                onClick: () => setNewType(opt.id),
                style: {
                  background: newType === opt.id ? COLORS.accent : COLORS.surfaceRaised,
                  border: "none",
                  borderRadius: 14,
                  padding: "5px 14px",
                  color: newType === opt.id ? "#000" : COLORS.textDim,
                  fontFamily: FONT_BODY,
                  fontWeight: 600,
                  fontSize: 12.5,
                },
              },
              opt.label
            )
          )
        ),
        h(
          "div",
          { style: { display: "flex", gap: 8, alignItems: "center" } },
          h("input", {
            autoFocus: true,
            value: newName,
            onChange: (e) => setNewName(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Enter") createChat(newType);
              if (e.key === "Escape") {
                setCreating(false);
                setNewName("");
              }
            },
            placeholder: newType === "channel" ? "Название канала…" : "Имя нового собеседника…",
            style: {
              flex: 1,
              background: COLORS.surfaceRaised,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 20,
              padding: "9px 15px",
              color: COLORS.text,
              fontFamily: FONT_BODY,
              fontSize: 14,
              outline: "none",
            },
          }),
          h(
            "button",
            {
              onClick: () => createChat(newType),
              "aria-label": "Создать",
              style: {
                background: COLORS.accent,
                border: "none",
                borderRadius: "50%",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              },
            },
            IconCheck({ size: 16, color: "#000" })
          ),
          h(
            "button",
            {
              onClick: () => {
                setCreating(false);
                setNewName("");
              },
              "aria-label": "Отмена",
              style: {
                background: "none",
                border: "none",
                color: COLORS.textDim,
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              },
            },
            IconX({ size: 18 })
          )
        )
      ),
    chats.length === 0 &&
      !creating &&
      h(
        "div",
        {
          style: {
            padding: "60px 20px",
            textAlign: "center",
            color: COLORS.textDim,
            fontFamily: FONT_BODY,
            fontSize: 13.5,
          },
        },
        "Пока нет ни одного чата — нажми «+», чтобы начать переписку"
      ),
    chats.map((c) => {
      const last = c.messages[c.messages.length - 1];
      return h(
        "button",
        {
          key: c.id,
          onClick: () => setActiveId(c.id),
          style: {
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 16px",
            background: "none",
            border: "none",
            borderBottom: `1px solid ${COLORS.border}`,
            textAlign: "left",
            cursor: "pointer",
          },
        },
        h(
          "div",
          {
            style: {
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: c.avatarColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              color: "#000",
              fontFamily: FONT_DISPLAY,
              fontSize: 16,
              flexShrink: 0,
            },
          },
          c.type === "channel" ? IconChannel({ size: 18, color: "#000" }) : c.name[0]
        ),
        h(
          "div",
          { style: { flex: 1, minWidth: 0 } },
          h(
            "div",
            { style: { display: "flex", alignItems: "center", gap: 6 } },
            h(
              "span",
              { style: { fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 15, color: COLORS.text } },
              c.name
            ),
            c.type === "channel" &&
              h(
                "span",
                {
                  style: {
                    fontFamily: FONT_BODY,
                    fontSize: 9.5,
                    color: COLORS.textDim,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 7,
                    padding: "1px 6px",
                  },
                },
                "канал"
              )
          ),
          h(
            "div",
            {
              style: {
                fontFamily: FONT_BODY,
                fontSize: 13,
                color: COLORS.textDim,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              },
            },
            last ? last.text : ""
          )
        ),
        h(
          "span",
          { style: { fontSize: 11, color: COLORS.textFaint, fontFamily: FONT_BODY } },
          last ? last.t : ""
        )
      );
    }),
    h(
      "button",
      {
        onClick: () => setCreating(true),
        style: {
          position: "absolute",
          bottom: 20,
          right: 20,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: COLORS.accent,
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 18px rgba(0,245,224,0.35)",
        },
        "aria-label": "Новый чат",
      },
      IconPlus({ size: 24, color: "#000" })
    )
  );
}

// ---------- Notes ----------
function Notes() {
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  function openNew() {
    setEditing({ id: null });
    setTitle("");
    setBody("");
  }
  function openEdit(n) {
    setEditing(n);
    setTitle(n.title);
    setBody(n.body);
  }
  function save() {
    if (!title.trim() && !body.trim()) {
      setEditing(null);
      return;
    }
    if (editing.id) {
      setNotes((prev) => prev.map((n) => (n.id === editing.id ? { ...n, title, body } : n)));
    } else {
      setNotes((prev) => [{ id: "n" + Date.now(), title: title || "Без названия", body }, ...prev]);
    }
    setEditing(null);
  }
  function remove(id) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setEditing(null);
  }

  if (editing) {
    return h(
      "div",
      { style: { display: "flex", flexDirection: "column", height: "100%" } },
      h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            borderBottom: `1px solid ${COLORS.border}`,
          },
        },
        h(
          "button",
          { onClick: () => setEditing(null), style: { background: "none", border: "none", color: COLORS.text }, "aria-label": "Закрыть" },
          IconX({ size: 20 })
        ),
        h(
          "span",
          { style: { fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 15 } },
          editing.id ? "Правка" : "Новая заметка"
        ),
        h(
          "button",
          {
            onClick: save,
            style: { background: "none", border: "none", color: COLORS.accent, fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14 },
          },
          "Готово"
        )
      ),
      h(
        "div",
        { style: { padding: 16, display: "flex", flexDirection: "column", gap: 10, flex: 1 } },
        h("input", {
          autoFocus: true,
          value: title,
          onChange: (e) => setTitle(e.target.value),
          placeholder: "Заголовок",
          style: {
            background: "none",
            border: "none",
            outline: "none",
            color: COLORS.text,
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: 20,
          },
        }),
        h("textarea", {
          value: body,
          onChange: (e) => setBody(e.target.value),
          placeholder: "Текст заметки…",
          style: {
            background: "none",
            border: "none",
            outline: "none",
            color: COLORS.textDim,
            fontFamily: FONT_BODY,
            fontSize: 14.5,
            lineHeight: 1.6,
            resize: "none",
            flex: 1,
          },
        }),
        editing.id &&
          h(
            "button",
            {
              onClick: () => remove(editing.id),
              style: {
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "none",
                border: "none",
                color: "#FF6B6B",
                fontFamily: FONT_BODY,
                fontSize: 13,
                padding: "8px 0",
                alignSelf: "flex-start",
              },
            },
            IconTrash({ size: 15 }),
            " Удалить заметку"
          )
      )
    );
  }

  return h(
    "div",
    { style: { padding: 12, position: "relative", height: "100%", overflowY: "auto" } },
    h(
      "div",
      { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } },
      notes.map((n) =>
        h(
          "button",
          {
            key: n.id,
            onClick: () => openEdit(n),
            style: {
              textAlign: "left",
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 14,
              padding: 14,
              minHeight: 100,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            },
          },
          h(
            "span",
            { style: { fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14.5, color: COLORS.text } },
            n.title
          ),
          h(
            "span",
            {
              style: {
                fontFamily: FONT_BODY,
                fontSize: 12.5,
                color: COLORS.textDim,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
              },
            },
            n.body
          )
        )
      )
    ),
    h(
      "button",
      {
        onClick: openNew,
        style: {
          position: "absolute",
          bottom: 20,
          right: 20,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: COLORS.accent,
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 18px rgba(0,245,224,0.35)",
        },
        "aria-label": "Новая заметка",
      },
      IconPlus({ size: 24, color: "#000" })
    )
  );
}

// ---------- Player ----------
function Player() {
  return h(
    "div",
    {
      style: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        padding: "24px 32px",
        textAlign: "center",
      },
    },
    h(
      "div",
      {
        style: {
          width: 84,
          height: 84,
          borderRadius: "50%",
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.6,
        },
      },
      IconMusic({ size: 32, color: COLORS.textDim })
    ),
    h(
      "div",
      { style: { fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 17, color: COLORS.text } },
      "Плеер закрыт"
    ),
    h(
      "div",
      {
        style: {
          fontFamily: FONT_BODY,
          fontSize: 13.5,
          color: COLORS.textDim,
          lineHeight: 1.6,
          maxWidth: 280,
        },
      },
      "Начиная с сентября–октября плеер больше не поддерживается IUS и будет закрыт."
    ),
    h(
      "div",
      {
        style: {
          fontFamily: FONT_BODY,
          fontSize: 13,
          color: COLORS.accent,
          marginTop: 4,
        },
      },
      "Спасибо всем, кто пользовался нашим плеером 💙"
    )
  );
}

// ---------- Music ----------
function Music() {
  return h(
    "div",
    {
      style: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        padding: "24px 32px",
        textAlign: "center",
      },
    },
    h(Blob, { size: 72 }),
    h(
      "div",
      { style: { fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, color: COLORS.text } },
      "Музыка скоро здесь"
    ),
    h(
      "div",
      {
        style: {
          fontFamily: FONT_BODY,
          fontSize: 13.5,
          color: COLORS.textDim,
          lineHeight: 1.6,
          maxWidth: 280,
        },
      },
      "Мы готовим новый раздел «Музыка» взамен старого плеера. Скоро здесь появится что-то новое."
    )
  );
}

// ---------- account / auth ----------
const ACCOUNT_KEY = "ius_account_v1";
const SESSION_KEY = "ius_session_v1";

function loadAccount() {
  try {
    const raw = localStorage.getItem(ACCOUNT_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}
function saveAccount(account) {
  try {
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  } catch (e) {}
}
function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}
function saveSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (e) {}
}

function AuthScreen({ hasAccount, onAuthed }) {
  const [mode, setMode] = useState(hasAccount ? "login" : "signup");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  function submit() {
    setError("");
    if (mode === "signup") {
      if (!nickname.trim()) {
        setError("Введите никнейм");
        return;
      }
      if (password.length < 4) {
        setError("Пароль должен быть от 4 символов");
        return;
      }
      if (password !== confirm) {
        setError("Пароли не совпадают");
        return;
      }
      const account = { nickname: nickname.trim(), password };
      saveAccount(account);
      saveSession({ loggedIn: true });
      onAuthed(account);
    } else {
      const account = loadAccount();
      if (!account) {
        setError("Аккаунт не найден — зарегистрируйтесь");
        return;
      }
      if (account.nickname !== nickname.trim() || account.password !== password) {
        setError("Неверный никнейм или пароль");
        return;
      }
      saveSession({ loggedIn: true });
      onAuthed(account);
    }
  }

  return h(
    "div",
    {
      style: {
        width: "100%",
        height: "100vh",
        background: COLORS.bg,
        color: COLORS.text,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 28px",
        fontFamily: FONT_BODY,
      },
    },
    h(Blob, { size: 60 }),
    h(
      "div",
      {
        style: {
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: 20,
          marginTop: 16,
          marginBottom: 26,
        },
      },
      "IUS Мессенджер"
    ),
    h(
      "div",
      {
        style: {
          display: "flex",
          background: COLORS.surface,
          borderRadius: 14,
          padding: 4,
          marginBottom: 22,
          width: "100%",
          maxWidth: 320,
        },
      },
      [
        { id: "signup", label: "Sign in" },
        { id: "login", label: "Log in" },
      ].map((opt) =>
        h(
          "button",
          {
            key: opt.id,
            onClick: () => {
              setMode(opt.id);
              setError("");
            },
            style: {
              flex: 1,
              background: mode === opt.id ? COLORS.accent : "transparent",
              border: "none",
              borderRadius: 11,
              padding: "9px 0",
              color: mode === opt.id ? "#000" : COLORS.textDim,
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: 13.5,
            },
          },
          opt.label
        )
      )
    ),
    h(
      "div",
      { style: { width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", gap: 12 } },
      h("input", {
        value: nickname,
        onChange: (e) => setNickname(e.target.value),
        placeholder: "Никнейм",
        autoCapitalize: "none",
        style: {
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: "13px 16px",
          color: COLORS.text,
          fontFamily: FONT_BODY,
          fontSize: 14.5,
          outline: "none",
        },
      }),
      h("input", {
        value: password,
        onChange: (e) => setPassword(e.target.value),
        placeholder: "Пароль",
        type: "password",
        onKeyDown: (e) => e.key === "Enter" && mode === "login" && submit(),
        style: {
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: "13px 16px",
          color: COLORS.text,
          fontFamily: FONT_BODY,
          fontSize: 14.5,
          outline: "none",
        },
      }),
      mode === "signup" &&
        h("input", {
          value: confirm,
          onChange: (e) => setConfirm(e.target.value),
          placeholder: "Повторите пароль",
          type: "password",
          onKeyDown: (e) => e.key === "Enter" && submit(),
          style: {
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            padding: "13px 16px",
            color: COLORS.text,
            fontFamily: FONT_BODY,
            fontSize: 14.5,
            outline: "none",
          },
        }),
      error &&
        h(
          "div",
          { style: { color: "#FF6B6B", fontFamily: FONT_BODY, fontSize: 12.5 } },
          error
        ),
      h(
        "button",
        {
          onClick: submit,
          style: {
            background: COLORS.accent,
            border: "none",
            borderRadius: 12,
            padding: "13px 0",
            color: "#000",
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: 14.5,
            marginTop: 4,
          },
        },
        mode === "signup" ? "Создать аккаунт" : "Войти"
      )
    )
  );
}

// ---------- Profile ----------
const AVATAR_COLORS = ["#0A66FB", "#5B9BFF", "#00A99A", "#FF8A65", "#B39DDB", "#FFD54F"];
const PROFILE_KEY = "ius_profile_v1";

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.iusId) parsed.iusId = randomIusId();
      if (parsed.ringtone === undefined) parsed.ringtone = null;
      if (parsed.ringtoneName === undefined) parsed.ringtoneName = null;
      if (!parsed.theme) parsed.theme = "dark";
      if (parsed.notificationsEnabled === undefined) parsed.notificationsEnabled = true;
      applyTheme(parsed.theme);
      return parsed;
    }
  } catch (e) {}
  const fresh = {
    name: "Ты",
    status: "Использую ius",
    avatarColor: AVATAR_COLORS[0],
    avatarImage: null,
    iusId: randomIusId(),
    ringtone: null,
    ringtoneName: null,
    theme: "dark",
    notificationsEnabled: true,
  };
  applyTheme(fresh.theme);
  return fresh;
}

function saveProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {}
}

function Profile({ profile, setProfile, onLogout }) {
  const fileRef = useRef(null);
  const ringtoneRef = useRef(null);
  const [savedFlash, setSavedFlash] = useState(false);

  function update(patch) {
    if (patch.theme) applyTheme(patch.theme);
    const next = { ...profile, ...patch };
    setProfile(next);
    saveProfile(next);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1200);
  }

  function onPickRingtone(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update({ ringtone: reader.result, ringtoneName: file.name });
    reader.readAsDataURL(file);
  }

  function onPickImage(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update({ avatarImage: reader.result });
    reader.readAsDataURL(file);
  }

  return h(
    "div",
    { style: { height: "100%", overflowY: "auto", padding: "28px 20px" } },
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 14 } },
      h(
        "div",
        { style: { position: "relative", width: 96, height: 96 } },
        profile.avatarImage
          ? h("img", {
              src: profile.avatarImage,
              style: {
                width: 96,
                height: 96,
                borderRadius: "50%",
                objectFit: "cover",
                display: "block",
              },
            })
          : h(
              "div",
              {
                style: {
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  background: profile.avatarColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 700,
                  fontSize: 36,
                  color: "#000",
                },
              },
              (profile.name || "?")[0].toUpperCase()
            ),
        h(
          "button",
          {
            onClick: () => fileRef.current && fileRef.current.click(),
            "aria-label": "Изменить фото",
            style: {
              position: "absolute",
              bottom: -2,
              right: -2,
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: COLORS.accent,
              border: `3px solid ${COLORS.bg}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          },
          IconCamera({ size: 15, color: "#000" })
        ),
        h("input", {
          ref: fileRef,
          type: "file",
          accept: "image/*",
          onChange: onPickImage,
          style: { display: "none" },
        })
      ),
      h(
        "div",
        {
          style: {
            fontFamily: FONT_BODY,
            fontSize: 12,
            color: COLORS.textDim,
            letterSpacing: 0.5,
          },
        },
        "ID: " + (profile.iusId || "")
      ),
      profile.avatarImage &&
        h(
          "button",
          {
            onClick: () => update({ avatarImage: null }),
            style: {
              background: "none",
              border: "none",
              color: COLORS.textDim,
              fontFamily: FONT_BODY,
              fontSize: 12,
            },
          },
          "Удалить фото"
        ),      !profile.avatarImage &&
        h(
          "div",
          { style: { display: "flex", gap: 8 } },
          AVATAR_COLORS.map((c) =>
            h("button", {
              key: c,
              onClick: () => update({ avatarColor: c }),
              "aria-label": "Выбрать цвет аватара",
              style: {
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: c,
                border: c === profile.avatarColor ? `2px solid ${COLORS.text}` : "2px solid transparent",
                padding: 0,
                cursor: "pointer",
              },
            })
          )
        )
    ),

    h(
      "div",
      { style: { marginTop: 28, display: "flex", flexDirection: "column", gap: 18 } },
      h(
        "label",
        { style: { display: "flex", flexDirection: "column", gap: 6 } },
        h(
          "span",
          { style: { fontFamily: FONT_BODY, fontSize: 12, color: COLORS.textDim } },
          "Имя"
        ),
        h("input", {
          value: profile.name,
          onChange: (e) => update({ name: e.target.value }),
          placeholder: "Твоё имя",
          style: {
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 10,
            padding: "11px 14px",
            color: COLORS.text,
            fontFamily: FONT_DISPLAY,
            fontWeight: 600,
            fontSize: 16,
            outline: "none",
          },
        })
      ),
      h(
        "label",
        { style: { display: "flex", flexDirection: "column", gap: 6 } },
        h(
          "span",
          { style: { fontFamily: FONT_BODY, fontSize: 12, color: COLORS.textDim } },
          "О себе"
        ),
        h("input", {
          value: profile.status,
          onChange: (e) => update({ status: e.target.value }),
          placeholder: "Статус",
          style: {
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 10,
            padding: "11px 14px",
            color: COLORS.text,
            fontFamily: FONT_BODY,
            fontSize: 14,
            outline: "none",
          },
        })
      )
    ),

    h(
      "div",
      { style: { marginTop: 22, display: "flex", flexDirection: "column", gap: 8 } },
      h(
        "span",
        { style: { fontFamily: FONT_BODY, fontSize: 12, color: COLORS.textDim } },
        "Рингтон уведомлений"
      ),
      h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            padding: "11px 14px",
          },
        },
        h(
          "div",
          {
            style: {
              width: 32,
              height: 32,
              borderRadius: 9,
              background: COLORS.surfaceRaised,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            },
          },
          IconBell({ size: 15, color: COLORS.accent })
        ),
        h(
          "div",
          { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column" } },
          h(
            "span",
            {
              style: {
                fontFamily: FONT_BODY,
                fontSize: 13,
                color: COLORS.text,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              },
            },
            profile.ringtoneName || "Стандартный сигнал"
          )
        ),
        h(
          "button",
          {
            onClick: () => playRingtone(profile.ringtone),
            style: {
              background: "none",
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
              padding: "6px 10px",
              color: COLORS.accent,
              fontFamily: FONT_BODY,
              fontSize: 12,
              flexShrink: 0,
            },
          },
          "▶"
        ),
        h(
          "button",
          {
            onClick: () => ringtoneRef.current && ringtoneRef.current.click(),
            style: {
              background: "none",
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
              padding: "6px 10px",
              color: COLORS.textDim,
              fontFamily: FONT_BODY,
              fontSize: 12,
              flexShrink: 0,
            },
          },
          "Изменить"
        ),
        h("input", {
          ref: ringtoneRef,
          type: "file",
          accept: "audio/*",
          onChange: onPickRingtone,
          style: { display: "none" },
        })
      ),
      profile.ringtone &&
        h(
          "button",
          {
            onClick: () => update({ ringtone: null, ringtoneName: null }),
            style: {
              alignSelf: "flex-start",
              background: "none",
              border: "none",
              color: COLORS.textDim,
              fontFamily: FONT_BODY,
              fontSize: 12,
            },
          },
          "Сбросить к стандартному"
        )
    ),

    h(
      "div",
      {
        style: {
          marginTop: 22,
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontFamily: FONT_BODY,
          fontSize: 12,
          color: savedFlash ? COLORS.accent : "transparent",
          transition: "color 0.3s ease",
          height: 16,
        },
      },
      IconCheck({ size: 14, color: savedFlash ? COLORS.accent : "transparent" }),
      "Сохранено"
    ),

    h("div", {
      style: { height: 1, background: COLORS.border, margin: "26px 0 18px" },
    }),

    h(
      "div",
      { style: { fontFamily: FONT_BODY, fontSize: 12, color: COLORS.textDim, marginBottom: 10 } },
      "Настройки"
    ),
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: 8 } },
      h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            padding: "11px 14px",
          },
        },
        h(
          "span",
          { style: { fontFamily: FONT_BODY, fontSize: 13.5, color: COLORS.text } },
          "Тема"
        ),
        h(
          "div",
          { style: { display: "flex", gap: 6 } },
          [
            { id: "dark", label: "Тёмная" },
            { id: "light", label: "Светлая" },
          ].map((opt) =>
            h(
              "button",
              {
                key: opt.id,
                onClick: () => update({ theme: opt.id }),
                style: {
                  background: profile.theme === opt.id ? COLORS.accent : COLORS.surfaceRaised,
                  border: "none",
                  borderRadius: 10,
                  padding: "6px 12px",
                  color: profile.theme === opt.id ? "#000" : COLORS.textDim,
                  fontFamily: FONT_BODY,
                  fontWeight: 600,
                  fontSize: 12,
                },
              },
              opt.label
            )
          )
        )
      ),
      h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            padding: "11px 14px",
          },
        },
        h(
          "span",
          { style: { fontFamily: FONT_BODY, fontSize: 13.5, color: COLORS.text } },
          "Автоуведомления"
        ),
        h(
          "button",
          {
            onClick: () => update({ notificationsEnabled: !profile.notificationsEnabled }),
            "aria-label": "Переключить автоуведомления",
            style: {
              width: 44,
              height: 26,
              borderRadius: 13,
              background: profile.notificationsEnabled ? COLORS.accent : COLORS.surfaceRaised,
              border: `1px solid ${COLORS.border}`,
              position: "relative",
              flexShrink: 0,
            },
          },
          h("div", {
            style: {
              position: "absolute",
              top: 2,
              left: profile.notificationsEnabled ? 20 : 2,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: profile.notificationsEnabled ? "#000" : COLORS.textDim,
              transition: "left 0.2s ease",
            },
          })
        )
      ),
      h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            padding: "11px 14px",
          },
        },
        h(
          "div",
          { style: { display: "flex", flexDirection: "column" } },
          h(
            "span",
            { style: { fontFamily: FONT_BODY, fontSize: 13.5, color: COLORS.text } },
            "Аккаунт"
          ),
          h(
            "span",
            { style: { fontFamily: FONT_BODY, fontSize: 11.5, color: COLORS.textDim } },
            (loadAccount() && loadAccount().nickname) || "—"
          )
        ),
        h(
          "button",
          {
            onClick: onLogout,
            style: {
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: `1px solid ${COLORS.border}`,
              borderRadius: 9,
              padding: "7px 12px",
              color: COLORS.textDim,
              fontFamily: FONT_BODY,
              fontSize: 12,
            },
          },
          IconLogout({ size: 13 }),
          "Выйти"
        )
      )
    ),

    h(
      "div",
      { style: { fontFamily: FONT_BODY, fontSize: 12, color: COLORS.textDim, marginBottom: 10 } },
      "О разработчике"
    ),
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: 8 } },
      h(
        "a",
        {
          href: "https://tiktok.com/@komarusikvduo",
          target: "_blank",
          rel: "noopener noreferrer",
          style: {
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            padding: "12px 14px",
            textDecoration: "none",
            color: COLORS.text,
          },
        },
        h(
          "div",
          {
            style: {
              width: 32,
              height: 32,
              borderRadius: 9,
              background: COLORS.surfaceRaised,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            },
          },
          IconTikTok({ size: 16, color: COLORS.accent })
        ),
        h(
          "div",
          { style: { display: "flex", flexDirection: "column" } },
          h("span", { style: { fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 13.5 } }, "TikTok"),
          h(
            "span",
            { style: { fontFamily: FONT_BODY, fontSize: 12, color: COLORS.textDim } },
            "@komarusikvduo"
          )
        )
      ),
      h(
        "a",
        {
          href: "https://t.me/timursikius",
          target: "_blank",
          rel: "noopener noreferrer",
          style: {
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            padding: "12px 14px",
            textDecoration: "none",
            color: COLORS.text,
          },
        },
        h(
          "div",
          {
            style: {
              width: 32,
              height: 32,
              borderRadius: 9,
              background: COLORS.surfaceRaised,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            },
          },
          IconSend({ size: 15, color: COLORS.accent })
        ),
        h(
          "div",
          { style: { display: "flex", flexDirection: "column" } },
          h("span", { style: { fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 13.5 } }, "Telegram"),
          h(
            "span",
            { style: { fontFamily: FONT_BODY, fontSize: 12, color: COLORS.textDim } },
            "@timursikius"
          )
        )
      )
    )
  );
}

// ---------- App shell ----------
function MainApp({ onLogout }) {
  const [tab, setTab] = useState("messenger");
  const [profile, setProfile] = useState(loadProfile);
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [toast, setToast] = useState(null);
  const profileRef = useRef(profile);
  const chatsRef = useRef(chats);
  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);
  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  useEffect(() => {
    const timers = [];
    const notifCount = 1 + Math.floor(Math.random() * 2); // 1 or 2
    for (let i = 0; i < notifCount; i++) {
      const delay = 20000 + Math.random() * 40000 + i * 25000;
      const timerId = setTimeout(() => {
        if (profileRef.current && profileRef.current.notificationsEnabled === false) return;
        const list = (chatsRef.current || []).filter((c) => !c.blocked);
        if (!list || list.length === 0) return;
        const chat = list[Math.floor(Math.random() * list.length)];
        const text = RANDOM_NOTIF_MESSAGES[Math.floor(Math.random() * RANDOM_NOTIF_MESSAGES.length)];
        const now = new Date();
        const t = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;
        setChats((prev) =>
          prev.map((c) =>
            c.id === chat.id
              ? { ...c, messages: [...c.messages, { id: Date.now(), from: "them", text, t }] }
              : c
          )
        );
        playRingtone(profileRef.current && profileRef.current.ringtone);
        setToast({ name: chat.name, text });
        setTimeout(() => setToast(null), 4000);
      }, delay);
      timers.push(timerId);
    }
    return () => timers.forEach(clearTimeout);
  }, []);

  const titles = { messenger: "Сообщения", notes: "Заметки", music: "Музыка", player: "Плеер", profile: "Профиль" };

  return h(
    "div",
    {
      style: {
        width: "100%",
        height: "100vh",
        margin: "0 auto",
        background: COLORS.bg,
        color: COLORS.text,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: FONT_BODY,
        position: "relative",
      },
    },
    toast &&
      h(
        "div",
        {
          onClick: () => {
            setTab("messenger");
            setToast(null);
          },
          style: {
            position: "absolute",
            top: "calc(env(safe-area-inset-top, 0px) + 10px)",
            left: 12,
            right: 12,
            zIndex: 50,
            background: COLORS.surfaceRaised,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            cursor: "pointer",
          },
        },
        IconBell({ size: 16, color: COLORS.accent }),
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", minWidth: 0 } },
          h(
            "span",
            { style: { fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 13 } },
            toast.name
          ),
          h(
            "span",
            {
              style: {
                fontFamily: FONT_BODY,
                fontSize: 12.5,
                color: COLORS.textDim,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              },
            },
            toast.text
          )
        )
      ),
    h(
      "div",
      { style: { display: "flex", alignItems: "center", gap: 10, padding: "calc(env(safe-area-inset-top, 0px) + 14px) 16px 12px" } },
      h("span", { style: { fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 17, letterSpacing: 0.5 } }, "IUS Мессенджер"),
      h("span", { style: { marginLeft: "auto", fontFamily: FONT_BODY, fontSize: 12, color: COLORS.textDim } }, titles[tab])
    ),
    h(
      "div",
      { style: { flex: 1, minHeight: 0, borderTop: `1px solid ${COLORS.border}` } },
      tab === "messenger" && h(Messenger, { chats, setChats, ringtone: profile.ringtone }),
      tab === "notes" && h(Notes),
      tab === "music" && h(Music),
      tab === "player" && h(Player),
      tab === "profile" && h(Profile, { profile, setProfile, onLogout })
    ),
    h(
      "div",
      {
        style: {
          display: "flex",
          borderTop: `1px solid ${COLORS.border}`,
          padding: "8px 12px calc(env(safe-area-inset-bottom, 0px) + 10px)",
        },
      },
      [
        { id: "messenger", Icon: IconChat, label: "Чаты" },
        { id: "notes", Icon: IconNote, label: "Заметки" },
        { id: "music", Icon: IconMusic, label: "Музыка" },
        { id: "player", Icon: IconClosed, label: "Плеер" },
        { id: "profile", Icon: IconUser, label: "Профиль" },
      ].map(({ id, Icon: I, label }) =>
        h(
          "button",
          {
            key: id,
            onClick: () => setTab(id),
            style: {
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              background: "none",
              border: "none",
              padding: "6px 0",
              cursor: "pointer",
              color: tab === id ? COLORS.accent : COLORS.textFaint,
            },
          },
          I({ size: 21, color: tab === id ? COLORS.accent : COLORS.textFaint }),
          h("span", { style: { fontFamily: FONT_BODY, fontSize: 10 } }, label)
        )
      )
    )
  );
}

// ---------- Root (auth gate) ----------
function Root() {
  const [authed, setAuthed] = useState(() => {
    const acc = loadAccount();
    if (!acc) return false;
    const s = loadSession();
    return s ? s.loggedIn !== false : true;
  });
  const [hasAccount, setHasAccount] = useState(() => !!loadAccount());

  function handleAuthed() {
    setHasAccount(true);
    setAuthed(true);
  }

  function handleLogout() {
    saveSession({ loggedIn: false });
    setAuthed(false);
  }

  if (!authed) {
    return h(AuthScreen, { hasAccount, onAuthed: handleAuthed });
  }
  return h(MainApp, { onLogout: handleLogout });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(h(Root));
