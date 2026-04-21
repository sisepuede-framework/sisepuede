import React, {useState} from 'react';

type Choice = {text: string; correct?: boolean; explain?: string};
export type Question = {q: string; choices: Choice[]};

export default function Quiz({questions}: {questions: Question[]}) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  return (
    <div style={{background: 'var(--ifm-color-emphasis-100)', borderRadius: 8, padding: '1rem 1.25rem', marginTop: '1.5rem'}}>
      <h4 style={{marginTop: 0}}>Check your understanding</h4>
      {questions.map((q, qi) => {
        const sel = picked[qi];
        return (
          <div key={qi} style={{marginBottom: '1rem'}}>
            <p style={{fontWeight: 500}}>{qi + 1}. {q.q}</p>
            {q.choices.map((c, ci) => {
              const isPicked = sel === ci;
              const showResult = sel !== undefined;
              const bg = !showResult ? 'transparent' : isPicked ? (c.correct ? '#15803D22' : '#DC262622') : c.correct ? '#15803D22' : 'transparent';
              return (
                <button key={ci} onClick={() => setPicked({...picked, [qi]: ci})} disabled={showResult}
                  style={{display: 'block', width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem', margin: '0.25rem 0', border: '1px solid var(--ifm-color-emphasis-300)', background: bg, borderRadius: 4, cursor: showResult ? 'default' : 'pointer'}}>
                  {c.text}
                  {showResult && isPicked && c.explain && <em style={{display: 'block', marginTop: '0.25rem', fontSize: '0.9em'}}>{c.explain}</em>}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
