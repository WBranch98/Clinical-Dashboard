import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const FHIR_BASE = "http://localhost:8080/fhir";

const VITALS = [
  { label: "Body Weight (kg)", code: "29463-7" },
  { label: "Systolic BP (mmHg)", code: "8480-6" },
  { label: "Diastolic BP (mmHg)", code: "8462-4" },
  { label: "Heart Rate (bpm)", code: "8867-4" },
];

export default function VitalsTrend({ patientId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVital, setSelectedVital] = useState(VITALS[0]);

  useEffect(() => {
    setLoading(true);
    fetch(`${FHIR_BASE}/Observation?patient=${patientId}&code=${selectedVital.code}&_sort=date&_count=20`)
      .then(res => res.json())
      .then(bundle => {
        const points = bundle.entry?.map(e => ({
          date: e.resource.effectiveDateTime?.split("T")[0],
          value: e.resource.valueQuantity?.value,
        })) || [];
        setData(points);
        setLoading(false);
      });
  }, [patientId, selectedVital]);

  return (
    <div style={{ marginTop: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "500" }}>Vitals trend</h3>
        <select
          value={selectedVital.code}
          onChange={e => setSelectedVital(VITALS.find(v => v.code === e.target.value))}
          style={{ fontSize: "13px", padding: "4px 8px", borderRadius: "6px", border: "1px solid #ddd" }}
        >
          {VITALS.map(v => (
            <option key={v.code} value={v.code}>{v.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={{ color: "gray", fontSize: "14px" }}>Loading vitals...</p>
      ) : data.length === 0 ? (
        <p style={{ color: "gray", fontSize: "14px" }}>No data found for this vital.</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#185FA5" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}