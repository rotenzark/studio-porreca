/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'studio-porreca', // usato per localStorage lang
    whatsapp: {
      number: '', // WhatsApp non dichiarato da loro: telefono ed email
      message: '',
      ids: [],
    },
    /* orari: per giorno (0=domenica) un array di finestre [inizio, fine]
       in minuti-stringa 'HH:MM'. Fine oltre '24:00' = scavalca mezzanotte
       (es. ['18:00','24:30'] = apre alle 18, chiude alle 00:30 del giorno
       dopo). Giorno chiuso = []. Scheda Google: lun–ven 9–12 e 14:30–20,
       sabato e domenica chiuso (il loro sito dice altro: vedi le note). */
    hours: {
      0: [],
      1: [['09:00', '12:00'], ['14:30', '20:00']],
      2: [['09:00', '12:00'], ['14:30', '20:00']],
      3: [['09:00', '12:00'], ['14:30', '20:00']],
      4: [['09:00', '12:00'], ['14:30', '20:00']],
      5: [['09:00', '12:00'], ['14:30', '20:00']],
      6: [],
    },
    hoursStatusId: 'orarioStato',     // elemento testo stato
    hoursTableSelector: '[data-day]', // righe/li con data-day da evidenziare
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1400,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1099,
    /* dizionario EN: SOLO overlay — l'HTML è la versione italiana. Le recensioni restano nella lingua originale, con la
       traduzione nostra sotto (.solo-en). */
    EN: {
      "i.cosa": "Kinesiology and postural re-education",
      "i.skip": "Skip",
      "m.salta": "Skip to content",
      "m.top": "Studio Porreca, back to the top",
      "t.cosa": "Kinesiology and postural re-education",
      "m.capitoli": "The chapters",
      "n.indagine": "The assessment",
      "n.servizi": "Head to toe",
      "n.metodo": "The method",
      "n.percorso": "Training",
      "n.persone": "Reviews",
      "n.studio": "The studio",
      "m.lingua": "Language",
      "t.chiama": "Call",
      "m.menu": "Open the chapters",
      "c.kicker": "Studio Porreca · kinesiology and postural re-education",
      "c.titolo": "Nothing should go unnoticed.",
      "c.chi": "The studio of Dr Pasquale Porreca, kinesiologist and postural technician in the Raggi Method® with Pancafit®, in Barona, Milan. It starts with an assessment of everything your posture carries with it; then the work is on the muscle chains and on breathing.",
      "c.appuntamento": "By appointment, Monday to Friday",
      "c.voto": "from 43 Google reviews",
      "c.chiama": "Call 342 645 7603",
      "c.scrivi": "Send an email",
      "c.alt": "The studio: the black desk with two chairs, the light-blue walls and the framed diplomas on the wall",
      "c.cap": "The desk where the assessment begins.",
      "a.kick": "The first session",
      "a.titolo": "The assessment",
      "a.intro": "The Raggi Method® looks at the person as a whole. That's why the first session starts with questions: during the assessment in the studio, we look for",
      "a.l1": "past physical traumas,",
      "a.l2": "scars,",
      "a.l3": "surgery,",
      "a.l4": "malocclusions, that is, how the teeth close,",
      "a.l5": "postural habits,",
      "a.l6": "wrong ways of doing things or of using the body,",
      "a.l7": "emotional situations that have left a mark.",
      "a.test": "Then come the postural tests. All the data go into a hypothesis about the primary cause, and the strategy is chosen from there.",
      "a.voce": "“[…] the neck problem discovered in the medical history and due to an old carpal tunnel operation!”",
      "a.voceChi": "Paola Barbieri, on Google (translated)",
      "s.kick": "Re-education",
      "s.titolo": "Head to toe",
      "s.intro": "Seven programmes, in order of height, as on an anatomical chart. Each one starts from the assessment.",
      "s.k1": "Eyes",
      "s.t1": "Visual function re-education",
      "s.d1": "Small differences in convergence or alignment between the two eyes can disturb posture even with perfect eyesight. Specific tests guide the choice of exercises for the eye muscles.",
      "s.k2": "Tongue",
      "s.t2": "Postural-functional re-education of the tongue",
      "s.d2": "For atypical swallowing, a short frenulum or difficulties linked to how the teeth close: the work is on the tongue's muscle chain, part of the postural system.",
      "s.k3": "Jaw",
      "s.t3": "Temporomandibular re-education",
      "s.d3": "For jaw clicking and grinding and for swallowing, with attention to the neck and the connected muscle chains.",
      "s.k4": "Diaphragm",
      "s.t4": "Breathing re-education",
      "s.d4": "The diaphragm is at the heart of the method: the work is on its movement and on diaphragmatic breathing.",
      "s.k5": "The whole chain",
      "s.t5": "Global postural rebalancing",
      "s.d5": "We look for the origins of pain and problems, then work on the tension of the muscle chains and on the diaphragm, with specific postures on Pancafit®.",
      "s.k6": "After an injury",
      "s.t6": "Post-traumatic rehabilitation",
      "s.d6": "When a point can't yet be moved or touched, the work goes through the muscle chains, at a distance, always following the doctor's instructions.",
      "s.k7": "Over time",
      "s.t7": "General functional re-education",
      "s.d7": "To recover movements lost after a long illness, a cast, a period of immobility or stiffness: first rebalancing the muscle chains, then proprioceptive re-education, so the regained movements last.",
      "s.nota": "No re-education replaces the doctor: after an injury or an operation, the work follows the doctor's instructions.",
      "me.titolo": "The method",
      "me.intro": "A global-approach postural rebalancing method, taught by the Posturalmed school.",
      "me.p1": "The method's equipment, “a device that acts on the neuro-muscular-fascial chains”: the blue benches in the photo.",
      "me.h2": "Global decompensated stretching",
      "me.p2": "All the muscle chains are worked in unison, including the respiratory chain, which is involved with every breath.",
      "me.h3": "The diaphragm",
      "me.p3": "Every strategy pays particular attention to the movement of the diaphragm, often tense and blocked.",
      "me.alt": "The two blue Pancafit benches in front of the mirror, and on the light-blue wall the anatomical charts of the spine, the skull and the brachial plexus",
      "me.cap": "The Pancafit® benches, the mirror and the anatomical charts in the studio.",
      "pe.titolo": "Training",
      "pe.1": "Personal Fitness Trainer certification (CFT3)",
      "pe.2": "Basic Technician in the Raggi Method® with Pancafit®",
      "pe.3": "Degree in Exercise and Sports Science",
      "pe.3n": "Thesis: “Global decompensated muscle stretching in volleyball: testing a possible increase in explosive strength”.",
      "pe.4": "Member of the Italian National Union of Kinesiologists (U.N.C.)",
      "pe.5": "Advanced Technician in the Raggi Method® with Pancafit®",
      "pe.5n": "Neck and vision · the tongue · shoulder, elbow, wrist and hand · the spine · foot and knee · scoliosis · mouth and jaw · disc herniation · the pelvis · the three diaphragms.",
      "pe.6": "Certificate in running Pancafit® Groups",
      "pe.alt": "The framed diplomas and certificates on the studio's light-blue wall",
      "pe.cap": "The diplomas, on the studio wall.",
      "r.kick": "Reviews",
      "r.titolo": "Who has been here",
      "r.voto": "from 43 Google reviews",
      "r.nota": "Public Google reviews, quoted as written; “[…]” marks where one was shortened. These are personal experiences: every programme is different. The translations are ours.",
      "st.titolo": "The studio",
      "st.app": "By appointment: call <a href=\"tel:+393426457603\">342 645 7603</a> or write to <a href=\"mailto:pasqualeporreca@gmail.com\">pasqualeporreca@gmail.com</a>.",
      "st.zona": "in Barona",
      "st.cap": "Studio hours",
      "st.lun": "Monday",
      "st.mar": "Tuesday",
      "st.mer": "Wednesday",
      "st.gio": "Thursday",
      "st.ven": "Friday",
      "st.sab": "Saturday",
      "st.dom": "Sunday",
      "st.chiuso": "closed",
      "st.tel": "Phone",
      "st.q1": "Accessible?",
      "st.a1": "Yes: the entrance and the parking are wheelchair accessible.",
      "st.q2": "Parking?",
      "st.a2": "Free, on the street too.",
      "st.q3": "Payments?",
      "st.a3": "Credit and debit cards, phone payments too.",
      "st.alt": "The studio seen from the entrance: light-blue walls, the diplomas, the desk with two chairs, the radiator and the wooden door",
      "st.fcap": "The studio, from the door.",
      "st.mappa": "Map: Studio Porreca, Via Don Primo Mazzolari 31, Milan",
      "z.motto": "Nothing should go unnoticed.",
      "z.cosa": "Kinesiology and postural re-education · Raggi Method® with Pancafit® · by appointment",
      "z.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · texts from their website, their social pages and the Google listing (September 2026); public reviews on Google; photos of the studio from their website and the Google listing; the symbol traced from their logo.",
      "z.su": "Back to the top ↑",
      "m.azioni": "Quick actions",
      "x.chiama": "Call",
      "x.mappa": "Map",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close"
    },
    /* MULTILINGUA (V4) — per i siti con più di due lingue, al posto di EN:
         LANGS: { en: {chiave:'...'}, ar: {chiave:'...'} }
       L'italiano resta SEMPRE la lingua del DOM e non ha dizionario.
       Se si valorizza EN e non LANGS, il comportamento è identico a prima. */
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],   // lingue che ribaltano dir=rtl
    /* etichette dello stato orari per lingua non-IT; l'IT è nel codice.
       Chiave mancante = fallback all'inglese, poi all'italiano. */
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */
  /* ══════════ FIRMA — il piombo che si ferma ══════════
     Stato finale nell'HTML: il piombo pende dritto (nessuna rotazione), il filo rosso tratteggiato scende intero dalla sua
     punta, le vertebre del collo ci sono, e ogni capitolo ha la sua linea di livello con la vertebra verde.
     Col movimento il JS rimette il piombo inclinato sotto l'intro e, finita l'intro, lo lascia oscillare come quando lo si
     appende: un pendolo smorzato, θ(t) = θ₀·e^(−t/τ)·cos(2πt/T) (reference: myPhysicsLab, «Simple Pendulum»), finché si
     ferma. Mentre l'ampiezza cala, dalla punta scende il filo tratteggiato e le vertebre del collo si accendono una alla volta.
     La rotazione si scrive nell'attributo `transform` dell'SVG (il CSSPlugin arrotonda: lezione di #212).
     Più giù, ogni capitolo che entra in vista accende la sua vertebra e traccia la linea di livello dal filo al titolo.
     Senza JS e con reduced-motion: tutto fermo e al suo posto, subito. */
  var pendolo = document.getElementById('pendolo');
  var tratto = document.getElementById('filoTratto');
  var collo = [].slice.call(document.querySelectorAll('.vertebra--collo'));
  var TH0 = 14, PERIODO = 1.5, TAU = 1.0, DURATA = 4.4;
  function angolo(t) { return TH0 * Math.exp(-t / TAU) * Math.cos(2 * Math.PI * t / PERIODO); }
  function ruota(a) {
    pendolo.setAttribute('transform', 'rotate(' + a.toFixed(3) + ' 30 0)');
    pendolo.setAttribute('data-angolo', a.toFixed(3));
  }
  if (hasGsap && !reducedMotion && pendolo && tratto) {
    var piomboSvg = pendolo.ownerSVGElement;
    ruota(TH0);
    gsap.set(tratto, { clipPath: 'inset(0% 0% 100% 0%)' });
    gsap.set(collo, { scale: 0 });
    piomboSvg.setAttribute('data-piombo', 'attesa');
    window.bespokeHeroEntrance = function () {
      piomboSvg.setAttribute('data-piombo', 'oscilla');
      var stato = { t: 0 };
      gsap.timeline({ onComplete: function () { ruota(0); piomboSvg.setAttribute('data-piombo', 'fermo'); } })
        .to(stato, { t: DURATA, duration: DURATA, ease: 'none', onUpdate: function () { ruota(angolo(stato.t)); } }, 0)
        .to(tratto, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power2.out' }, 2.3)
        .to(collo, { scale: 1, duration: 0.36, ease: 'back.out(2.4)', stagger: 0.15 }, 2.7);
    };
  }

  /* ══════════ i livelli: ogni capitolo accende la sua vertebra e traccia la linea dal filo al titolo ══════════ */
  var livelli = [].slice.call(document.querySelectorAll('.livello'));
  if (hasGsap && hasST && !reducedMotion) {
    livelli.forEach(function (lv) {
      var linea = lv.querySelector('.livello__linea'), vert = lv.querySelector('.livello__vertebra'), sq = lv.querySelector('.livello__squadra');
      if (!linea || !vert) return;
      gsap.set(linea, { scaleX: 0 });
      gsap.set(vert, { scale: 0 });
      if (sq) gsap.set(sq, { opacity: 0 });
      lv.setAttribute('data-livello', 'attesa');
      ScrollTrigger.create({
        trigger: lv, start: 'top 82%', once: true,
        onEnter: function () {
          lv.setAttribute('data-livello', 'in-corso');
          var tl = gsap.timeline({ onComplete: function () { lv.setAttribute('data-livello', 'fatto'); } });
          tl.to(vert, { scale: 1, duration: 0.42, ease: 'back.out(2.2)' }, 0)
            .to(linea, { scaleX: 1, duration: 0.62, ease: 'power2.out' }, 0.15);
          if (sq) tl.to(sq, { opacity: 0.7, duration: 0.3, ease: 'none' }, 0.62);
        },
      });
    });
  }

  /* ══════════ la testata segna il capitolo in vista (sulla copertina, nessuno) ══════════ */
  var navLinks = document.querySelectorAll('.capitoli-nav a[data-cap]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var perCap = {};
    [].forEach.call(navLinks, function (a) { perCap[a.getAttribute('data-cap')] = a; });
    var ioN = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var a = perCap[e.target.id] || null;
        [].forEach.call(navLinks, function (x) { x.removeAttribute('aria-current'); });
        if (a) a.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['filo'].concat(Object.keys(perCap)).forEach(function (id) { var s = document.getElementById(id); if (s) ioN.observe(s); });
  }

  /* lo stato degli orari anche in «Lo studio»: copia di quello della copertina (il plumbing ne scrive uno) */
  var st1 = document.getElementById('orarioStato'), st2 = document.getElementById('orarioStato2');
  if (st1 && st2) {
    var copiaStato = function () { st2.textContent = st1.textContent; };
    copiaStato();
    new MutationObserver(copiaStato).observe(st1, { childList: true, characterData: true, subtree: true });
  }
})();
