# Clinical Dashboard

A React-based clinical dashboard querying a HAPI FHIR R4 server 
loaded with Synthea-generated synthetic patient data.

## Features
- Patient list with demographics
- Vitals trend charts (weight, BP, heart rate)
- Active and resolved conditions panel
- Encounter history filtered by class (AMB, EMER, IMP)

## Tech Stack
- React
- Recharts
- HAPI FHIR R4
- Synthea

## Setup
1. Run HAPI FHIR server locally on port 8080
2. Load Synthea data
3. npm install
4. npm start