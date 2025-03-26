const express = require("express");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const router = express.Router();

router.post("/report", async (req, res) => {
  const { sensors, reportType, startTime, endTime, dateRange, reportData } = req.body;

  try {
    const tempDir = path.join(__dirname, "../temp");

    // 1. Write sensor_data.csv
    const csvPath = path.join(tempDir, "sensor_data.csv");
    const headers = ["Sensor ID", "Timestamp", "Temperature", "CO2", "PM2.5", "Humidity"];
    const csvContent = [
      headers.join(","),
      ...reportData.map(row =>
        [row["Sensor ID"], row.Timestamp, row.Temperature, row.CO2, row["PM2.5"], row.Humidity].join(",")
      )
    ].join("\n");
    fs.writeFileSync(csvPath, csvContent);

    // 2. Write data.py
    const dataPy = `
report_type = "${reportType}"
selected_sensors = ${JSON.stringify(sensors, null, 2)}
start_time = "${startTime}"
end_time = "${endTime}"
date_range = ${JSON.stringify(dateRange, null, 2)}
`;
    fs.writeFileSync(path.join(tempDir, "data.py"), dataPy);

    // 3. Run Quarto to generate PDF
    const qmdTemplate = path.join(__dirname, "../temp/template.qmd");
    const command = `quarto render ${qmdTemplate} --to pdf --output report.pdf`;

    execSync(command, { cwd: tempDir });

    // 4. Serve the PDF
    const pdfPath = path.join(tempDir, "report.pdf");
    const pdfStream = fs.createReadStream(pdfPath);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=report.pdf");
    pdfStream.pipe(res);

  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).send("Failed to generate report.");
  }
});

module.exports = router;
