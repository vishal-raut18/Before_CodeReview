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
           
            Description: { required: true, minlength: 1 }
           
            
        },
        messages: {
           
            Description: "This Field  is required.",
           
           
        },
        errorClass: 'text-danger small',

        submitHandler: function (form, e) {
            e.preventDefault();

            const data = {
                Computer: $('[name="Computer"]').val() === "No Computer Selected" ? "" : $('[name="Computer"]').val(),
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
                LastModifiedBy:"vishalr@alohatechnology.com",
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

    
   
});

const descField = document.getElementById('descriptionField');
const descCount = document.getElementById('descCount');
const descError = document.getElementById('descError');
const maxLength = 1000;

descField.addEventListener('input', () => {
    const currentLength = descField.value.length;
    descCount.textContent = currentLength;

    if (currentLength > maxLength) {
        descField.classList.add('is-invalid');
        descError.classList.remove('d-none');
        descCount.classList.remove('text-muted');
        descCount.classList.add('text-danger');
    } else {
        descField.classList.remove('is-invalid');
        descError.classList.add('d-none');
        descCount.classList.add('text-muted');
        descCount.classList.remove('text-danger');
    }
});


