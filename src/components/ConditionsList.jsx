import { useEffect, useState } from "react";

const FHIR_BASE = "http://localhost:8080/fhir";

export default function ConditionsList({ patientId }) {
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");

  useEffect(() => {
    setLoading(true);
    fetch(`${FHIR_BASE}/Condition?patient=${patientId}&_count=50`)
      .then(res => res.json())
      .then(bundle => {
        const all = bundle.entry?.map(e => e.resource) || [];
        setConditions(all);
        setLoading(false);
      });
  }, [patientId]);

  const filtered = conditions.filter(c =>
    c.clinicalStatus?.coding?.[0]?.code === filter
  );

  return (
    <div style={{ marginTop: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "500" }}>Conditions</h3>
        <button
          onClick={() => setFilter("active")}
          style={{
            fontSize: "12px", padding: "4px 12px", borderRadius: "20px", cursor: "pointer",
            background: filter === "active" ? "#E1F5EE" : "transparent",
            color: filter === "active" ? "#0F6E56" : "gray",
            border: filter === "active" ? "1px solid #9FE1CB" : "1px solid #ddd"
          }}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("resolved")}
          style={{
            fontSize: "12px", padding: "4px 12px", borderRadius: "20px", cursor: "pointer",
            background: filter === "resolved" ? "#F1EFE8" : "transparent",
            color: filter === "resolved" ? "#5F5E5A" : "gray",
            border: filter === "resolved" ? "1px solid #D3D1C7" : "1px solid #ddd"
          }}
        >
          Resolved
        </button>
      </div>

      {loading ? (
        <p style={{ color: "gray", fontSize: "14px" }}>Loading conditions...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: "gray", fontSize: "14px" }}>No {filter} conditions found.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtered.map(c => (
            <div key={c.id} style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "0.5px solid #eee",
              fontSize: "13px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ color: "#1a1a1a" }}>{c.code?.text}</span>
              <span style={{ color: "gray", fontSize: "12px" }}>
                {c.onsetDateTime?.split("T")[0]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}