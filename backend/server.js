const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

// leads.json file location
const dataFile = path.join(__dirname, "leads.json");

// Read leads from file
function readLeads() {
    try {
        const data = fs.readFileSync(dataFile, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Save leads to file
function saveLeads(leads) {
    fs.writeFileSync(
        dataFile,
        JSON.stringify(leads, null, 2)
    );
}


// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Client Lead Management API is running!"
    });
});


// GET all leads
app.get("/api/leads", (req, res) => {

    const leads = readLeads();

    res.json(leads);
});


// POST - Add new lead
app.post("/api/leads", (req, res) => {

    const leads = readLeads();

    const newLead = {
        id: Date.now(),
        name: req.body.name,
        email: req.body.email,
        source: req.body.source,
        status: req.body.status,
        notes: req.body.notes
    };

    leads.push(newLead);

    saveLeads(leads);

    res.status(201).json(newLead);
});


// PUT - Update lead status
app.put("/api/leads/:id", (req, res) => {

    const leads = readLeads();

    const id = Number(req.params.id);

    const lead = leads.find(
        lead => lead.id === id
    );

    if (!lead) {
        return res.status(404).json({
            message: "Lead not found"
        });
    }

    lead.status = req.body.status;

    saveLeads(leads);

    res.json(lead);
});


// DELETE - Delete lead
app.delete("/api/leads/:id", (req, res) => {

    const leads = readLeads();

    const id = Number(req.params.id);

    const updatedLeads = leads.filter(
        lead => lead.id !== id
    );

    if (updatedLeads.length === leads.length) {
        return res.status(404).json({
            message: "Lead not found"
        });
    }

    saveLeads(updatedLeads);

    res.json({
        message: "Lead deleted successfully"
    });
});


// Start server
app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});