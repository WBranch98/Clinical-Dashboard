# Clinical Dashboard

A React-based clinical analytics dashboard built on HAPI FHIR R4, demonstrating real-world health data interoperability concepts including FHIR resource navigation, LOINC-coded observations, and population health visualization. Patient data is generated using Synthea — an open-source synthetic patient generator — ensuring no real PHI is used.

## Features

- Patient list with demographics (name, age, gender, city)
- Summary stat cards showing condition, encounter, and observation counts
- Interactive vitals trend charts with dropdown (body weight, systolic/diastolic BP, heart rate)
- Active and resolved conditions panel with one-click filtering
- Encounter history filtered by class (AMB outpatient, EMER emergency, IMP inpatient)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Recharts |
| FHIR Server | HAPI FHIR R4 (local) |
| Synthetic Data | Synthea |
| Standards | HL7 FHIR R4, LOINC, SNOMED CT |

## Architecture

```
Synthea (synthetic patients)
        ↓
HAPI FHIR Server (localhost:8080)
        ↓
React Dashboard (localhost:3000)
  ├── fhirService.js  (all API calls)
  ├── PatientList.jsx
  ├── PatientSummary.jsx
  ├── VitalsTrend.jsx
  ├── ConditionsList.jsx
  └── EncounterHistory.jsx
```

## FHIR Resources Used

| Resource | Purpose |
|----------|---------|
| Patient | Demographics, identifiers |
| Observation | Vitals and lab results (LOINC-coded) |
| Condition | Diagnoses and problem list (SNOMED CT-coded) |
| Encounter | Visit history, class, and type |

## Setup

### Prerequisites
- Node.js v18+
- Java 17+
- Docker (optional)

### 1. Start the HAPI FHIR server

**Option A — Docker (fastest):**
```bash
docker run -p 8080:8080 hapiproject/hapi:latest
```

**Option B — Maven:**
```bash
git clone https://github.com/hapifhir/hapi-fhir-jpaserver-starter
cd hapi-fhir-jpaserver-starter
mvn spring-boot:run
```

### 2. Generate and load synthetic patient data

```bash
# Generate 50 synthetic patients in Atlanta, GA
java -jar synthea-with-dependencies.jar -p 50 Georgia Atlanta

# Load into HAPI FHIR server
for file in ./output/fhir/*.json; do
  curl -X POST http://localhost:8080/fhir \
    -H "Content-Type: application/fhir+json" \
    -d @"$file"
done
```

### 3. Run the dashboard

```bash
npm install
npm start
```

Open http://localhost:3000

## HL7 v2 & Mirth Connect

While this project focuses on FHIR R4, production hospital environments still rely heavily on HL7 v2 messaging. Below is a sample ADT A01 (patient admit) message — the most common message type in hospital IT:

```
MSH|^~\&|SENDING_APP|HOSPITAL|RECEIVING_APP|FACILITY|20240101120000||ADT^A01|MSG001|P|2.5
EVN|A01|20240101120000
PID|1||MR12345^^^HOSPITAL^MR||SMITH^JOHN^A||19800515|M|||123 MAIN ST^^ATLANTA^GA^30301
PV1|1|I|3WEST^301^1|||JONES^SARAH|||MED
```

In a production environment, Mirth Connect would:
1. Receive this message via TCP/MLLP on a configured port
2. Parse PID segments to extract patient demographics
3. Transform the message using JavaScript transformers
4. Route it to downstream systems (EHR, pharmacy, lab)

This HL7 v2 → FHIR translation pattern is how legacy hospital systems connect to modern FHIR-based applications.

## Key Concepts Demonstrated

- **FHIR R4 REST API** — querying Patient, Observation, Condition, and Encounter resources
- **LOINC codes** — standardized identifiers for vitals (e.g. 29463-7 = body weight, 8480-6 = systolic BP)
- **SNOMED CT** — standardized coding for diagnoses and conditions
- **Pagination** — handling FHIR Bundle next links for large datasets
- **Parallel API calls** — using Promise.all to fetch multiple resource counts simultaneously
- **Social Determinants of Health (SDOH)** — Synthea includes SDOH conditions (transport access, employment, housing) as FHIR Condition resources

## Relevance to Health Informatics

This project mirrors real-world health IT workflows:
- The FHIR service layer replicates how Epic and Cerner expose patient data via their FHIR APIs
- LOINC-coded observation queries are how clinical decision support tools identify specific vitals or lab values
- The encounter class filter (AMB/EMER/IMP) is a standard population health segmentation used in care management platforms
