// Spades Institute — "The Ready Room" direction
// Single-page hi-fi prototype. All sections are designed surfaces.

const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mission": "B",
  "hero": "room",
  "origin": "D",
  "showInsignia": true,
  "page": "home"
}/*EDITMODE-END*/;

// ── Editorial substrate ──────────────────────────────────────────────
const HEROS = {
  room:    ["The room", "before the room."],
  rfp:     ["Off the record.", "Before the RFP. On purpose."],
  call:    ["Where the call gets made", "before the contract gets written."],
  closed:  ["Operators.", "Closed table. Nonpartisan."],
};

const MISSIONS = {
  A: "Spades Institute convenes the trusted conversations that have to happen before a national security problem becomes a procurement.",
  B: "Spades Institute is the operator-founded nonprofit that brings government, industry, and academia together off the record — so the right answer arrives before the contract does.",
  C: "We host the closed table. The room where capability, mission, and policy can be honest with each other — without contracts, optics, or party in the way.",
};

const ORIGINS = {
  A: {
    eyebrow: "The hangar — 2023",
    body: "Two Marine aviators stood on a flight line arguing about why a commercial AI tool that should have shipped to the fleet eighteen months ago was still stuck in a contracting office. The argument lasted an hour. The fix would have taken a phone call between the right four people. Spades Institute exists to make that phone call happen — before the eighteen months.",
  },
  B: {
    eyebrow: "The conversation that shouldn't have been hard",
    body: "A program officer, a startup founder, and a policy lead all knew each other. They couldn't share what they knew, because the contract vehicle hadn't been awarded yet. The capability everyone needed sat on a shelf for two years. We started Spades because that shelf is full of capability the country has already paid for.",
  },
  C: {
    eyebrow: "Why none of this was happening already",
    body: "The honest answer is: it wasn't anyone's job. Trade associations lobby. Think tanks publish. Vendors sell. None of them are built to be the trusted, nonpartisan, contracts-aside table where the people who actually solve a problem sit down before the problem is framed as a procurement. So we built it.",
  },
  D: {
    eyebrow: "The ready room — 2023",
    body: "Two Marine aviators who'd briefed and debriefed in ready rooms for fifteen years walked out of a contracting office and realized something simple: nobody in the national security apparatus had a ready room anymore. There was no closed-door, off-the-record place where the people who actually knew the problem could talk to the people who actually built the solution — before the contract distorted the conversation, before the optics took over, before the lines hardened. The ready room is where a squadron tells itself the truth. Spades is that ready room — for the intelligence community, the cyber agencies, and the institutions that work alongside them.",
  },
};

// ── Atomic primitives ────────────────────────────────────────────────

// Brand rule — a single hairline divider. NO spade ornament.
// The spade exists only as part of the actual logo image; we never re-draw it.
const SuitRule = ({ tone = "brass", width = "100%" }) => {
  const stroke = tone === "brass" ? "var(--brass)" : tone === "ink" ? "var(--ink)" : "var(--cream-3)";
  return (
    <div className="suit-rule suit-rule--bare" style={{ width }}>
      <span className="suit-rule__line suit-rule__line--full" style={{ background: stroke }} />
    </div>
  );
};

// Pip is now a tiny brass square — a typographic accent, not the brand spade.
// Used as a list bullet/eyebrow accent. Never a spade.
const Pip = ({ size = 6, color = "currentColor" }) => (
  <span aria-hidden="true" style={{
    display: "inline-block",
    width: size,
    height: size,
    background: color,
    verticalAlign: "2px",
    marginRight: size > 8 ? 0 : 2,
  }} />
);

const Eyebrow = ({ children, dark }) => (
  <div className={"eyebrow" + (dark ? " eyebrow--dark" : "")}>
    <Pip size={9} color={dark ? "var(--brass)" : "var(--brass-dark)"} />
    <span>{children}</span>
  </div>
);

// Splits a string into per-word spans for staggered reveal.
const SplitWords = ({ text, className = "", accent = false }) => {
  const words = text.split(/(\s+)/);
  return (
    <span className={"split " + className + (accent ? " split--accent" : "")}>
      {words.map((w, i) =>
        /^\s+$/.test(w)
          ? <span key={i} className="ws">{w}</span>
          : <span key={i} className="word"><span>{w}</span></span>
      )}
    </span>
  );
};

// Subtly-striped placeholder for imagery we don't have
const Placeholder = ({ ratio = "4/5", label, tone = "ink" }) => (
  <div className={"placeholder placeholder--" + tone} style={{ aspectRatio: ratio }}>
    <span className="placeholder__label">{label}</span>
  </div>
);

// ── Concept-of-ops diagram (designer's proposal pending founders' source)
const ConOpsDiagram = () => (
  <div className="conops__frame">
    <div className="conops__corner conops__corner--tl">A.</div>
    <div className="conops__corner conops__corner--tr">FIG. 01</div>
    <div className="conops__corner conops__corner--bl">CONOPS</div>
    <div className="conops__corner conops__corner--br">DRAFT · DESIGNER PROPOSAL</div>
    <svg viewBox="0 0 1200 640" className="conops__svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <pattern id="conops-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="rgba(28,33,46,0.06)" strokeWidth="1"/>
        </pattern>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--brass-dark)"/>
        </marker>
      </defs>
      <rect x="0" y="0" width="1200" height="640" fill="url(#conops-grid)"/>

      {/* Three institutions */}
      {[
        { x: 200, y: 140, label: "GOVERNMENT", sub: "Holds the question", body: ["Intelligence community","Civil cyber agencies","Policy & procurement"]},
        { x: 1000, y: 140, label: "INDUSTRY", sub: "Holds the build", body: ["Cleared founders","Defense primes","Dual-use tech"]},
        { x: 600, y: 540, label: "ACADEMIA", sub: "Holds the frame", body: ["Research centers","Cleared faculty","Independent fellows"]},
      ].map((n, i) => (
        <g key={i} transform={`translate(${n.x},${n.y})`}>
          <circle r="92" fill="var(--cream-2)" stroke="var(--ink)" strokeWidth="1.5"/>
          <circle r="92" fill="none" stroke="var(--brass)" strokeWidth="1" strokeDasharray="2 4" opacity="0.5"/>
          <text textAnchor="middle" y="-30" fontFamily="var(--mono)" fontSize="11" letterSpacing="0.18em" fill="var(--brass-dark)">{n.label}</text>
          <text textAnchor="middle" y="-8" fontFamily="var(--serif)" fontStyle="italic" fontSize="16" fill="var(--ink)">{n.sub}</text>
          {n.body.map((b, j) => (
            <text key={j} textAnchor="middle" y={14 + j * 18} fontFamily="var(--sans)" fontSize="12" fill="var(--ink)" opacity="0.65">{b}</text>
          ))}
        </g>
      ))}

      {/* Center — the closed table (Spades) */}
      <g transform="translate(600,340)">
        <rect x="-180" y="-110" width="360" height="220" fill="var(--ink)" />
        <rect x="-180" y="-110" width="360" height="220" fill="none" stroke="var(--brass)" strokeWidth="1.5"/>
        <rect x="-170" y="-100" width="340" height="200" fill="none" stroke="var(--brass)" strokeWidth="0.5" opacity="0.5"/>
        <text textAnchor="middle" y="-66" fontFamily="var(--mono)" fontSize="10" letterSpacing="0.22em" fill="var(--brass)">THE CLOSED TABLE</text>
        <g transform="translate(-44,-66)">
          <image href="assets/logo-light.png" x="0" y="0" width="88" height="60" preserveAspectRatio="xMidYMid meet" />
        </g>
        <text textAnchor="middle" y="34" fontFamily="var(--serif)" fontSize="20" fill="var(--cream)" fontWeight="600">Spades Institute</text>
        <text textAnchor="middle" y="58" fontFamily="var(--mono)" fontSize="10" letterSpacing="0.18em" fill="var(--brass)" opacity="0.85">CONVENER · NON-PARTISAN · OFF THE RECORD</text>
        <text textAnchor="middle" y="84" fontFamily="var(--sans)" fontSize="11" fill="var(--cream)" opacity="0.55">501(c)(3) · No contracts · Donations &amp; program fees</text>
      </g>

      {/* Inflows: each institution → table */}
      <path d="M285 195 Q 410 270, 420 320" fill="none" stroke="var(--brass-dark)" strokeWidth="1.2" markerEnd="url(#arrow)" />
      <path d="M915 195 Q 790 270, 780 320" fill="none" stroke="var(--brass-dark)" strokeWidth="1.2" markerEnd="url(#arrow)" />
      <path d="M600 446 L 600 460" fill="none" stroke="var(--brass-dark)" strokeWidth="1.2" markerEnd="url(#arrow)" />

      {/* Inflow labels */}
      <text x="320" y="244" fontFamily="var(--mono)" fontSize="10" letterSpacing="0.16em" fill="var(--brass-dark)">PROBLEM</text>
      <text x="838" y="244" fontFamily="var(--mono)" fontSize="10" letterSpacing="0.16em" fill="var(--brass-dark)" textAnchor="end">CAPABILITY</text>
      <text x="612" y="478" fontFamily="var(--mono)" fontSize="10" letterSpacing="0.16em" fill="var(--brass-dark)">FRAME</text>

      {/* Outflow: readout, single page out the right */}
      <g transform="translate(820,340)">
        <path d="M0 0 L 90 0" fill="none" stroke="var(--brass)" strokeWidth="1.2" markerEnd="url(#arrow)" />
        <g transform="translate(110,-26)">
          <rect width="60" height="52" fill="var(--cream)" stroke="var(--ink)" strokeWidth="1"/>
          <line x1="8" y1="12" x2="52" y2="12" stroke="var(--ink)" strokeWidth="0.8" opacity="0.4"/>
          <line x1="8" y1="20" x2="52" y2="20" stroke="var(--ink)" strokeWidth="0.8" opacity="0.4"/>
          <line x1="8" y1="28" x2="52" y2="28" stroke="var(--ink)" strokeWidth="0.8" opacity="0.4"/>
          <line x1="8" y1="36" x2="42" y2="36" stroke="var(--ink)" strokeWidth="0.8" opacity="0.4"/>
          <text x="30" y="64" textAnchor="middle" fontFamily="var(--mono)" fontSize="9" letterSpacing="0.18em" fill="var(--brass-dark)">READOUT</text>
        </g>
      </g>

      {/* Footnote callouts */}
      <g fontFamily="var(--mono)" fontSize="10" letterSpacing="0.14em" fill="var(--ink)" opacity="0.55">
        <text x="40" y="40">i. Each institution holds one piece. None holds all three.</text>
        <text x="40" y="608">ii. The room produces a written record. Nothing classified. Nothing for sale.</text>
      </g>
    </svg>
  </div>
);

