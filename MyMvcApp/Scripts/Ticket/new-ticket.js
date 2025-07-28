function showSuccessToast() {
    const toast = document.getElementById('successToast');
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

//  Open New Ticket Modal
$("#openNewTicketModalBtn").on("click", function () {
    $(".modal").modal("hide"); 

    $("#modalContext").val("new"); 
    $("#newTicketForm")[0].reset();
    const newModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("newTicketModal"));
    newModal.show();
});


$(document).ready(function () {
    $('#newTicketForm').validate({
        rules: {
            Computer: { required: true },
            Owner: { required: true },
            AssignedTo: { required: true },
            Description: { required: true, minlength: 5 },
            Email: { required: true, email: true },
            Priority: { required: true }
        },
        messages: {
            Computer: "Please select a computer.",
            Owner: "Owner is required.",
            AssignedTo: "Assigned To is required.",
            Description: "This Field  is required.",
            Email: "Enter a valid email.",
            Priority: "Please select a priority."
        },
        errorClass: 'text-danger small',

        submitHandler: function (form, e) {
            e.preventDefault();

            const data = {
                Computer: $('[name="Computer"]').val(),
                Group: "Testing",
                Tags: "",
                TicketID: "TK-" + Math.floor(100000 + Math.random() * 900000),
                Status: "Open",
                Owner: $('[name="Owner"]').val(),
                AssignedTo: $('[name="AssignedTo"]').val(),
                Username: "New User",
                Email: $('[name="Email"]').val(),
                Description: $('[name="Description"]').val(),
                Notes: "",
                CreatedAt: new Date().toISOString(),
                LastModified: new Date().toISOString(),
                Source: "Manual",
                Priority: $('[name="Priority"]').val()
            };

            $.ajax({
                url: '/Ticket/SaveTicket',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (response) {
                    if (response.success) {
                        const grid = $("#ticketGrid").dxDataGrid("instance");
                        const currentData = grid.option("dataSource");
                        data.ID = response.id; 
                        currentData.unshift(data);
                        grid.option("dataSource", currentData);
                        grid.refresh();

                        showSuccessToast();

                        const modal = bootstrap.Modal.getInstance(document.getElementById("newTicketModal"));
                        if (modal) modal.hide();

                        $('#newTicketForm')[0].reset();
                    } else {
                        alert("Error saving ticket: " + response.message);
                    }
                },
                error: function () {
                    alert("Failed to save ticket. Please try again.");
                }
            });
        }

    });

    
    $("#uploadBtn").on("click", function () {
        $("#fileInput").click();
    });
});
