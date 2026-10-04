import { useMemo, useState, type FormEvent } from 'react';
import { ArrowDown, ArrowUp, ExternalLink, FilePlus2, Pencil, Plus, Save, Search, Trash2, X } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Button, EmptyState, Input, Select, Textarea } from '@/ui';
import { doctors } from '@/content';
import { knowledgeArticles, authorById } from '@/content/pages/knowledge-data';
import { FOUNDER_ID } from '@/content/pages/knowledge';
import type { KnowledgeCategory } from '@/content/pages/knowledge-types';
import { adminCopy as C, knowledgeCategoryLabels } from '@/content/pages/platform';
import {
  SLUG_PATTERN,
  seedPages,
  slugify,
  uid,
  usePersisted,
  type CmsArticle,
  type CmsPage,
  type CmsSection,
  type PublishStatus,
} from './store';
import { AdminPanel, StatusPill, type Sync } from './ui';

const CATEGORIES = Object.keys(knowledgeCategoryLabels) as KnowledgeCategory[];

const useStatusLabel = () => {
  const { L } = useI18n();
  return (status: PublishStatus) => (
    <StatusPill tone={status === 'published' ? 'ok' : 'muted'}>{L(status === 'published' ? C.published : C.draft)}</StatusPill>
  );
};

/* ============================================================== SECTIONS */

const SectionsEditor = ({ sections, onChange }: { sections: CmsSection[]; onChange: (next: CmsSection[]) => void }) => {
  const { L } = useI18n();
  const move = (index: number, delta: number) => {
    const next = [...sections];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    onChange(next);
  };
  const patch = (id: string, change: Partial<CmsSection>) =>
    onChange(sections.map((entry) => (entry.id === id ? { ...entry, ...change } : entry)));

  return (
    <fieldset className="oph-aeditor__sections">
      <legend className="oph-field__label">{L(C.sections)}</legend>
      <ol>
        {sections.map((entry, index) => (
          <li key={entry.id} className="oph-aeditor__section">
            <span className="oph-aeditor__n" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="oph-aeditor__fields">
              <Input
                label={`${L(C.sectionHeading)} ${index + 1}`}
                value={entry.heading}
                onChange={(event) => patch(entry.id, { heading: event.target.value })}
              />
              <Textarea
                label={`${L(C.sectionBody)} ${index + 1}`}
                rows={3}
                value={entry.body}
                onChange={(event) => patch(entry.id, { body: event.target.value })}
              />
            </div>
            <div className="oph-aeditor__tools">
              <Button variant="ghost" size="sm" iconOnly aria-label={`${L(C.moveUp)}: ${index + 1}`} disabled={index === 0} onClick={() => move(index, -1)}>
                <ArrowUp size={15} aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                aria-label={`${L(C.moveDown)}: ${index + 1}`}
                disabled={index === sections.length - 1}
                onClick={() => move(index, 1)}
              >
                <ArrowDown size={15} aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                aria-label={`${L(C.removeSection)}: ${index + 1}`}
                onClick={() => onChange(sections.filter((item) => item.id !== entry.id))}
              >
                <Trash2 size={15} aria-hidden="true" />
              </Button>
            </div>
          </li>
        ))}
      </ol>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange([...sections, { id: uid('sec'), heading: '', body: '' }])}
      >
        <Plus size={15} aria-hidden="true" />
        {L(C.addSection)}
      </Button>
    </fieldset>
  );
};

/* ================================================================= PAGES */

const emptyPage = (): CmsPage => ({
  id: uid('page'),
  title: '',
  slug: '',
  description: '',
  status: 'draft',
  sections: [{ id: uid('sec'), heading: '', body: '' }],
  updatedAt: new Date().toISOString(),
});

