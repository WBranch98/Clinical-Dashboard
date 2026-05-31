import { useEffect, useState } from "react";
import { getPatients, getPatientSummary } from "../services/fhirService";

const cleanName = (name) => name.replace(/\d+/g, "").trim();

const calculateAge = (birthDate) => {
  const today = new Date();
  const dob = new Date(birthDate);
  return today.getFullYear() - dob.getFullYear();
};

export default function PatientList({ onSelect }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPatients().then((data) => {
      setPatients(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p style={{ padding: "1rem", color: "gray" }}>Loading patients...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ marginBottom: "1rem", fontSize: "18px" }}>Patient List</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
            <th style={{ padding: "8px" }}>Name</th>
            <th style={{ padding: "8px" }}>Age</th>
            <th style={{ padding: "8px" }}>Gender</th>
            <th style={{ padding: "8px" }}>City</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr
              key={p.id}
              onClick={() => onSelect(p)}
              style={{ borderBottom: "1px solid #eee", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
              onMouseLeave={e => e.currentTarget.style.background = ""}
            >
              <td style={{ padding: "8px" }}>
                {cleanName(p.name?.[0]?.given?.[0] || "")} {cleanName(p.name?.[0]?.family || "")}
              </td>
              <td style={{ padding: "8px" }}>{calculateAge(p.birthDate)}</td>
              <td style={{ padding: "8px" }}>{p.gender}</td>
              <td style={{ padding: "8px" }}>{p.address?.[0]?.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}