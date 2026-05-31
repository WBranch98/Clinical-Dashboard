import { useEffect, useState } from "react";
import { getPatientSummary } from "../services/fhirService";
import VitalsTrend from "./VitalsTrend";
import ConditionsList from "./ConditionsList";
import EncounterHistory from "./EncounterHistory";

const cleanName = (name) => name.replace(/\d+/g, "").trim();

const calculateAge = (birthDate) => {
  const today = new Date();
  const dob = new Date(birthDate);
  return today.getFullYear() - dob.getFullYear();
};

export default function PatientSummary({ patient, onBack }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPatientSummary(patient.id).then((data) => {
      setSummary(data);
      setLoading(false);
    });
  }, [patient.id]);

  const firstName = cleanName(patient.name?.[0]?.given?.[0] || "");
  const lastName = cleanName(patient.name?.[0]?.family || "");

  return (
    <div style={{ padding: "1rem" }}>
      <button
        onClick={onBack}
        style={{ marginBottom: "1rem", cursor: "pointer" }}
      >
        ← Back to list
      </button>

      <h2 style={{ fontSize: "20px", marginBottom: "4px" }}>
        {firstName} {lastName}
      </h2>
      <p style={{ color: "gray", fontSize: "14px", marginBottom: "1.5rem" }}>
        {calculateAge(patient.birthDate)} yrs · {patient.gender} · {patient.address?.[0]?.city}
      </p>

      {loading ? (
        <p style={{ color: "gray" }}>Loading summary...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          <StatCard label="Conditions" value={summary.conditionCount} color="#EEEDFE" textColor="#534AB7" />
          <StatCard label="Encounters" value={summary.encounterCount} color="#E1F5EE" textColor="#0F6E56" />
          <StatCard label="Observations" value={summary.observationCount} color="#E6F1FB" textColor="#185FA5" />
          <VitalsTrend patientId={patient.id} />
          <ConditionsList patientId={patient.id} />
          <EncounterHistory patientId={patient.id} />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color, textColor }) {
  return (
    <div style={{
      background: color,
      borderRadius: "12px",
      padding: "1rem 1.25rem",
    }}>
      <p style={{ fontSize: "12px", color: textColor, marginBottom: "6px", fontWeight: "500" }}>
        {label}
      </p>
      <p style={{ fontSize: "28px", fontWeight: "500", color: textColor }}>
        {value}
      </p>
    </div>
  );
}