// Small mark for the Roundtables card — the table itself, abstracted
const RoundtableMark = () => (
  <svg viewBox="0 0 240 160" className="rt-mark" aria-hidden="true">
    <defs>
      <pattern id="rt-grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0H0V20" fill="none" stroke="rgba(232,226,210,0.06)" strokeWidth="1"/>
      </pattern>
    </defs>
    <rect width="240" height="160" fill="url(#rt-grid)"/>
    {/* The table */}
    <ellipse cx="120" cy="92" rx="92" ry="34" fill="none" stroke="var(--brass)" strokeWidth="1.2"/>
    <ellipse cx="120" cy="92" rx="78" ry="26" fill="none" stroke="var(--brass)" strokeWidth="0.5" opacity="0.5"/>
    {/* Five seats around it */}
    {[
      [120, 56], [42, 78], [198, 78], [70, 122], [170, 122],
    ].map(([x, y], i) => (
      <g key={i}>
        <circle cx={x} cy={y} r="7" fill="var(--cream)" opacity="0.85"/>
        <circle cx={x} cy={y} r="7" fill="none" stroke="var(--brass)" strokeWidth="0.8"/>
      </g>
    ))}
    {/* Tags */}
    <text x="14" y="22" fontFamily="var(--mono)" fontSize="9" letterSpacing="0.18em" fill="var(--brass)" opacity="0.85">FIG. 02</text>
    <text x="226" y="22" textAnchor="end" fontFamily="var(--mono)" fontSize="9" letterSpacing="0.18em" fill="var(--brass)" opacity="0.85">N=5–9</text>
    <text x="14" y="148" fontFamily="var(--mono)" fontSize="9" letterSpacing="0.18em" fill="var(--cream)" opacity="0.55">CLOSED · OFF THE RECORD · ONE-PAGE OUT</text>
  </svg>
);

// ── Nav ──────────────────────────────────────────────────────────────
const Nav = ({ page, setPage, dark }) => {
  const items = [
    ["home",    "Home"],
    ["about",   "About"],
    ["engagements", "Engagements"],
    ["briefings", "Briefings"],
    ["events",  "Events"],
    ["connect", "Connect"],
  ];
  return (
    <nav className={"nav" + (dark ? " nav--dark" : "")}>
      <div className="nav__inner">
        <a className="nav__brand" onClick={() => setPage("home")}>
          <img className="brand-mark" src="assets/logo-dark.png" alt="Spades Institute" />
        </a>
        <div className="nav__links">
          {items.slice(1).map(([k, l]) => (
            <a key={k} className={"nav__link" + (page === k ? " is-active" : "")}
               onClick={() => setPage(k)}>{l}</a>
          ))}
        </div>
        <div className="nav__cta">
          <a className="btn btn--text nav__cta-text" onClick={() => setPage("connect")}>Partner</a>
          <a className="btn btn--primary" onClick={() => setPage("connect")}>Request a session</a>
        </div>
      </div>
    </nav>
  );
};

