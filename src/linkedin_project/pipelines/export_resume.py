"""Load resume data (DuckDB if populated, else static real content) as plain Python.

This is the single data source for anything that renders the resume —
currently the Next.js frontend in /web, which consumes the JSON this module
produces via scripts/export_resume_json.py.

The curated experience narrative (featured roles with client engagements,
career stats, portfolio, fun facts) is static editorial content transcribed
from Chris Selig's resume — it doesn't fit the flat LinkedIn-scrape schema
in scrape/schema.py and isn't something scraping could produce anyway, so
it has no DB-backed path. Skills, education, and certifications remain
DB-backed with a static fallback, matching the existing scrape schema.
"""

from __future__ import annotations

from pathlib import Path
from typing import Optional

import duckdb
import pandas as pd

_PROJECT_ROOT = Path(__file__).resolve().parents[3]
_DB_PATH = _PROJECT_ROOT / "data" / "duckdb" / "linkedin.db"

# ---------------------------------------------------------------------------
# Profile
# ---------------------------------------------------------------------------
PROFILE: dict[str, object] = {
    "name": "Chris Selig, MBA",
    "headline": "Senior Data Engineer, Analytics",
    "location": "Calgary, AB, Canada",
    "email": "",
    "linkedin_url": "https://www.linkedin.com/in/chris-selig/",
    "summary": (
        "Senior data and analytics professional who builds pipelines, "
        "dashboards, and automation that turn chaos into clarity. Brings "
        "strong hands-on expertise in Python, SQL, Databricks, Spark, "
        "Power BI, and R, along with a practical, business-focused "
        "approach to solving real problems. Experienced in translating "
        "complex data into reliable, high-value solutions that save time, "
        "improve decisions, and quietly retire a few terrible spreadsheets "
        "along the way."
    ),
    "focus_areas": [
        "Data Science",
        "Business Intelligence",
        "Visual Analytics",
        "Data Engineering",
        "Data Analysis",
        "Automation",
    ],
    # Corporate functions and business units supported with analytics,
    # across roles — not what he does, but who he's done it for.
    "business_domains": [
        "Accounting / Finance",
        "IT",
        "Human Resources",
        "BI Teams",
        "Supply Chain",
        "Corporate Planning",
    ],
}

# ---------------------------------------------------------------------------
# Industries served — real, specific engagements, not a generic bucket.
# Backs the "Industries served" stat tile's hover detail.
# ---------------------------------------------------------------------------
INDUSTRIES: list[dict[str, object]] = [
    {
        "name": "Energy & Utilities",
        "examples": [
            "Cenovus Energy",
            "CNOOC International",
            "ATCO Energy",
            "Husky Energy",
            "Devon Energy",
            "ConocoPhillips Canada",
        ],
    },
    {
        "name": "Finance & Wealth Management",
        "examples": ["Camber Capital Private Wealth", "Western Financial Group"],
    },
    {
        "name": "Aviation Security",
        "examples": ["GardaWorld — airport security screening-officer training"],
    },
    {"name": "Retail", "examples": ["Liquidation World"]},
    {
        "name": "Academic & Research",
        "examples": [
            "University medical study (300+ R Markdown reports)",
            "Harvard graduate student — R geospatial analysis & linear regression",
        ],
    },
    {
        "name": "Technology / Startups",
        "examples": ["Stealth startup — investor-presentation R Shiny dashboard"],
    },
    {
        "name": "Health & Wellness",
        "examples": ["Therapy practice — analytics & traffic reporting"],
    },
    {
        "name": "Automotive / Auto Recycling",
        "examples": ["Minnesota u-pick auto-parts business — eBay sales profitability"],
    },
]

# ---------------------------------------------------------------------------
# Skills — sized by how often each tool shows up across 18 years of real
# work (counted from the resume text), not LinkedIn endorsements.
# ---------------------------------------------------------------------------
SAMPLE_SKILLS = pd.DataFrame(
    [
        {"name": "R", "endorsements": 26},
        {"name": "Power BI", "endorsements": 18},
        {"name": "Excel / VBA", "endorsements": 19},
        {"name": "Python", "endorsements": 9},
        {"name": "Spotfire", "endorsements": 8},
        {"name": "SQL", "endorsements": 8},
        {"name": "RStudio", "endorsements": 4},
        {"name": "Spark", "endorsements": 4},
        {"name": "AWS", "endorsements": 4},
        {"name": "Databricks", "endorsements": 3},
        {"name": "Power Automate", "endorsements": 3},
        {"name": "Azure", "endorsements": 3},
        {"name": "Essbase", "endorsements": 3},
        {"name": "KNIME", "endorsements": 2},
        {"name": "Cognos", "endorsements": 2},
        {"name": "Tableau", "endorsements": 1},
    ]
)

