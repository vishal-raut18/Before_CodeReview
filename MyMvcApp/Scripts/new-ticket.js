function showSuccessToast() {
    const toast = document.getElementById('successToast');
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// ✅ Open New Ticket Modal
$("#openNewTicketModalBtn").on("click", function () {
    $(".modal").modal("hide"); // Close all open modals
    $("#modalContext").val("new"); // Set modal context to NEW
    $("#newTicketForm")[0].reset(); // Reset form
    const newModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("newTicketModal"));
    newModal.show(); // Show New Ticket modal
});

// ✅ Form Submit + Add Ticket to Grid
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
            Description: "Description is required.",
            Email: "Enter a valid email.",
            Priority: "Please select a priority."
        },
        errorClass: 'text-danger small',

        submitHandler: function (form, e) {
            e.preventDefault();

            const data = {
                ID: Date.now(),
                Computer: $('[name="Computer"]').val(),
                Group: "Default",
                Tags: "",
                TicketID: "TK-" + Math.floor(100000 + Math.random() * 900000),
                Status: "Open",
                Owner: $('[name="Owner"]').val(),
                AssignedTo: $('[name="AssignedTo"]').val(),
                Username: "New User",
                Email: $('[name="Email"]').val(),
                Description: $('[name="Description"]').val(),
                Notes: "",
                CreatedAt: new Date().toISOString().split('T')[0],
                LastModified: new Date().toISOString().split('T')[0],
                Source: "Manual",
                Priority: $('[name="Priority"]').val()
            };

            const grid = $("#ticketGrid").dxDataGrid("instance");
            const currentData = grid.option("dataSource");
            currentData.unshift(data);
            grid.option("dataSource", currentData);
            grid.refresh();

            showSuccessToast();
            const modal = bootstrap.Modal.getInstance(document.getElementById("newTicketModal"));
            if (modal) modal.hide();

            $('#newTicketForm')[0].reset();
        }
    });

    // ✅ Trigger file input on upload button click
    $("#uploadBtn").on("click", function () {
        $("#fileInput").click();
    });
});
