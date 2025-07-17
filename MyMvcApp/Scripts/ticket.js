$(document).ready(function () {
    $('.view-btn').click(function () {
        var id = $(this).data("id");

        $.get("/Ticket/ViewTicket", { id: id }, function (data) {
            // Remove any previous modal content
            $('#ticketDetailsModalContainer').html('');
            // Append new modal HTML
            $('#ticketDetailsModalContainer').html(data);
            // Show modal using Bootstrap
            $('#viewTicketModal').modal('show');
        });
    });
});
