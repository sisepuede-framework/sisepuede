import React from 'react';

type Sector = 'afolu' | 'energy' | 'ippu' | 'ce' | 'socio';
const META: Record<Sector, {label: string; pyClass: string; color: string; icon: string}> = {
  afolu: {label: 'AFOLU', pyClass: 'AFOLU', color: '#15803D', icon: '🌱'},
  energy: {label: 'Energy', pyClass: 'EnergyConsumption / EnergyProduction', color: '#D97706', icon: '⚡'},
  ippu: {label: 'IPPU', pyClass: 'IPPU', color: '#7C3AED', icon: '🏭'},
  ce: {label: 'Circular Economy', pyClass: 'CircularEconomy', color: '#0891B2', icon: '♻️'},
  socio: {label: 'Socioeconomic', pyClass: 'Socioeconomic', color: '#475569', icon: '👥'},
};

export default function SectorCard({sector, children, useSvg = true}: {sector: Sector; children?: React.ReactNode; useSvg?: boolean}) {
  const m = META[sector];
  const [svgFailed, setSvgFailed] = React.useState(false);
  const showSvg = useSvg && !svgFailed;
  return (
    <div className={`sector-${sector}`} style={{padding: '1rem 1.25rem', background: 'var(--ifm-background-surface-color)', borderRadius: 8, marginBottom: '1rem'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
        {showSvg ? (
          <img
            src={`/img/sectors/${sector}.svg`}
            alt=""
            width={32}
            height={32}
            onError={() => setSvgFailed(true)}
            style={{flexShrink: 0}}
          />
        ) : (
          <span style={{fontSize: '1.5rem'}}>{m.icon}</span>
        )}
        <h4 style={{margin: 0, color: m.color}}>{m.label}</h4>
        <code style={{marginLeft: 'auto'}}>{m.pyClass}</code>
      </div>
      <div style={{marginTop: '0.5rem'}}>{children}</div>
    </div>
  );
}
