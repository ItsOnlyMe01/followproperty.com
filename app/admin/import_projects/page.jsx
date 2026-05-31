"use client";

import { useState } from "react";
import Papa from "papaparse";

export default function ImportProjectsPage() {
    const [rows, setRows] = useState([]);
    const [projects, setProjects] = useState([]);

    const handleFileUpload = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        Papa.parse(file, {
            header: false,
            skipEmptyLines: true,
            complete: (results) => {
                const headers = results.data[1];

                const dataRows = results.data
                    .slice(2)
                    .filter(
                        (row) => row[0] && row[0].trim() !== ""
                    );

                console.log("HEADERS:");
                console.log(headers);

                console.log("FIRST DATA ROW:");
                console.log(dataRows[0]);

                const parsedProjects = dataRows.map((row) => ({
                    projectName: row[0],
                    location: row[1],
                    launchedDate: row[2],
                    launchingPrice: row[3],
                    possessionDate: row[4],
                    builderName: row[5],
                    units: row[6],
                    totalArea: row[7],
                    towers: row[8],
                    apartmentsPerFloor: row[9],
                    configuration: row[10],
                    status: row[11],
                    marketPrice: row[12],
                    perSqftRate: row[13],
                    perSqftRentalAvg: row[14],
                    monthlyRentRange: row[15],
                    superArea: row[16],
                    avgAreaSqft: row[17],
                    gps: row[18],
                    unitSize: row[19],
                }));

                console.log(
                    "TOTAL PROJECTS:",
                    parsedProjects.length
                );
                console.log(
                    "FIRST PROJECT:",
                    parsedProjects[0]
                );
                console.log(
                    "SECOND PROJECT:",
                    parsedProjects[1]
                );

                setProjects(parsedProjects);
                setRows(dataRows);
            },
        });
    };

    const handleImport = async () => {
        try {
            const response = await fetch(
                "/api/import_projects",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(
                        projects
                    ),
                }
            );

            const data = await response.json();

            console.log(data);

            alert(
                `Imported ${data.count} projects`
            );
        } catch (error) {
            console.error(error);
            alert("Import failed");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                Import Projects
            </h1>

            <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
            />

            {projects.length > 0 && (
                <button
                    onClick={handleImport}
                    className="bg-blue-600 text-white px-4 py-2 rounded ml-4"
                >
                    Import 10 Projects
                </button>
            )}

            {rows.length > 0 && (
                <>
                    <p className="mt-4">
                        Total Rows: {rows.length}
                    </p>

                    <div className="overflow-auto border mt-4">
                        <table className="w-full text-sm">
                            <tbody>
                                {rows
                                    .slice(0, 10)
                                    .map(
                                        (
                                            row,
                                            index
                                        ) => (
                                            <tr
                                                key={
                                                    index
                                                }
                                            >
                                                {row.map(
                                                    (
                                                        value,
                                                        i
                                                    ) => (
                                                        <td
                                                            key={
                                                                i
                                                            }
                                                            className="border p-2"
                                                        >
                                                            {String(
                                                                value
                                                            )}
                                                        </td>
                                                    )
                                                )}
                                            </tr>
                                        )
                                    )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}