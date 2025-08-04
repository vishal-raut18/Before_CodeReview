$(function () {
    // Handler for "Mark as Open"
    $(".change-status-open").on("click", function () {
        updateTicketStatus("Open", "toastOpen", "bg-success");
        
    });

    // Handler for "Mark as In Progress"
    $(".change-status-inprogress").on("click", function () {
        updateTicketStatus("In Progress", "toastProgress", "bg-warning");
    });




    // Handler for "Closed" dropdown (just before showing modal)
    $(".change-status-closed").on("click", function (e) {
        e.preventDefault();

        const grid = $("#ticketGrid").dxDataGrid("instance");
        if (!grid) return;

        const selectedRows = grid.getSelectedRowsData();
        if (selectedRows.length === 0) {
            alert("Please select at least one ticket.");
            isCloseAllowed = false;
            return;
        }

        isCloseAllowed = true;
        $("#closeTicketModal").modal("show");
    });




    // Handler for "Close Ticket" button (confirm modal)
    // Confirm button click
    $("#confirmCloseTicket").on("click", function () {
        if (!isCloseAllowed) {
            alert("No ticket selected.");
            return;
        }

        updateTicketStatus("Closed", "toastClosed", "bg-primary");
        $("#closeTicketModal").modal("hide");

        isCloseAllowed = false; // Reset
    });

});

// Generic update function
function updateTicketStatus(newStatus, toastId, colorClass) {
    const grid = $("#ticketGrid").dxDataGrid("instance");

    if (!grid) return;

    const selectedRows = grid.getSelectedRowsData();
    if (selectedRows.length === 0) {
        alert("Please select at least one ticket.");
        return;
    }

    const ticketIds = selectedRows.map(r => r.ID);

    $.ajax({
        type: "POST",
        url: "/Ticket/UpdateTicketStatus",
        contentType: "application/json",
        data: JSON.stringify({
            ids: ticketIds,
            newStatus: newStatus
        }),
        success: function () {
            // Update UI grid
            const dataSource = grid.option("dataSource");
            ticketIds.forEach(id => {
                const index = dataSource.findIndex(item => item.ID === id);
                if (index !== -1) dataSource[index].Status = newStatus;
            });
            grid.refresh();

            // ✅ Show matching toast
            const toastEl = document.getElementById(toastId);
            if (toastEl) {
                const bsToast = new bootstrap.Toast(toastEl);
                bsToast.show();
            }
        },
        error: function () {
            alert("Failed to update ticket status.");
        }
    });
}




    document.addEventListener("DOMContentLoaded", function () {
        const closeTicketModal = document.getElementById("closeTicketModal");
    const sendEmailCheckbox = document.getElementById("sendEmailCheckbox");
    const closeNotes = document.getElementById("closeNotes");
    const notesCharCount = document.getElementById("notesCharCount");

    closeTicketModal.addEventListener('hidden.bs.modal', function () {
        // Reset checkbox
        sendEmailCheckbox.checked = false;

    // Clear textarea
    closeNotes.value = '';

    // Reset character count
    notesCharCount.textContent = '0';
        });

    // Optional: Live character count while typing
    closeNotes.addEventListener('input', function () {
        notesCharCount.textContent = closeNotes.value.length;
    });

        
    });

