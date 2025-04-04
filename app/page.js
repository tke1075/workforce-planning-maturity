"use client";

import { useState, useEffect } from "react";

// Mapping for each category's selection to its numeric score.
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

// Define the dropdown options for each category (with full text and descriptions).
const options = {
  "Strategic Alignment": [
    "Ad Hoc - Workforce planning is reactive with no alignment to strategy.",
    "Basic Alignment - Some efforts to align workforce planning with strategy exist.",
    "Integrated - Workforce planning is generally aligned with strategy.",
    "Strategic Partner - Workforce planning is fully integrated into strategic decisions.",
  ],
  "Leadership Engagement": [
    "Minimal Involvement - Leaders are not involved in workforce planning.",
    "Limited Engagement - Some leaders participate but inconsistently.",
    "Active Support - Leaders actively support workforce planning.",
    "Full Integration - Leaders fully integrate workforce planning into decision-making.",
  ],
  "Data-Driven Decision Making": [
    "No Data Usage - Decisions are made without workforce data.",
    "Basic Reports - Basic reporting is used occasionally.",
    "Advanced Analytics - Advanced analytics support workforce planning.",
    "Predictive Insights - Predictive insights drive workforce strategy.",
  ],
  "Talent Management": [
    "Reactive Hiring - Hiring is done reactively with no long-term plan.",
    "Basic Workforce Planning - Workforce planning exists but is not comprehensive.",
    "Talent Strategy - A structured talent strategy is in place.",
    "Proactive Workforce Design - Workforce planning is fully integrated and proactive.",
  ],
  "Cross-Functional Collaboration": [
    "Siloed Teams - Departments work independently with no collaboration.",
    "Limited Collaboration - Some departments collaborate, but it's inconsistent.",
    "Integrated Approach - Workforce planning is integrated across multiple teams.",
    "Strategic Partnership - Cross-functional collaboration drives workforce strategy.",
  ],
  "Resource Optimization": [
    "Ad Hoc Budgeting - Resources are allocated reactively with no long-term plan.",
    "Basic Resource Planning - Basic budgeting exists but lacks strategic planning.",
    "Efficient Allocation - Resources are allocated based on data-driven decisions.",
    "Strategic Resource Management - Resource planning is fully integrated with workforce strategy.",
  ],
  "Continuous Improvement": [
    "No Review Process - There is no formal review process for workforce planning.",
    "Basic Performance Tracking - Basic tracking is in place but lacks a strategic approach.",
    "Structured Improvement Plans - Reviews lead to structured improvement plans.",
    "Continuous Workforce Optimization - Continuous planning improvements drive organizational success.",
  ],
};

export default function Page() {
  // Initialize form state for all 7 categories.
  const [formData, setFormData] = useState({
    "Strategic Alignment": "",
    "Leadership Engagement": "",
    "Data-Driven Decision Making": "",
    "Talent Management": "",
    "Cross-Functional Collaboration": "",
    "Resource Optimization": "",
    "Continuous Improvement": "",
  });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [averageScore, setAverageScore] = useState(0);

  // Update the state for a given category.
  const handleChange = (category, value) => {
    setFormData((prevData) => ({ ...prevData, [category]: value }));
  };

  // Calculate average score locally using the score mapping.
  useEffect(() => {
    let total = 0;
    let count = 0;
    Object.keys(formData).forEach((cat) => {
      const selection = formData[cat];
      // We assume the option's value starts with the key used in scoreMapping.
      // For example: "Ad Hoc - Workforce planning is reactive..." → "Ad Hoc"
      const key = selection.split(" - ")[0];
      if (selection && scoreMapping[cat] && scoreMapping[cat][key]) {
        total += scoreMapping[cat][key];
        count++;
      }
    });
    const avg = count > 0 ? (total / count).toFixed(1) : 0;
    setAverageScore(avg);
  }, [formData]);

  // Handle form submission: send data to API and update result summary.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email,
      ...formData,
    };

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("Response from API:", result);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // ---------------------------
  // Return Block with Enhanced Styling using Bootstrap
  // ---------------------------
  return (
    <div className="container my-5">
      <div className="card p-4 shadow-sm">
        <h1 className="text-center mb-3">
          Workforce Planning Maturity Assessment
        </h1>
        <p className="text-center text-secondary mb-4">
          Get a custom 30-60-90 day plan to improve alignment, analytics, and more.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            {Object.keys(options).map((category) => (
              <div key={category} className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">{category}</h5>
                  <select
                    className="form-select"
                    value={formData[category]}
                    onChange={(e) => handleChange(category, e.target.value)}
                    required
                  >
                    <option value="">--Select a Level--</option>
                    {options[category].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
          {/* Email Field and Submit Button Card */}
          <div className="card mb-3">
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Enter your email:
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Email My Results
              </button>
            </div>
          </div>
        </form>
        {submitted && (
          <div className="mt-4">
            <h2>Results Summary</h2>
            <p>
              <strong>Average Score:</strong> {averageScore} / 10
            </p>
            <p>
              Detailed 30-60-90 day plans based on your selections has been
              emailed to you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

