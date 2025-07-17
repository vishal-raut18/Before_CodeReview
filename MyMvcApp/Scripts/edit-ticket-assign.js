$(document).ready(function () {
    // Open Owner modal from Edit Ticket
    $('#editOwnerAddBtn').click(function () {
        $('#editTicketModal').modal('hide');
        setTimeout(() => {
            $('#assignOwnerModal').modal('show');
            $('#assignOwnerModal').attr('data-source', 'edit');
        }, 300);
    });

    // Open Assigned To modal from Edit Ticket
    $('#editAssignedToAddBtn').click(function () {
        $('#editTicketModal').modal('hide');
        setTimeout(() => {
            $('#assignToModal').modal('show');
            $('#assignToModal').attr('data-source', 'edit');
        }, 300);
    });

    // Assign Owner from Owner Modal (only if from Edit)
    $('#assignOwnerBtn').click(function () {
        if ($('#assignOwnerModal').attr('data-source') === 'edit') {
            const selectedRadio = $('#ownerTable input[name="selectedOwner"]:checked');
            if (!selectedRadio.length) {
                alert("Please select an owner.");
                return;
            }

            const row = selectedRadio.closest('tr');
            const name = row.data('username');

            $('#editOwner').val(name);

            $('#assignOwnerModal').modal('hide');
            setTimeout(() => {
                $('body').addClass('modal-open');
                $('#editTicketModal').modal('show');
            }, 300);
        }
    });

    // Assign Assignee from Assignee Modal (only if from Edit)
    $('#assignToBtn').click(function () {
        if ($('#assignToModal').attr('data-source') === 'edit') {
            const selectedRadio = $('#assigneeTable input[name="selectedAssignee"]:checked');
            if (!selectedRadio.length) {
                alert("Please select an assignee.");
                return;
            }

            const row = selectedRadio.closest('tr');
            const name = row.data('username');
            const role = row.data('role');

            $('#editAssignedTo').val(`${name} (${role})`);

            $('#assignToModal').modal('hide');
            setTimeout(() => {
                $('body').addClass('modal-open');
                $('#editTicketModal').modal('show');
            }, 300);
        }
    });

    // Remove data-source flag when modal closes
    $('#assignOwnerModal, #assignToModal').on('hidden.bs.modal', function () {
        $(this).removeAttr('data-source');
    });
});
