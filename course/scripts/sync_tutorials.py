#!/usr/bin/env python3
"""Clone jcsyme/sisepuede_tutorials, render notebooks to MDX, copy raw .ipynb."""
import shutil
import subprocess
import tempfile
from pathlib import Path

REPO = "https://github.com/jcsyme/sisepuede_tutorials.git"
TUTORIALS = [
    ("sisepuede_tutorial_1-subsector_models.ipynb", "t1", "Sector Models"),
    ("sisepuede_tutorial_2-model_attributes.ipynb", "t2", "Model Attributes"),
    ("sisepuede_tutorial_3-working_with_transformations.ipynb", "t3", "Working with Transformations"),
    ("sisepuede_tutorial_4-sisepuede_object.ipynb", "t4", "SISEPUEDE Object"),
    ("sisepuede_tutorial_5-article_6_analysis_example.ipynb", "t5", "Peru Article 6 Analysis"),
    ("sisepuede_tutorial_6-uncertain_trajectories.ipynb", "t6", "Uncertain Trajectories"),
]

ROOT = Path(__file__).resolve().parent.parent
DOCS_TUTORIALS = ROOT / "docs" / "06-tutorials" / "rendered"
STATIC_NOTEBOOKS = ROOT / "static" / "notebooks"


def main():
    DOCS_TUTORIALS.mkdir(parents=True, exist_ok=True)
    STATIC_NOTEBOOKS.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.check_call(["git", "clone", "--depth", "1", REPO, tmp])
        for fname, tid, title in TUTORIALS:
            src = Path(tmp) / fname
            shutil.copy(src, STATIC_NOTEBOOKS / fname)
            out_md = DOCS_TUTORIALS / f"{tid}.md"
            subprocess.check_call([
                "jupyter", "nbconvert", "--to", "markdown",
                "--output", out_md.stem, "--output-dir", str(out_md.parent),
                str(src),
            ])
            body = out_md.read_text()
            frontmatter = (
                f"---\n"
                f"id: {tid}\n"
                f"title: \"Tutorial {tid.upper()}: {title}\"\n"
                f"sidebar_position: {int(tid[1])}\n"
                f"---\n\n"
                f"import TutorialCallout from '@site/src/components/TutorialCallout';\n\n"
                f"<TutorialCallout id=\"{tid}\" />\n\n"
            )
            out_md.write_text(frontmatter + body)
            print(f"  -> wrote {out_md.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
