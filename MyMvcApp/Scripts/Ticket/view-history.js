$(document).ready(function () {
    $(document).on("click", ".view-history-action", function (e) {
        e.preventDefault();

        const grid = $("#ticketGrid").dxDataGrid("instance");
        if (!grid) return alert("Ticket grid not found.");

        const selectedRows = grid.getSelectedRowsData();
        if (selectedRows.length === 0) return alert("Please select a row to view history.");

        const ticket = selectedRows[0];
        const ticketId = ticket.TicketID; 

        
        $("#historyTicketId").text(ticketId || "-");
        $("#historyComputer").text(ticket.Computer || "-");
        $("#historyStatus").text(ticket.Status || "-");
        $("#historyDescription").text(ticket.Description || "-");
        $("#historyFiles").text(ticket.Files || "No File Uploaded");
        $("#historyOwner").text(ticket.Owner || "-");
        $("#historyAssignedTo").text(ticket.AssignedTo || "-");

        $("#historyNotifyUser").text(ticket.Email || "-");
        $("#historySource").text(ticket.Source || "Manual");
        $("#historyPriority").text(ticket.Priority || "-");

      
        $("#historyActionContainer").empty();

       
        $.getJSON('/Ticket/GetHistory', { ticketId: ticketId }, function (historyList) {
            console.log("History data received:", historyList);

            if (!historyList || historyList.length === 0) {
                $("#historyActionContainer").append('<p>No history found.</p>');
                return;
            }

            historyList.forEach(function (history, index) {
              
                let date;
                if (index === 0) {
                    date = new Date(ticket.CreatedDate || history.actionDate);
                } else {
                    date = new Date(history.actionDate);
                }
                let formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

                let cardHtml = '';

                if (index === 0) {
                 
                    let curr = safeParseJSON(history.newValues) || {};
                    


                    cardHtml = `
                              <div class="rounded shadow-sm mb-3" style="background-color: #f9f9f9; border: 1px solid #ddd; padding: 10px;">
                                <div class="d-flex justify-content-between align-items-center" style="background-color: #e6f8d3; padding: 6px 12px; border-bottom: 1px solid #ccc; margin: -10px -10px 0 -10px;">
                                  <strong>${history.actionType} By:</strong> <span class="text-dark ms-1">vishalr@alohatechnologydev.com</span>
                                  <div class="text-muted small">${formattedDate}</div>
                                </div>
                                <div class="p-2">
                                  ${renderMainDetails(curr)}
                                </div>
                              </div>
                            `;

                } else {
                   
                    cardHtml = `
                        <div class="rounded shadow-sm mb-3" style="background-color: #f9f9f9; border: 1px solid #ddd; padding: 10px;">
                            <div class="d-flex justify-content-between align-items-center" style="background-color: #94cbf6; padding: 6px 12px; border-bottom: 1px solid #ccc;margin: -10px -10px 0 -10px; ">
                                <strong >${history.actionType} By:</strong> <span class="text-dark ms-1">vishalr@alohatechnologydev.com</span>
                                <div class="text-muted small">${formattedDate}</div>
                            </div>
                            <div class="p-2">
                                ${renderUpdatedFields(history)}
                            </div>
                        </div>
                    `;
                }

                $("#historyActionContainer").append(cardHtml);
            });
        }).fail(function () {
            $("#historyActionContainer").append('<p>Error loading history.</p>');
        });

    
        const historyModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("viewHistoryModal"));
        historyModal.show();
    });
});


function safeParseJSON(jsonStr) {
    if (!jsonStr) return null;
    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        console.warn("Failed to parse JSON:", e);
        return null;
    }
}


function renderMainDetails(curr) {
    const details = [
        { label: "Status", value: curr.Status },
        { label: "Description", value: curr.Description },
        { label: "Owner", value: curr.Owner },
        { label: "Assigned To", value: curr.AssignedTo },
        { label: "Priority", value: curr.Priority },
    ];

    let html = '<div style="display: flex; flex-direction: column; gap: 6px;">';

    details.forEach(({ label, value }) => {
        html += `
            <div style="display: flex; align-items: center;">
                <div style="min-width: 110px; font-weight: bold;">${label}:</div>
                <div>${value || '-'}</div>
            </div>
        `;
    });

    html += '</div>';

    return html;
}


function renderUpdatedFields(history) {
    let curr = safeParseJSON(history.newValues) || {};

    if (!history.changedFields) {
        return '<em>No changes details.</em>';
    }

    let fields = history.changedFields.split(',').map(f => f.trim());
    let html = '';

    fields.forEach(field => {
        let newVal = curr[field] !== undefined ? curr[field] : '-';
        html += `
            <div style="display: flex; align-items: center; margin-bottom: 6px;">
                <div style="min-width: 110px; font-weight: normal; color: black;">${field}:</div>
                <div style="color: black;">${newVal}</div>
            </div>
        `;
    });

    return html || '<em>No changes details.</em>';
}