# ---------------------------------------------------------------------------
# Career stats — a few honest numbers, not vanity metrics.
# ---------------------------------------------------------------------------
STATS: list[dict[str, object]] = [
    {"label": "Years in data & analytics", "value": "18+"},
    {"label": "Companies & consulting clients", "value": "12"},
    {
        "label": "Industries served",
        "value": str(len(INDUSTRIES)),
        "details": [industry["name"] for industry in INDUSTRIES],
    },
    {
        "label": "Tools mastered",
        "value": "20+",
        "details": list(
            SAMPLE_SKILLS.sort_values("endorsements", ascending=False)["name"]
        ),
    },
]

# ---------------------------------------------------------------------------
# Featured experience — full detail, including consulting client
# engagements nested under the consultancy that ran them.
# ---------------------------------------------------------------------------
FEATURED_EXPERIENCE: list[dict[str, object]] = [
    {
        "company": "Cenovus Energy",
        "location": "Calgary, AB",
        "date_range": "2024 – Present",
        "role": "Senior Advisor, HR Data & Analytics",
        "summary": None,
        "bullets": [
            "Developed data pipelines, data models, reports, and conducted statistical analysis in the Human Resources space using Databricks, Claude Code, GitHub Copilot, Python, Spark, R, and Power BI.",
            "Built and maintained the entire HR data model using Python, PySpark, and Databricks — saving significant time in both validating data and developing new data products.",
            "Developed an automated People Metrics Power BI dashboard that lets the enterprise see and action their HR metrics.",
            "Built an Excel-based compensation model for HR Operations that streamlined on-demand data pulls for divestitures, cutting manual effort.",
            "Completed the WFP waterfall variance table, letting plan owners quickly identify and review budget variances.",
            "Identified and remediated a data access issue, strengthened permissions, and implemented automated monitoring for permission changes.",
            "Developed an AI-based model that reads different file formats and extracts the data into tables — saving end users 4 days of work each time new files were sent to the team.",
        ],
        "engagements": [],
    },
    {
        "company": "Bidamia Inc.",
        "location": "Calgary, AB",
        "date_range": "2018 – 2024",
        "role": "Data Science & Analytics Consultant (Contractor / Freelancer)",
        "summary": (
            "Helped individuals and companies combine, manage, and analyze their "
            "data to gain new insights and create more efficient reporting "
            "capabilities. Developed Spotfire and Power BI dashboards and reports "
            "for clients, provided end-user training, and built ETL processes "
            "using KNIME and R."
        ),
        "bullets": [],
        "engagements": [
            {
                "client": "CNOOC International",
                "role": "Data Scientist",
                "former": True,
                "bullets": [
                    "Managed the analytics environment (RStudio/Python/GitLab) and advised on data initiatives, including rolling out BI tools and optimizing processes.",
                    "Reverse-engineered a large manual process that took days each month and sped it up using system resources and Power BI.",
                    "Led the Power BI implementation program rolled out across the entire business, including training users on best practices.",
                    "Using R, developed a time series algorithm to forecast IT financial costs more efficiently than the traditional process.",
                ],
            },
            {
                "client": "Various (Online freelancer)",
                "role": None,
                "former": True,
                "bullets": [
                    "Produced over 300 R Markdown reports for participants in a university medical study, automatically generated via R/RStudio with ggplot2 visuals and PDF output.",
                    "Wrote OData queries to extract Microsoft Dynamics sales data and visualize it in Power BI for executives.",
                    "Developed an R Shiny dashboard to visualize economic, financial, geospatial, and proprietary data for investor presentations at a stealth startup — hosted on Docker + an Azure VM.",
                    "Built an R-based interactive text-mining analysis on free-form survey text (word correlation, frequency counts, sentiment) to surface customer-satisfaction insights for management.",
                    "Created a Power BI dashboard visualizing SurveyMonkey customer-satisfaction data to help management focus improvement efforts.",
                    "Using Python, built a data pipeline between internal systems and AWS (S3 and Redshift) enabling new analytics initiatives.",
                    "Taught a Harvard graduate student to use R for geospatial analysis and linear regression.",
                    "Combined data from multiple systems for the first time to determine whether a Minnesota u-pick auto-parts business's eBay sales were profitable, delivering Excel and Power BI reports plus profitability recommendations.",
                    "Set up Google Analytics and Calendly with a Google Data Studio dashboard for a therapy practice, enabling near-real-time visitor and booking-funnel tracking.",
                    "Set up Google Analytics and a Google Data Studio report for the same therapy practice to track which blog posts and social channels drove the most traffic.",
                    "Created R/ggplot2 data visualizations for an academic study on the mental-health effects of COVID-19.",
                ],
            },
            {
                "client": "ATCO Energy",
                "role": "Data Analyst",
                "former": True,
                "bullets": [
                    "Used R to run advanced statistical text mining (topic modeling, word sentiment, bigrams) on an IT Engagement survey, providing an action plan for IT leadership.",
                    "Developed a data pipeline and model supporting project and financial reporting.",
                    "Consulted on data management best practices to build a more efficient reporting process.",
                    "Created a Power BI dashboard for HR to visualize executives' goals and track progress.",
                    "Developed a Power Automate cloud flow to auto-update SharePoint under certain conditions, freeing up human time.",
                ],
            },
            {
                "client": "Husky Energy",
                "role": "Data Analyst",
                "former": True,
                "bullets": [
                    "Completed a text-mining analysis of software vendor responses using R/RStudio to inform an ITFM tool selection.",
                    "Built an R Markdown pipeline generating a monthly report of actual, forecast, and budgeted Information Service costs and variances.",
                    "Developed a seasonal-naive time series forecasting model to quickly forecast Information Service expenses.",
                    "Built a cost show-back report (R + Spotfire, queried/modeled via Tibco Data Virtualization) that for the first time let the organization show back IS costs to the business.",
                    "Created an automated ETL pipeline (KNIME) combining forecast/budget files and loading to SQL Server.",
                    "Developed a SQL Server database as the single source of truth for the Planning and Controls team, cutting reporting time dramatically and building the pipelines to feed it.",
                    "Built Spotfire reports (with HTML/CSS) tracking project-portfolio costs and status for upper management and the CIO — the first time all costs were visualized together.",
                ],
            },
            {
                "client": "Devon Energy",
                "role": "Reporting Analyst",
                "former": True,
                "bullets": [
                    "Delivered Power BI training sessions to groups across Canada and the US.",
                    "Used R to develop custom visuals within Power BI.",
                    "Delivered training on visualization theory and best practices, plus a how-to video to keep the course alive over time.",
                    "Facilitated requirements-gathering sessions with stakeholders to drive Power BI report development.",
                ],
            },
        ],
    },
    {
        "company": "SELICA Analytics Inc.",
        "location": "Calgary, AB",
        "date_range": "2022 – 2023",
        "role": "Founder, Co-CEO",
        "summary": (
            "Led a team of developers supporting client needs — helping "
            "businesses gather and understand their data using Power BI, R, "
            "Python, Excel, and Power Automate, and architecting client solutions."
        ),
        "bullets": [],
        "engagements": [
            {
                "client": "ATCO Energy",
                "role": "Technical Lead / Senior Developer",
                "former": False,
                "bullets": [
                    "Built a Power Automate flow using AI to extract information from PDF files, saving 10 hours a month and enabling consolidated analysis for the first time.",
                    "Created a project-management template that collected project forecasts and exported them to a database for detailed leadership reporting.",
                ],
            },
            {
                "client": "Camber Capital Private Wealth",
                "role": "Technical Lead",
                "former": False,
                "bullets": [
                    "Streamlined the financial management process from 3–5 days down to 10 minutes, including more user-friendly Excel input files and a best-practice Power BI data model.",
                    "Built a 165-query Power BI report that automated data ingestion into a dashboard for my clients' clients.",
                ],
            },
        ],
    },
]

