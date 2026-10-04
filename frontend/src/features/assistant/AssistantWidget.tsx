import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Bot, Headset, RotateCcw, Send, Sparkles, X } from 'lucide-react';
import {
  analyseDialogue,
  createSession,
  isKnowledgeGap,
  respond,
} from '@shared/assistant/engine';
import type {
  AssistantKnowledge,
  AssistantMessage,
  AssistantReply,
} from '@shared/assistant/types';
import { useI18n } from '@/i18n';
import { Button } from '@/ui';
import { lockPageScroll } from '@/ui/scrollLock';
import { api } from '@/services/api';
import { track } from '@/services/analytics';
import { getSessionId } from '@/services/analytics';
import { departments, doctors, services } from '@/content';
import { faq } from '@/content/faq';
import { assistantUiCopy as UI } from '@/content/pages/overlays';

/** Phones get the assistant as a full-height sheet (layout.css, same query). */
const SHEET_QUERY = '(max-width: 767px), (max-height: 500px) and (pointer: coarse)';
/**
 * The sheet drops its secondary rows while the keyboard is up (the visual
 * viewport is well shorter than the layout viewport) or the window is tiny.
 */
const isCompact = (viewport: VisualViewport) =>
  window.innerHeight - viewport.height > 120 || viewport.height < 320;

/**
 * Keeps the phone sheet glued to the *visual* viewport. When the on-screen
 * keyboard opens, iOS pans the visual viewport and Android shrinks it without
 * touching `100dvh`; following `visualViewport` (height + offsetTop, written as
 * CSS variables once per frame) keeps the header and the input in view with no
 * jump. The page underneath is locked so a swipe never scrolls it instead.
 */
const usePhoneSheet = (open: boolean, sheetRef: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const node = sheetRef.current;
    if (!open || !node || typeof window === 'undefined' || !window.matchMedia?.(SHEET_QUERY).matches) return;

    const unlock = lockPageScroll();

    const viewport = window.visualViewport;
    let frame = 0;
    const apply = () => {
      frame = 0;
      if (!viewport) return;
      node.style.setProperty('--oph-assistant-vh', `${Math.round(viewport.height)}px`);
      node.style.setProperty('--oph-assistant-top', `${Math.max(0, Math.round(viewport.offsetTop))}px`);
      node.toggleAttribute('data-compact', isCompact(viewport));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(apply);
    };
    apply();
    viewport?.addEventListener('resize', schedule);
    viewport?.addEventListener('scroll', schedule);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      viewport?.removeEventListener('resize', schedule);
      viewport?.removeEventListener('scroll', schedule);
      unlock();
    };
  }, [open, sheetRef]);
};

/** A rendered message may carry the booking link the reply offered. */
type ChatMessage = AssistantMessage & { action?: AssistantReply['action'] };

/**
 * OPHTRA assistant.
 *
 * Available 24/7. Answers FAQs, consults on services, recommends a service and
 * a doctor, collects preliminary symptoms, books/cancels/reschedules
 * appointments, explains notifications and transfers to an operator. Every
 * dialogue is analysed and unmatched questions are reported so the knowledge
 * base keeps improving.
 *
 * The reply comes from the API when it is reachable; otherwise the same shared
 * engine runs in the browser, so the assistant is never "offline".
 *
 * Service names («ОКТ», «катаракта», «LASIK», «детский офтальмолог»…) route
 * to that service: the reply carries an «Открыть запись» link with the service
 * prefilled, and «Да, продолжаем» opens it. Nothing navigates on its own.
 *
 * Figma fix: the floating «Помощник» overlapped cards and CTAs. The launcher
 * is a compact forest pill (icon-only on phones) that rises above the cookie
 * card while it is shown (--oph-consent-offset) and fades out over the footer.
 */
