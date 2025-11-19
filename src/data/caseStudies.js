// src/data/caseStudies.js
export const caseStudies = [
    {
        id: "satellite-forecast-2030",
        title: "Satellite Launch Growth – 2030 Forecast Using Linear & Log-Linear Models",
        company: "Independent Research",
        company_logo_url: "/images/logos/satellite.png",
        industry: "Space & Data",
        sector: "Forecasting & Analytics",
        thumbnail_url: "/images/thumbs/nxIh2.jpg",

        problem_statement:
            "Constellations like Starlink caused a sharp jump in satellites entering orbit between 2019–2020. I wanted to see what baseline models would predict for 2030 using UCS data from 2000–2022.",

        problem_description: `
**Context:** Global satellite launches accelerated sharply in the last five years, driven mostly by LEO internet constellations.  
**Pain:** Public forecasts are often hand-wavy or based on fleet announcements, not historical launch behavior.
`,

        root_cause_analysis: `
- Industry reports often extrapolate from company goals, not real launch cadence  
- Yearly growth became nonlinear after 2019 due to reusable rockets  
- Simple forecasts rarely show uncertainty or model behavior
`,

        proposed_solution: `
- Fit two quick baselines using historical UCS counts  
- **Linear regression** for a conservative trajectory  
- **Log-linear regression** to capture exponential growth post-2019  
- Compare both and bracket a reasonable 2030 range  
- Include the exact code snippet so others can reproduce it
`,

        expected_impact: `
- Transparent, reproducible forecasting baseline  
- Gives analysts a starting point before layering domain knowledge  
- Shows how much model choice alone can swing a 2030 estimate
`,

        key_learnings: `
- Growth is highly nonlinear after 2019  
- Even simple models disagree by more than 2x, so ranges matter  
- The 2019–2020 Starlink spike introduces structural breaks that should be modeled separately  
- Publishing the code builds trust and keeps analysis accountable
`,
        key_learnings: `
- Growth is highly nonlinear after 2019  
- Even simple models disagree by more than 2x, so ranges matter  
- The 2019–2020 Starlink spike introduces structural breaks that should be modeled separately  
- Publishing the code builds trust and keeps analysis accountable
`,
        created_date: "2025-11-07",
        featured: false,
        likes: 100,

        // Optional extras your CaseStudyDetail page will render via ReactMarkdown
        problem_description_extra: `
        ### Code Used
        \`\`\`python
        import pandas as pd
        import numpy as np
        from sklearn.linear_model import LinearRegression

        df = pd.read_csv("ucs_satellites_by_year.csv")
        X = df[['year']].values
        y = df['total'].values

        lin = LinearRegression().fit(X, y)
        loglin = LinearRegression().fit(X, np.log(y))

        print("2030 linear:", lin.predict([[2030]]))
        print("2030 log-linear:", np.exp(loglin.predict([[2030]])))
        \`\`\`

        ### Original Post on X
        I first shared the quick result here:  
        https://x.com/your-post-here
`
    },

    {
        id: "tesla-autopilot-safety",
        title: "Tesla Autopilot - Open Safety Program",
        company: "Tesla",
        company_logo_url: "/images/logos/tesla.png",
        industry: "Automotive",
        sector: "Safety & Compliance",
        thumbnail_url: `${process.env.PUBLIC_URL}/images/thumbs/Tesla.PNG`,
        problem_statement:
            "Lack of transparent safety data undermines public trust in autonomous vehicle technology",
        problem_description: `
**Context:** Highly scrutinized product with complex edge cases.  
**Pain:** Public trust, policy engagement, and developer focus misaligned due to opaque signals.
    `,
        root_cause_analysis: `
- No consistent external reporting for safety indicators  
- Safety reviews buried in internal tooling  
- Weak feedback loop from incidents → product priorities
    `,
        proposed_solution: `
- **Open Safety Dashboard** with rate-based indicators  
- Structured **incident taxonomy** + weekly triage  
- Executive **policy brief** pipeline connected to telemetry
    `,
        expected_impact: `
- Better regulator & community alignment  
- Faster corrective action on high-severity patterns  
- Stronger internal focus on risk-adjusted priorities
    `,
        key_learnings: `
- Narratives follow **trusted numbers**  
- Public safety metrics reduce speculation & improve cooperation  
- Incident taxonomy unlocks compounding insights
    `,
        featured: true,
        likes: 2,
        created_date: "2025-01-23",
    },


];
