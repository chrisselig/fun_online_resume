"""Hand-curated resume content, exported as plain Python/JSON.

This is the single data source for the Next.js frontend in /web, which
consumes the JSON this module produces via scripts/export_resume_json.py.
Everything here is static editorial content transcribed from Chris Selig's
real resume — there is no scraper or database behind it.
"""

from __future__ import annotations

import pandas as pd

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
# Focus-area examples — real (client, accomplishment) proof pulled from
# FEATURED_EXPERIENCE/EARLIER_EXPERIENCE bullets below, keyed by the focus
# area it backs. Backs the Hero focus-area tags' hover detail.
# ---------------------------------------------------------------------------
FOCUS_AREA_EXAMPLES: dict[str, list[dict[str, str]]] = {
    "Data Science": [
        {
            "client": "Western Financial Group",
            "accomplishment": "Built a k-means customer-segmentation model in R to group branch customers for targeted strategy.",
        },
        {
            "client": "CNOOC International",
            "accomplishment": "Developed a time series algorithm in R to forecast IT financial costs more efficiently than the traditional process.",
        },
    ],
    "Business Intelligence": [
        {
            "client": "CNOOC International",
            "accomplishment": "Led the Power BI implementation program rolled out across the entire business, including training users on best practices.",
        },
        {
            "client": "ATCO Energy",
            "accomplishment": "Created a Power BI dashboard for HR to visualize executives' goals and track progress.",
        },
    ],
    "Visual Analytics": [
        {
            "client": "Husky Energy",
            "accomplishment": "Built Spotfire reports (with HTML/CSS) tracking project-portfolio costs and status for upper management and the CIO — the first time all costs were visualized together.",
        },
        {
            "client": "Camber Capital Private Wealth",
            "accomplishment": "Built a 165-query Power BI report that automated data ingestion into a dashboard for my clients' clients.",
        },
    ],
    "Data Engineering": [
        {
            "client": "Husky Energy",
            "accomplishment": "Developed a SQL Server database as the single source of truth for the Planning and Controls team, cutting reporting time dramatically.",
        },
        {
            "client": "Cenovus Energy",
            "accomplishment": "Built and maintained the entire HR data model using Python, PySpark, and Databricks.",
        },
    ],
    "Data Analysis": [
        {
            "client": "GardaWorld",
            "accomplishment": "Built an R-based analysis that quantified data-submission errors for the first time, focusing training initiatives.",
        },
        {
            "client": "ATCO Energy",
            "accomplishment": "Ran advanced statistical text mining (topic modeling, word sentiment, bigrams) on an IT Engagement survey, providing an action plan for IT leadership.",
        },
    ],
    "Automation": [
        {
            "client": "Cenovus Energy",
            "accomplishment": "Developed an AI-based model that reads different file formats and extracts the data into tables — saving end users 4 days of work each time new files were sent.",
        },
        {
            "client": "ATCO Energy",
            "accomplishment": "Built a Power Automate flow using AI to extract information from PDF files, saving 10 hours a month.",
        },
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
# work (counted from the resume text) and weighted up for tools used daily
# in the current role, not LinkedIn endorsements.
# ---------------------------------------------------------------------------
SKILLS = pd.DataFrame(
    [
        {"name": "R", "endorsements": 26},
        {"name": "Python", "endorsements": 21},
        {"name": "Excel / VBA", "endorsements": 19},
        {"name": "Power BI", "endorsements": 18},
        {"name": "Databricks", "endorsements": 15},
        {"name": "Spotfire", "endorsements": 8},
        {"name": "SQL", "endorsements": 8},
        {"name": "RStudio", "endorsements": 4},
        {"name": "Spark", "endorsements": 4},
        {"name": "AWS", "endorsements": 4},
        {"name": "Power Automate", "endorsements": 3},
        {"name": "Azure", "endorsements": 3},
        {"name": "Essbase", "endorsements": 3},
        {"name": "KNIME", "endorsements": 2},
        {"name": "Cognos", "endorsements": 2},
        {"name": "Tableau", "endorsements": 1},
    ]
)

# ---------------------------------------------------------------------------
# Companies & consulting clients — every real employer and named client
# across featured and earlier-career roles. Backs that stat's hover detail.
# ---------------------------------------------------------------------------
COMPANIES_AND_CLIENTS: list[str] = [
    "Cenovus Energy",
    "Bidamia Inc.",
    "CNOOC International",
    "ATCO Energy",
    "Husky Energy",
    "Devon Energy",
    "SELICA Analytics Inc.",
    "Camber Capital Private Wealth",
    "Western Financial Group",
    "GardaWorld",
    "ConocoPhillips Canada",
    "Liquidation World",
]

# ---------------------------------------------------------------------------
# Career stats — a few honest numbers, not vanity metrics.
# ---------------------------------------------------------------------------
STATS: list[dict[str, object]] = [
    {"label": "Years in data & analytics", "value": "18+"},
    {
        "label": "Companies & consulting clients",
        "value": str(len(COMPANIES_AND_CLIENTS)),
        "details": COMPANIES_AND_CLIENTS,
    },
    {
        "label": "Industries served",
        "value": str(len(INDUSTRIES)),
        "details": [industry["name"] for industry in INDUSTRIES],
    },
    {
        "label": "Tools mastered",
        "value": "20+",
        "details": list(SKILLS.sort_values("endorsements", ascending=False)["name"]),
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
        "rewards": [
            "4 fewer days of manual file-wrangling every cycle — automated, not just dashboarded",
            "Closed a real data-access gap with automated permission monitoring",
        ],
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
        "rewards": [
            "Led a Power BI rollout across an entire business, not just one team",
            "Replaced scattered spreadsheets with one SQL Server source of truth",
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
        "rewards": [
            "Cut a financial close process from 3–5 days to 10 minutes",
            "Reclaimed 10 hours a month from manual PDF work using AI",
        ],
    },
]

# ---------------------------------------------------------------------------
# Earlier-career rewards — the bonus wave's "what you get" pitch.
# ---------------------------------------------------------------------------
EARLIER_CAREER_REWARDS: list[str] = [
    "Cut Essbase turnaround from 5 days to 2 hours",
    "Caught data-submission errors nobody had quantified before",
]

# ---------------------------------------------------------------------------
# Earlier career — condensed to one standout line each, full detail lives
# in the source resume rather than the page (concept over completeness).
# ---------------------------------------------------------------------------
EARLIER_EXPERIENCE: list[dict[str, object]] = [
    {
        "company": "Western Financial Group",
        "location": "Calgary, AB",
        "date_range": "2017",
        "role": "Business Intelligence Analyst",
        "summary": (
            "Developed self-service business intelligence and analytics "
            "solutions for branches and executive leadership. Software used: "
            "Cognos Report Studio/Query Studio, Excel, R, and Spotfire."
        ),
        "bullets": [
            "Developed an analysis report in Spotfire that allowed management to understand the change in active policies versus the change in revenue for the brokerage.",
            "Developed an automated Excel/VBA/SQL-based model to forecast both revenues and expenses for the branch offices, using a weighted-average method that significantly reduced forecasting time.",
            "Developed a Tibco Spotfire based analysis dashboard for executives to show how changes in policy counts related to changes in revenue.",
            "Developed, using R, a customer-segmentation model (k-means clustering) to group similar customers for marketing efforts.",
            "Developed a Cognos Report Studio report to help transition and track 14,000 customers as they moved to a new product, ensuring key customers were contacted about product changes.",
        ],
    },
    {
        "company": "GardaWorld",
        "location": "Calgary, AB",
        "date_range": "2016 – 2017",
        "role": "Data Analyst",
        "summary": (
            "Tasked to develop more efficient processes, and a database so "
            "data analysis and visualization can be performed to gather "
            "insights into the business. Software used: Excel, Power BI, R."
        ),
        "bullets": [
            "Developed a Power BI dashboard tracking airport security screening-officer training, visualizing metrics including — for the first time — statistics per training specialist: time spent training, what training was provided, and when.",
            "Through R/RStudio, developed an analysis to quantify and visualize data-submission errors from the divisions for the first time, helping focus training initiatives.",
        ],
    },
    {
        "company": "ConocoPhillips Canada",
        "location": "Calgary, AB",
        "date_range": "2008 – 2016",
        "role": "Long Range Planning Analyst / Business Analyst / Business Analyst – Systems",
        "summary": (
            "Developed automated tools and dashboards for coworkers and "
            "management to provide insight into operating expenditures. "
            "Created forecasts, budgets, and long-range plans. As part of both "
            "the Finance and IT departments, monitored, maintained, and "
            "validated the Essbase financial accounting system database."
        ),
        "bullets": [
            "Reduced Essbase database turnaround time from 5 days to 2 hours through automation of the Excel data models.",
            "Reduced data submission times from 1 day to 15 minutes by developing an automated Excel model that used VBA to extract data from databases.",
            "Significantly reduced database load errors by end users through streamlined Excel data load templates.",
            "Trained finance members on correct Essbase processes, significantly reducing data load errors.",
            "Reduced errors and turnaround time of a manually maintained Excel dashboard by replacing it with an automated Spotfire dashboard, giving management on-demand access to financials.",
            "Developed a financial analysis dashboard in Spotfire that flagged accounting coding errors through vendor agreement comparisons against invoiced general ledger accounts.",
            "Reduced operating expenditure forecast time from 6 hours to 30 minutes by developing an Excel-based data model that retrieved data from one database, layered on user-selected inputs, and exported the forecast.",
            "Developed an Excel-based planning data model using VBA and SQL to extract data from Oracle for various scenarios, compiling it into presentation-ready visualizations.",
            "Reduced data compilation time from 3+ hours to 5 minutes through an Excel-based data model that used VBA and SQL to extract data from an Oracle database.",
        ],
    },
    {
        "company": "Liquidation World",
        "location": "Calgary, AB",
        "date_range": "2006 – 2008",
        "role": "Assistant Manager / Store Manager",
        "summary": None,
        "bullets": [
            "Managed day-to-day store operations of a top-5 sales store, including human resources functions, merchandising, and customer service.",
            "Promoted to Store Manager within 6 months of hire.",
        ],
    },
]

# ---------------------------------------------------------------------------
# Shared "reasons to hire me" pool — drawn randomly by all 3 arcade games at
# their reward/completion moments (Data Invaders' per-wave rewards above are
# separate and stay tied to specific companies). Mix of real, resume-grounded
# lines (untapped detail from FEATURED_EXPERIENCE/EARLIER_EXPERIENCE beyond
# what's already in .rewards / EARLIER_CAREER_REWARDS) and generic-but-
# plausible DE/analytics value props written in the same voice.
# ---------------------------------------------------------------------------
REASONS_TO_HIRE_ME: list[str] = [
    # Real — Husky Energy
    "Built a SQL Server single source of truth for Planning and Controls, cutting reporting time dramatically",
    "Ran a vendor text-mining analysis that turned an ITFM tool selection into an informed decision, not a coin flip",
    # Real — Camber Capital
    "Built a 165-query Power BI report that fully automated data ingestion for client reporting",
    # Real — ConocoPhillips
    "Cut operating-expenditure forecasting from 6 hours to 30 minutes",
    # Real — CNOOC International
    "Reverse-engineered a manual process that took days each month and sped it up with Power BI",
    # Real — ATCO Energy
    "Ran text-mining analysis on an IT engagement survey and handed leadership an action plan, not a word cloud",
    "Built a Power Automate flow that auto-updates SharePoint, freeing up human time nobody noticed was being wasted",
    # Real — Devon Energy
    "Delivered Power BI training sessions across Canada and the US, not just a slide deck",
    # Real — Cenovus Energy
    "Built an entire HR data model from scratch in Python, PySpark, and Databricks",
    "Built an AI model that reads multiple file formats and extracts the data into clean tables",
    "Shipped an automated People Metrics dashboard so the enterprise can self-serve its own HR numbers",
    # Real — GardaWorld
    "Quantified data-submission errors for the first time, focusing training where it actually helped",
    # Real — Western Financial Group
    "Built a k-means customer-segmentation model that gave branch offices real segments instead of guesses",
    # Real — Bidamia freelance engagements
    "Produced 300+ automated R Markdown reports for a university medical study — zero manual copy-paste",
    "Built a Python pipeline moving data into AWS S3 and Redshift, unlocking analytics that didn't exist before",
    "Built an R Shiny investor dashboard, hosted on Docker and Azure, for a stealth startup's fundraising",
    # Generic-but-plausible DE/analytics value props, same voice
    "Pipelines built for 99.9%+ uptime, not 99.9%+ uptime on the slide",
    "Cuts reporting turnaround from days to minutes",
    "Automates the manual process nobody wants to own",
    "Turns a wall of spreadsheets into one source of truth",
    "Writes SQL a human can still read a year later",
    "Ships dashboards people actually open, not just ones that get built",
    "Catches the data-quality bug before it reaches the CFO's deck",
    "Documents the pipeline well enough that it survives when you leave",
    "Builds for the on-call page that never fires",
    "Picks the boring, reliable tool over the exciting, fragile one",
]

# ---------------------------------------------------------------------------
# Education
# ---------------------------------------------------------------------------
EDUCATION = pd.DataFrame(
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
CERTIFICATIONS = pd.DataFrame(
    [
        {
            "name": "Claude Code: Software Engineering with Generative AI Agents",
            "authority": "Vanderbilt University (Coursera)",
            "issued_date": "2026",
        },
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
PORTFOLIO: list[dict[str, object]] = [
    {
        "title": "Movie Awards Video Analysis",
        "links": [
            {"label": "Live app", "url": "https://the-movie-awards.ca/"},
            {
                "label": "GitHub",
                "url": "https://github.com/chrisselig/movie_awards_video_analysis",
            },
        ],
    },
    {
        "title": "Fantasy Baseball Dashboard (Python + Claude Code)",
        "links": [
            {
                "label": "Live app",
                "url": "https://chris-selig.shinyapps.io/fantasy_baseball_dashboard/",
            },
            {
                "label": "GitHub",
                "url": "https://github.com/chrisselig/fantasy_baseball_forecasting",
            },
        ],
    },
    {
        "title": "Azure Data Engineering — Bike Sharing DW",
        "links": [
            {"label": "GitHub", "url": "https://github.com/chrisselig/bikesharingDW"}
        ],
    },
    {
        "title": "Azure Data Engineering — NYC Data Project",
        "links": [
            {
                "label": "GitHub",
                "url": "https://github.com/chrisselig/de_udacity_nycdata_project",
            }
        ],
    },
]

# ---------------------------------------------------------------------------
# Personality traits — the original 10 carried over from the ShinyResume
# project's personality_tbl.rds (self-assessed, scale of 0-20, rescaled to
# 0-100; Introvert/Creative manually adjusted upward from the raw rescale),
# plus 10 more self-assessed by hand. "link" ties a trait to a real resume
# bullet or fun fact where one genuinely fits — left None otherwise rather
# than forcing a connection that isn't there.
# ---------------------------------------------------------------------------
PERSONALITY_TRAITS: list[dict[str, object]] = [
    {"trait": "Analytical", "value": 80, "link": None},
    {"trait": "Curious", "value": 90, "link": None},
    {"trait": "Honest", "value": 90, "link": None},
    {"trait": "Humour", "value": 100, "link": None},
    {"trait": "Motivated", "value": 80, "link": None},
    {"trait": "Introvert", "value": 75, "link": None},
    {
        "trait": "Creative",
        "value": 60,
        "link": "Built the Movie Awards Video Analysis app — proof the data skills don't clock out at 5pm.",
    },
    {"trait": "Serious", "value": 30, "link": None},
    {"trait": "Extrovert", "value": 20, "link": None},
    {
        "trait": "Unmotivated",
        "value": 10,
        "link": (
            "Can still knock out Glass Joe in about a minute in Punch-Out!! "
            "— just don't always feel like proving it."
        ),
    },
    {
        "trait": "Leadership",
        "value": 40,
        "link": "Founder & Co-CEO of SELICA Analytics, leading a team of developers serving enterprise clients.",
    },
    {"trait": "Perfectionist", "value": 0, "link": None},
    {"trait": "Skeptical", "value": 50, "link": None},
    {"trait": "Stubborn", "value": 10, "link": None},
    {"trait": "Direct / Blunt", "value": 80, "link": None},
    {
        "trait": "Collaborative",
        "value": 90,
        "link": "Facilitated requirements-gathering sessions with stakeholders to drive Power BI report development.",
    },
    {"trait": "Patience", "value": 70, "link": None},
    {
        "trait": "Resourceful",
        "value": 80,
        "link": (
            "Reverse-engineered a large manual process that took days each "
            "month and sped it up using system resources and Power BI."
        ),
    },
    {
        "trait": "Mentoring",
        "value": 100,
        "link": "Delivered Power BI training sessions to groups across Canada and the US.",
    },
    {
        "trait": "Self-Taught",
        "value": 70,
        "link": "Keeps buying every technical book on a whim, chasing the next skill to learn.",
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


def _records(df: pd.DataFrame) -> list[dict[str, object]]:
    """Convert a DataFrame to JSON-safe records (NaN/NaT -> None)."""
    records = df.to_dict(orient="records")
    return [
        {
            k: (None if isinstance(v, float) and pd.isna(v) else v)
            for k, v in row.items()
        }
        for row in records
    ]


def load_resume() -> dict[str, object]:
    """Return the full resume (profile + all sections) as plain Python data."""
    return {
        "profile": dict(PROFILE),
        "stats": STATS,
        "focus_area_examples": FOCUS_AREA_EXAMPLES,
        "industries": INDUSTRIES,
        "skills": _records(SKILLS),
        "experience": {
            "featured": FEATURED_EXPERIENCE,
            "earlier": EARLIER_EXPERIENCE,
            "earlier_rewards": EARLIER_CAREER_REWARDS,
        },
        "education": _records(EDUCATION),
        "certifications": _records(CERTIFICATIONS),
        "portfolio": PORTFOLIO,
        "personality_traits": PERSONALITY_TRAITS,
        "fun_facts": FUN_FACTS,
        "hire_me_pool": REASONS_TO_HIRE_ME,
    }