// ── HOME ─────────────────────────────────────────────────────────────
const Home = ({ tweaks, setPage }) => {
  const hero = HEROS[tweaks.hero];
  const mission = MISSIONS[tweaks.mission];
  const origin = ORIGINS[tweaks.origin];

  return (
    <>
      {/* HERO — type-led, dark warm oak surface */}
      <section className="hero" data-screen-label="01 Home — Hero">
        <div className="hero__grid">
          <div className="hero__meta">
            <Eyebrow dark>Vol. I · At the table since 2024</Eyebrow>
          </div>
          <h1 className="hero__headline played">
            <span className="hero__line"><SplitWords text={hero[0]} /></span>
            <span className="hero__line hero__line--accent"><SplitWords text={hero[1]} accent /><span className="type-cursor" /></span>
          </h1>
          <p className="hero__deck">
            {mission}
          </p>
          <div className="hero__actions hero__cta">
            <a className="btn btn--primary btn--lg" onClick={() => setPage("connect")}>Partner with us</a>
            <a className="btn btn--text btn--lg" onClick={() => setPage("briefings")}>Read the briefings <span className="arr">→</span></a>
          </div>
          <div className="hero__stamp">
            <div className="hero__credentials">
              <span>501(c)(3)</span>
              <span className="dot" />
              <span>Nonpartisan</span>
              <span className="dot" />
              <span>Ethics-first</span>
            </div>
          </div>
        </div>
        <div className="hero__sidebar" aria-hidden="true">
          <div className="hero__sidebar-row"><span>Est.</span><span>MMXXIV</span></div>
          <div className="hero__sidebar-row"><span>Seat</span><span>Washington, D.C.</span></div>
          <div className="hero__sidebar-row"><span>Form</span><span>501(c)(3)</span></div>
          <div className="hero__sidebar-row"><span>Posture</span><span>Off the record</span></div>
        </div>
      </section>

      {/* ORIGIN — magazine teaser */}
      <section className="origin" data-screen-label="02 Home — Origin">
        <SuitRule tone="ink" />
        <div className="origin__grid">
          <div className="origin__portrait reveal reveal--up">
            <Placeholder ratio="4/5" label="FOUNDERS — environment portrait" />
            <div className="origin__caption">
              <span>Vishal Amin & Lili Davoudian</span>
              <span className="caption-meta">Founding Partners</span>
            </div>
          </div>
          <div className="origin__body reveal reveal--up">
            <Eyebrow>Origin · {origin.eyebrow}</Eyebrow>
            <p className="origin__pull">
              "{origin.body.split(". ")[0]}.
              <span className="origin__pull-rest"> {origin.body.split(". ").slice(1).join(". ")}"</span>
            </p>
            <a className="btn btn--text" onClick={() => setPage("about")}>Read the full origin <span className="arr">→</span></a>
          </div>
        </div>
      </section>

      {/* WHY SPADES — the chosen narrative ("The Ace") */}
      <section className="why" data-screen-label="03 Home — Why Spades">
        <div className="why__inner">
          <Eyebrow>Why Spades</Eyebrow>
          <div className="why__grid">
            <div className="why__mark reveal reveal--scale" aria-hidden="true">
              <div className="why__mark-frame">
                <img className="why__mark-logo" src="assets/logo-dark.png" alt="" />
                <span className="why__mark-stamp">EST · MMXXIV</span>
              </div>
            </div>
            <div className="why__copy reveal reveal--up">
              <h2 className="display">The ace of spades has been the patch on naval aviators' shoulders for generations.</h2>
              <p>
                Quiet provenance, not parade decoration. The same restraint applies to how we carry it: as an institutional insignia, not as a squadron flag. We borrowed it because the people we built this for — intelligence officers, cyber leads, station-house veterans, the agencies whose work doesn't fly under a unit patch — recognize the lineage without needing it spelled out.
              </p>
              <a className="btn btn--text" onClick={() => setPage("about")}>The full reading <span className="arr">→</span></a>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — concept-of-ops diagram */}
      <section className="conops" data-screen-label="04 Home — How it works">
        <SuitRule tone="ink" />
        <div className="conops__head reveal reveal--up">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="display">How the closed table operates.</h2>
          <p className="conops__deck">Three institutions rarely sit at the same table on purpose. Government holds the question. Industry holds the build. Academia holds the frame. Spades holds the room — closed door, off the record — so the right answer arrives before the contract does.</p>
        </div>
        <ConOpsDiagram />
        <p className="conops__caption">
          <span className="conops__caption-mark">A.</span> The diagram above is a designer's rendering of the model the founders use in private. Founders' source asset will replace this in production.
        </p>
      </section>

      {/* THREE COMMITMENTS — replaces the values trio */}
      <section className="commits" data-screen-label="05 Home — Commitments">
        <div className="commits__head reveal reveal--up">
          <Eyebrow>Three commitments</Eyebrow>
          <h2 className="display">Behaviors, not slogans.</h2>
          <p className="commits__deck">Every nonprofit says it stands for something. Here is what we actually do — falsifiable enough that you can tell us when we miss.</p>
        </div>
        <ol className="commits__list">
          <li className="commit reveal reveal--up">
            <div className="commit__num">01.</div>
            <div className="commit__body">
              <h3 className="commit__title">How we run the room.</h3>
              <p>Closed door, off the record, no slide decks pitching anything. The people who know the problem talk to the people who can move it. We pick the room, we pick the question, and we leave the badge-flashing at the door.</p>
            </div>
          </li>
          <li className="commit reveal reveal--up">
            <div className="commit__num">02.</div>
            <div className="commit__body">
              <h3 className="commit__title">What we leave behind.</h3>
              <p>Every session ends with a written record of what was shared and what's next. Nothing classified. Nothing for sale. Available to participants — and, when the room agrees, to the public. The readout is the deliverable.</p>
            </div>
          </li>
          <li className="commit reveal reveal--up">
            <div className="commit__num">03.</div>
            <div className="commit__body">
              <h3 className="commit__title">How we stay clean.</h3>
              <p>Nonpartisan by charter. Funded by donations and program fees, not contracts. Government participants can request our standard ethics letter for their filing. We publish what we accept and what we decline.</p>
              <a className="btn btn--text" onClick={() => setPage("about")}>Read the full ethics letter <span className="arr">→</span></a>
            </div>
          </li>
        </ol>
      </section>

      {/* WHAT WE DO — the new trio */}
      <section className="programs" data-screen-label="06 Home — What we do">
        <SuitRule tone="brass" />
        <div className="programs__head reveal reveal--up">
          <Eyebrow dark>What we do</Eyebrow>
          <h2 className="display display--dark">Two recurring programs and a fellowship.</h2>
          <p className="programs__deck">The Speaker Series <em>presents</em>. Roundtables <em>solve</em>. The Fellowship <em>places</em> — bi-directionally. Each is a different product. Each has its own page, its own intake, and its own way of being useful.</p>
        </div>
        <div className="programs__grid stagger">

          {/* CARD 1 — SPEAKER SERIES (portrait-led) */}
          <article className="program program--speaker">
            <div className="program__head">
              <div className="program__num">№ 01 · Flagship</div>
              <h3 className="program__title">The Speaker Series.</h3>
              <p className="program__one-line">A named senior leader. A closed-door audience. One topic, deeply.</p>
            </div>
            <div className="program__portrait">
              <Placeholder ratio="4/5" label="SPEAKER · environment portrait" />
              <div className="program__portrait-cap">
                <span className="ml">Recent</span>
                <strong>Senior IC official, civil cyber resilience</strong>
              </div>
            </div>
            <dl className="program__meta program__meta--inline">
              <div><dt>Format</dt><dd>In-person · Virtual</dd></div>
              <div><dt>Cadence</dt><dd>Monthly · D.C.</dd></div>
              <div><dt>Attribution</dt><dd>Off the record</dd></div>
            </dl>
            <div className="program__ctas">
              <a className="btn btn--primary" onClick={() => setPage("speaker-series")}>See upcoming sessions <span className="arr">→</span></a>
              <a className="btn btn--text" onClick={() => setPage("speaker-series")}>Request a speaker</a>
            </div>
          </article>

          {/* CARD 2 — ROUNDTABLES (diagram-led, no portrait) */}
          <article className="program program--rt">
            <div className="program__head">
              <div className="program__num">№ 02 · Anchor</div>
              <h3 className="program__title">Strategic Roundtables.</h3>
              <p className="program__one-line">A specific problem. Government, industry, academia at one table. A written readout walks out.</p>
            </div>
            <div className="program__diagram" aria-hidden="true">
              <RoundtableMark />
            </div>
            <div className="program__example">
              <div className="program__example-label">Example issue</div>
              <p className="program__example-body">"Closing the gap between commercial AI capability and IC adoption timelines — what would have to be true."</p>
              <div className="program__example-meta">
                <span>5–9 participants</span>
                <span className="dot" />
                <span>Briefing → Discussion → Readout</span>
                <span className="dot" />
                <span>One-page memo</span>
              </div>
            </div>
            <div className="program__ctas">
              <a className="btn btn--primary" onClick={() => setPage("roundtables")}>Read past readouts <span className="arr">→</span></a>
              <a className="btn btn--text" onClick={() => setPage("roundtables")}>Propose a Roundtable</a>
            </div>
          </article>

          {/* CARD 3 — FELLOWSHIP (state-led) */}
          <article className="program program--fellow">
            <div className="program__head">
              <div className="program__num">№ 03 · Signature</div>
              <h3 className="program__title">National Security Fellowship.</h3>
              <p className="program__one-line">A six-to-twelve month bi-directional placement. Government and industry inside each other's operating environment.</p>
            </div>
            <div className="program__state">
              <div className="program__state-row">
                <span className="program__state-label">Cohort II</span>
                <span className="program__state-value">In residence · 14 fellows · 7 agencies, 7 firms</span>
              </div>
              <div className="program__state-row">
                <span className="program__state-label">Cohort III</span>
                <span className="program__state-value program__state-value--muted">Applications closed · Window opens Q1 2026</span>
              </div>
              <div className="program__state-row">
                <span className="program__state-label">Waitlist</span>
                <span className="program__state-value">Open · Notified at intake</span>
              </div>
            </div>
            <div className="program__ctas">
              <a className="btn btn--primary" onClick={() => setPage("fellowship")}>Join the waitlist <span className="arr">→</span></a>
              <a className="btn btn--text" onClick={() => setPage("fellowship")}>Read the program brief</a>
            </div>
          </article>

        </div>
      </section>

      {/* BRIEFINGS — front page of the magazine */}
      <section className="briefings" data-screen-label="05 Home — Briefings">
        <SuitRule tone="ink" />
        <div className="briefings__head reveal reveal--up">
          <Eyebrow>The Briefings</Eyebrow>
          <a className="btn btn--text" onClick={() => setPage("briefings")}>All briefings →</a>
        </div>
        <div className="briefings__grid">
          <article className="briefing briefing--feat reveal reveal--up">
            <Placeholder ratio="3/2" label="FEATURED ESSAY · environment shot" />
            <div className="briefing__cat">Essay · Procurement</div>
            <h3 className="briefing__title">The shelf is full. The shelf has been full for a while.</h3>
            <p className="briefing__deck">
              Three quiet conversations about capability already paid for, sitting on hold inside three different program offices. A note on what comes after the contract.
            </p>
            <div className="briefing__byline">
              <span>By Lili Davoudian</span>
              <span className="dot" />
              <span>April 2026</span>
              <span className="dot" />
              <span>11 min</span>
            </div>
          </article>
          <ol className="briefings__list stagger">
            <li className="briefing-row">
              <div className="briefing-row__cat">Field note</div>
              <h4>What a closed convening on cyber resilience actually sounds like.</h4>
              <div className="briefing-row__byline"><span>Vishal Amin</span><span className="dot" /><span>March 2026</span></div>
            </li>
            <li className="briefing-row">
              <div className="briefing-row__cat">Conversation</div>
              <h4>An ODNI alum and a cleared founder on what trust costs.</h4>
              <div className="briefing-row__byline"><span>Editorial</span><span className="dot" /><span>February 2026</span></div>
            </li>
            <li className="briefing-row">
              <div className="briefing-row__cat">Essay</div>
              <h4>Nonpartisan is a posture, not a slogan. Here is the posture.</h4>
              <div className="briefing-row__byline"><span>Dan Goodwin</span><span className="dot" /><span>January 2026</span></div>
            </li>
            <li className="briefing-row">
              <div className="briefing-row__cat">Reading</div>
              <h4>Three books our fellows are arguing about this quarter.</h4>
              <div className="briefing-row__byline"><span>Editorial</span><span className="dot" /><span>December 2025</span></div>
            </li>
          </ol>
        </div>
      </section>

      {/* ON THE ROADMAP — quiet, transparent, not a graveyard */}
      <section className="roadmap-strip" data-screen-label="08 Home — Roadmap">
        <SuitRule tone="ink" />
        <div className="roadmap-strip__inner">
          <div className="roadmap-strip__head reveal reveal--up">
            <Eyebrow>On the roadmap</Eyebrow>
            <h2 className="display">Programs in development.</h2>
            <p>What we're building next, named honestly. Some are awaiting funding. Some are in pilot. Some are still concepts. We list them here because the alternative — quiet until launch — is what other institutions do, and we are not them.</p>
          </div>
          <ol className="roadmap-strip__list stagger">
            <li className="roadmap-row reveal reveal--up">
              <div className="roadmap-row__state">
                <span className="status-dot status-dot--draft" />
                <span>Awaiting funding</span>
              </div>
              <div className="roadmap-row__body">
                <h3>Veteran Mentoring.</h3>
                <p>A pathway from operational experience to executive mentorship, in partnership with Operation MOS. Veterans build a professional resume on the platform; mentors meet them where they are. Designed, partnered, awaiting a dedicated funder before it gets the staff it deserves.</p>
              </div>
              <a className="btn btn--text" onClick={() => setPage("roadmap")}>Express interest <span className="arr">→</span></a>
            </li>
            <li className="roadmap-row reveal reveal--up">
              <div className="roadmap-row__state">
                <span className="status-dot status-dot--draft" />
                <span>Concept stage</span>
              </div>
              <div className="roadmap-row__body">
                <h3>Cleared-founder studio.</h3>
                <p>An invite-only working group of cleared founders crossing the same procurement, capital, and access frictions. Quarterly meetings, pooled lessons, no equity stake from us. Scoping conversations now.</p>
              </div>
              <a className="btn btn--text" onClick={() => setPage("roadmap")}>The roadmap <span className="arr">→</span></a>
            </li>
          </ol>
        </div>
      </section>
      <section className="event-strip reveal reveal--up" data-screen-label="06 Home — Event">
        <div className="event-strip__inner">
          <div className="event-strip__col event-strip__col--mark">
            <span className="event-strip__num">06</span>
            <span>The June Convening</span>
          </div>
          <div className="event-strip__col event-strip__col--head">
            <h3>Closed-door briefing on the post-contract pipeline.</h3>
            <p>One day. Three sessions. Off the record. By invitation, with a public bench for partner inquiries.</p>
          </div>
          <div className="event-strip__col event-strip__col--meta">
            <div><span className="ml">Date</span><strong>11 June 2026</strong></div>
            <div><span className="ml">Place</span><strong>Washington, D.C.</strong></div>
            <div><span className="ml">Form</span><strong>By invitation</strong></div>
            <a className="btn btn--primary" onClick={() => setPage("events")}>Inquire →</a>
          </div>
        </div>
      </section>

      {/* CLOSE */}
      <section className="close" data-screen-label="07 Home — Close">
        <div className="close__inner reveal reveal--up">
          <span className="close__mark" aria-hidden="true"><img src="assets/logo-light.png" alt="" /></span>
          <h2 className="display display--dark">Partner with us.</h2>
          <p>If your work intersects national-cyber, intelligence, or the institutions that support them — and you can be honest in a closed room — there is a seat for you.</p>
          <div className="close__actions">
            <a className="btn btn--primary btn--lg" onClick={() => setPage("connect")}>Request a session</a>
            <a className="btn btn--ghost btn--inverse btn--lg" onClick={() => setPage("about")}>Read our ethics letter</a>
          </div>
        </div>
      </section>
    </>
  );
};

