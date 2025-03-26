const express = require('express');
const router = express.Router();
const { addNote, getNotes, deleteNote } = require('../services/noteService');

// Get all notes for a sensor
router.get('/:sensorId/notes', async (req, res) => {
    try {
        const { sensorId } = req.params;
        const notes = await getNotes(sensorId);
        res.json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

// Add a new note to a sensor
router.post('/:sensorId/notes', async (req, res) => {
    try {
        const { sensorId } = req.params;
        const { content, author } = req.body;
        
        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        const result = await addNote(sensorId, content, author);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ error: 'Failed to add note' });
    }
});

// Delete a note
router.delete('/:sensorId/notes/:noteId', async (req, res) => {
    try {
        const { sensorId, noteId } = req.params;
        const result = await deleteNote(sensorId, noteId);
        res.json(result);
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

module.exports = router; 