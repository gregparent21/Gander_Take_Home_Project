import { useState, useEffect } from "react";
import aircraftData from "../mock_data/aircrafts";

export default function Home() {
  const [aircraft, setAircraft] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("aircraft");
    if (stored) {
      setAircraft(JSON.parse(stored));
    } else {
      setAircraft(aircraftData);
    }
  }, []);

  useEffect(() => {
    if (aircraft.length > 0) {
      localStorage.setItem("aircraft", JSON.stringify(aircraft));
    }
  }, [aircraft]);
  
  const [filters, setFilters] = useState({
    tailNumber: "",
    model: "",
    status: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredAircraft = aircraft.filter((a) =>
    (filters.tailNumber === "" || a.tailNumber.toLowerCase().includes(filters.tailNumber.toLowerCase())) &&
    (filters.model === "" || a.model.toLowerCase().includes(filters.model.toLowerCase())) &&
    (filters.status === "" || a.status === filters.status)
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Gander Aircraft Dashboard</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <input
          name="tailNumber"
          placeholder="Filter by Tail Number"
          className="border p-2 rounded"
          onChange={handleChange}
        />
        <input
          name="model"
          placeholder="Filter by Model"
          className="border p-2 rounded"
          onChange={handleChange}
        />
        <select
          name="status"
          className="border p-2 rounded"
          onChange={handleChange}
        >
          <option value="">All Statuses</option>
          <option value="available">Available</option>
          <option value="maintenance">Maintenance</option>
          <option value="aog">AOG</option>
        </select>
      </div>

      {/* Ready-to-Fly Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Ready to Fly</h2>
        <p className="mb-1">Total: {
          aircraft.filter((a) => a.status === "available").length
        }</p>
        <ul className="list-disc ml-6">
          {aircraft
            .filter((a) => a.status === "available")
            .map((a) => (
              <li key={a.tailNumber}>
                {a.tailNumber} ({a.model})
              </li>
            ))}
        </ul>
      </div>

      {/* Aircraft List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAircraft.map((a) => (
          <div
          key={a.tailNumber}
          className="border p-4 rounded shadow hover:bg-gray-100 cursor-pointer transition"
          onClick={() => {
            const newStatus = prompt("Update status to: available, maintenance, or aog")?.toLowerCase();
            const allowedStatuses = ["available", "maintenance", "aog"];
          
            if (!newStatus || !allowedStatuses.includes(newStatus)) {
              alert("Invalid. Enter available, maintenance, or aog.");
              return;
            }
          
            const updated = aircraft.map((ac) =>
              ac.tailNumber === a.tailNumber ? { ...ac, status: newStatus } : ac
            );
            setAircraft(updated);
          }}
        >
        
            <p><strong>Tail Number:</strong> {a.tailNumber}</p>
            <p><strong>Model:</strong> {a.model}</p>
            <p><strong>Status:</strong> {a.status}</p>
            <p><strong>Location:</strong> ({a.location.lat}, {a.location.lng})</p>
          </div>
        ))}
      </div>

      {/* Reset + Add Buttons Below the Grid */}
      <div className="mt-12 flex justify-center gap-4">
        {/* Add Aircraft Button */}
        <button
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
          onClick={() => {
            const tailNumber = prompt("Enter Tail Number:");
            const model = prompt("Enter Model:");
            const status = prompt("Enter Status (available, maintenance, or aog):")?.toLowerCase();
            const lat = parseFloat(prompt("Enter Latitude:"));
            const lng = parseFloat(prompt("Enter Longitude:"));

            const allowedStatuses = ["available", "maintenance", "aog"];
            if (!tailNumber || !model || !allowedStatuses.includes(status) || isNaN(lat) || isNaN(lng)) {
              alert("Invalid inputs");
              return;
            }

            const newAircraft = {
              tailNumber,
              model,
              status,
              location: { lat, lng },
            };

            // Check for duplicate tail number
            const exists = aircraft.some((a) => a.tailNumber === tailNumber);
            if (exists) {
              alert("Dulplicate Tail Number");
              return;
            }

            setAircraft([...aircraft, newAircraft]);
          }}
        >
          Add Aircraft
        </button>

        {/* Reset Button */}
        <button
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          onClick={() => {
            localStorage.removeItem("aircraft");
            setAircraft(aircraftData);
          }}
        >
          Reset Aircraft Data
        </button>
      </div>
    </div>
  );
}
