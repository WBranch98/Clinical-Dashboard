import { useEffect, useState } from "react";

const FHIR_BASE = "http://localhost:8080/fhir";

const CLASS_LABELS = {
  AMB: { label: "Outpatient", color: "#E1F5EE", textColor: "#0F6E56", border: "#9FE1CB" },
  EMER: { label: "Emergency", color: "#FAECE7", textColor: "#993C1D", border: "#F5C4B3" },
  IMP: { label: "Inpatient", color: "#E6F1FB", textColor: "#185FA5", border: "#B5D4F4" },
};

export default function EncounterHistory({ patientId }) {
  const [encounters, setEncounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    setLoading(true);
    fetch(`${FHIR_BASE}/Encounter?patient=${patientId}&_count=50&_sort=-date`)
      .then(res => res.json())
      .then(bundle => {
        const all = bundle.entry?.map(e => e.resource) || [];
        setEncounters(all);
        setLoading(false);
      });
  }, [patientId]);

  const filtered = filter === "ALL"
    ? encounters
    : encounters.filter(e => e.class?.code === filter);

  return (
    <div style={{ marginTop: "2rem", paddingBottom: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem", flexWrap: "wrap" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "500", marginRight: "4px" }}>Encounters</h3>
        {["ALL", "AMB", "EMER", "IMP"].map(cls => (
          <button
            key={cls}
            onClick={() => setFilter(cls)}
            style={{
              fontSize: "12px", padding: "4px 12px", borderRadius: "20px", cursor: "pointer",
              background: filter === cls
                ? (CLASS_LABELS[cls]?.color || "#F1EFE8")
                : "transparent",
              color: filter === cls
                ? (CLASS_LABELS[cls]?.textColor || "#5F5E5A")
                : "gray",
              border: filter === cls
                ? `1px solid ${CLASS_LABELS[cls]?.border || "#D3D1C7"}`
                : "1px solid #ddd"
            }}
          >
            {cls === "ALL" ? "All" : CLASS_LABELS[cls]?.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: "gray", fontSize: "14px" }}>Loading encounters...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: "gray", fontSize: "14px" }}>No encounters found.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtered.map(e => {
            const cls = e.class?.code;
            const style = CLASS_LABELS[cls] || {};
            return (
              <div key={e.id} style={{
                padding: "10px 14px",
                borderRadius: "8px",
                border: "0.5px solid #eee",
                fontSize: "13px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{
                    fontSize: "11px", padding: "2px 8px", borderRadius: "10px",
                    background: style.color, color: style.textColor,
                    border: `1px solid ${style.border}`, whiteSpace: "nowrap"
                  }}>
                    {style.label || cls}
                  </span>
                  <span style={{ color: "#1a1a1a" }}>{e.type?.[0]?.text}</span>
                </div>
                <span style={{ color: "gray", fontSize: "12px" }}>
                  {e.period?.start?.split("T")[0]}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
