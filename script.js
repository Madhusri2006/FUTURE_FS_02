const API_URL = "http://localhost:5000/api/leads";

const addLeadBtn = document.getElementById("addLeadBtn");
const leadFormSection = document.getElementById("leadFormSection");
const leadForm = document.getElementById("leadForm");
const cancelLeadBtn = document.getElementById("cancelLeadBtn");

const leadsTableBody = document.getElementById("leadsTableBody");
const searchInput = document.getElementById("searchInput");

const totalLeads = document.getElementById("totalLeads");
const newLeads = document.getElementById("newLeads");
const contactedLeads = document.getElementById("contactedLeads");
const convertedLeads = document.getElementById("convertedLeads");

let leads = [];

// Load leads from backend when page opens
loadLeads();


// Open Add Lead form
addLeadBtn.addEventListener("click", () => {
    leadFormSection.style.display = "block";

    leadFormSection.scrollIntoView({
        behavior: "smooth"
    });
});


// Cancel form
cancelLeadBtn.addEventListener("click", () => {
    leadForm.reset();
    leadFormSection.style.display = "none";
});


// Add new lead
leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const lead = {
        name: document.getElementById("leadName").value,
        email: document.getElementById("leadEmail").value,
        source: document.getElementById("leadSource").value,
        status: document.getElementById("leadStatus").value,
        notes: document.getElementById("leadNotes").value
    };

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(lead)
        });

        if (!response.ok) {
            throw new Error("Failed to add lead");
        }

        const newLead = await response.json();

        leads.push(newLead);

        leadForm.reset();
        leadFormSection.style.display = "none";

        displayLeads();
        updateStats();

        alert("Lead added successfully!");

    } catch (error) {

        console.error(error);
        alert("Unable to add lead. Please check the backend server.");

    }
});


// Load leads from backend
async function loadLeads() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load leads");
        }

        leads = await response.json();

        displayLeads();
        updateStats();

    } catch (error) {

        console.error("Error loading leads:", error);

    }
}


// Display leads
function displayLeads(filteredLeads = leads) {

    leadsTableBody.innerHTML = "";

    filteredLeads.forEach((lead) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${lead.name}</td>

            <td>${lead.email}</td>

            <td>${lead.source}</td>

            <td>
                <select onchange="changeStatus(${lead.id}, this.value)">
                    <option value="New" ${lead.status === "New" ? "selected" : ""}>
                        New
                    </option>

                    <option value="Contacted" ${lead.status === "Contacted" ? "selected" : ""}>
                        Contacted
                    </option>

                    <option value="Converted" ${lead.status === "Converted" ? "selected" : ""}>
                        Converted
                    </option>
                </select>
            </td>

            <td>${lead.notes || "-"}</td>

            <td>
                <button onclick="deleteLead(${lead.id})">
                    Delete
                </button>
            </td>
        `;

        leadsTableBody.appendChild(row);
    });
}


// Update dashboard statistics
function updateStats() {

    totalLeads.textContent = leads.length;

    newLeads.textContent =
        leads.filter(lead => lead.status === "New").length;

    contactedLeads.textContent =
        leads.filter(lead => lead.status === "Contacted").length;

    convertedLeads.textContent =
        leads.filter(lead => lead.status === "Converted").length;
}


// Change lead status
async function changeStatus(id, newStatus) {

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                status: newStatus
            })
        });

        if (!response.ok) {
            throw new Error("Failed to update status");
        }

        const updatedLead = await response.json();

        const leadIndex = leads.findIndex(
            lead => lead.id === id
        );

        if (leadIndex !== -1) {
            leads[leadIndex] = updatedLead;
        }

        displayLeads();
        updateStats();

    } catch (error) {

        console.error(error);
        alert("Unable to update lead status.");

    }
}


// Delete lead
async function deleteLead(id) {

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete lead");
        }

        leads = leads.filter(
            lead => lead.id !== id
        );

        displayLeads();
        updateStats();

    } catch (error) {

        console.error(error);
        alert("Unable to delete lead.");

    }
}


// Search leads
searchInput.addEventListener("input", () => {

    const searchText =
        searchInput.value.toLowerCase();

    const filteredLeads = leads.filter((lead) =>
        lead.name.toLowerCase().includes(searchText) ||
        lead.email.toLowerCase().includes(searchText) ||
        lead.source.toLowerCase().includes(searchText)
    );

    displayLeads(filteredLeads);
});