import { useState } from "react";
import PatientList from "./components/PatientList";

export default function App() {
  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ padding: "1rem", borderBottom: "1px solid #eee", fontSize: "22px" }}>
        Clinical Dashboard
      </h1>
      {selectedPatient ? (
        <div style={{ padding: "1rem" }}>
          <button onClick={() => setSelectedPatient(null)}>← Back to list</button>
          <h2 style={{ marginTop: "1rem" }}>Patient: {selectedPatient.id}</h2>
        </div>
      ) : (
        <PatientList onSelect={setSelectedPatient} />
      )}
    </div>
  );
}