export const AssistantWidget = () => {
  const { t, L, language } = useI18n();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [input, setInput] = useState('');

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const repliesRef = useRef<AssistantReply[]>([]);
  const sessionRef = useRef(createSession(getSessionId(), language));

  /** Catalogue projection the shared engine works against. */
  const knowledge = useMemo<AssistantKnowledge>(
    () => ({
      faq: faq.map((item) => ({
        id: item.id,
        topic: item.topic,
        question: L(item.question),
        answer: L(item.answer),
      })),
      departments: departments.map((department) => ({
        id: department.id,
        slug: department.slug,
        name: L(department.name),
        short: L(department.short),
        keywords: [L(department.name), L(department.short)],
      })),
      services: services.map((service) => ({
        id: service.id,
        slug: service.slug,
        departmentId: service.departmentId,
        name: L(service.name),
        price: service.price,
      })),
      doctors: doctors.map((doctor) => ({
        id: doctor.id,
        slug: doctor.slug,
        name: L(doctor.name),
        role: L(doctor.role),
        departmentIds: doctor.departmentIds,
      })),
    }),
    [L],
  );

  useEffect(() => {
    sessionRef.current.language = language;
  }, [language]);

  usePhoneSheet(open, panelRef);

  // Move focus into the dialog (not the input: on phones that would pop the
  // keyboard over the greeting before the visitor has read it).
  useEffect(() => {
    if (open) panelRef.current?.focus({ preventScroll: true });
  }, [open]);

  const push = useCallback((message: Omit<ChatMessage, 'id' | 'at'>) => {
    setMessages((current) => [
      ...current,
      { ...message, id: `${Date.now()}-${current.length}`, at: new Date().toISOString() },
    ]);
  }, []);

  // Greet on first open.
  useEffect(() => {
    if (!open || messages.length > 0) return;
    push({ role: 'assistant', text: t.assistant.greeting, intent: 'greeting' });
    setSuggestions([
      t.assistant.quickSymptoms,
      t.assistant.quickService,
      t.assistant.quickDoctor,
      t.assistant.quickBooking,
      t.assistant.quickFaq,
    ]);
  }, [open, messages.length, push, t.assistant]);

  // Keep the newest message in view.
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, pending]);

  const applyReply = useCallback(
    (reply: AssistantReply) => {
      repliesRef.current.push(reply);
      push({
        role: 'assistant',
        text: reply.reply,
        intent: reply.intent,
        action: reply.action?.type === 'book' ? reply.action : undefined,
      });
      // The operator handoff has a permanent button in the footer; offering it
      // as a chip too would duplicate it in the same view.
      setSuggestions(reply.suggestions.filter((chip) => chip !== t.assistant.quickOperator));

      if (reply.handoff) {
        push({ role: 'system', text: t.assistant.operatorText });
        track('assistant_handoff', { intent: reply.intent });
      }

      if (isKnowledgeGap(reply)) {
        // Unmatched questions are reported so an editor can extend the FAQ —
        // this is the assistant's knowledge-base learning loop.
        track('assistant_knowledge_gap', { intent: reply.intent, confidence: reply.confidence });
      }
    },
    [push, t.assistant.operatorText, t.assistant.quickOperator],
  );

  /** Set on close; the launcher takes focus once it has re-mounted. */
  const restoreFocusRef = useRef(false);

  const close = useCallback(
    (restoreFocus = true) => {
      setClosing(true);
      // Report the dialogue for analysis before the widget unmounts. This is
      // best-effort telemetry: an unreachable API must not surface as an
      // unhandled rejection.
      if (repliesRef.current.length > 0) {
        try {
          const analysis = analyseDialogue(sessionRef.current, repliesRef.current);
          void Promise.resolve(
            api.assistantTranscript(sessionRef.current.id, {
              messages: [...messages, { analysis }],
              language,
            }),
          ).catch(() => undefined);
        } catch {
          /* analysis/reporting is best-effort */
        }
      }
      window.setTimeout(() => {
        restoreFocusRef.current = restoreFocus;
        setClosing(false);
        setOpen(false);
      }, 220);
    },
    [messages, language],
  );

  // Return focus to the launcher after it renders again (focusing in the same
  // tick as setOpen(false) hit a button that did not exist yet).
  useEffect(() => {
    if (open || !restoreFocusRef.current) return;
    restoreFocusRef.current = false;
    launcherRef.current?.focus();
  }, [open]);

  /** Opens a route the visitor asked for and gets the panel out of the way. */
  const follow = useCallback(
    (target: string) => {
      navigate(target);
      // The visitor is going somewhere else: leave focus to the new page.
      close(false);
    },
    [navigate, close],
  );

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || pending) return;

      push({ role: 'user', text });
      setInput('');
      setSuggestions([]);
      setPending(true);

      let reply: AssistantReply;
      try {
        const remote = await api.assistant({
          message: text,
          language,
          sessionId: sessionRef.current.id,
        });
        reply = {
          ...remote,
          intent: remote.intent as AssistantReply['intent'],
          confidence: 1,
          entities: remote.entities ?? {},
        };
      } catch {
        // API unavailable — run the identical engine locally.
        reply = respond({ message: text, session: sessionRef.current, knowledge });
      }
      applyReply(reply);
      setPending(false);

      // Only an explicit «да» to a booking offer navigates; recommendations
      // show a link instead of whisking the visitor away mid-conversation.
      if (reply.action?.type === 'navigate') {
        const target = reply.action.target;
        window.setTimeout(() => follow(target), 700);
      } else {
        inputRef.current?.focus();
      }
    },
    [pending, push, language, applyReply, knowledge, follow],
  );

  const reset = useCallback(() => {
    sessionRef.current = createSession(`${getSessionId()}-${Date.now()}`, language);
    repliesRef.current = [];
    setMessages([]);
    setSuggestions([]);
  }, [language]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, close]);

  if (!open) {
    return (
      <button
        ref={launcherRef}
        type="button"
        className="oph-assistant-launcher"
        onClick={() => {
          setOpen(true);
          track('assistant_opened');
        }}
        aria-label={t.assistant.title}
      >
        <span className="oph-assistant-launcher__pulse" aria-hidden="true" />
        <span className="oph-assistant-launcher__icon" aria-hidden="true">
          <Sparkles size={17} />
        </span>
        <span className="oph-assistant-launcher__label">{t.assistant.launcher}</span>
      </button>
    );
  }

  return (
    <section
      ref={panelRef}
      tabIndex={-1}
      className="oph-assistant"
      data-closing={closing || undefined}
      role="dialog"
      aria-label={t.assistant.title}
    >
      <header className="oph-assistant__header">
        <span className="oph-assistant__avatar" aria-hidden="true">
          <Bot size={20} />
        </span>
        <div className="oph-assistant__who">
          <h2 className="oph-assistant__name">{t.assistant.title}</h2>
          <p className="oph-assistant__sub">
            <span className="oph-assistant__online" aria-hidden="true" />
            <span>{t.assistant.online}</span>
            <span aria-hidden="true">·</span>
            <span>{t.assistant.subtitle}</span>
          </p>
        </div>
        <button type="button" className="oph-assistant__icon" onClick={reset} aria-label={t.assistant.reset}>
          <RotateCcw size={15} aria-hidden="true" />
        </button>
        <button type="button" className="oph-assistant__icon" onClick={() => close()} aria-label={t.common.close}>
          <X size={16} aria-hidden="true" />
        </button>
      </header>

      <div className="oph-assistant__body" ref={bodyRef} aria-live="polite">
        {messages.map((message) => (
          <div key={message.id} className={`oph-msg oph-msg--${message.role === 'assistant' ? 'bot' : message.role}`}>
            <div className="oph-msg__bubble">
              {message.text}
              {message.action ? (
                <>
                  <br />
                  <Link
                    className="oph-msg__action"
                    to={message.action.target}
                    onClick={(event) => {
                      event.preventDefault();
                      track('assistant_booking_link', { target: message.action!.target });
                      follow(message.action!.target);
                    }}
                  >
                    {L(UI.openBooking)}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        ))}

        {pending ? (
          <div className="oph-msg oph-msg--bot">
            <div className="oph-msg__bubble">
              <span className="oph-visually-hidden">{t.assistant.typing}</span>
              <span className="oph-typing" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </div>
          </div>
        ) : null}

        <p className="oph-assistant__disclaimer">{t.assistant.disclaimer}</p>
      </div>

      <div className="oph-assistant__footer">
        {suggestions.length > 0 ? (
          <div className="oph-assistant__chips">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="oph-assistant__chip"
                onClick={() => void send(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : null}

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void send(input);
          }}
          className="oph-assistant__form"
        >
          <input
            ref={inputRef}
            className="oph-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t.assistant.placeholder}
            aria-label={t.assistant.placeholder}
            autoComplete="off"
            enterKeyHint="send"
          />
          <Button
            type="submit"
            iconOnly
            className="oph-assistant__send"
            aria-label={t.assistant.send}
            aria-disabled={!input.trim() || pending}
          >
            <Send size={18} aria-hidden="true" />
          </Button>
        </form>

        <button
          type="button"
          className="oph-assistant__chip oph-assistant__operator"
          onClick={() => void send(t.assistant.quickOperator)}
        >
          <Headset size={14} aria-hidden="true" />
          {t.assistant.quickOperator}
        </button>
      </div>
    </section>
  );
};
