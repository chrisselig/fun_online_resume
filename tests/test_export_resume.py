"""Unit tests for the resume export pipeline."""

from __future__ import annotations

import json

from linkedin_project.pipelines.export_resume import load_resume


def test_load_resume_falls_back_to_static_data_without_db():
    resume = load_resume(db_path="/nonexistent/path/linkedin.db")

    assert resume["profile"]["name"] == "Chris Selig, MBA"
    assert len(resume["experience"]["featured"]) >= 1
    assert len(resume["experience"]["earlier"]) >= 1
    assert len(resume["skills"]) >= 1
    assert len(resume["stats"]) >= 1


def test_featured_experience_bullets_or_engagements_present():
    resume = load_resume(db_path="/nonexistent/path/linkedin.db")

    for role in resume["experience"]["featured"]:
        has_bullets = len(role["bullets"]) > 0
        has_engagement_bullets = any(len(e["bullets"]) > 0 for e in role["engagements"])
        assert has_bullets or has_engagement_bullets, role["company"]


def test_load_resume_is_json_serializable_with_no_nan():
    resume = load_resume(db_path="/nonexistent/path/linkedin.db")

    serialized = json.dumps(resume)
    assert "NaN" not in serialized
    json.loads(serialized)  # round-trips without error
