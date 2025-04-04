import nodemailer from "nodemailer";
import { google } from "googleapis";

// ---------------------------------------------------------
// MAPPINGS: Score, Potential Owner, and Detailed 30-60-90 Plans
// ---------------------------------------------------------

// Numeric score mapping for each category's selection.
const scoreMapping = {
  "Strategic Alignment": {
    "Ad Hoc": 2,
    "Basic Alignment": 5,
    "Integrated": 7,
    "Strategic Partner": 10,
  },
  "Leadership Engagement": {
    "Minimal Involvement": 2,
    "Limited Engagement": 4,
    "Active Support": 7,
    "Full Integration": 10,
  },
  "Data-Driven Decision Making": {
    "No Data Usage": 2,
    "Basic Reports": 4,
    "Advanced Analytics": 7,
    "Predictive Insights": 10,
  },
  "Talent Management": {
    "Reactive Hiring": 2,
    "Basic Workforce Planning": 4,
    "Talent Strategy": 7,
    "Proactive Workforce Design": 10,
  },
  "Cross-Functional Collaboration": {
    "Siloed Teams": 2,
    "Limited Collaboration": 4,
    "Integrated Approach": 7,
    "Strategic Partnership": 10,
  },
  "Resource Optimization": {
    "Ad Hoc Budgeting": 2,
    "Basic Resource Planning": 4,
    "Efficient Allocation": 7,
    "Strategic Resource Management": 10,
  },
  "Continuous Improvement": {
    "No Review Process": 2,
    "Basic Performance Tracking": 4,
    "Structured Improvement Plans": 7,
    "Continuous Workforce Optimization": 10,
  },
};

// Mapping for potential owner for each category's selection.
const potentialOwnerMapping = {
  "Strategic Alignment": {
    "Ad Hoc": "Chief Strategy Officer, CHRO, or HR Business Partner",
    "Basic Alignment": "Chief Strategy Officer, CHRO, or HR Business Partner",
    "Integrated": "Chief Strategy Officer, CHRO, or HR Business Partner",
    "Strategic Partner": "Chief Strategy Officer, CHRO, or HR Business Partner",
  },
  "Leadership Engagement": {
    "Minimal Involvement": "Chief People Officer, Department Head, or Executive Sponsor",
    "Limited Engagement": "Chief People Officer, Department Head, or Executive Sponsor",
    "Active Support": "Chief People Officer, Department Head, or Executive Sponsor",
    "Full Integration": "Chief People Officer, Department Head, or Executive Sponsor",
  },
  "Data-Driven Decision Making": {
    "No Data Usage": "People Analytics Lead, HRIS Manager, or Data Analyst",
    "Basic Reports": "People Analytics Lead, HRIS Manager, or Data Analyst",
    "Advanced Analytics": "People Analytics Lead, HRIS Manager, or Data Analyst",
    "Predictive Insights": "People Analytics Lead, HRIS Manager, or Data Analyst",
  },
  "Talent Management": {
    "Reactive Hiring": "Talent Acquisition Lead, HR Business Partner, or People Operations Manager",
    "Basic Workforce Planning": "Talent Acquisition Lead, HR Business Partner, or People Operations Manager",
    "Talent Strategy": "Chief People Officer, Talent Acquisition Lead, or People Operations Manager",
    "Proactive Workforce Design": "Chief People Officer, Organizational Development Lead, or Workforce Planning Manager",
  },
  "Cross-Functional Collaboration": {
    "Siloed Teams": "Chief Operating Officer, HR Business Partner, or Department Manager",
    "Limited Collaboration": "Chief Operating Officer, Program Manager, or People Operations Manager",
    "Integrated Approach": "Chief People Officer, Chief Operating Officer, or Transformation Lead",
    "Strategic Partnership": "Chief People Officer, Chief Strategy Officer, or Executive Sponsor",
  },
  "Resource Optimization": {
    "Ad Hoc Budgeting": "Finance Manager, HR Business Partner, or Department Head",
    "Basic Resource Planning": "Director of Finance, Workforce Planning Analyst, or HR Manager",
    "Efficient Allocation": "VP of Finance, HR Director, or Strategic Planning Lead",
    "Strategic Resource Management": "Chief Financial Officer, Chief People Officer, or Strategic Workforce Planner",
  },
  "Continuous Improvement": {
    "No Review Process": "HR Coordinator, Operations Analyst, or Department Admin",
    "Basic Performance Tracking": "HR Analyst, Department Lead, or People Operations Specialist",
    "Structured Improvement Plans": "HR Director, Talent Development Manager, or Business Unit Leader",
    "Continuous Workforce Optimization": "Chief People Officer, Director of Organizational Effectiveness, or Strategic HR Partner",
  },
};

