$(document).ready(function () {
    $(document).on('click', '.view-history-action', function () {
        const selectedRow = $('table tbody input[type="checkbox"]:checked').closest('tr');
        if (selectedRow.length === 0) {
            alert("Please select a ticket to view history.");
            return;
        }

        const ticketId = selectedRow.find('td:eq(4)').text().trim();
        const computer = selectedRow.find('td:eq(1)').text().trim();
        const status = selectedRow.find('td:eq(5)').text().trim();
        const owner = selectedRow.find('td:eq(6)').text().trim();
        const assignedTo = selectedRow.find('td:eq(7)').text().trim();
        const notifyUser = selectedRow.find('td:eq(9)').text().trim(); // Corrected index
        const email = selectedRow.find('td:eq(9)').text().trim();
        const description = selectedRow.find('td:eq(10)').text().trim();
        const priority = selectedRow.find('td:eq(15)').text().trim();

       



       

        $('#historyTicketId').text(`#${ticketId}`);
        $('#historyComputer').text(computer);
        $('#historyStatus').text(status);
        $('#historyDescription').text(description);
        $('#historyOwner').text(owner);
        $('#historyAssignedTo').text(assignedTo);
        $('#historyNotifyUser').text(notifyUser); // Displays in modal
        $('#historyPriority').text(priority);
        $('#historyCreatedByName').text(email); // display below 'Created By'
        const now = new Date();
        const formatted = now.toLocaleString(); // Example: "7/2/2025, 11:34:56 AM"
        $('#historyCreatedDate').text(formatted);

        $('#historyActionStatus').text(status);
        $('#historyActionDescription').text(description);
        $('#historyActionOwner').text(owner);
        $('#historyActionAssignedTo').text(assignedTo);
        $('#historyActionPriority').text(priority);

        $('#viewHistoryModal').modal('show');

        
    });

    
});
