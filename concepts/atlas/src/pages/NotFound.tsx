import { useLocation } from 'react-router-dom';
import { Chapter } from '../components/Chapter';
import { Page } from '../components/Shell';
import { BtnLink, Eyebrow, R, SplitTitle } from '../components/ui';

export default function NotFound() {
  const { pathname } = useLocation();
  return (
    <Page title="404 — вне карты">
      <Chapter shot="lost" size="sm" align="center">
        <div className="col col--center col--wide">
          <Eyebrow>Ошибка 404 · сигнал потерян</Eyebrow>
          <SplitTitle as="h1" className="display" text="Этой точки *нет на карте*" />
          <R d={250}>
            <p className="lead" style={{ margin: '26px auto 30px' }}>
              Адрес <span className="mono gold">{pathname}</span> ведёт в открытый космос. Вернёмся на орбиту — оттуда видно все маршруты.
            </p>
            <div className="actions" style={{ justifyContent: 'center' }}>
              <BtnLink to="/">Вернуться на орбиту</BtnLink>
              <BtnLink to="/booking" ghost>
                Записаться
              </BtnLink>
            </div>
          </R>
        </div>
      </Chapter>
    </Page>
  );
}
