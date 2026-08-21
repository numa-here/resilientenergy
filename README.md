# resilientenergy
# AI-Driven Energy Supply Chain Resilience

> **An AI-powered decision-support platform for monitoring, predicting, and responding to crude-oil supply chain disruptions in India.**

## 🚨 Problem

India is highly dependent on imported crude oil, making its energy supply vulnerable to geopolitical conflicts, sanctions, shipping disruptions, route closures, and sudden changes in global oil markets.

Traditional supply-chain planning systems often struggle to respond to rapidly changing geopolitical conditions.

The key question is:

**What should India do when a critical energy supply corridor is suddenly disrupted?**

---

## 💡 Our Solution

We built an AI-driven **Energy Supply Chain Resilience Platform** that continuously evaluates energy-supply risks, simulates potential disruptions, identifies alternative procurement strategies, and recommends strategic-reserve actions.

The platform follows a complete decision-support pipeline:

```text
Geopolitical & Logistics Data
            ↓
     Risk Intelligence
            ↓
   Disruption Prediction
            ↓
    Scenario Simulation
            ↓
 Procurement Optimization
            ↓
 Strategic Reserve Optimization
            ↓
     AI Recommendation
            ↓
     Human Decision-Maker
```

The goal is not to replace decision-makers, but to provide them with faster and more explainable intelligence.

---

# 🎯 Key Features

## 1. 🌍 Geopolitical Risk Intelligence

The platform evaluates geopolitical and logistics signals to calculate disruption-risk scores for major energy corridors and suppliers.

It provides:

* Corridor-level risk scores
* Supplier risk assessment
* Event severity classification
* Risk explanations
* Potential disruption probability
* Critical-event alerts

Example:

```text
Strait of Hormuz
Risk Score: 82/100
Status: HIGH RISK
```

The system also explains the factors contributing to the score.

---

## 2. 🗺️ Energy Supply Chain Digital Twin

An interactive map visualizes India's crude-oil supply network.

It represents:

* Oil-supplying countries
* Shipping corridors
* Strait of Hormuz
* Red Sea
* Suez Canal
* Indian ports
* Refineries
* Strategic reserves
* Alternative routes

Users can inspect individual routes and suppliers to understand their risk, dependency, estimated transit time, and alternatives.

---

## 3. 🔮 Disruption Scenario Simulator

Users can create hypothetical disruption scenarios and evaluate their potential consequences.

Example scenario:

**30-Day Partial Strait of Hormuz Disruption**

The simulator estimates changes in:

* Crude supply
* Supply gap
* Crude prices
* Transportation costs
* Refinery impact
* Strategic reserve coverage
* Overall energy security

The platform provides before-and-after comparisons to help decision-makers understand the potential consequences of a disruption.

---

## 4. 🤖 Adaptive Procurement Optimizer

When a major supply route is disrupted, the system evaluates alternative suppliers and routes.

Recommendations consider:

* Cost
* Availability
* Geopolitical risk
* Sanctions exposure
* Transit time
* Supplier reliability
* Shipping risk

The system ranks possible alternatives and explains why a particular option is recommended.

Example:

```text
RECOMMENDED ACTION

Diversify near-term procurement toward
lower-risk alternative suppliers and routes.

Reason:
Lower geopolitical exposure
+ acceptable cost
+ reliable availability
+ shorter transit time
```

---

## 5. 🛢️ Strategic Reserve Optimization

The platform models how strategic petroleum reserves could be used during a supply disruption.

Users can compare:

### Emergency Strategy

Prioritize immediate supply-gap reduction.

### Balanced Strategy

Balance immediate requirements with long-term reserve protection.

### Conservative Strategy

Preserve reserves for a prolonged disruption.

The system estimates:

* Reserve drawdown
* Remaining days of coverage
* Supply-gap reduction
* Recovery timeline

---

## 6. 📊 AI Command Center

The central dashboard provides decision-makers with a high-level view of the energy situation.

It includes:

* Energy Security Score
* Supply Disruption Risk
* Import Dependency
* Strategic Reserve Coverage
* Supply Gap
* Critical Corridors
* Active Alerts
* Top Risks
* AI-Generated Situation Brief

This allows decision-makers to understand the situation quickly without analyzing raw data manually.

---

## 7. 🚨 Alert & Incident Management

The system identifies important events and presents them as actionable alerts.

Each alert can contain:

* Event
* Severity
* Risk score
* Affected corridor
* Potential impact
* Timestamp
* Recommended action

Example:

```text
⚠️ HIGH-RISK ALERT

Event:
Strait of Hormuz disruption

Risk:
82/100

Potential Impact:
Significant reduction in crude availability

Recommended Action:
Evaluate alternative procurement routes.
```