// ── ABOUT ────────────────────────────────────────────────────────────
const About = ({ tweaks, setPage }) => {
  const origin = ORIGINS[tweaks.origin];
  const mission = MISSIONS[tweaks.mission];

  return (
    <>
      {/* Origin — long-form magazine feature */}
      <section className="about-origin reveal reveal--up" data-screen-label="08 About — Origin">
        <div className="about-origin__head">
          <Eyebrow>The Origin</Eyebrow>
          <div className="about-origin__date">2023 → 2024</div>
        </div>
        <div className="about-origin__grid">
          <div className="about-origin__portrait">
            <Placeholder ratio="3/4" label="FOUNDERS — closed door portrait" />
          </div>
          <div className="about-origin__body">
            <h1 className="feature">{origin.eyebrow}.</h1>
            <p className="feature__lede">{origin.body}</p>
            <blockquote className="pullquote">
              "The ready room is where a squadron tells itself the truth."
            </blockquote>
            <p>
              That sentence was the whole brief, and it stayed the whole brief. We chartered a 501(c)(3), wrote an ethics letter we were willing to publish, and started inviting people to closed conversations. Then we kept doing it.
            </p>
            <p>
              The first convening had eleven people in a wood-paneled room three blocks from the White House. No press. No vendors pitching. No agenda slide. A program officer described what was actually broken; a cleared founder described what she could actually build; an academic explained why the policy framing was off by one degree. The conversation lasted ninety minutes. Three of those eleven people are still working together.
            </p>
            <blockquote className="pullquote pullquote--right">
              "Eleven people. Ninety minutes. Three are still working together."
            </blockquote>
            <p>
              Spades grew from there — slowly, by reference, the way trusted institutions grow. We do not advertise convenings. We do not publish attendee lists. We do publish a posture, an ethics letter, and the names of the people accountable for both.
            </p>
          </div>
        </div>
      </section>

      <SuitRule tone="ink" />

      {/* Why Spades — full */}
      <section className="about-why" data-screen-label="09 About — Why Spades">
        <Eyebrow>Why Spades</Eyebrow>
        <h2 className="display reveal reveal--up">A reading of the mark.</h2>
        <div className="about-why__grid stagger">
          <div className="about-why__chapter">
            <div className="chapter__num">I.</div>
            <h3>The patch.</h3>
            <p>The ace of spades has been the patch on naval aviators' shoulders for generations. Quiet provenance — earned, not declared. We carry the lineage. We do not carry the imagery.</p>
          </div>
          <div className="about-why__chapter">
            <div className="chapter__num">II.</div>
            <h3>The reading.</h3>
            <p>In the suit of spades, the highest card is the ace and the table where it's played is closed. Spades Institute is the closed table — high-trust, ethics-bound, nonpartisan. The right people, off the record, before anyone has to choose sides.</p>
          </div>
          <div className="about-why__chapter">
            <div className="chapter__num">III.</div>
            <h3>The discipline.</h3>
            <p>Spadework is the unglamorous, deliberate ground-laying that has to happen before anything visible succeeds. You don't see spadework. You see the building that stands because it happened.</p>
          </div>
        </div>
      </section>

      {/* Why "Spades" — Vishal's name origin (slot for founder text) */}
      <section className="name-origin reveal reveal--up" data-screen-label="09b About — Why the name 'Spades'">
        <SuitRule tone="ink" />
        <div className="name-origin__head">
          <Eyebrow>Why the name "Spades"</Eyebrow>
          <div className="name-origin__deck">The single most-asked question. Vishal's own answer.</div>
        </div>
        <div className="name-origin__grid">
          <div className="name-origin__portrait">
            <Placeholder ratio="3/4" label="VISHAL — first-person portrait" />
            <div className="name-origin__byline">
              <span>Vishal Amin</span>
              <span className="caption-meta">Founding Partner · told first-person</span>
            </div>
          </div>
          <div className="name-origin__body">
            <div className="name-origin__quote-mark" aria-hidden="true">&ldquo;</div>
            <blockquote className="name-origin__quote">
              <p className="name-origin__lede"><span className="name-origin__placeholder-tag">Founder text · placeholder</span> When people ask me why I called it Spades, the honest answer starts with a moment I haven't told most people.</p>
              <p>I'd been thinking about this institution for a year before it had a name. I knew the room I wanted to build — closed door, off the record, the right people working a real problem — but I didn't have a word for it that felt earned. Then, on a particular afternoon, the answer was sitting in front of me and I almost missed it. <span className="name-origin__placeholder-tag name-origin__placeholder-tag--inline">Founders supply the moment in their own words.</span></p>
              <p>The patch on the shoulder is part of it. The reading of the suit is part of it. The discipline of spadework is part of it. But the reason I picked the word — the actual moment — is more specific than any of those, and that's the part I want to tell you here, in my own voice, before anyone else's reading of it.</p>
              <p className="name-origin__sign">— V.A.</p>
            </blockquote>
            <div className="name-origin__note">
              <Pip size={9} color="var(--brass-dark)" />
              <span><strong>Designer's note for founders:</strong> this slot is held for your first-person account of why you chose the name "Spades." Replace the bracketed paragraphs with the moment as you'd tell it. Layout, photo, and pull-quote treatment will adapt to the length of what you write.</span>
            </div>
          </div>
        </div>
      </section>

      <SuitRule tone="ink" />

      {/* Thesis */}
      <section className="thesis" data-screen-label="10 About — Thesis">
        <div className="thesis__inner">
          <Eyebrow>The Thesis</Eyebrow>
          <p className="thesis__statement">{mission}</p>
          <div className="thesis__commitments">
            <div className="commitment">
              <div className="commitment__num">01</div>
              <h4>Off the record, on purpose.</h4>
              <p>Closed convenings are the product. We don't record, attribute, or publish what is said in the room — only that the room happened, and what we owe its participants.</p>
            </div>
            <div className="commitment">
              <div className="commitment__num">02</div>
              <h4>Nonpartisan as practice.</h4>
              <p>Nonpartisan isn't a slogan; it's a behavior. We don't endorse, lobby, or take program funding from anyone whose interests we'd have to disclose to the room.</p>
            </div>
            <div className="commitment">
              <div className="commitment__num">03</div>
              <h4>Ethics published, not posted.</h4>
              <p>Our ethics letter is signed, dated, and updated when our circumstances change. It's the second link in our nav for a reason.</p>
            </div>
          </div>
        </div>
      </section>

      <SuitRule tone="ink" />

      {/* Who we are — real roster */}
      <section className="people" data-screen-label="11 About — Who We Are">
        <Eyebrow>Who we are</Eyebrow>
        <h2 className="display reveal reveal--up">Founders. Council. Advisors. Fellows.</h2>

        <div className="roster-section">
          <div className="roster-section__head"><span>I.</span> Founding Partners</div>
          <div className="people__founders stagger">
            <PersonCard name="Vishal Amin" role="Founding Partner · Co-Founder, Spades Institute"
              img="assets/people/vishal.avif"
              bio="Operating Partner at Crosspoint Capital. After his time within the U.S. Department of War, Vishal has led cybersecurity, cloud, and national security businesses with a focus on strategy, innovation, and operational execution across regulated markets. A Presidential Scholar and a graduate of the George W. Bush Presidential Center."
              credit="USMC · Cybersecurity"
              big />
            <PersonCard name="Lili Davoudian" role="Founding Partner · Co-Founder, Spades Institute"
              img="assets/people/Lili.avif"
              bio="Senior Director at Microsoft leading cybersecurity for financial services. Helped build Microsoft Defender for Cloud and has driven Zero Trust adoption across government and commercial sectors. Magna cum laude graduate of Georgetown. Board of Directors, BankFund Credit Union."
              credit="Cloud Security · Policy"
              big />
          </div>
        </div>

        <div className="roster-section">
          <div className="roster-section__head"><span>II.</span> Council</div>
          <div className="people__grid stagger">
            {[
              ["Chad Raduege", "President & CEO, The Raduege Group", "assets/people/chad-raduege.jpg", "USAF General · White House Comms"],
              ["Russ Andersson", "Co-Founder & COO, RapidFort", "assets/people/russ-andersson.jpg", "DevSecOps · National Security"],
              ["Greg Oslan", "Strategic Advisor, Board Director, Investor", "assets/people/greg-oslan.jpg", "Cybersecurity Center · DIU"],
              ["Ellen McCarthy", "Chairwoman & CEO, Trust in Media Cooperative", "assets/people/ellen-mccarthy.jpg", "State Dept · Harvard Belfer"],
              ["Robyn Klein", "National Security & Cyber Policy Expert", "assets/people/robyn-klein.jpg", "Cyber Policy · AI Governance"],
              ["DJ Rosenthal", "Founder & CEO, 77 Meridian Law & Policy", "assets/people/dj-rosenthal.jpg", "NSC · DOJ"],
              ["Jamil Jaffer", "Venture Partner, Paladin Capital Group", "assets/people/jamil-jaffer.jpg", "Paladin Capital · White House"],
              ["Brad Levine", "Founder & CEO, Synergist Technology", "assets/people/brad-levine.jpg", "AI Compliance · GovTech"],
            ].map(([name, role, img, credit]) => (
              <PersonTile key={name} name={name} role={role} img={img} credit={credit} />
            ))}
          </div>
        </div>

        <div className="roster-section">
          <div className="roster-section__head"><span>III.</span> Senior Advisors</div>
          <div className="people__grid stagger">
            {[
              ["Dan Goodwin", "Senior BD Executive, Micron Technology", "assets/people/dan-goodwin.jpg", "Micron · Defense"],
              ["Andrew Shea", "Security Leader · Founder, Operation MOS", "assets/people/andrew-shea.jpg", "Microsoft · USNA"],
              ["Tanya Loh", "Advisor & Brand Builder", "assets/people/tanya-loh.jpeg", "Forgepoint Capital · Yale"],
            ].map(([name, role, img, credit]) => (
              <PersonTile key={name} name={name} role={role} img={img} credit={credit} />
            ))}
          </div>
        </div>

        <div className="roster-section">
          <div className="roster-section__head"><span>IV.</span> Fellows</div>
          <div className="people__grid people__grid--small stagger">
            {[
              ["Ken Kurz", "CIO, COPT Defense Properties", "assets/people/ken-kurz.jpg", "CISO · DoD"],
              ["Macy Dennis", "CSO, Ember Echo", "assets/people/macy-dennis.jpg", "Intelligence · Critical Infra"],
              ["Jason Christman", "CPO, Cyber Eagle Project", "assets/people/jason-christman.jpg", "Brigadier General · AI Cyber"],
              ["Robert Christafore", "BD Director, Verizon", "assets/people/robert-christafore.jpg", "Verizon · USMC"],
              ["Saša Zdjelar", "Operating Partner, Crosspoint Capital", "assets/people/sasa-zdjelar.jpg", "Salesforce · Crosspoint"],
              ["Justin Zeefe", "Founding GP, Green Flag Ventures", "assets/people/justin-zeefe.png", "Nisos Founder · IC"],
              ["Everett Stern", "Founder, Tactical Rabbit", "assets/people/everett-stern.jpg", "HSBC Whistleblower · Intel"],
              ["Hala Nelson", "Professor of Mathematics; Co-Founder, MI2MR", "assets/people/hala-nelson.png", "O'Reilly Author · DoD Advisor"],
              ["David Mahdi", "Chief Identity Officer, Transmit Security", "assets/people/david-mahdi.jpg", "Gartner VP · Identity"],
              ["Trevor Hull", "Security Leader, Microsoft Federal", "assets/people/trevor-hull.jpg", "Microsoft Federal · USMC Pilot"],
              ["Jansen Weaver", "CBO, Peripheral; Marine Attaché, USMCR", "assets/people/jansen-weaver.png", "USMC Intel · Hoover Institution"],
              ["Tim Kosiba", "Spades Fellow", "assets/people/tim-kosiba.jpg", "Cyber · Intel"],
            ].map(([name, role, img, credit]) => (
              <PersonTile key={name} name={name} role={role} img={img} credit={credit} />
            ))}
          </div>
        </div>
      </section>

      <SuitRule tone="ink" />

      {/* How it works — redesigned, NOT numbered circles */}
      <section className="how" data-screen-label="12 About — How it works">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="display reveal reveal--up">Four moves. One room.</h2>
        <ol className="how__list stagger">
          <li>
            <div className="how__num">I</div>
            <div className="how__content">
              <h3>The ask.</h3>
              <p>A government program lead, a cleared founder, or an academic principal brings a question that won't survive being framed as a procurement. We listen first.</p>
            </div>
            <div className="how__time">Week 0</div>
          </li>
          <li>
            <div className="how__num">II</div>
            <div className="how__content">
              <h3>The roster.</h3>
              <p>We propose seven to fourteen people. Not eighty. Each name is vetted against the ethics letter and against what would actually make the room useful.</p>
            </div>
            <div className="how__time">Week 1–3</div>
          </li>
          <li>
            <div className="how__num">III</div>
            <div className="how__content">
              <h3>The room.</h3>
              <p>One day. Closed door. Off the record. A read-ahead, an opening read, a working session, a debrief. No press, no slides-as-pitches, no vendors selling.</p>
            </div>
            <div className="how__time">Week 4</div>
          </li>
          <li>
            <div className="how__num">IV</div>
            <div className="how__content">
              <h3>The follow-through.</h3>
              <p>An action memo to participants — with what was agreed, what stayed unresolved, and which two phone calls we promised to make. Then we make them.</p>
            </div>
            <div className="how__time">Week 5+</div>
          </li>
        </ol>
      </section>

      {/* Ethics & independence */}
      <section className="ethics" data-screen-label="13 About — Ethics">
        <div className="ethics__inner">
          <div className="ethics__mark"><img src="assets/logo-light.png" alt="" /></div>
          <Eyebrow dark>Ethics & Independence</Eyebrow>
          <h2 className="display display--dark">A signed letter, not a footer link.</h2>
          <p>
            We publish the rules we hold ourselves to: what funding we accept, what funding we decline, what we disclose to participants, and what we owe the room when we get something wrong. The letter is signed by both founders. It's dated. We update it when our circumstances change.
          </p>
          <a className="btn btn--primary btn--lg" onClick={() => setPage("connect")}>Read the ethics letter →</a>
        </div>
      </section>
    </>
  );
};

