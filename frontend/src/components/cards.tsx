import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Star, Tag } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Badge, Card, CardFooter, CardMedia, CardText, CardTitle, Illustration } from '@/ui';
import type { IllustrationName } from '@/ui';
import { Reveal } from '@/motion';
import { DoctorPortrait } from '@/services/images';
import { DemoTag } from '@/components/people';
import { ROUTES } from '@/app/navigation';
import type { Department, Doctor, NewsItem, Program, Promotion, Review, Service } from '@/types';

/* ============================================================== DEPARTMENT */

export const DepartmentCard = ({ department, to }: { department: Department; to: string }) => {
  const { L, t } = useI18n();
  return (
    <Reveal variant="up">
      <Card interactive to={to} className="oph-card--tint">
        <Illustration name={department.illustration as IllustrationName} size={120} />
        <div style={{ marginTop: 'var(--oph-space-5)', display: 'grid', gap: 'var(--oph-space-3)' }}>
          <CardTitle>{L(department.name)}</CardTitle>
          <CardText>{L(department.short)}</CardText>
        </div>
        <CardFooter>
          <span className="oph-link">
            {t.common.more}
            <ArrowRight size={16} aria-hidden="true" />
          </span>
        </CardFooter>
      </Card>
    </Reveal>
  );
};

/* ================================================================== DOCTOR */

export const DoctorCard = ({ doctor }: { doctor: Doctor }) => {
  const { L, t } = useI18n();
  return (
    <Reveal variant="up">
      <Card interactive to={`${ROUTES.doctors}/${doctor.slug}`}>
        <CardMedia ratio="3 / 4">
          <DoctorPortrait photo={doctor.photo} seed={doctor.id} label={L(doctor.name)} />
        </CardMedia>
        <div style={{ display: 'grid', gap: 'var(--oph-space-2)' }}>
          <CardTitle>{L(doctor.name)}</CardTitle>
          <DemoTag />
          <CardText className="oph-card__text--clamp">{L(doctor.role)}</CardText>
        </div>
        <CardFooter>
          <Badge tone="outline">
            {t.common.experience} {doctor.experience} {t.common.years}
          </Badge>
          <ArrowRight size={17} aria-hidden="true" color="var(--oph-primary)" />
        </CardFooter>
      </Card>
    </Reveal>
  );
};

/* ================================================================= SERVICE */

export const ServiceCard = ({ service }: { service: Service }) => {
  const { L, t, formatPrice } = useI18n();
  return (
    <Reveal variant="up">
      <Card interactive>
        <div style={{ display: 'grid', gap: 'var(--oph-space-3)' }}>
          <CardTitle>{L(service.name)}</CardTitle>
          <CardText>{L(service.short)}</CardText>
        </div>
        <CardFooter>
          <span style={{ display: 'grid', gap: 4 }}>
            <strong style={{ fontSize: 'var(--oph-text-lg)', letterSpacing: '-0.02em' }}>
              {t.common.from} {formatPrice(service.price)}
            </strong>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: 'var(--oph-muted)',
                fontSize: 'var(--oph-text-xs)',
              }}
            >
              <Clock size={13} aria-hidden="true" />
              {service.duration} {t.common.minutes}
            </span>
          </span>
          <Link className="oph-link" to={`${ROUTES.appointment}?service=${service.slug}`}>
            {t.common.book}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </CardFooter>
      </Card>
    </Reveal>
  );
};

/* ================================================================= PROGRAM */

export const ProgramCard = ({ program }: { program: Program }) => {
  const { L, t, language, formatPrice } = useI18n();
  const includes = program.includes[language] ?? program.includes.ru ?? [];

  return (
    <Reveal variant="up">
      <Card interactive>
        <div style={{ display: 'grid', gap: 'var(--oph-space-3)' }}>
          <Badge>{formatPrice(program.price)}</Badge>
          <CardTitle>{L(program.name)}</CardTitle>
          <CardText>{L(program.short)}</CardText>
        </div>

        <ul
          style={{
            display: 'grid',
            gap: 'var(--oph-space-2)',
            margin: 'var(--oph-space-6) 0 0',
            color: 'var(--oph-ink-soft)',
            fontSize: 'var(--oph-text-sm)',
          }}
        >
          {includes.map((item) => (
            <li key={item} style={{ position: 'relative', paddingLeft: 22 }}>
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '0.55em',
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: 'var(--oph-accent)',
                }}
              />
              {item}
            </li>
          ))}
        </ul>

        <CardFooter>
          <span style={{ color: 'var(--oph-muted)', fontSize: 'var(--oph-text-xs)' }}>
            {L(program.duration)}
          </span>
          <Link className="oph-link" to={`${ROUTES.appointment}?program=${program.slug}`}>
            {t.common.book}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </CardFooter>
      </Card>
    </Reveal>
  );
};