---

# 🧠 AI Architecture

The platform is designed around multiple specialized AI components:

```text
                 DATA SOURCES
                      │
       ┌──────────────┼──────────────┐
       ↓              ↓              ↓
    News Data     Shipping Data   Market Data
       │              │              │
       └──────────────┼──────────────┘
                      ↓
             Geopolitical Risk AI
                      ↓
             Logistics Risk AI
                      ↓
          Disruption Prediction
                      ↓
             Scenario Simulator
                 ↙         ↘
                ↓           ↓
       Procurement AI    Reserve AI
                ↘           ↙
                      ↓
              AI Recommendation
                      ↓
               Human Decision
```

---

# 🧪 Demonstration Scenario

The primary demonstration scenario is:

## Strait of Hormuz — 30-Day Partial Disruption

The demonstration shows the complete decision-making process:

1. Detect increased geopolitical risk.
2. Increase the corridor risk score.
3. Estimate the resulting supply reduction.
4. Simulate the economic and operational impact.
5. Identify alternative suppliers.
6. Identify alternative transportation routes.
7. Rank procurement options.
8. Compare strategic-reserve strategies.
9. Generate an explainable AI recommendation.

This demonstrates how the platform can move from **early warning to actionable response**.

---

# 📈 Example Decision Flow

```text
Hormuz Risk Increases
        ↓
Supply Disruption Probability Increases
        ↓
Potential Crude Shortfall Detected
        ↓
Scenario Simulation
        ↓
Alternative Suppliers Evaluated
        ↓
Alternative Routes Evaluated
        ↓
Reserve Strategies Compared
        ↓
Optimal Response Generated
```

---

# 🔍 Explainable AI

A key design principle of the platform is **explainability**.

Instead of simply saying:

> "Use Supplier A."

the system explains:

```text
WHY THIS OPTION?

✓ Lower geopolitical risk
✓ Higher supplier reliability
✓ Adequate availability
✓ Lower route exposure
✓ Acceptable additional transportation cost
✓ Shorter estimated transit time
```

This allows human decision-makers to validate the recommendation before taking action.

---

# 🛡️ Human-in-the-Loop

The platform is designed as a **decision-support system**, not an autonomous control system.

AI provides:

**Prediction → Simulation → Recommendation**

Human decision-makers retain control over:

**Validation → Approval → Execution**

---

# ⚙️ Technology Stack

### Frontend

* React
* TypeScript
* Modern responsive UI
* Interactive dashboards
* Data visualizations
* Geospatial visualization

### AI / Data Intelligence

* Risk scoring
* Natural Language Processing
* Scenario modelling
* Optimization algorithms
* Generative AI for explanations and executive summaries

### Backend

* API-based architecture
* Structured data processing
* Modular AI services
* Database integration

### Data Sources

The production architecture can be connected to:

* News and geopolitical intelligence
* Shipping/AIS data
* Sanctions data
* Crude-price data
* Port and logistics data
* Weather information
* Public energy datasets

> **Note:** The current hackathon prototype may use simulated/demo data where live APIs are unavailable. Such values are explicitly treated as simulation data and should not be interpreted as live operational intelligence.

---

# 🚀 Future Scope

The platform can be extended with:

* Real-time AIS vessel tracking
* Live geopolitical news ingestion
* Real-time sanctions monitoring
* Live crude-price feeds
* Weather and maritime-risk integration
* Advanced ML forecasting
* More detailed refinery modelling
* India-wide energy infrastructure digital twin
* Automated scenario generation
* Historical disruption analysis
* Multi-country energy-risk comparison

---

# 🎯 Impact

The platform aims to help energy decision-makers:

* Detect emerging supply risks earlier
* Understand cascading disruption effects
* Compare alternative procurement options
* Optimize strategic reserve usage
* Reduce dependence on vulnerable corridors
* Improve energy supply resilience
* Make faster, evidence-based decisions

---

# 🏆 Hackathon Value Proposition

### Traditional Approach

```text
Data → Human Analysis → Decision
```

### Our Approach

```text
Continuous Intelligence
        ↓
AI Risk Detection
        ↓
Impact Simulation
        ↓
Optimization
        ↓
Explainable Recommendation
        ↓
Human Decision
```

**We don't just predict the disruption.
We predict its impact and recommend what to do next.**

---

## ⚠️ Disclaimer

This platform is a prototype developed for demonstration and decision-support purposes.

AI-generated predictions, simulations, recommendations, and economic estimates should be validated by qualified experts and authoritative data sources before being used for real-world operational or policy decisions.
