/* styles/ReportForm.css */
.report-form {
  background-color: #b22222;
  padding: 3rem;
  border-radius: 15px;
  color: white;
  max-width: 900px;
  margin: 2rem auto;
}

.form-group {
  margin-bottom: 2rem;
}

.form-group h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.form-group select {
  width: 100%;
  padding: 0.8rem;
  border-radius: 25px;
  border: none;
  background-color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
}

.date-section {
  margin: 2rem 0;
}

.date-section h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.date-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.date-group {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 1rem;
}

.date-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

.date-group input {
  width: 100%;
  padding: 0.5rem;
  border: none;
  background: transparent;
}

.submit-button {
  background-color: #28a745;
  color: white;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  display: block;
  margin: 2rem auto 0;
}