const PersonTile = ({ name, role, img, credit }) => (
  <article className="person-tile">
    <div className="person-tile__photo">
      <img src={img} alt={name} loading="lazy" />
    </div>
    <div className="person-tile__name">{name}</div>
    <div className="person-tile__role">{role}</div>
    <div className="person-tile__credit"><Pip size={8} color="var(--brass-dark)" /><span>{credit}</span></div>
  </article>
);

const PersonCard = ({ name, role, img, bio, credit, big }) => (
  <article className={"person" + (big ? " person--big" : "")}>
    <div className="person__photo">
      <img src={img} alt={name} loading="lazy" />
    </div>
    <div className="person__body">
      <div className="person__name">{name}</div>
      <div className="person__role">{role}</div>
      <p className="person__bio">{bio}</p>
      <div className="person__credit"><Pip size={9} color="var(--brass-dark)" /> <span>{credit}</span></div>
    </div>
  </article>
);

// ── ENGAGEMENTS ──────────────────────────────────────────────────────
const Engagements = ({ setPage }) => (
  <>
    <section className="page-head">
      <Eyebrow>Engagements</Eyebrow>
      <h1 className="feature">Two recurring programs. A fellowship. A roadmap.</h1>
      <p className="page-head__deck">The Speaker Series presents. Roundtables solve. The Fellowship places. Each is a different product with its own page, its own intake, and its own way of being useful. What's in development sits on the roadmap, named honestly.</p>
    </section>
    <SuitRule tone="ink" />
    <section className="eng">
      <article className="eng__anchor">
        <div className="eng__num">№ 01 · Flagship</div>
        <h2 className="display">The Speaker Series.</h2>
        <p className="eng__lede">
          A named senior leader, a closed-door audience, one topic deeply. Recent topics include post-contract capability transition, cyber resilience for civil agencies, and what dual-use AI procurement looks like when it works.
        </p>
        <div className="eng__layout">
          <Placeholder ratio="3/2" label="ENVIRONMENT — closed conference room" />
          <dl className="eng__facts">
            <div><dt>Format</dt><dd>In-person or virtual</dd></div>
            <div><dt>Location</dt><dd>Washington, D.C. & beyond</dd></div>
            <div><dt>Cadence</dt><dd>Monthly</dd></div>
            <div><dt>Attribution</dt><dd>Off the record</dd></div>
            <div><dt>Participants</dt><dd>7–14 by invitation</dd></div>
          </dl>
        </div>
        <div className="eng__cta-row">
          <a className="btn btn--primary btn--lg" onClick={() => setPage("speaker-series")}>Open the Speaker Series page →</a>
          <a className="btn btn--text" onClick={() => setPage("speaker-series")}>Request a session</a>
        </div>
      </article>

      <SuitRule tone="ink" />

      <article className="eng__anchor">
        <div className="eng__num">№ 02 · Anchor</div>
        <h2 className="display">Strategic Roundtables.</h2>
        <p className="eng__lede">
          A specific problem, a specific group, a specific deliverable. Government, industry, and academia at the same table — closed door, off the record, with a one-page readout that walks out. The Roundtable is built to <em>solve</em>. The Speaker Series is built to <em>present</em>. Different products.
        </p>
        <div className="eng__layout">
          <Placeholder ratio="3/2" label="ABSTRACT — closed table, no portrait" tone="ink" />
          <dl className="eng__facts">
            <div><dt>Format</dt><dd>Briefing → Discussion → Readout</dd></div>
            <div><dt>Seats</dt><dd>5–9 by invitation</dd></div>
            <div><dt>Duration</dt><dd>~2 hours</dd></div>
            <div><dt>Deliverable</dt><dd>One-page readout</dd></div>
            <div><dt>Attribution</dt><dd>Chatham House</dd></div>
          </dl>
        </div>
        <div className="eng__cta-row">
          <a className="btn btn--primary btn--lg" onClick={() => setPage("roundtables")}>Open the Roundtables page →</a>
          <a className="btn btn--text" onClick={() => setPage("roundtables")}>Propose a Roundtable</a>
        </div>
      </article>

      <SuitRule tone="ink" />

      <article className="eng__support">
        <div className="eng__num">№ 03 · Signature</div>
        <h2 className="display">National Security Fellowship.</h2>
        <p className="eng__lede">
          Bi-directional placement between government and industry — six to twelve months immersed in each other's operating environment.
        </p>
        <div className="eng__closed">
          <span className="status-dot" /><span><strong>Cohort II — in residence.</strong> Cohort III applications closed. Waitlist open for Cohort IV.</span>
        </div>
        <a className="btn btn--ghost" onClick={() => setPage("fellowship")}>Open the Fellowship page →</a>
      </article>

      <SuitRule tone="ink" />

      <article className="eng__support">
        <div className="eng__num">№ 04 · Roadmap</div>
        <h2 className="display">Programs in development.</h2>
        <p className="eng__lede">
          Veteran Mentoring (in partnership with Operation MOS) sits on the roadmap, awaiting dedicated funding. A cleared-founder studio is in scoping. Listed here because the alternative — quiet until launch — is what other institutions do, and we are not them.
        </p>
        <a className="btn btn--ghost" onClick={() => setPage("roadmap")}>Open the roadmap →</a>
      </article>
    </section>
  </>
);

// ── BRIEFINGS INDEX ─────────────────────────────────────────────────
const Briefings = ({ setPage }) => (
  <>
    <section className="page-head">
      <Eyebrow>The Briefings</Eyebrow>
      <h1 className="feature">Field notes from the closed table.</h1>
      <p className="page-head__deck">Essays, conversations, and reading lists from people who have been in the room. We do not break what was said. We publish what we are willing to argue in public.</p>
    </section>
    <SuitRule tone="ink" />
    <section className="briefings-index">
      <article className="briefing briefing--feat">
        <Placeholder ratio="3/2" label="FEATURED ESSAY · cover" />
        <div className="briefing__cat">Essay · Procurement</div>
        <h3 className="briefing__title">The shelf is full. The shelf has been full for a while.</h3>
        <p className="briefing__deck">Three quiet conversations about capability already paid for. A note on what comes after the contract.</p>
        <div className="briefing__byline"><span>Lili Davoudian</span><span className="dot" /><span>April 2026</span><span className="dot" /><span>11 min</span></div>
      </article>
      <div className="briefings-index__list">
        {[
          ["Field note", "What a closed convening on cyber resilience actually sounds like.", "Vishal Amin", "March 2026", "8 min"],
          ["Conversation", "An ODNI alum and a cleared founder on what trust costs.", "Editorial", "February 2026", "14 min"],
          ["Essay", "Nonpartisan is a posture, not a slogan. Here is the posture.", "Dan Goodwin", "January 2026", "9 min"],
          ["Reading", "Three books our fellows are arguing about this quarter.", "Editorial", "December 2025", "6 min"],
          ["Field note", "How to convene seven people who do not want to be in the same room.", "Lili Davoudian", "November 2025", "7 min"],
          ["Essay", "What the ready-room culture actually was. And wasn't.", "Vishal Amin", "October 2025", "12 min"],
        ].map(([cat, title, by, date, read], i) => (
          <article key={i} className="briefing-row briefing-row--full">
            <div className="briefing-row__cat">{cat}</div>
            <h4>{title}</h4>
            <div className="briefing-row__byline"><span>{by}</span><span className="dot" /><span>{date}</span><span className="dot" /><span>{read}</span></div>
          </article>
        ))}
      </div>
    </section>
  </>
);

// ── EVENTS ───────────────────────────────────────────────────────────
const Events = ({ setPage }) => (
  <>
    <section className="event-hero" data-screen-label="14 Events — Hero">
      <div className="event-hero__inner reveal reveal--up">
        <Eyebrow dark>The June Convening · 2026</Eyebrow>
        <h1 className="event-hero__headline">Closed-door briefing on the post-contract pipeline.</h1>
        <p className="event-hero__deck">One day. Three sessions. Off the record. By invitation, with a public bench for partner inquiries.</p>
        <dl className="event-hero__facts">
          <div><dt>Date</dt><dd>11 June 2026</dd></div>
          <div><dt>Place</dt><dd>Washington, D.C.</dd></div>
          <div><dt>Form</dt><dd>By invitation</dd></div>
          <div><dt>Seats</dt><dd>11 of 14</dd></div>
        </dl>
        <a className="btn btn--primary btn--lg" onClick={() => setPage("connect")}>Inquire about a seat →</a>
      </div>
    </section>

    <section className="event-agenda">
      <Eyebrow>Agenda</Eyebrow>
      <h2 className="display">The day, in three blocks.</h2>
      <ol className="agenda stagger">
        {[
          ["08:30", "Reading", "Read-ahead distributed 72 hours prior. We open with the read in the room."],
          ["09:30", "Block I — The shelf", "What is sitting unfielded, and where did it stop moving?"],
          ["11:30", "Recess", "Coffee. Notes. No phones in the working sessions."],
          ["13:00", "Block II — The hand-off", "From contract to operator: where the handshake breaks."],
          ["15:00", "Block III — The follow-through", "Two calls we will make next week. Who makes them."],
          ["16:30", "Debrief", "Action memo drafted in the room. Signed before anyone leaves."],
        ].map(([time, head, body], i) => (
          <li key={i}>
            <div className="agenda__time">{time}</div>
            <div className="agenda__head">{head}</div>
            <div className="agenda__body">{body}</div>
          </li>
        ))}
      </ol>
    </section>

    <SuitRule tone="ink" />

    <section className="speakers">
      <Eyebrow>The Room</Eyebrow>
      <h2 className="display">Eleven of fourteen confirmed.</h2>
      <p className="page-head__deck">Roles named, names withheld until 24 hours before. This is the discipline.</p>
      <div className="speakers__grid stagger">
        {[
          ["Senior official", "Federal civil cyber agency"],
          ["Program officer", "Defense innovation unit"],
          ["Founder", "Cleared dual-use AI"],
          ["Director", "FFRDC · intelligence studies"],
          ["Deputy", "Congressional intel-committee staff"],
          ["Principal", "ODNI alum · advisory"],
          ["Vice President", "Cyber primes · government programs"],
          ["Fellow", "Spades · cohort II"],
          ["Senior counsel", "Federal CIO orbit"],
          ["Editor", "National-security beat"],
          ["Founder", "Secure infrastructure · early-stage"],
        ].map(([role, where], i) => (
          <article key={i} className="speaker">
            <div className="speaker__portrait"><Placeholder ratio="1/1" label={`SEAT ${String(i + 1).padStart(2, "0")}`} /></div>
            <div className="speaker__role">{role}</div>
            <div className="speaker__where">{where}</div>
          </article>
        ))}
        <article className="speaker speaker--open">
          <div className="speaker__portrait speaker__portrait--open">
            <span className="speaker__open-mark">Open seat</span>
          </div>
          <div className="speaker__role">Three open seats</div>
          <div className="speaker__where">By referral or inquiry</div>
        </article>
      </div>
    </section>
  </>
);

