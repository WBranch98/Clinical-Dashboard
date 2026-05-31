import { useState } from "react";
import PatientList from "./components/PatientList";
import PatientSummary from "./components/PatientSummary";

export default function App() {
  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ padding: "1rem", borderBottom: "1px solid #eee", fontSize: "22px" }}>
        Clinical Dashboard
      </h1>
      {selectedPatient ? (
        <PatientSummary patient={selectedPatient} onBack={() => setSelectedPatient(null)} />
       ) : (
        <PatientList onSelect={setSelectedPatient} />
      )}
    </div>
  );
}
