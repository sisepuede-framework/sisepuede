import React from 'react';

const TUTORIALS = {
  t1: {title: 'Sector Models', file: 'sisepuede_tutorial_1-subsector_models.ipynb'},
  t2: {title: 'Model Attributes', file: 'sisepuede_tutorial_2-model_attributes.ipynb'},
  t3: {title: 'Working with Transformations', file: 'sisepuede_tutorial_3-working_with_transformations.ipynb'},
  t4: {title: 'SISEPUEDE Object', file: 'sisepuede_tutorial_4-sisepuede_object.ipynb'},
  t5: {title: 'Peru Article 6 Analysis', file: 'sisepuede_tutorial_5-article_6_analysis_example.ipynb'},
  t6: {title: 'Uncertain Trajectories', file: 'sisepuede_tutorial_6-uncertain_trajectories.ipynb'},
};

export default function TutorialCallout({id}: {id: keyof typeof TUTORIALS}) {
  const t = TUTORIALS[id];
  const raw = `https://github.com/jcsyme/sisepuede_tutorials/blob/main/${t.file}`;
  const colab = `https://colab.research.google.com/github/jcsyme/sisepuede_tutorials/blob/main/${t.file}`;
  const download = `/sisepuede/notebooks/${t.file}`;
  return (
    <div style={{borderLeft: '4px solid var(--ifm-color-primary)', background: 'var(--ifm-color-emphasis-100)', padding: '0.75rem 1rem', marginBottom: '1.5rem'}}>
      <strong>Tutorial {id.toUpperCase()}: {t.title}</strong>
      <div style={{marginTop: '0.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
        <a href={colab} target="_blank" rel="noreferrer">▶ Open in Colab</a>
        <a href={raw} target="_blank" rel="noreferrer">↗ View on GitHub</a>
        <a href={download} download>⬇ Download .ipynb</a>
      </div>
    </div>
  );
}