/* =============================================================== PROMOTION */

export const PromotionCard = ({ promotion }: { promotion: Promotion }) => {
  const { L, t, formatDate } = useI18n();
  return (
    <Reveal variant="up">
      <Card interactive tone="tint">
        <div style={{ display: 'grid', gap: 'var(--oph-space-3)' }}>
          <Badge tone="solid">
            <Tag size={12} aria-hidden="true" />
            −{promotion.discount}%
          </Badge>
          <CardTitle>{L(promotion.title)}</CardTitle>
          <CardText>{L(promotion.short)}</CardText>
        </div>
        <CardFooter>
          <span style={{ color: 'var(--oph-muted)', fontSize: 'var(--oph-text-xs)' }}>
            {formatDate(promotion.validFrom, { day: 'numeric', month: 'short' })} —{' '}
            {formatDate(promotion.validTo, { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <Link className="oph-link" to={`${ROUTES.appointment}?promo=${promotion.slug}`}>
            {t.common.book}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </CardFooter>
      </Card>
    </Reveal>
  );
};

/* ==================================================================== NEWS */

export const NewsCard = ({ item, basePath }: { item: NewsItem; basePath: string }) => {
  const { L, t, formatDate } = useI18n();
  return (
    <Reveal variant="up">
      <Card interactive to={`${basePath}/${item.slug}`}>
        <div style={{ display: 'grid', gap: 'var(--oph-space-3)' }}>
          <div className="oph-row" style={{ justifyContent: 'space-between' }}>
            <Badge tone="outline">{L(item.category)}</Badge>
            <time
              dateTime={item.date}
              style={{ color: 'var(--oph-muted)', fontSize: 'var(--oph-text-xs)' }}
            >
              {formatDate(item.date)}
            </time>
          </div>
          <CardTitle>{L(item.title)}</CardTitle>
          <CardText>{L(item.excerpt)}</CardText>
        </div>
        <CardFooter>
          <span className="oph-link">
            {t.common.readMore}
            <ArrowRight size={15} aria-hidden="true" />
          </span>
        </CardFooter>
      </Card>
    </Reveal>
  );
};

/* ================================================================== REVIEW */

export const ReviewCard = ({
  review,
  doctorName,
  serviceName,
}: {
  review: Review;
  doctorName?: string;
  serviceName?: string;
}) => {
  const { L, formatDate } = useI18n();
  return (
    <Reveal variant="up">
      <Card>
        <div
          className="oph-row"
          style={{ justifyContent: 'space-between', marginBottom: 'var(--oph-space-4)' }}
        >
          <span role="img" aria-label={`${review.rating} / 5`} style={{ display: 'inline-flex', gap: 3 }}>
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                size={15}
                aria-hidden="true"
                fill={index < review.rating ? 'var(--oph-accent)' : 'none'}
                color={index < review.rating ? 'var(--oph-accent)' : 'var(--oph-line-strong)'}
              />
            ))}
          </span>
          <time
            dateTime={review.date}
            style={{ color: 'var(--oph-muted)', fontSize: 'var(--oph-text-xs)' }}
          >
            {formatDate(review.date)}
          </time>
        </div>

        <blockquote
          style={{
            margin: 0,
            color: 'var(--oph-ink-soft)',
            fontSize: 'var(--oph-text-md)',
            lineHeight: 'var(--oph-leading-relaxed)',
          }}
        >
          {L(review.text)}
        </blockquote>

        <CardFooter>
          <span style={{ display: 'grid', gap: 3 }}>
            <strong style={{ fontSize: 'var(--oph-text-sm)' }}>{L(review.author)}</strong>
            <span style={{ color: 'var(--oph-muted)', fontSize: 'var(--oph-text-xs)' }}>
              {[serviceName, doctorName].filter(Boolean).join(' · ')}
            </span>
          </span>
        </CardFooter>
      </Card>
    </Reveal>
  );
};
