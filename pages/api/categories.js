// pages/api/categories.js

export default function handler(req, res) {
  const categories = {
    "Strategic Alignment": {
      levels: {
        "Ad Hoc": {
          description: "Workforce planning is reactive with no alignment to strategy.",
          potentialOwner: "Chief Strategy Officer, CHRO, or HR Business Partner",
          score: 2,
          plan: {
            "30 Days": [
              "Review current strategic documents – Identify any workforce-related mentions.",
              "Assess current planning process – Interview HR team members.",
              "Document gaps in strategic alignment – List current misalignments."
            ],
            "60 Days": [
              "Initiate alignment discussions – Schedule strategic planning meetings.",
              "Draft alignment roadmap – Create basic workflow toward integration.",
              "Identify early success indicators – Define short-term metrics."
            ],
            "90 Days": [
              "Embed in culture – Make workforce review part of team lead expectations.",
              "Report ROI – Link improvements to reduced turnover or cost savings.",
              "Refine annually – Review improvement system each year for growth."
            ]
          }
        },
        "Basic Alignment": {
          description: "Some efforts to align workforce planning with strategy exist.",
          potentialOwner: "Chief Strategy Officer, CHRO, or HR Business Partner",
          score: 5,
          plan: {
            "30 Days": [
              "Review prior workforce initiatives – Evaluate success rate.",
              "Meet with key department heads – Gather input on workforce needs.",
              "Map current planning cycle – Understand frequency and contributors."
            ],
            "60 Days": [
              "Design integration touchpoints – Identify when strategy feeds planning.",
              "Launch collaborative sessions – Align HR and strategy teams.",
              "Create alignment metrics – Define what success looks like."
            ],
            "90 Days": [
              "Implement key initiatives – Start integrated planning.",
              "Monitor effectiveness – Use metrics to track performance.",
              "Report progress – Share updates with leadership."
            ]
          }
        }
        // Add more levels if needed.
      }
    },
    "Leadership Engagement": {
      levels: {
        "Minimal Involvement": {
          score: 2,
          potentialOwner: "Chief People Officer, Department Head, or Executive Sponsor",
          description: "Leaders are not involved in workforce planning.",
          plan: {
            "30 Days": [
              "Identify key leaders - List directors and execs across departments",
              "Schedule engagement sessions - Set calendar invites for 1:1 discussions",
              "Educate leaders - Share 1-pager on workforce planning basics"
            ],
            "60 Days": [
              "Implement leadership workshops - Run short sessions on workforce strategy",
              "Encourage workforce decision-making - Assign small ownership roles",
              "Develop accountability metrics - Define 2–3 KPIs per leader"
            ],
            "90 Days": [
              "Measure engagement - Send leader survey on participation and value",
              "Adjust strategies - Use feedback to improve engagement methods",
              "Ensure long-term commitment - Include workforce goals in exec reviews"
            ]
          }
        }
        // Add other levels as needed.
      }
    }
    // Add the remaining categories following the same structure.
  };

  res.status(200).json(categories);
}

