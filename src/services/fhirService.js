const FHIR_BASE = 'http://localhost:8080/fhir';

export const getPatients = async () => {
  const res = await fetch(`${FHIR_BASE}/Patient?_count=50&_pretty=true`);
  const bundle = await res.json();
  return bundle.entry?.map(e => e.resource) || [];
};

export const getPatientById = async (id) => {
  const res = await fetch(`${FHIR_BASE}/Patient/${id}`);
  return await res.json();
};

export const getPatientSummary = async (id) => {
  const [conditions, encounters, observations] = await Promise.all([
    fetch(`${FHIR_BASE}/Condition?patient=${id}&_summary=count`).then(r => r.json()),
    fetch(`${FHIR_BASE}/Encounter?patient=${id}&_summary=count`).then(r => r.json()),
    fetch(`${FHIR_BASE}/Observation?patient=${id}&category=vital-signs&_summary=count`).then(r => r.json()),
  ]);
  return {
    conditionCount: conditions.total,
    encounterCount: encounters.total,
    observationCount: observations.total,
  };
};