import React, { useState, useEffect } from 'react';
import SensorChart from './SensorChart';
import '../styles/SensorDetail.css';

const SensorDetail = ({ sensor, onClose, temperatureUnit }) => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [loading, setLoading] = useState(true);
    const [historicalData, setHistoricalData] = useState([]);

    // Mapping of sensor IDs to display numbers
    const sensorNumberMapping = {
        'bcff4dd3b24c': '2',  // Hope Classroom
        'fcf5c497654a': '3',  // Event Space
        'bcff4dd3b442': '4',  // 220 Classroom
        'd8bfc0c0e514': '5',  // Outdoor underneath stairs
        'a4cf12ff89ae': '6',  // 216 Classroom
        '40f52032b5b7': '7',  // Cube Garden
        '08f9e05fd2d3': '8',  // Room 210
        '485519ee6c1a': '9',  // Lounge space
        '485519ee5010': '10', // Study space
        '2462ab14bae1': '11', // Room 307 / Whidbey
        '98f4abd6f8fa': '12', // Room 402
        '18fe34f753d2': '13'  // Room 416
    };

    useEffect(() => {
        fetchNotes();
        fetchHistoricalData();
    }, [sensor.id]);

    const fetchNotes = async () => {
        try {
            const response = await fetch(`/api/sensors/${sensor.id}/notes`);
            const data = await response.json();
            setNotes(data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistoricalData = async () => {
        try {
            const response = await fetch(`/api/sensors/${sensor.id}/history`);
            const data = await response.json();
            setHistoricalData(data);
        } catch (error) {
            console.error('Error fetching historical data:', error);
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;

        try {
            const response = await fetch(`/api/sensors/${sensor.id}/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: newNote }),
            });

            if (response.ok) {
                setNewNote('');
                fetchNotes();
            }
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    const handleDeleteNote = async (noteId) => {
        try {
            const response = await fetch(`/api/sensors/${sensor.id}/notes/${noteId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchNotes();
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const formatTemperature = (celsius) => {
        if (celsius === null) return 'N/A';
        const temp = temperatureUnit === 'F' ? (celsius * 9/5) + 32 : celsius;
        return `${temp.toFixed(1)}°${temperatureUnit}`;
    };

    return (
        <div className="sensor-detail">
            <div className="sensor-detail-header">
                <h2>Sensor {sensorNumberMapping[sensor.id] || 'N/A'} - {sensor.name} Details</h2>
                <button className="close-button" onClick={onClose}>&times;</button>
            </div>
            
            <div className="sensor-info">
                <h3>Current Readings</h3>
                <div className="readings-grid">
                    <div className="reading-item">
                        <span className="label">Temperature:</span>
                        <span className="value">{formatTemperature(sensor.lastReading.temperature)}</span>
                    </div>
                    <div className="reading-item">
                        <span className="label">Humidity:</span>
                        <span className="value">{sensor.lastReading.humidity}%</span>
                    </div>
                    <div className="reading-item">
                        <span className="label">CO2:</span>
                        <span className="value">{sensor.lastReading.co2} ppm</span>
                    </div>
                    <div className="reading-item">
                        <span className="label">PM2.5:</span>
                        <span className="value">{sensor.lastReading.pm25} µg/m³</span>
                    </div>
                </div>
            </div>

            <div className="charts-section">
                <SensorChart
                    data={historicalData}
                    title="Temperature History (24h)"
                    yLabel="Temperature"
                    color="#ff6b6b"
                    temperatureUnit={temperatureUnit}
                />
                <SensorChart
                    data={historicalData}
                    title="CO2 History (24h)"
                    yLabel="CO2"
                    color="#4ecdc4"
                    temperatureUnit={temperatureUnit}
                />
            </div>

            <div className="notes-section">
                <h3>Notes</h3>
                <form onSubmit={handleAddNote} className="add-note-form">
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add a new note..."
                        rows="3"
                        maxLength="500"
                    />
                    <button type="submit">Add Note</button>
                </form>

                <div className="notes-list">
                    {loading ? (
                        <p>Loading notes...</p>
                    ) : notes.length > 0 ? (
                        notes.map((note) => (
                            <div key={note.NoteId} className="note-item">
                                <p className="note-content">{note.Content}</p>
                                <div className="note-meta">
                                    <div className="note-info">
                                        <span>By: {note.Author}</span>
                                        <span>{formatDate(note.CreatedAt)}</span>
                                    </div>
                                    <button
                                        className="delete-note-button"
                                        onClick={() => handleDeleteNote(note.NoteId)}
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No notes yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SensorDetail; 