// Detailed 30-60-90 day plans for each category and selection, including a description.
const detailedPlans = {
  "Strategic Alignment": {
    "Ad Hoc": {
      description: "Workforce planning is reactive with no alignment to strategy.",
      "30 Days": [
        "Review current strategic documents – Identify any workforce-related mentions.",
        "Assess current planning process – Interview HR team members.",
        "Document gaps in strategic alignment – List current misalignments.",
      ],
      "60 Days": [
        "Initiate alignment discussions – Schedule strategic planning meetings.",
        "Draft alignment roadmap – Create basic workflow toward integration.",
        "Identify early success indicators – Define short-term metrics.",
      ],
      "90 Days": [
        "Embed in culture – Make workforce review part of team lead expectations.",
        "Report ROI – Link improvements to reduced turnover or cost savings.",
        "Refine annually – Review improvement system each year for growth.",
      ],
    },
    "Basic Alignment": {
      description: "Some efforts to align workforce planning with strategy exist.",
      "30 Days": [
        "Review prior workforce initiatives – Evaluate success rate.",
        "Meet with key department heads – Gather input on workforce needs.",
        "Map current planning cycle – Understand frequency and contributors.",
      ],
      "60 Days": [
        "Design integration touchpoints – Identify when strategy feeds planning.",
        "Launch collaborative sessions – Align HR and strategy teams.",
        "Create alignment metrics – Define what success looks like.",
      ],
      "90 Days": [
        "Implement key initiatives – Start integrated planning.",
        "Monitor effectiveness – Use metrics to track performance.",
        "Report progress – Share updates with leadership.",
      ],
    },
    "Integrated": {
      description: "Workforce planning is generally aligned with strategy.",
      "30 Days": [
        "Validate current planning processes – Confirm alignment with strategic goals.",
        "Capture recent strategic shifts – Identify impacts on workforce needs.",
        "Update integration points – Refine the planning calendar.",
      ],
      "60 Days": [
        "Facilitate cross-departmental planning – Schedule workshops and sessions.",
        "Integrate strategic feedback – Use data to update workforce projections.",
        "Enhance collaboration – Assign dedicated planning roles.",
      ],
      "90 Days": [
        "Document best practices – Share successful planning methods across the organization.",
        "Expand forecasting horizons – Extend planning into longer-term scenarios.",
        "Align with budgeting cycles – Integrate workforce plans with financial reviews.",
      ],
    },
    "Strategic Partner": {
      description: "Workforce planning is fully integrated into strategic decisions.",
      "30 Days": [
        "Conduct an executive strategy review – Ensure full alignment with company goals.",
        "Audit current workforce strategy – Identify gaps and opportunities.",
        "Develop a comprehensive communication plan – Engage all stakeholders.",
      ],
      "60 Days": [
        "Establish a strategic workforce planning committee – Include key leaders from all departments.",
        "Integrate KPIs into executive dashboards – Make workforce impact visible.",
        "Roll out advanced planning tools – Support data-driven decision making.",
      ],
      "90 Days": [
        "Review overall outcomes with executives – Present key performance trends.",
        "Iterate the planning process – Adjust strategies based on feedback.",
        "Celebrate successes – Recognize milestones and improvements across teams.",
      ],
    },
  },
  "Leadership Engagement": {
    "Minimal Involvement": {
      description: "Leaders are not involved in workforce planning.",
      "30 Days": [
        "Identify key leaders – List directors and executives across departments.",
        "Schedule initial engagement meetings – Set up one-on-one sessions.",
        "Provide basic orientation – Explain the importance of workforce planning.",
      ],
      "60 Days": [
        "Conduct leadership workshops – Introduce basic workforce planning concepts.",
        "Define accountability metrics – Establish simple KPIs for engagement.",
        "Initiate regular communication – Start monthly check-ins.",
      ],
      "90 Days": [
        "Measure engagement impact – Use surveys or feedback forms.",
        "Refine leadership roles – Adjust responsibilities based on feedback.",
        "Establish long-term engagement plans – Integrate workforce planning in executive reviews.",
      ],
    },
    "Limited Engagement": {
      description: "Some leaders participate but inconsistently.",
      "30 Days": [
        "Survey leadership – Identify current engagement levels.",
        "Highlight critical areas – Emphasize key strategic needs.",
        "Schedule introductory sessions – Inform leaders about workforce planning.",
      ],
      "60 Days": [
        "Formalize leadership roles – Clearly define responsibilities in planning.",
        "Conduct targeted training sessions – Provide deeper insights into planning processes.",
        "Create shared dashboards – Increase transparency of workforce metrics.",
      ],
      "90 Days": [
        "Evaluate participation – Review engagement data and feedback.",
        "Optimize collaboration – Adjust processes to better involve leaders.",
        "Set up periodic reviews – Integrate planning results into executive meetings.",
      ],
    },
    "Active Support": {
      description: "Leaders actively support workforce planning.",
      "30 Days": [
        "Map current leadership involvement – Document activities related to planning.",
        "Identify engagement gaps – Highlight areas needing more active support.",
        "Align priorities – Ensure leaders understand workforce goals.",
      ],
      "60 Days": [
        "Expand decision-making roles – Assign specific planning tasks to leaders.",
        "Share performance data – Provide detailed workforce metrics.",
        "Establish cross-functional committees – Facilitate collaboration between departments.",
      ],
      "90 Days": [
        "Review leadership impact – Analyze the outcomes of active support initiatives.",
        "Refine engagement strategies – Adjust based on performance data.",
        "Formalize ongoing collaboration – Integrate leadership support into regular reviews.",
      ],
    },
    "Full Integration": {
      description: "Leaders fully integrate workforce planning into decision-making.",
      "30 Days": [
        "Document current leadership practices – Ensure full transparency in planning.",
        "Conduct comprehensive strategy reviews – Align workforce planning with business goals.",
        "Reinforce executive commitment – Publicly affirm leadership support.",
      ],
      "60 Days": [
        "Establish a formal planning council – Include all key leadership figures.",
        "Integrate advanced KPIs – Monitor workforce impact through detailed dashboards.",
        "Roll out collaborative initiatives – Launch integrated planning projects.",
      ],
      "90 Days": [
        "Assess long-term outcomes – Measure improvements in planning effectiveness.",
        "Iterate and refine processes – Continuously optimize leadership engagement.",
        "Celebrate integrated success – Recognize contributions in a company-wide forum.",
      ],
    },
  },
  "Data-Driven Decision Making": {
    "No Data Usage": {
      description: "Decisions are made without workforce data.",
      "30 Days": [
        "Identify key data sources – Review available workforce and business data systems.",
        "Assess current decision-making – Determine how decisions are made without data.",
        "Interview key stakeholders – Understand the impact of non-data decisions.",
      ],
      "60 Days": [
        "Develop baseline reports – Create simple summaries using available data.",
        "Provide data literacy training – Introduce basic data concepts to decision-makers.",
        "Establish initial KPIs – Define essential workforce performance indicators.",
      ],
      "90 Days": [
        "Integrate basic data into planning – Begin incorporating data into decision-making.",
        "Gather feedback on reports – Assess improvements and identify gaps.",
        "Plan for advanced analytics – Outline steps for deeper data integration.",
      ],
    },
    "Basic Reports": {
      description: "Basic reporting is used occasionally.",
      "30 Days": [
        "Review existing reporting methods – Evaluate current data reports.",
        "Identify gaps – Determine what information is missing.",
        "Standardize data collection – Ensure consistency across departments.",
      ],
      "60 Days": [
        "Improve report accessibility – Centralize reports for easier access.",
        "Establish a regular reporting cadence – Set consistent intervals for updates.",
        "Train staff on data interpretation – Educate on reading and using reports.",
      ],
      "90 Days": [
        "Incorporate reports into meetings – Use data to drive strategic decisions.",
        "Gather feedback – Identify improvements in reporting and data usage.",
        "Plan for advanced reporting – Consider next steps for enhanced analytics.",
      ],
    },
    "Advanced Analytics": {
      description: "Advanced analytics support workforce planning.",
      "30 Days": [
        "Audit current analytics tools – List platforms and tools in use.",
        "Validate existing KPIs – Ensure alignment with workforce goals.",
        "Assess internal capabilities – Evaluate staff skills in data analytics.",
      ],
      "60 Days": [
        "Develop new dashboards – Create or refine interactive analytics dashboards.",
        "Conduct advanced analytics training – Deepen team skills in data analysis.",
        "Expand KPI metrics – Introduce more detailed performance measures.",
      ],
      "90 Days": [
        "Automate reporting processes – Implement automated data pipelines.",
        "Integrate analytics into planning – Make insights central to decision-making.",
        "Review ROI – Measure the business impact of advanced analytics.",
      ],
    },
    "Predictive Insights": {
      description: "Predictive insights drive workforce strategy.",
      "30 Days": [
        "Introduce predictive models – Test models for attrition, hiring, etc.",
        "Engage decision-makers – Demonstrate the benefits of predictive insights.",
        "Train data teams – Focus on building predictive modeling skills.",
      ],
      "60 Days": [
        "Refine predictive models – Adjust models based on feedback and data.",
        "Integrate predictions into planning – Use forecasts for scenario planning.",
        "Demonstrate impact – Show how predictions can influence business outcomes.",
      ],
      "90 Days": [
        "Expand prediction areas – Develop models for skills gaps or performance trends.",
        "Build internal expertise – Increase training and hiring in predictive analytics.",
        "Establish governance – Set policies for ethical and effective use of predictive data.",
      ],
    },
  },
  "Talent Management": {
    "Reactive Hiring": {
      description: "Hiring is done reactively with no long-term plan.",
      "30 Days": [
        "Audit current hiring practices – Identify gaps and urgent needs.",
        "Review recent hires – Evaluate the effectiveness of reactive hiring.",
        "Communicate with department heads – Understand immediate staffing challenges.",
      ],
      "60 Days": [
        "Document hiring bottlenecks – Identify recurring issues in the process.",
        "Develop a short-term hiring strategy – Plan for filling critical roles quickly.",
        "Implement quick training sessions – Prepare managers for faster onboarding.",
      ],
      "90 Days": [
        "Review reactive hiring outcomes – Analyze time-to-fill and turnover metrics.",
        "Transition to proactive planning – Begin integrating long-term strategies.",
        "Establish initial KPIs – Measure improvements in hiring efficiency.",
      ],
    },
    "Basic Workforce Planning": {
      description: "Workforce planning exists but is not comprehensive.",
      "30 Days": [
        "Map current roles – Create an updated inventory of positions.",
        "Assess future headcount – Gather input from department managers.",
        "Identify critical roles – Pinpoint positions that most affect operations.",
      ],
      "60 Days": [
        "Develop baseline workforce plans – Outline staffing requirements.",
        "Begin succession planning – Identify potential internal candidates for key roles.",
        "Link hiring to budgeting – Coordinate with finance on staffing costs.",
      ],
      "90 Days": [
        "Conduct a full workforce review – Evaluate planning processes and outcomes.",
        "Adjust planning strategies – Refine the workforce plan based on feedback.",
        "Establish regular review cycles – Set quarterly workforce planning meetings.",
      ],
    },
    "Talent Strategy": {
      description: "A structured talent strategy is in place.",
      "30 Days": [
        "Review existing talent strategy – Assess alignment with business goals.",
        "Analyze workforce data – Validate current talent metrics.",
        "Engage leadership – Confirm support for strategic talent initiatives.",
      ],
      "60 Days": [
        "Refine the employee value proposition – Clarify benefits and growth opportunities.",
        "Adjust talent sourcing strategies – Focus on attracting high-quality candidates.",
        "Develop targeted training programs – Enhance skills for key roles.",
      ],
      "90 Days": [
        "Monitor talent retention – Track turnover and engagement metrics.",
        "Scale successful initiatives – Expand programs yielding positive results.",
        "Align talent strategy with organizational goals – Integrate feedback into a long-term plan.",
      ],
    },
    "Proactive Workforce Design": {
      description: "Workforce planning is fully integrated and proactive.",
      "30 Days": [
        "Forecast future skill needs – Identify emerging trends and gaps.",
        "Engage with department heads – Determine long-term staffing requirements.",
        "Review current organizational design – Assess alignment with future needs.",
      ],
      "60 Days": [
        "Develop a proactive hiring model – Create a roadmap for future talent acquisition.",
        "Initiate reskilling programs – Prepare existing employees for new roles.",
        "Integrate design with budgeting – Align workforce design with financial planning.",
      ],
      "90 Days": [
        "Implement the proactive model – Roll out planned changes to workforce structure.",
        "Measure impact on performance – Evaluate improvements in organizational agility.",
        "Refine the workforce design strategy – Adjust based on performance data and market changes.",
      ],
    },
  },
  "Cross-Functional Collaboration": {
    "Siloed Teams": {
      description: "Departments work independently with no collaboration.",
      "30 Days": [
        "Identify isolated teams – Survey departments to pinpoint communication gaps.",
        "Map siloed workflows – Document where handoffs and processes break down.",
        "Initiate initial outreach – Start conversations between isolated groups.",
      ],
      "60 Days": [
        "Hold interdepartmental meetings – Facilitate introductions and share objectives.",
        "Define basic collaboration metrics – Establish simple KPIs for joint efforts.",
        "Launch pilot projects – Test small-scale collaborative initiatives.",
      ],
      "90 Days": [
        "Assess pilot outcomes – Evaluate the effectiveness of initial collaboration.",
        "Standardize communication workflows – Optimize handoffs between teams.",
        "Share success stories – Publicize early wins to encourage broader collaboration.",
      ],
    },
    "Limited Collaboration": {
      description: "Some departments collaborate, but it's inconsistent.",
      "30 Days": [
        "Audit collaboration tools – Identify current practices and gaps.",
        "Gather feedback – Survey teams on interdepartmental challenges.",
        "Schedule preliminary cross-team check-ins – Establish regular touchpoints.",
      ],
      "60 Days": [
        "Formalize collaborative roles – Clearly define responsibilities for joint projects.",
        "Develop shared dashboards – Increase transparency across departments.",
        "Conduct targeted training sessions – Improve interdepartmental communication skills.",
      ],
      "90 Days": [
        "Evaluate collaboration performance – Analyze outcomes of joint initiatives.",
        "Optimize processes – Refine roles and workflows based on feedback.",
        "Plan for expansion – Scale up successful collaborative practices.",
      ],
    },
    "Integrated Approach": {
      description: "Workforce planning is integrated across multiple teams.",
      "30 Days": [
        "Define shared goals – Align interdepartmental objectives and priorities.",
        "Map interdependencies – Identify overlapping functions and processes.",
        "Engage team leaders – Initiate discussions on collaborative opportunities.",
      ],
      "60 Days": [
        "Launch joint initiatives – Start cross-functional projects to address shared challenges.",
        "Establish common metrics – Track performance of integrated efforts.",
        "Facilitate peer learning – Organize workshops to share best practices.",
      ],
      "90 Days": [
        "Review integrated processes – Assess the impact of collaboration on performance.",
        "Iterate strategies – Refine plans based on collective feedback.",
        "Institutionalize collaboration – Embed cross-functional work into regular planning cycles.",
      ],
    },
    "Strategic Partnership": {
      description: "Cross-functional collaboration drives workforce strategy.",
      "30 Days": [
        "Form a cross-functional steering group – Include leaders from all relevant departments.",
        "Align strategic priorities – Ensure all teams support the common vision.",
        "Initiate integrated planning sessions – Start regular, wide-ranging meetings.",
      ],
      "60 Days": [
        "Develop shared KPIs – Create performance indicators that reflect joint efforts.",
        "Roll out enterprise-wide projects – Implement large-scale collaboration initiatives.",
        "Provide comprehensive training – Equip teams with tools for effective cross-functional work.",
      ],
      "90 Days": [
        "Review overall outcomes – Analyze the impact of cross-functional strategies on the organization.",
        "Refine strategic plans – Update processes based on performance data.",
        "Celebrate collaborative success – Recognize achievements and incentivize partnership.",
      ],
    },
  },
  "Resource Optimization": {
    "Ad Hoc Budgeting": {
      description: "Resources are allocated reactively with no long-term plan.",
      "30 Days": [
        "Identify current spending – Gather data on workforce-related costs.",
        "Interview department heads – Understand immediate budget constraints.",
        "Highlight reactive resource allocation – Document instances of ad hoc spending.",
      ],
      "60 Days": [
        "Draft a basic budget plan – Align resource allocation with immediate needs.",
        "Implement simple forecasting – Use past data for short-term planning.",
        "Monitor reactive spending – Track cost overruns and inefficiencies.",
      ],
      "90 Days": [
        "Review budget performance – Compare planned vs. actual spending.",
        "Establish regular budgeting reviews – Set up quarterly budget meetings.",
        "Transition to structured planning – Start integrating long-term resource planning.",
      ],
    },
    "Basic Resource Planning": {
      description: "Basic budgeting exists but lacks strategic planning.",
      "30 Days": [
        "Review existing budgets – Analyze current resource allocation patterns.",
        "Identify resource gaps – Determine which areas lack proper budgeting.",
        "Collect historical spending data – Gather past financial reports.",
      ],
      "60 Days": [
        "Develop a basic budgeting framework – Outline key resource allocation processes.",
        "Align budgets with staffing needs – Coordinate with HR and department heads.",
        "Train managers on budgeting basics – Ensure proper financial oversight.",
      ],
      "90 Days": [
        "Implement a structured resource plan – Transition to a more organized budgeting process.",
        "Evaluate planning effectiveness – Compare budget forecasts with actual spending.",
        "Refine budgeting procedures – Adjust the framework based on feedback.",
      ],
    },
    "Efficient Allocation": {
      description: "Resources are allocated based on data-driven decisions.",
      "30 Days": [
        "Consolidate resource data – Merge budget, headcount, and performance metrics.",
        "Audit current resource usage – Identify inefficiencies in allocation.",
        "Define priority criteria – Determine which functions receive resources first.",
      ],
      "60 Days": [
        "Introduce zero-based budgeting – Justify every resource allocation from scratch.",
        "Implement resource dashboards – Visualize allocation against performance.",
        "Engage with department leaders – Align resource allocation with strategic goals.",
      ],
      "90 Days": [
        "Review and adjust resource allocation – Continuously optimize based on performance data.",
        "Standardize allocation reporting – Create consistent budgeting reports.",
        "Ensure ongoing efficiency – Set up routine audits and performance reviews.",
      ],
    },
    "Strategic Resource Management": {
      description: "Resource planning is fully integrated with workforce strategy.",
      "30 Days": [
        "Establish integrated planning meetings – Sync HR, finance, and operations.",
        "Map future resource needs – Forecast staffing and technology requirements.",
        "Define strategic priorities – Identify critical areas for investment.",
      ],
      "60 Days": [
        "Develop long-term budgeting models – Integrate strategic forecasts with budgeting.",
        "Implement agile resource planning – Allow flexibility in resource allocation.",
        "Communicate strategic goals – Ensure all departments understand resource priorities.",
      ],
      "90 Days": [
        "Integrate resource management into business reviews – Align financial planning with strategic outcomes.",
        "Refine allocation strategies – Use performance data to adjust resource distribution.",
        "Establish continuous review processes – Monitor and optimize resource usage regularly.",
      ],
    },
  },
  "Continuous Improvement": {
    "No Review Process": {
      description: "There is no formal review process for workforce planning.",
      "30 Days": [
        "Assess current review practices – Identify if any review process exists.",
        "Gather feedback from teams – Collect initial input on review needs.",
        "Document existing gaps – Note where regular reviews are absent.",
      ],
      "60 Days": [
        "Develop a basic review checklist – Establish simple criteria for performance assessment.",
        "Pilot regular reviews – Implement trial review sessions in select departments.",
        "Collect performance data – Monitor outcomes of the initial review process.",
      ],
      "90 Days": [
        "Evaluate pilot results – Analyze feedback and review data.",
        "Refine the review process – Adjust checklist and schedule based on pilot insights.",
        "Plan for full-scale implementation – Prepare to roll out a formal review process company-wide.",
      ],
    },
    "Basic Performance Tracking": {
      description: "Basic tracking is in place but lacks a strategic approach.",
      "30 Days": [
        "Identify key performance indicators – Determine baseline metrics for workforce performance.",
        "Establish initial tracking methods – Use simple tools or spreadsheets for data collection.",
        "Communicate the need for tracking – Inform teams about upcoming performance tracking.",
      ],
      "60 Days": [
        "Implement regular data collection – Set a schedule for performance reviews.",
        "Consolidate tracking data – Centralize data from various departments.",
        "Review baseline performance – Compare current data with initial expectations.",
      ],
      "90 Days": [
        "Analyze performance trends – Identify recurring issues or improvements.",
        "Refine tracking tools – Upgrade to more robust tools or dashboards as needed.",
        "Set performance targets – Establish benchmarks based on the collected data.",
      ],
    },
    "Structured Improvement Plans": {
      description: "Reviews lead to structured improvement plans.",
      "30 Days": [
        "Set improvement targets – Define what success looks like for each metric.",
        "Draft standard action plans – Create templates for improvement strategies.",
        "Train team leaders – Educate them on developing and implementing improvement plans.",
      ],
      "60 Days": [
        "Launch improvement initiatives – Start structured projects in key areas.",
        "Monitor progress closely – Use metrics to track outcomes.",
        "Collect feedback – Gather input on the effectiveness of the plans.",
      ],
      "90 Days": [
        "Evaluate effectiveness – Assess results of improvement initiatives.",
        "Refine action plans – Update templates based on performance and feedback.",
        "Establish continuous cycles – Set up regular reviews and iterations for improvement.",
      ],
    },
    "Continuous Workforce Optimization": {
      description: "Continuous planning improvements drive organizational success.",
      "30 Days": [
        "Integrate continuous review – Embed review processes into daily operations.",
        "Identify optimization opportunities – Pinpoint areas for ongoing improvement.",
        "Form an optimization task force – Create a team dedicated to workforce improvements.",
      ],
      "60 Days": [
        "Implement continuous monitoring – Use automated tools for real-time data.",
        "Scale successful initiatives – Expand effective improvements company-wide.",
        "Encourage a feedback culture – Establish channels for continuous suggestions.",
      ],
      "90 Days": [
        "Review overall impact – Measure the effect of continuous optimization on performance.",
        "Document best practices – Standardize and share successful strategies.",
        "Plan future enhancements – Set goals for the next phase of optimization.",
      ],
    },
  },
};

