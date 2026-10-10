"""Unit tests for the resume export pipeline."""

from __future__ import annotations

import json

from linkedin_project.pipelines.export_resume import load_resume


def test_load_resume_returns_the_curated_content():
    resume = load_resume()

    assert resume["profile"]["name"] == "Chris Selig, MBA"
    assert len(resume["experience"]["featured"]) >= 1
    assert len(resume["experience"]["earlier"]) >= 1
    assert len(resume["skills"]) >= 1
    assert len(resume["stats"]) >= 1


def test_industries_stat_matches_the_real_industries_list():
    resume = load_resume()

    industries_stat = next(
        s for s in resume["stats"] if s["label"] == "Industries served"
    )
    assert industries_stat["value"] == str(len(resume["industries"]))
    assert industries_stat["details"] == [i["name"] for i in resume["industries"]]
    assert len(resume["industries"]) > 4  # more than the original undercount


def test_featured_experience_bullets_or_engagements_present():
    resume = load_resume()

    for role in resume["experience"]["featured"]:
        has_bullets = len(role["bullets"]) > 0
        has_engagement_bullets = any(len(e["bullets"]) > 0 for e in role["engagements"])
        assert has_bullets or has_engagement_bullets, role["company"]


def test_every_focus_area_has_a_real_example():
    resume = load_resume()

    focus_areas = resume["profile"]["focus_areas"]
    examples = resume["focus_area_examples"]
    for area in focus_areas:
        assert area in examples, area
        assert len(examples[area]) >= 1, area
        for example in examples[area]:
            assert example["client"]
            assert example["accomplishment"]


def test_load_resume_is_json_serializable_with_no_nan():
    resume = load_resume()

    serialized = json.dumps(resume)
    assert "NaN" not in serialized
    json.loads(serialized)  # round-trips without error
