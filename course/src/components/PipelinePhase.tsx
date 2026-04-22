import React from 'react';

const PHASES = [
  {n: 0, name: 'Schema Compilation', file: 'sisepuede/core/model_attributes.py', summary: 'ModelAttributes loads all attribute tables and builds the variable schema.'},
  {n: 1, name: 'Template Ingestion', file: 'sisepuede/data_management/ingestion.py', summary: 'BaseInputDatabase reads region templates into a long-format DataFrame.'},
  {n: 2, name: 'Sampling Units', file: 'sisepuede/data_management/sampling_unit.py', summary: 'FutureTrajectories classifies trajectories as Lever (L) or Exogenous (X).'},
  {n: 3, name: 'LHS Sampling', file: 'sisepuede/data_management/lhs_design.py', summary: 'LHSDesign generates two LHS arrays (levers + exogenous) over [0,1].'},
  {n: 4, name: 'Primary Key Index', file: 'sisepuede/data_management/ordered_direct_product_table.py', summary: 'Mixed-radix encoding of (design × strategy × future) → primary_id.'},
  {n: 5, name: 'Input Materialization', file: 'sisepuede/manager/sisepuede.py', summary: 'generate_scenario_database_from_primary_key produces the perturbed wide DataFrame.'},
  {n: 6, name: 'Sectoral Execution', file: 'sisepuede/manager/sisepuede_models.py', summary: 'Socio → AFOLU → CE → EnergyProduction → EnergyConsumption → IPPU.'},
  {n: 7, name: 'Output Database', file: 'sisepuede/manager/sisepuede_output_database.py', summary: 'Batched writes to SQLite or CSV with conflict resolution.'},
];

export default function PipelinePhase({n}: {n: number}) {
  const p = PHASES[n];
  if (!p) return null;
  return (
    <div style={{border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '0.5rem'}}>
      <div style={{display: 'flex', gap: '0.75rem', alignItems: 'baseline'}}>
        <span style={{background: 'var(--ifm-color-primary)', color: 'white', borderRadius: 4, padding: '0.15rem 0.5rem', fontWeight: 600}}>Phase {p.n}</span>
        <strong>{p.name}</strong>
      </div>
      <p style={{margin: '0.5rem 0 0.25rem'}}>{p.summary}</p>
      <code style={{fontSize: '0.85em'}}>{p.file}</code>
    </div>
  );
}