// ---------------------------------------------------------
// API Endpoint Handler: Process POST Request, Build Email HTML, and Send Email
// ---------------------------------------------------------
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Destructure incoming data from the request body.
  const {
    email,
    "Strategic Alignment": strategicAlignment,
    "Leadership Engagement": leadershipEngagement,
    "Data-Driven Decision Making": dataDriven,
    "Talent Management": talentManagement,
    "Cross-Functional Collaboration": crossFunctional,
    "Resource Optimization": resourceOptimization,
    "Continuous Improvement": continuousImprovement,
  } = req.body;

  // List of all categories.
  const categories = [
    "Strategic Alignment",
    "Leadership Engagement",
    "Data-Driven Decision Making",
    "Talent Management",
    "Cross-Functional Collaboration",
    "Resource Optimization",
    "Continuous Improvement",
  ];

  let totalScore = 0;
  let count = 0;
  let plansHTML = "";

  // Loop over each category to build HTML for detailed plans.
  categories.forEach((cat) => {
    const selection = req.body[cat];
    if (selection) {
      // Extract the key from the selection text.
      const key = selection.split(" - ")[0];
      if (scoreMapping[cat] && scoreMapping[cat][key]) {
        totalScore += scoreMapping[cat][key];
        count++;

        // Get the detailed plan object for this category and key.
        const selectionObj = detailedPlans[cat] && detailedPlans[cat][key];
        const descriptionText =
          selectionObj && selectionObj.description
            ? ` - ${selectionObj.description}`
            : "";

        plansHTML += `<h3>${cat} - ${key}${descriptionText}</h3>`;
        plansHTML += `<p><strong>Score:</strong> ${scoreMapping[cat][key]}/10</p>`;

        if (
          potentialOwnerMapping[cat] &&
          potentialOwnerMapping[cat][key]
        ) {
          plansHTML += `<p><strong>Potential Owner:</strong> ${potentialOwnerMapping[cat][key]}</p>`;
        }

        if (selectionObj) {
          plansHTML += "<ul>";
          ["30 Days", "60 Days", "90 Days"].forEach((period) => {
            if (Array.isArray(selectionObj[period])) {
              plansHTML += `<li><strong>${period}:</strong><br>${selectionObj[period].join("<br>")}</li>`;
            }
          });
          plansHTML += "</ul>";
        }
      }
    }
  });

  const averageScore = count ? (totalScore / count).toFixed(1) : 0;

  // Construct the final email HTML content.
  const htmlContent = `
    <h1>Your Workforce Planning Maturity Assessment Results</h1>
    <p><strong>Email:</strong> ${req.body.email}</p>
    <p><strong>Average Score:</strong> ${averageScore} / 10</p>
    ${
      plansHTML
        ? `<h2>Detailed 30-60-90 Day Plans</h2>${plansHTML}`
        : "<p>No detailed plans available.</p>"
    }
  `;

  // ---------------------------------------------------------
  // Set up OAuth2 Client for Gmail (using your environment variables).
  // ---------------------------------------------------------
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );
  oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  try {
    // Retrieve an access token for Gmail SMTP.
    const accessTokenObj = await oAuth2Client.getAccessToken();
    const accessToken =
      typeof accessTokenObj === "object" ? accessTokenObj.token : accessTokenObj;

    // Create the Nodemailer transporter using OAuth2.
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    // Set up the email options.
    const mailOptions = {
      from: `Workforce Assessment <${process.env.EMAIL_USER}>`,
      to: email,
      cc: process.env.CC_EMAIL || process.env.EMAIL_USER,
      subject: "Your Workforce Planning Maturity Assessment Results",
      html: htmlContent,
    };

    // Send the email.
    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result);
    res.status(200).json({ message: "Email sent successfully!", result });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email", error: error.toString() });
  }
}