export const PagesManager = ({ sync }: { sync: Sync }) => {
  const { L, formatDate } = useI18n();
  const statusLabel = useStatusLabel();
  const [pages, setPages] = usePersisted<CmsPage[]>('pages', seedPages);
  const [draft, setDraft] = useState<CmsPage | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const open = (page: CmsPage | null) => {
    setIsNew(!page);
    setDraft(page ? structuredClone(page) : emptyPage());
    setSlugTouched(Boolean(page));
    setErrors({});
  };

  const validate = (page: CmsPage) => {
    const next: Record<string, string> = {};
    if (!page.title.trim()) next.title = L(C.required);
    const isHome = page.id === 'home';
    if (!isHome && !page.slug) next.slug = L(C.required);
    else if (!isHome && !SLUG_PATTERN.test(page.slug)) next.slug = L(C.slugInvalid);
    else if (pages.some((other) => other.id !== page.id && other.slug === page.slug)) next.slug = L(C.slugTaken);
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft || saving || !validate(draft)) return;
    setSaving(true);
    const saved = { ...draft, title: draft.title.trim(), updatedAt: new Date().toISOString() };
    setPages((current) => (isNew ? [saved, ...current] : current.map((p) => (p.id === saved.id ? saved : p))));
    await sync('pages', saved.id, saved as unknown as Record<string, unknown>, { create: isNew });
    setSaving(false);
    setDraft(null);
  };

  const toggleStatus = (page: CmsPage) => {
    const status: PublishStatus = page.status === 'published' ? 'draft' : 'published';
    setPages((current) => current.map((p) => (p.id === page.id ? { ...p, status, updatedAt: new Date().toISOString() } : p)));
    void sync('pages', page.id, { status });
  };

  const remove = (page: CmsPage) => {
    if (!window.confirm(`${L(C.confirmDelete)}\n${page.title}`)) return;
    setPages((current) => current.filter((p) => p.id !== page.id));
    void sync('pages', page.id, {}, { remove: true });
  };

  if (draft) {
    return (
      <AdminPanel
        title={isNew ? L(C.newPage) : `${L(C.edit)}: ${draft.title || '—'}`}
        actions={
          <Button variant="ghost" size="sm" onClick={() => setDraft(null)}>
            <X size={15} aria-hidden="true" />
            {L(C.cancel)}
          </Button>
        }
      >
        <form className="oph-aeditor" onSubmit={save} noValidate>
          <div className="oph-aeditor__grid">
            <Input
              label={L(C.title)}
              required
              value={draft.title}
              error={errors.title}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  title: event.target.value,
                  slug: slugTouched || draft.id === 'home' ? draft.slug : slugify(event.target.value),
                })
              }
            />
            <Input
              label={L(C.slug)}
              hint={`/${draft.slug} · ${L(C.slugHint)}`}
              value={draft.slug}
              disabled={draft.id === 'home'}
              error={errors.slug}
              spellCheck={false}
              onChange={(event) => {
                setSlugTouched(true);
                setDraft({ ...draft, slug: event.target.value.toLowerCase() });
              }}
            />
          </div>
          <Textarea
            label={L(C.description)}
            rows={2}
            maxLength={200}
            hint={`${draft.description.length} / 160`}
            value={draft.description}
            onChange={(event) => setDraft({ ...draft, description: event.target.value })}
          />
          <Select
            label={L(C.status)}
            value={draft.status}
            options={[
              { value: 'draft', label: L(C.draft) },
              { value: 'published', label: L(C.published) },
            ]}
            onChange={(event) => setDraft({ ...draft, status: event.target.value as PublishStatus })}
          />
          <SectionsEditor sections={draft.sections} onChange={(sections) => setDraft({ ...draft, sections })} />
          <div className="oph-aeditor__footer">
            <Button type="submit" loading={saving}>
              <Save size={16} aria-hidden="true" />
              {isNew ? L(C.create) : L(C.save)}
            </Button>
          </div>
        </form>
      </AdminPanel>
    );
  }

  return (
    <AdminPanel
      title={L(C.pagesTitle)}
      lead={L(C.pagesLead)}
      actions={
        <Button size="sm" onClick={() => open(null)}>
          <FilePlus2 size={15} aria-hidden="true" />
          {L(C.newPage)}
        </Button>
      }
    >
      {pages.length === 0 ? (
        <EmptyState title={L(C.noPages)} />
      ) : (
        <div className="oph-rtable-wrap">
          <table className="oph-table oph-rtable">
            <caption className="oph-visually-hidden">{L(C.pagesLead)}</caption>
            <thead>
              <tr>
                <th scope="col">{L(C.title)}</th>
                <th scope="col">{L(C.status)}</th>
                <th scope="col">{L(C.updated)}</th>
                <th scope="col" style={{ textAlign: 'right' }}>
                  {L(C.actions)}
                </th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id}>
                  <td>
                    <span className="oph-table__name">{page.title}</span>
                    <span className="oph-atable__sub">
                      /{page.slug} · {page.sections.length} {L(C.sectionsShort)}
                    </span>
                  </td>
                  <td data-label={L(C.status)}>{statusLabel(page.status)}</td>
                  <td className="oph-atable__muted" data-label={L(C.updated)}>
                    {formatDate(page.updatedAt, { day: 'numeric', month: 'short' })}
                  </td>
                  <td data-cell="actions">
                    <div className="oph-atable__actions">
                      <Button variant="ghost" size="sm" onClick={() => open(page)}>
                        <Pencil size={14} aria-hidden="true" />
                        {L(C.edit)}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleStatus(page)}>
                        {page.status === 'published' ? L(C.unpublish) : L(C.publish)}
                      </Button>
                      {page.status === 'published' ? (
                        <a className="oph-atable__icon" href={`/${page.slug}`} target="_blank" rel="noopener noreferrer" aria-label={`/${page.slug}`}>
                          <ExternalLink size={14} aria-hidden="true" />
                        </a>
                      ) : null}
                      {page.id !== 'home' ? (
                        <Button variant="ghost" size="sm" iconOnly aria-label={`${L(C.delete)}: ${page.title}`} onClick={() => remove(page)}>
                          <Trash2 size={14} aria-hidden="true" />
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminPanel>
  );
};

/* ============================================================== ARTICLES */

const seedArticles = (): CmsArticle[] =>
  knowledgeArticles.map((article) => ({
    id: article.id,
    title: article.title.ru,
    slug: article.slug,
    excerpt: article.excerpt.ru,
    body: article.sections.map((s) => `## ${s.title.ru}\n\n${s.body.ru.join('\n\n')}`).join('\n\n'),
    category: article.category,
    tags: [...article.tags],
    authorId: article.authorId,
    status: 'published',
    date: article.date,
    updatedAt: `${article.date}T09:00:00.000Z`,
  }));

const emptyArticle = (): CmsArticle => ({
  id: uid('art'),
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  category: 'prevention',
  tags: [],
  authorId: '',
  status: 'draft',
  date: new Date().toISOString().slice(0, 10),
  updatedAt: new Date().toISOString(),
});

export const ArticlesManager = ({ sync }: { sync: Sync }) => {
  const { L, formatDate } = useI18n();
  const statusLabel = useStatusLabel();
  const [articles, setArticles] = usePersisted<CmsArticle[]>('articles', seedArticles);
  const [draft, setDraft] = useState<CmsArticle | null>(null);
  const [tagsText, setTagsText] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  const authorOptions = useMemo(
    () => [
      { value: '', label: '—' },
      ...[FOUNDER_ID, ...doctors.map((doctor) => doctor.id)].map((id) => ({
        value: id,
        label: authorById(id) ? L(authorById(id)!.name) : id,
      })),
    ],
    [L],
  );
  const authorName = (id: string) => (authorById(id) ? L(authorById(id)!.name) : '—');

  const filtered = articles.filter(
    (article) =>
      (!category || article.category === category) &&
      (!status || article.status === status) &&
      (!query.trim() || `${article.title} ${article.tags.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase())),
  );

  const open = (article: CmsArticle | null) => {
    const next = article ? structuredClone(article) : emptyArticle();
    setIsNew(!article);
    setDraft(next);
    setTagsText(next.tags.join(', '));
    setSlugTouched(Boolean(article));
    setErrors({});
  };

  const validate = (article: CmsArticle) => {
    const next: Record<string, string> = {};
    if (!article.title.trim()) next.title = L(C.required);
    if (!article.slug) next.slug = L(C.required);
    else if (!SLUG_PATTERN.test(article.slug)) next.slug = L(C.slugInvalid);
    else if (articles.some((other) => other.id !== article.id && other.slug === article.slug)) next.slug = L(C.slugTaken);
    if (article.status === 'published' && !article.authorId) next.authorId = L(C.authorRequired);
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft || saving) return;
    const saved: CmsArticle = {
      ...draft,
      title: draft.title.trim(),
      tags: tagsText
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
      updatedAt: new Date().toISOString(),
    };
    if (!validate(saved)) return;
    setSaving(true);
    setArticles((current) => (isNew ? [saved, ...current] : current.map((a) => (a.id === saved.id ? saved : a))));
    await sync('articles', saved.id, saved as unknown as Record<string, unknown>, { create: isNew });
    setSaving(false);
    setDraft(null);
  };

  const toggleStatus = (article: CmsArticle) => {
    if (article.status === 'draft' && !article.authorId) {
      open(article);
      setErrors({ authorId: L(C.authorRequired) });
      return;
    }
    const next: PublishStatus = article.status === 'published' ? 'draft' : 'published';
    setArticles((current) => current.map((a) => (a.id === article.id ? { ...a, status: next, updatedAt: new Date().toISOString() } : a)));
    void sync('articles', article.id, { status: next });
  };

  const remove = (article: CmsArticle) => {
    if (!window.confirm(`${L(C.confirmDelete)}\n${article.title}`)) return;
    setArticles((current) => current.filter((a) => a.id !== article.id));
    void sync('articles', article.id, {}, { remove: true });
  };

  if (draft) {
    return (
      <AdminPanel
        title={isNew ? L(C.newArticle) : `${L(C.edit)}: ${draft.title || '—'}`}
        actions={
          <Button variant="ghost" size="sm" onClick={() => setDraft(null)}>
            <X size={15} aria-hidden="true" />
            {L(C.cancel)}
          </Button>
        }
      >
        <form className="oph-aeditor" onSubmit={save} noValidate>
          <Input
            label={L(C.title)}
            required
            value={draft.title}
            error={errors.title}
            onChange={(event) =>
              setDraft({ ...draft, title: event.target.value, slug: slugTouched ? draft.slug : slugify(event.target.value) })
            }
          />
          <div className="oph-aeditor__grid">
            <Input
              label={L(C.slug)}
              hint={`/knowledge-base/${draft.slug}`}
              value={draft.slug}
              error={errors.slug}
              spellCheck={false}
              onChange={(event) => {
                setSlugTouched(true);
                setDraft({ ...draft, slug: event.target.value.toLowerCase() });
              }}
            />
            <Select
              label={L(C.category)}
              value={draft.category}
              options={CATEGORIES.map((id) => ({ value: id, label: L(knowledgeCategoryLabels[id]) }))}
              onChange={(event) => setDraft({ ...draft, category: event.target.value as KnowledgeCategory })}
            />
            <Select
              label={L(C.author)}
              value={draft.authorId}
              error={errors.authorId}
              options={authorOptions}
              onChange={(event) => setDraft({ ...draft, authorId: event.target.value })}
            />
            <Input label={L(C.tags)} hint={L(C.tagsHint)} value={tagsText} onChange={(event) => setTagsText(event.target.value)} />
          </div>
          <Textarea label={L(C.excerpt)} rows={2} value={draft.excerpt} onChange={(event) => setDraft({ ...draft, excerpt: event.target.value })} />
          <Textarea label={L(C.body)} rows={10} value={draft.body} onChange={(event) => setDraft({ ...draft, body: event.target.value })} />
          <Select
            label={L(C.status)}
            value={draft.status}
            options={[
              { value: 'draft', label: L(C.draft) },
              { value: 'published', label: L(C.published) },
            ]}
            onChange={(event) => setDraft({ ...draft, status: event.target.value as PublishStatus })}
          />
          <div className="oph-aeditor__footer">
            <Button type="submit" loading={saving}>
              <Save size={16} aria-hidden="true" />
              {isNew ? L(C.create) : L(C.save)}
            </Button>
          </div>
        </form>
      </AdminPanel>
    );
  }

  return (
    <AdminPanel
      title={L(C.articlesTitle)}
      lead={L(C.articlesLead)}
      actions={
        <Button size="sm" onClick={() => open(null)}>
          <FilePlus2 size={15} aria-hidden="true" />
          {L(C.newArticle)}
        </Button>
      }
    >
      <div className="oph-afilters">
        <Input
          label={L(C.search)}
          type="search"
          value={query}
          icon={<Search size={16} aria-hidden="true" />}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Select
          label={L(C.category)}
          value={category}
          options={[{ value: '', label: L(C.allCategories) }, ...CATEGORIES.map((id) => ({ value: id, label: L(knowledgeCategoryLabels[id]) }))]}
          onChange={(event) => setCategory(event.target.value)}
        />
        <Select
          label={L(C.status)}
          value={status}
          options={[
            { value: '', label: L(C.allStatuses) },
            { value: 'published', label: L(C.published) },
            { value: 'draft', label: L(C.draft) },
          ]}
          onChange={(event) => setStatus(event.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={L(C.noArticles)} />
      ) : (
        <div className="oph-rtable-wrap">
          <table className="oph-table oph-rtable">
            <caption className="oph-visually-hidden">{L(C.articlesLead)}</caption>
            <thead>
              <tr>
                <th scope="col">{L(C.title)}</th>
                <th scope="col">{L(C.category)}</th>
                <th scope="col">{L(C.author)}</th>
                <th scope="col">{L(C.status)}</th>
                <th scope="col" style={{ textAlign: 'right' }}>
                  {L(C.actions)}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((article) => (
                <tr key={article.id}>
                  <td>
                    <span className="oph-table__name">{article.title}</span>
                    <span className="oph-atable__sub">
                      {formatDate(article.date, { day: 'numeric', month: 'short', year: 'numeric' })}
                      {article.tags.length ? ` · #${article.tags.slice(0, 3).join(' #')}` : ''}
                    </span>
                  </td>
                  <td data-label={L(C.category)}>
                    <span className="oph-eyebrow">{L(knowledgeCategoryLabels[article.category])}</span>
                  </td>
                  <td className="oph-atable__muted" data-label={L(C.author)}>
                    {authorName(article.authorId)}
                  </td>
                  <td data-label={L(C.status)}>{statusLabel(article.status)}</td>
                  <td data-cell="actions">
                    <div className="oph-atable__actions">
                      <Button variant="ghost" size="sm" onClick={() => open(article)}>
                        <Pencil size={14} aria-hidden="true" />
                        {L(C.edit)}
                      </Button>
                      <Button variant={article.status === 'published' ? 'ghost' : 'primary'} size="sm" onClick={() => toggleStatus(article)}>
                        {article.status === 'published' ? L(C.unpublish) : L(C.publish)}
                      </Button>
                      <Button variant="ghost" size="sm" iconOnly aria-label={`${L(C.delete)}: ${article.title}`} onClick={() => remove(article)}>
                        <Trash2 size={14} aria-hidden="true" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminPanel>
  );
};