# ---------------------------------------------------------------------------
# Earlier career — condensed to one standout line each, full detail lives
# in the source resume rather than the page (concept over completeness).
# ---------------------------------------------------------------------------
EARLIER_EXPERIENCE: list[dict[str, str]] = [
    {
        "company": "Western Financial Group",
        "location": "Calgary, AB",
        "date_range": "2017",
        "role": "Business Intelligence Analyst",
        "highlight": (
            "Built a k-means customer-segmentation model in R and an "
            "automated Excel/VBA/SQL revenue & expense forecasting model "
            "for branch offices."
        ),
    },
    {
        "company": "GardaWorld",
        "location": "Calgary, AB",
        "date_range": "2016 – 2017",
        "role": "Data Analyst",
        "highlight": (
            "Built a Power BI dashboard tracking airport security screening-"
            "officer training, and an R-based analysis that quantified "
            "data-submission errors for the first time, focusing training "
            "initiatives."
        ),
    },
    {
        "company": "ConocoPhillips Canada",
        "location": "Calgary, AB",
        "date_range": "2008 – 2016",
        "role": "Long Range Planning Analyst / Business Analyst / Business Analyst – Systems",
        "highlight": (
            "Automated Excel/VBA/SQL models that cut Essbase turnaround from "
            "5 days to 2 hours and operating-expenditure forecasting from "
            "6 hours to 30 minutes."
        ),
    },
    {
        "company": "Liquidation World",
        "location": "Calgary, AB",
        "date_range": "2006 – 2008",
        "role": "Assistant Manager / Store Manager",
        "highlight": (
            "Ran day-to-day operations of a top-5 sales store; promoted to "
            "Store Manager within 6 months of hire."
        ),
    },
]

