$(document).ready(function () {
    let selectedRow;

    // Handle View Ticket
    $(document).on('click', '.view-ticket-action', function (e) {
        e.preventDefault();

        selectedRow = $('table tbody input[type="checkbox"]:checked').closest('tr');
        if (selectedRow.length === 0) {
            alert("Please select a ticket row to view.");
            return;
        }

        // Populate modal fields from selected row
        $('#viewTicketId').text(`#${selectedRow.find('td:eq(4)').text().trim()}`);
        $('#viewComputer').text(selectedRow.find('td:eq(1)').text().trim());
        $('#viewStatus').text(selectedRow.find('td:eq(5)').text().trim());
        $('#viewDescription').text(selectedRow.find('td:eq(10)').text().trim());
        $('#viewEmail').text(selectedRow.find('td:eq(9)').text().trim());
        $('#viewAssignedTo').text(selectedRow.find('td:eq(7)').text().trim());
        $('#viewPriority').text(selectedRow.find('td:eq(15)').text().trim());

        $('#viewTicketModal').modal('show');
    });

    // Open Edit Ticket from View
    $('#viewEditBtn').click(function () {
        $('#viewTicketModal').modal('hide');
        setTimeout(function () {
            $('.edit-ticket-action').trigger('click');
        }, 300);
    });

    // Open Close Ticket modal
    $('#viewCloseTicketBtn').click(function () {
        $('#viewTicketModal').modal('hide');
        setTimeout(function () {
            $('#closeTicketModal').modal('show');
        }, 300);
    });
});
