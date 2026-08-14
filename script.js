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
leadForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const lead = {
        id: Date.now(),
        name: document.getElementById("leadName").value,
        email: document.getElementById("leadEmail").value,
        source: document.getElementById("leadSource").value,
        status: document.getElementById("leadStatus").value,
        notes: document.getElementById("leadNotes").value
    };

    leads.push(lead);

    leadForm.reset();
    leadFormSection.style.display = "none";

    displayLeads();
    updateStats();
});

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
                        <option value="New" ${lead.status === "New" ? 'selected' : ''}>New</option>
                        <option value="Contacted" ${lead.status === "Contacted" ? 'selected' : ''}>Contacted</option>
                        <option value="Converted" ${lead.status === "Converted" ? 'selected' : ''}>Converted</option>
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

// Change lead status from dropdown
function changeStatus(id, newStatus) {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;

    lead.status = newStatus;

    updateStats();
}

// Delete lead
function deleteLead(id) {

    leads = leads.filter(lead => lead.id !== id);

    displayLeads();
    updateStats();
}

// Search leads
searchInput.addEventListener("input", () => {

    const searchText = searchInput.value.toLowerCase();

    const filteredLeads = leads.filter((lead) =>
        lead.name.toLowerCase().includes(searchText) ||
        lead.email.toLowerCase().includes(searchText) ||
        lead.source.toLowerCase().includes(searchText)
    );

    displayLeads(filteredLeads);
});