function showSuccessToast() {
    const toast = document.getElementById('successToast');
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

$(document).ready(function () {
    // Edit button clicked
    $(document).on("click", ".edit-ticket-action", function (e) {
        e.preventDefault();

        const grid = $("#ticketGrid").dxDataGrid("instance");
        const selected = grid.getSelectedRowsData();

        if (selected.length === 0) {
            alert("Please select a ticket to edit.");
            return;
        }

        const ticket = selected[0];

        // Populate modal fields
        if (ticket.Computer && ticket.Computer.trim() !== "") {
            
            $("#editComputerReadonly").val(ticket.Computer).show();
            $("#editComputerDropdown").hide();
        } else {
          
            $("#editComputerReadonly").hide();
            $("#editComputerDropdown").val("").show();
        }

        $("#editStatus").val(ticket.Status || "");
        $("#editOwner").val(ticket.Owner || "");
        $("#editAssignedTo").val(ticket.AssignedTo || "");
        $("#editDescription").val(ticket.Description || "");
        $("#editEmail").val(ticket.Email || "");
        $("#editPriority").val(ticket.Priority || "");

       
        $("#editTicketModal").data("TicketID", ticket.TicketID);
        $("#editTicketModal").data("ID", ticket.ID);
        $("#modalContext").val("edit");

       
        bootstrap.Modal.getOrCreateInstance(document.getElementById("editTicketModal")).show();
    });

    // Save / Update
    $(document).on("click", "#updateTicketBtn", function () {
        const grid = $("#ticketGrid").dxDataGrid("instance");

        const id = $("#editTicketModal").data("ID");
        const ticketId = $("#editTicketModal").data("TicketID");

        const updatedData = {
            ID: id,
            TicketID: ticketId,
            Computer: $("#editComputerReadonly").is(":visible")
                ? $("#editComputerReadonly").val()
                : $("#editComputerDropdown").val(),

            Status: $("#editStatus").val(),
            Owner: $("#editOwner").val(),
            AssignedTo: $("#editAssignedTo").val(),
            Description: $("#editDescription").val(),
            Email: $("#editEmail").val(),
            Priority: $("#editPriority").val()
        };

        // Update grid
        const allData = grid.option("dataSource");
        const index = allData.findIndex(item => item.ID === id);
        if (index !== -1) {
            Object.assign(allData[index], updatedData);
            grid.option("dataSource", allData); 

            $("#modalContext").val("new");
        }

        // AJAX: update database
        $.ajax({
            url: '/Ticket/UpdateTicket',
            type: 'POST',
            data: updatedData,
            success: function () {
                bootstrap.Modal.getInstance(document.getElementById("editTicketModal")).hide();
                showSuccessToast(); 
            },
            error: function () {
                alert("Error updating ticket.");
            }
        });
        $("#modalContext").val("new");
    });


    
});
