import { useState } from 'react';
import { AreaField, CheckField, FormSuccess, SubmitButton, TextField, checked, phoneRule, req, requestNo, useForm } from './forms';

/** Short "call me back" request used on service and contact pages. */
export function ContactForm({ context, submitLabel = 'Отправить заявку' }: { context?: string; submitLabel?: string }) {
  const [no, setNo] = useState('');
  const f = useForm(
    { name: '', phone: '', comment: context ? `Интересует: ${context}` : '', consent: '' },
    { name: req('Как к вам обращаться?'), phone: phoneRule, consent: checked('Без согласия мы не можем связаться с вами') },
  );
  if (f.status === 'done')
    return (
      <div className="glass">
        <FormSuccess
          title="Заявка принята"
          text="Координатор перезвонит в рабочее время, ответит на вопросы и подберёт удобное время приёма."
          number={no}
          onReset={() => {
            f.reset();
            setNo('');
          }}
        />
      </div>
    );
  return (
    <form className="form glass form-card" noValidate onSubmit={f.submit(() => setNo(requestNo()))}>
      <div className="form__row">
        <TextField f={f.bind('name')} label="Имя" autoComplete="name" />
        <TextField f={f.bind('phone')} label="Телефон или WhatsApp" type="tel" inputMode="tel" autoComplete="tel" placeholder="+7" />
      </div>
      <AreaField f={f.bind('comment')} label="Комментарий" optional />
      <CheckField f={f.bind('consent')}>Я согласен на обработку персональных данных</CheckField>
      <div className="row">
        <SubmitButton pending={f.status === 'pending'}>{submitLabel}</SubmitButton>
        <span className="small muted">Концепт: данные никуда не отправляются.</span>
      </div>
    </form>
  );
}