# ---------------------------------------------------------------------------
# Education
# ---------------------------------------------------------------------------
SAMPLE_EDUCATION = pd.DataFrame(
    [
        {
            "school": "Institute for Statistics Education",
            "degree": "Certificate in Analytics for Data Science",
            "field_of_study": "",
            "start_year": "",
            "end_year": "2020",
            "description": "",
        },
        {
            "school": "University of Calgary",
            "degree": "Certificate in Business Intelligence and Analytics",
            "field_of_study": "",
            "start_year": "",
            "end_year": "",
            "description": "",
        },
        {
            "school": "Dalhousie University, Halifax, NS",
            "degree": "Master of Business Administration (MBA)",
            "field_of_study": "Finance",
            "start_year": "",
            "end_year": "",
            "description": "",
        },
        {
            "school": "Acadia University, Wolfville, NS",
            "degree": "Bachelor of Arts (BA)",
            "field_of_study": "Economics",
            "start_year": "",
            "end_year": "",
            "description": "",
        },
    ]
)

# ---------------------------------------------------------------------------
# Professional development — frequent, recent, self-directed upskilling.
# ---------------------------------------------------------------------------
SAMPLE_CERTIFICATIONS = pd.DataFrame(
    [
        {
            "name": "Data Engineering with Azure",
            "authority": "Udacity",
            "issued_date": "2023",
        },
        {"name": "Data Engineering Academy", "authority": "", "issued_date": "2021"},
        {
            "name": "Python for Data Science Automation",
            "authority": "Business Science",
            "issued_date": "2021",
        },
        {
            "name": "UIPath RPA Citizen Developer Foundation",
            "authority": "UiPath Academy",
            "issued_date": "2020",
        },
        {
            "name": "Intermediate Python",
            "authority": "Dataquest",
            "issued_date": "2020",
        },
        {
            "name": "Postgres for Data Engineers",
            "authority": "Dataquest",
            "issued_date": "2020",
        },
        {
            "name": "Algorithm Complexity for Data Engineering",
            "authority": "Dataquest",
            "issued_date": "2020",
        },
        {
            "name": "Predictive Web Applications for Business with R",
            "authority": "Business Science University",
            "issued_date": "2019",
        },
        {
            "name": "Business Analysis with R",
            "authority": "Business Science University",
            "issued_date": "2019",
        },
        {
            "name": "Data Science for Business with R: HR Analytics",
            "authority": "Business Science University",
            "issued_date": "2018",
        },
        {
            "name": "Statistics with R – Probability and Data",
            "authority": "Coursera",
            "issued_date": "2017",
        },
        {
            "name": "Fundamentals of Visualization with Tableau",
            "authority": "Coursera",
            "issued_date": "2017",
        },
    ]
)

# ---------------------------------------------------------------------------
# Portfolio
# ---------------------------------------------------------------------------
PORTFOLIO: list[dict[str, str]] = [
    {
        "title": "Azure Data Engineering — Bike Sharing DW",
        "url": "https://github.com/chrisselig/bikesharingDW",
    },
    {
        "title": "Azure Data Engineering — NYC Data Project",
        "url": "https://github.com/chrisselig/de_udacity_nycdata_project",
    },
    {
        "title": "Fantasy Baseball Dashboard (Python + Claude Code)",
        "url": "https://chris-selig.shinyapps.io/fantasy_baseball_dashboard/",
    },
    {
        "title": "Movie Awards Video Analysis",
        "url": "https://github.com/chrisselig/movie_awards_video_analysis",
    },
]

