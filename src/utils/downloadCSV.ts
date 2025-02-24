const downloadCSV = (jsonData: any[], filename: string = "data.csv") => {
  if (!jsonData.length) return;

  const headers = Object.keys(jsonData[0]);
  const csvRows = [];

  csvRows.push(headers.join(","));

  for (const row of jsonData) {
    const values = headers.map(header => {
      const escaped = ("" + row[header]).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  const csvContent = csvRows.join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export default downloadCSV;