// ── PROGRAMS / SPEAKER SERIES ────────────────────────────────────────
const SpeakerSeries = ({ setPage }) => (
  <>
    <section className="page-head" data-screen-label="20 Speaker Series — Hero">
      <Eyebrow>Program · 01 · Flagship</Eyebrow>
      <h1 className="feature">The Speaker Series.</h1>
      <p className="page-head__deck">A named senior leader, a closed-door audience, one topic deeply. Curated speakers from the intelligence community, civil cyber, defense, and dual-use industry. Recurring. Off the record. Fourteen seats.</p>
    </section>
    <SuitRule tone="ink" />

    <section className="prog-detail">

      <div className="prog-block">
        <Eyebrow>What it is</Eyebrow>
        <p className="prog-block__lede">A monthly closed-door session built around one speaker and one topic. Seven to fourteen participants by invitation, mixed across government, industry, and academia. The speaker frames for thirty minutes. The room presses for sixty. Everyone leaves with the same one-page readout, off the record. The speaker leaves with new questions; the room leaves with a cleaner picture.</p>
        <dl className="prog-facts">
          <div><dt>Cadence</dt><dd>Monthly</dd></div>
          <div><dt>Duration</dt><dd>90 minutes</dd></div>
          <div><dt>Format</dt><dd>In-person · Virtual</dd></div>
          <div><dt>Seats</dt><dd>7–14, by invitation</dd></div>
          <div><dt>Attribution</dt><dd>Off the record · Chatham House</dd></div>
          <div><dt>Deliverable</dt><dd>One-page readout to participants</dd></div>
        </dl>
      </div>

      <SuitRule tone="ink" />

      {/* TOPICS */}
      <div className="prog-block">
        <Eyebrow>Topics covered &amp; on deck</Eyebrow>
        <h2 className="display">What the room has been working on.</h2>
        <ul className="topic-list">
          {[
            ["Recent","Civil cyber resilience after the next downtime event","Senior IC official"],
            ["Recent","Procurement reform that doesn't break the program office","Acquisitions principal"],
            ["Recent","Dual-use AI: capability vs. clearance timelines","Cleared founder"],
            ["Recent","What the IC asks of cleared industry, plainly","Former DNI senior staff"],
            ["On deck","Talent flows between agencies and primes","Service-secretary alum"],
            ["On deck","The bench: who's preparing the next CIO class","Federal CIO emeritus"],
          ].map(([when, topic, speaker], i) => (
            <li key={i} className="topic-row">
              <span className="topic-row__when">{when}</span>
              <span className="topic-row__topic">{topic}</span>
              <span className="topic-row__speaker">{speaker}</span>
            </li>
          ))}
        </ul>
        <p className="prog-block__note"><Pip size={9} color="var(--brass-dark)" /> Speaker names withheld until 24 hours before the session. The discipline is the discipline.</p>
      </div>

      <SuitRule tone="ink" />

      {/* SPEAKERS */}
      <div className="prog-block">
        <Eyebrow>Speakers</Eyebrow>
        <h2 className="display">A small selection of who has held the floor.</h2>
        <div className="speakers-bios stagger">
          {[
            ["Senior IC official", "Civil cyber agency", "Two decades inside federal civil cyber. Spoke on resilience after operational disruption — what works and what gets celebrated for working.", "S.O."],
            ["Cleared founder", "Dual-use AI", "Built two companies inside the cleared envelope. Spoke on the gap between commercial AI capability and IC adoption timelines.", "C.F."],
            ["Acquisitions principal", "Federal civilian", "Twenty years across program offices. Spoke on procurement reform that doesn't break the program office.", "A.P."],
            ["Former DNI senior staff", "Intelligence community", "Plain talk on what the IC actually asks of cleared industry and what gets lost in translation.", "F.D."],
            ["Service-secretary alum", "DoD", "Talent flows between agencies and primes — a warning, an opportunity, and a headcount.", "S.S."],
            ["Federal CIO emeritus", "Civilian agency", "On the bench: who's preparing the next CIO class, and what they need from us before they get the seat.", "F.C."],
          ].map(([role, org, bio, init], i) => (
            <article key={i} className="speaker-bio">
              <div className="speaker-bio__avatar"><span>{init}</span></div>
              <div className="speaker-bio__body">
                <div className="speaker-bio__role">{role}</div>
                <div className="speaker-bio__org">{org}</div>
                <p>{bio}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="prog-block__note"><Pip size={9} color="var(--brass-dark)" /> Identities held under Chatham House. Initials and roles are illustrative for the public site.</p>
      </div>

      <SuitRule tone="ink" />

      {/* CALENDAR */}
      <div className="prog-block">
        <Eyebrow>Calendar · Spring 2026</Eyebrow>
        <h2 className="display">Upcoming sessions.</h2>
        <div className="cal">
          {[
            ["Tue","11","Mar","Procurement reform · post-contract pipeline","Washington, D.C. · In person","Open · Invitation"],
            ["Wed","09","Apr","Civil cyber resilience after the next event","Hybrid · D.C. + Virtual","Open · Invitation"],
            ["Tue","13","May","Dual-use AI: clearance vs. capability","Washington, D.C. · In person","Waitlist"],
            ["Wed","11","Jun","Talent flows: agencies, primes, cleared founders","Washington, D.C. · In person","Open · Invitation"],
          ].map(([dow, day, mo, topic, where, status], i) => (
            <article key={i} className={"cal__row" + (status.startsWith("Waitlist") ? " is-waitlist" : "")}>
              <div className="cal__date">
                <span className="cal__dow">{dow}</span>
                <span className="cal__day">{day}</span>
                <span className="cal__mo">{mo}</span>
              </div>
              <div className="cal__body">
                <h4>{topic}</h4>
                <div className="cal__meta"><span>{where}</span></div>
              </div>
              <div className="cal__status"><span className="status-dot" />{status}</div>
            </article>
          ))}
        </div>
        <a className="btn btn--text" onClick={() => setPage("events")}>Past sessions →</a>
      </div>

      <SuitRule tone="ink" />

      {/* INTAKE */}
      <div className="prog-block prog-block--intake">
        <Eyebrow>Request a Speaker Series</Eyebrow>
        <h2 className="display">Bring the room to your problem.</h2>
        <p className="prog-block__lede">We host most sessions in D.C., but we run sessions for partner organizations on their topic, in their city, on their cadence. Tell us what the room would be for.</p>
        <SpeakerIntake />
      </div>
    </section>
  </>
);

const SpeakerIntake = () => (
  <form className="prog-intake" onSubmit={(e) => e.preventDefault()}>
    <div className="row">
      <label><span>Organization</span><input type="text" placeholder="Agency, firm, or institution" /></label>
      <label><span>Your role</span><input type="text" placeholder="Title · agency or company" /></label>
    </div>
    <div className="row">
      <label><span>Contact email</span><input type="email" placeholder="you@domain.gov · you@firm.com" /></label>
      <label><span>Format</span>
        <select defaultValue="">
          <option value="" disabled>Select a format</option>
          <option>In person · D.C.</option>
          <option>In person · Our city</option>
          <option>Virtual · Cleared platform</option>
          <option>Hybrid</option>
        </select>
      </label>
    </div>
    <label className="full"><span>Topic of interest</span>
      <textarea rows="3" placeholder="What is the question the room would press on? One or two sentences is enough." />
    </label>
    <div className="row">
      <label><span>Proposed window</span><input type="text" placeholder="e.g. April–June 2026" /></label>
      <label><span>Audience size</span><input type="text" placeholder="Approx. seats · we cap at 14" /></label>
    </div>
    <div className="connect__assure">
      <Pip size={11} color="var(--brass-dark)" />
      <span>A founder reads this. Reply inside three business days. We will not pitch the response to a CRM.</span>
    </div>
    <button type="submit" className="btn btn--primary btn--lg">Submit the request</button>
  </form>
);

// ── PROGRAMS / ROUNDTABLES ───────────────────────────────────────────
const Roundtables = ({ setPage }) => (
  <>
    <section className="page-head" data-screen-label="21 Roundtables — Hero">
      <Eyebrow>Program · 02 · Anchor</Eyebrow>
      <h1 className="feature">Strategic Roundtables.</h1>
      <p className="page-head__deck">A specific problem, a specific group, a specific deliverable. Government, industry, and academia at the same table — closed door, off the record, with a one-page readout that walks out. The Roundtable is built to <em>solve</em>. The Speaker Series is built to <em>present</em>. Different products.</p>
    </section>
    <SuitRule tone="ink" />

    <section className="prog-detail">

      <div className="prog-block">
        <Eyebrow>What a Roundtable is</Eyebrow>
        <div className="rt-def">
          <ol className="rt-def__steps">
            <li><span className="rt-def__num">01.</span><div><strong>Briefing.</strong> Twenty minutes. The convener and a designated framer establish the problem in operational terms. No slides selling anything.</div></li>
            <li><span className="rt-def__num">02.</span><div><strong>Discussion.</strong> Ninety minutes. Five to nine participants from across government, industry, and academia work the problem under Chatham House rules.</div></li>
            <li><span className="rt-def__num">03.</span><div><strong>Readout.</strong> A one-page memo of what was shared and what's next. Drafted by the convener, circulated to the room for redaction, then released.</div></li>
          </ol>
          <dl className="rt-def__facts">
            <div><dt>Seats</dt><dd>5–9</dd></div>
            <div><dt>Duration</dt><dd>~2 hours</dd></div>
            <div><dt>Attribution</dt><dd>Chatham House · Off the record</dd></div>
            <div><dt>What you get</dt><dd>One-page readout · Continued access to the room</dd></div>
            <div><dt>What you don't</dt><dd>A pitch deck · A vendor scorecard · A press release</dd></div>
          </dl>
        </div>
      </div>

      <SuitRule tone="ink" />

      {/* EXAMPLE ISSUES */}
      <div className="prog-block">
        <Eyebrow>Example issues</Eyebrow>
        <h2 className="display">What the table has worked on.</h2>
        <div className="rt-issues stagger">
          {[
            ["Civil cyber","Closing the gap between commercial AI capability and IC adoption timelines.","Q1 2026"],
            ["Procurement","What the post-contract pipeline actually looks like, and why capability stalls there.","Q4 2025"],
            ["Talent","Bi-directional placements: what the agency owes the company, and the reverse.","Q3 2025"],
            ["Trust","Cleared-founder access to senior IC officials without the SBIR theater.","Q2 2025"],
          ].map(([cat, q, when], i) => (
            <article key={i} className="rt-issue">
              <div className="rt-issue__cat">{cat}</div>
              <h4>{q}</h4>
              <div className="rt-issue__when">{when}</div>
            </article>
          ))}
        </div>
        <p className="prog-block__note"><Pip size={9} color="var(--brass-dark)" /> Examples are representative of the format. Specific roundtables, dates, and participants are not disclosed without participant consent.</p>
      </div>

      <SuitRule tone="ink" />

      {/* SAMPLE READOUT */}
      <div className="prog-block">
        <Eyebrow>Sample readout</Eyebrow>
        <h2 className="display">The deliverable shape.</h2>
        <p className="prog-block__lede">Every Roundtable produces one of these. A page. Quiet, useful, and shaped to be read by a busy person in two minutes. This is the artifact the program is judged on.</p>
        <div className="readout-doc">
          <div className="readout-doc__chrome"><span>READOUT · ROUNDTABLE</span><span>Strictly confidential to participants</span></div>
          <div className="readout-doc__body">
            <div className="readout-doc__head">
              <div className="readout-doc__title">Closing the gap between commercial AI capability and IC adoption timelines.</div>
              <div className="readout-doc__meta">No. RT-2026-001 · Washington, D.C. · 11 March 2026 · 7 participants</div>
            </div>
            <div className="readout-doc__col">
              <h5>What was shared</h5>
              <ul>
                <li>The procurement window for commercial dual-use AI is narrower than the capability window. Most capability ages out before contract.</li>
                <li>Adoption is gated less by capability and more by accreditation. The room agreed accreditation is the actual program of record.</li>
                <li>Three near-term moves were named that would close half the gap inside twelve months without legislative action.</li>
              </ul>
            </div>
            <div className="readout-doc__col">
              <h5>What's next</h5>
              <ul>
                <li>Convener will circulate a non-attribution memo to the agency lead and the participating firm by 25 March.</li>
                <li>Two participants offered to host follow-on sessions on accreditation pathways. Spades will scope and propose.</li>
                <li>The room agreed to reconvene in 90 days to test progress against a short list of behaviors, not metrics.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <SuitRule tone="ink" />

      {/* INTAKE */}
      <div className="prog-block prog-block--intake">
        <Eyebrow>Propose a Roundtable</Eyebrow>
        <h2 className="display">An issue that needs the right room.</h2>
        <p className="prog-block__lede">Tell us the issue, who you'd want at the table, and what a useful outcome looks like. We will write back with whether we can build it, who else we would invite, and when.</p>
        <RoundtableIntake />
      </div>
    </section>
  </>
);

const RoundtableIntake = () => (
  <form className="prog-intake" onSubmit={(e) => e.preventDefault()}>
    <div className="row">
      <label><span>Your name</span><input type="text" placeholder="Full name" /></label>
      <label><span>Role · affiliation</span><input type="text" placeholder="Title at agency, firm, or institution" /></label>
    </div>
    <label className="full"><span>The issue</span>
      <textarea rows="3" placeholder="One paragraph. What's the question the room would press on? Be specific — the more operational the better." />
    </label>
    <label className="full"><span>Who you'd want at the table</span>
      <textarea rows="3" placeholder="Roles or institutions, not names. e.g. 'A federal civil cyber lead, two cleared founders, an accreditation principal.'" />
    </label>
    <label className="full"><span>The outcome you want</span>
      <textarea rows="2" placeholder="What does a useful one-page readout look like? What would you do with it?" />
    </label>
    <div className="row">
      <label><span>Email</span><input type="email" placeholder="you@domain.gov · you@firm.com" /></label>
      <label><span>Window</span><input type="text" placeholder="e.g. May–July 2026" /></label>
    </div>
    <div className="connect__assure">
      <Pip size={11} color="var(--brass-dark)" />
      <span>A founder reads this. Reply inside three business days, with a yes, a no, or a sharper question.</span>
    </div>
    <button type="submit" className="btn btn--primary btn--lg">Propose the Roundtable</button>
  </form>
);

// ── PROGRAMS / FELLOWSHIP ────────────────────────────────────────────
const Fellowship = ({ setPage }) => (
  <>
    <section className="page-head" data-screen-label="22 Fellowship — Hero">
      <Eyebrow>Program · 03 · Signature</Eyebrow>
      <h1 className="feature">National Security Fellowship.</h1>
      <p className="page-head__deck">A six-to-twelve month bi-directional placement between government and industry. Fellows do real work inside the partner organization — not job-shadowing, not site visits — and bring what they learn home. Cohort II is in residence. Cohort III opens Q1 2026.</p>
    </section>
    <SuitRule tone="ink" />

    <section className="prog-detail">

      {/* CURRENT STATE — handled with dignity */}
      <div className="prog-block fellow-state reveal reveal--up">
        <div className="fellow-state__head">
          <Eyebrow>Current state · Cohort III</Eyebrow>
          <div className="fellow-state__pill">Applications closed · Waitlist open</div>
        </div>
        <p className="fellow-state__lede">The window for Cohort III applications closed on 30 November 2025. We are reviewing in Dec–Feb and placing fellows in March. <strong>The waitlist is the real signal</strong> — it tells us where the demand is, and it's how we shape Cohort IV. If you're considering applying, joining the waitlist is the only step that matters right now.</p>
        <div className="fellow-state__cta">
          <a className="btn btn--primary btn--lg" onClick={() => setPage("connect")}>Join the waitlist <span className="arr">→</span></a>
          <span className="fellow-state__small">We hold notes. We do not market. Notification when Cohort IV opens.</span>
        </div>
      </div>

      <SuitRule tone="ink" />

      <div className="prog-block">
        <Eyebrow>Who it's for</Eyebrow>
        <div className="fellow-fit">
          <article className="fellow-fit__col">
            <h4>Government fellows</h4>
            <p>Mid-to-senior officials inside intelligence community, federal civil cyber, and adjacent agencies. Five years minimum at the level. Placed inside a cleared firm, defense prime, or research institute for the cohort.</p>
            <ul>
              <li>Operational role with shipped deliverables</li>
              <li>Clearance status maintained · Conflicts mapped at intake</li>
              <li>Returns to home agency with placement memo</li>
            </ul>
          </article>
          <article className="fellow-fit__col">
            <h4>Industry fellows</h4>
            <p>Senior operators inside cleared firms, dual-use technology companies, and policy institutions. Five years minimum at the level. Placed inside the partner agency for the cohort.</p>
            <ul>
              <li>Real assignment, not a tour</li>
              <li>Reading-in handled at intake</li>
              <li>Returns to home firm with placement memo</li>
            </ul>
          </article>
        </div>
      </div>

      <SuitRule tone="ink" />

      <div className="prog-block">
        <Eyebrow>Structure</Eyebrow>
        <h2 className="display">A simple shape, deliberately.</h2>
        <ol className="fellow-shape">
          <li><span className="fellow-shape__num">01.</span><div><strong>Intake.</strong> Two months. Conflicts review, clearance read-in, role scoping, mentor pairing. Nothing starts until intake closes.</div></li>
          <li><span className="fellow-shape__num">02.</span><div><strong>Residency.</strong> Six to twelve months. The fellow is at the partner organization, doing the work. Quarterly check-ins with the convener.</div></li>
          <li><span className="fellow-shape__num">03.</span><div><strong>Outbrief.</strong> One month. Placement memo, three written reflections, an exit conversation with both organizations.</div></li>
        </ol>
      </div>

      <SuitRule tone="ink" />

      <div className="prog-block">
        <Eyebrow>Alumni</Eyebrow>
        <h2 className="display">Where Cohort I went next.</h2>
        <div className="fellow-alumni stagger">
          {[
            ["Government → industry","Returned to senior agency role with industry rotation memo. Now advising the program from the inside."],
            ["Industry → government","Placed at federal civil cyber. Now permanent staff after waiver process."],
            ["Government → academia","Took a research fellowship. Continues to publish under the Spades imprint."],
            ["Industry → industry, cleared","Moved from commercial to a cleared firm with the agency relationship intact."],
          ].map(([flow, what], i) => (
            <article key={i} className="fellow-alumni__card">
              <div className="fellow-alumni__flow">{flow}</div>
              <p>{what}</p>
            </article>
          ))}
        </div>
        <p className="prog-block__note"><Pip size={9} color="var(--brass-dark)" /> Alumni names withheld until the alumnus opts in. Tracks are illustrative.</p>
      </div>
    </section>
  </>
);

// ── PROGRAMS / ROADMAP ───────────────────────────────────────────────
const Roadmap = ({ setPage }) => (
  <>
    <section className="page-head" data-screen-label="23 Roadmap — Hero">
      <Eyebrow>On the roadmap</Eyebrow>
      <h1 className="feature">Programs in development.</h1>
      <p className="page-head__deck">What we're building next, named honestly. Some are awaiting funding. Some are in pilot. Some are still concepts. We list them here because the alternative — quiet until launch — is what other institutions do, and we are not them.</p>
    </section>
    <SuitRule tone="ink" />

    <section className="roadmap-detail">

      {/* VETERAN MENTORING — lead */}
      <article className="rd-program reveal reveal--up">
        <div className="rd-program__chrome">
          <Eyebrow>Pathway program · 01</Eyebrow>
          <div className="rd-program__state"><span className="status-dot status-dot--draft" /> Awaiting funding · Partner secured</div>
        </div>
        <h2 className="display">Veteran Mentoring.</h2>
        <p className="rd-program__lede">A pathway from operational experience to executive mentorship, in partnership with <a className="lk">Operation MOS</a>. Veterans build a professional resume on the platform; mentors meet them where they are. The bones are designed. The partner is named. The platform exists. What's missing is dedicated funding for the staff who would run it well.</p>

        <div className="rd-program__split">
          <div className="rd-program__col">
            <h4>What it would do</h4>
            <ul>
              <li>Pair transitioning veterans with executive mentors across cleared industry, federal civilian, and IC.</li>
              <li>Use Operation MOS as the resume substrate so mentors meet veterans where they already are.</li>
              <li>Run quarterly cohort gatherings under the Spades convening practice — closed door, off the record.</li>
              <li>Publish a yearly readout on what the cohort needed and where the system didn't deliver.</li>
            </ul>
          </div>
          <div className="rd-program__col">
            <h4>What's missing</h4>
            <ul>
              <li><strong>Funding.</strong> $180K–$240K/year for two years would fund a program lead, operations, and the cohort gatherings.</li>
              <li><strong>An anchor donor.</strong> Lead philanthropist or institutional foundation aligned to veteran-cleared transitions.</li>
              <li><strong>Pilot cohort.</strong> Ten veterans, ten mentors, ninety days. Designed and ready to run on funded go.</li>
            </ul>
          </div>
        </div>

        <div className="rd-program__cta">
          <a className="btn btn--primary" onClick={() => setPage("connect")}>Express interest <span className="arr">→</span></a>
          <a className="btn btn--text" onClick={() => setPage("connect")}>Talk to a founder about funding this</a>
        </div>
      </article>

      <SuitRule tone="ink" />

      {/* SECONDARY — concept stage */}
      <article className="rd-program reveal reveal--up">
        <div className="rd-program__chrome">
          <Eyebrow>Working group · 02</Eyebrow>
          <div className="rd-program__state"><span className="status-dot status-dot--draft" /> Concept stage · Scoping conversations</div>
        </div>
        <h2 className="display">Cleared-founder studio.</h2>
        <p className="rd-program__lede">An invite-only working group of cleared founders crossing the same procurement, capital, and access frictions. Quarterly meetings under Roundtable rules. Pooled lessons on contract paths, capital paths, and government access. We take no equity. We take no introduction fees. We take honest conversation as the medium.</p>
        <p className="rd-program__small">Currently in scoping conversations with twelve founders. If this is your day-to-day, write to us; the room is being formed now.</p>
        <a className="btn btn--text" onClick={() => setPage("connect")}>Add your name to the scoping list <span className="arr">→</span></a>
      </article>

      <SuitRule tone="ink" />

      {/* TERTIARY — placeholder for future entries */}
      <article className="rd-program rd-program--quiet">
        <div className="rd-program__chrome">
          <Eyebrow>Future · 03</Eyebrow>
          <div className="rd-program__state"><span className="status-dot status-dot--draft" /> Idea stage · Not yet a commitment</div>
        </div>
        <h2 className="display">Public-record project.</h2>
        <p className="rd-program__lede">A small editorial program that publishes annual readouts on procurement, IC adoption, and the cleared talent pipeline — written for the public, sourced from what the closed table is willing to release. Idea stage. Nothing committed. We write it down here so you can hold us to deciding by year-end.</p>
      </article>
    </section>
  </>
);

// ── CONNECT ──────────────────────────────────────────────────────────
const Connect = () => {
  const [intent, setIntent] = useState("convening");
  return (
    <>
      <section className="page-head">
        <Eyebrow>Connect</Eyebrow>
        <h1 className="feature">A short note. A real person reads it.</h1>
        <p className="page-head__deck">We respond inside three business days. If the note is time-sensitive, say so in the first line and we will move faster.</p>
      </section>
      <SuitRule tone="ink" />
      <section className="connect">
        <form className="connect__form" onSubmit={(e) => e.preventDefault()}>
          <fieldset className="connect__intent">
            <legend>Reason for the note</legend>
            <div className="seg">
              {[["convening","Request a convening"],["partner","Partner with us"],["fellow","Fellow / advisor"],["press","Press · journalist"],["other","Other"]].map(([k,l]) => (
                <button key={k} type="button" className={"seg__btn" + (intent === k ? " is-active" : "")} onClick={() => setIntent(k)}>{l}</button>
              ))}
            </div>
          </fieldset>
          <div className="row">
            <label><span>Name</span><input type="text" defaultValue="" placeholder="Your full name" /></label>
            <label><span>Affiliation</span><input type="text" placeholder="Agency, company, or institution" /></label>
          </div>
          <div className="row">
            <label><span>Email</span><input type="email" placeholder="you@domain.gov · you@firm.com" /></label>
            <label><span>LinkedIn (optional)</span><input type="url" placeholder="linkedin.com/in/…" /></label>
          </div>
          <label className="full"><span>The note</span>
            <textarea rows="6" placeholder="A few sentences on what you'd like to discuss. Specifics are welcome and not required." />
          </label>
          <div className="connect__assure">
            <Pip size={11} color="var(--brass-dark)" />
            <span>Read by a founder. Not stored on a CRM. Replies inside three business days. <a>Ethics letter →</a></span>
          </div>
          <button type="submit" className="btn btn--primary btn--lg">Send the note</button>
        </form>
        <aside className="connect__aside">
          <div className="aside__block">
            <h4>Direct</h4>
            <p>For sensitive inquiries: a founder will share a Signal handle on first reply.</p>
          </div>
          <div className="aside__block">
            <h4>Mail</h4>
            <p>Spades Institute<br/>Washington, D.C.</p>
          </div>
          <div className="aside__block">
            <h4>Reading</h4>
            <p>Newest briefings arrive monthly. We do not sell the list. We do not rent the list.</p>
          </div>
        </aside>
      </section>
    </>
  );
};

// ── Footer ───────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="footer">
    <SuitRule tone="brass" />
    <div className="footer__inner">
      <div className="footer__brand">
        <img className="footer__logo" src="assets/logo-dark.png" alt="Spades Institute" />
        <span className="footer__tag">Closed table. Off the record. On purpose.</span>
      </div>
      <div className="footer__cols">
        <div>
          <h5>Institution</h5>
          <a>About</a><a>Ethics letter</a><a>Press</a>
        </div>
        <div>
          <h5>Engagements</h5>
          <a>Speaker Series</a><a>Fellowship</a><a>Veteran Mentoring</a>
        </div>
        <div>
          <h5>Reading</h5>
          <a>The Briefings</a><a>Events</a><a>Newsletter</a>
        </div>
      </div>
    </div>
    <div className="footer__legal">
      <span>Spades Institute · 501(c)(3) · MMXXIV</span>
      <span>Nonpartisan · Off the record · Ethics-first</span>
    </div>
  </footer>
);

// ── Tweaks ───────────────────────────────────────────────────────────
const Tweaks = ({ tweaks, setTweak }) => (
  <TweaksPanel title="Tweaks">
    <TweakSection title="Mission candidate (founders pick)">
      <TweakRadio value={tweaks.mission} options={[["A","A"],["B","B"],["C","C"]]} onChange={(v) => setTweak("mission", v)} />
      <p className="tw-note">{MISSIONS[tweaks.mission]}</p>
    </TweakSection>
    <TweakSection title="Hero headline">
      <TweakSelect value={tweaks.hero} onChange={(v) => setTweak("hero", v)}
        options={[["room","The room before the room."],["rfp","Off the record. Before the RFP."],["call","Where the call gets made."],["closed","Operators. Closed table."]]} />
    </TweakSection>
    <TweakSection title="Origin candidate">
      <TweakSelect value={tweaks.origin} onChange={(v) => setTweak("origin", v)}
        options={[["A","A · The hangar"],["B","B · The conversation"],["C","C · Why none of this"],["D","D · The ready room (rec.)"]]} />
    </TweakSection>
    <TweakSection title="Insignia stamp">
      <TweakToggle value={tweaks.showInsignia} onChange={(v) => setTweak("showInsignia", v)} />
    </TweakSection>
    <TweakSection title="Page">
      <TweakSelect value={tweaks.page} onChange={(v) => setTweak("page", v)}
        options={[["home","Home"],["about","About"],["engagements","Engagements"],["briefings","Briefings"],["events","Events"],["connect","Connect"]]} />
    </TweakSection>
  </TweaksPanel>
);

// ── App ──────────────────────────────────────────────────────────────
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const setPage = (p) => setTweak("page", p);
  const page = tweaks.page;
  const dark = page === "home" || page === "events";

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  // ── Global scroll-reveal: any element with class `reveal` (or variants),
  //    `stagger`, `suit-rule`, or `section-rule` gets `is-in` when it scrolls
  //    into view. Re-runs on every page change because DOM is rebuilt.
  useEffect(() => {
    const targets = document.querySelectorAll(
      ".reveal, .reveal--up, .reveal--blur, .reveal--scale, .reveal--line, .reveal--line-y, .stagger, .suit-rule, .section-rule"
    );
    if (!targets.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [page]);

  // ── Magnetic hover position for program cards (sets --mx/--my)
  useEffect(() => {
    const cards = document.querySelectorAll(".program");
    const handlers = [];
    cards.forEach((card) => {
      const onMove = (ev) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((ev.clientX - r.left) / r.width) * 100 + "%");
        card.style.setProperty("--my", ((ev.clientY - r.top) / r.height) * 100 + "%");
      };
      card.addEventListener("pointermove", onMove);
      handlers.push([card, onMove]);
    });
    return () => handlers.forEach(([c, h]) => c.removeEventListener("pointermove", h));
  }, [page]);

  // ── Subtle parallax on hero watermark
  useEffect(() => {
    const wm = document.querySelector(".hero__watermark");
    if (!wm) return;
    const onScroll = () => {
      const y = Math.min(window.scrollY, 800);
      wm.style.transform = `translateY(calc(-50% + ${y * 0.08}px)) rotate(${-6 + y * 0.004}deg)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [page]);

  return (
    <div className={"site" + (dark ? " site--dark-top" : "")}>
      <Nav page={page} setPage={setPage} dark={dark} />
      <main className="main">
        {page === "home" && <Home tweaks={tweaks} setPage={setPage} />}
        {page === "about" && <About tweaks={tweaks} setPage={setPage} />}
        {page === "engagements" && <Engagements setPage={setPage} />}
        {page === "speaker-series" && <SpeakerSeries setPage={setPage} />}
        {page === "roundtables" && <Roundtables setPage={setPage} />}
        {page === "fellowship" && <Fellowship setPage={setPage} />}
        {page === "roadmap" && <Roadmap setPage={setPage} />}
        {page === "briefings" && <Briefings setPage={setPage} />}
        {page === "events" && <Events setPage={setPage} />}
        {page === "connect" && <Connect />}
      </main>
      <Footer />
      <Tweaks tweaks={tweaks} setTweak={setTweak} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
