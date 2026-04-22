import React from 'react';

type Row = {field: string; description: string; unit?: string};
export default function VariableTable({rows, caption}: {rows: Row[]; caption?: string}) {
  return (
    <div style={{overflowX: 'auto', marginBottom: '1.5rem'}}>
      {caption && <p style={{fontStyle: 'italic', marginBottom: '0.25rem'}}>{caption}</p>}
      <table style={{width: '100%', borderCollapse: 'collapse'}}>
        <thead>
          <tr style={{background: 'var(--ifm-color-emphasis-200)'}}>
            <th style={{textAlign: 'left', padding: '0.5rem 0.75rem'}}>Field</th>
            <th style={{textAlign: 'left', padding: '0.5rem 0.75rem'}}>Description</th>
            <th style={{textAlign: 'left', padding: '0.5rem 0.75rem'}}>Unit</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{borderTop: '1px solid var(--ifm-color-emphasis-300)'}}>
              <td style={{padding: '0.5rem 0.75rem'}}><code>{r.field}</code></td>
              <td style={{padding: '0.5rem 0.75rem'}}>{r.description}</td>
              <td style={{padding: '0.5rem 0.75rem'}}>{r.unit ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