# ---------------------------------------------------------------------------
# Fun facts — wit as a design tool, not a distraction.
# ---------------------------------------------------------------------------
FUN_FACTS: list[str] = [
    "Can still knock out Glass Joe in about a minute in Punch-Out!! on the NES.",
    "Committed to playing first-person shooters, no matter how bad I am at them.",
    "Keep buying every technical book I can on a whim because I want to learn everything.",
    "Addicted to hand-tool woodworking and buying saws — 15 and counting. Send help.",
]

_SAMPLE_SECTIONS: dict[str, pd.DataFrame] = {
    "education": SAMPLE_EDUCATION,
    "skills": SAMPLE_SKILLS,
    "certifications": SAMPLE_CERTIFICATIONS,
}

_DB_QUERIES: dict[str, str] = {
    "education": "SELECT * FROM education ORDER BY end_date DESC",
    "skills": "SELECT * FROM skills ORDER BY endorsement_count DESC",
    "certifications": "SELECT * FROM certifications ORDER BY issued_date DESC",
}

# ---------------------------------------------------------------------------
# Database helpers
# ---------------------------------------------------------------------------


def get_db_connection(
    db_path: str | Path = _DB_PATH,
) -> Optional[duckdb.DuckDBPyConnection]:
    """Open a read-only DuckDB connection, or return None if unavailable."""
    try:
        path = Path(db_path)
        if not path.exists():
            return None
        return duckdb.connect(str(path), read_only=True)
    except Exception:
        return None


def _safe_query(conn: duckdb.DuckDBPyConnection, sql: str) -> Optional[pd.DataFrame]:
    """Execute SQL and return a DataFrame, or None on error."""
    try:
        return conn.execute(sql).df()
    except Exception:
        return None


def _extract_year(series: pd.Series) -> pd.Series:
    """Extract year strings from ISO 8601 date strings."""
    parsed = pd.to_datetime(series, errors="coerce")
    return parsed.dt.year.astype("Int64").astype(str).where(parsed.notna(), other="")


def load_section(
    conn: Optional[duckdb.DuckDBPyConnection], section: str
) -> pd.DataFrame:
    """Load a DB-backed resume section from DuckDB, falling back to static data."""
    if section not in _SAMPLE_SECTIONS:
        raise ValueError(f"Unknown section: {section!r}")

    if conn is None:
        return _SAMPLE_SECTIONS[section].copy()

    result = _safe_query(conn, _DB_QUERIES[section])
    if result is None or result.empty:
        return _SAMPLE_SECTIONS[section].copy()

    if section == "education":
        if "start_date" in result.columns and "start_year" not in result.columns:
            result = result.copy()
            result["start_year"] = _extract_year(result["start_date"])
        if "end_date" in result.columns and "end_year" not in result.columns:
            result = result.copy()
            result["end_year"] = _extract_year(result["end_date"])

    return result


def load_profile(conn: Optional[duckdb.DuckDBPyConnection]) -> dict[str, object]:
    """Load the profile record from DuckDB, falling back to static data."""
    if conn is None:
        return dict(PROFILE)
    result = _safe_query(conn, "SELECT * FROM profile LIMIT 1")
    if result is None or result.empty:
        return dict(PROFILE)
    row = result.iloc[0].to_dict()
    row.setdefault("summary", PROFILE["summary"])
    return row


def _records(df: pd.DataFrame) -> list[dict[str, object]]:
    """Convert a DataFrame to JSON-safe records (NaN/NaT -> None).

    ``DataFrame.where`` re-coerces ``None`` back to the column's own NA
    sentinel (``float('nan')`` even for pandas' string dtype), so NaN is
    scrubbed per-value after ``to_dict`` instead, once values are plain
    Python objects no longer bound to a column dtype.
    """
    records = df.to_dict(orient="records")
    return [
        {
            k: (None if isinstance(v, float) and pd.isna(v) else v)
            for k, v in row.items()
        }
        for row in records
    ]


def load_resume(db_path: str | Path = _DB_PATH) -> dict[str, object]:
    """Load the full resume (profile + all sections) as plain Python data."""
    conn = get_db_connection(db_path)
    try:
        return {
            "profile": load_profile(conn),
            "stats": STATS,
            "industries": INDUSTRIES,
            "skills": _records(load_section(conn, "skills")),
            "experience": {
                "featured": FEATURED_EXPERIENCE,
                "earlier": EARLIER_EXPERIENCE,
            },
            "education": _records(load_section(conn, "education")),
            "certifications": _records(load_section(conn, "certifications")),
            "portfolio": PORTFOLIO,
            "fun_facts": FUN_FACTS,
        }
    finally:
        if conn is not None:
            conn.close()
