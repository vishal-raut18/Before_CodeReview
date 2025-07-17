$(document).ready(function () {
   
    $(document).on("click", ".delete-ticket-action", function (e) {
        e.preventDefault();

        const grid = window.ticketGridInstance;
        if (!grid) {
            alert("Grid not found");
            return;
        }

        const selectedRows = grid.getSelectedRowsData();
        if (selectedRows.length === 0) {
            alert("Please select a row to delete.");
            return;
        }

        // Show delete confirmation modal
        const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("deleteTicketModal"));
        modal.show();
    });

    // Confirm deletion
    $("#confirmDeleteBtn").on("click", function () {
        const grid = window.ticketGridInstance;
        if (!grid) return;

        const selectedKeys = grid.getSelectedRowKeys();

        if (selectedKeys.length === 0) {
            alert("No rows selected.");
            return;
        }

        // Remove selected rows from data source
        const dataSource = grid.getDataSource();
        const items = dataSource.items();

        // Filter out selected rows
        const newItems = items.filter(item => !selectedKeys.includes(item.ID));
        dataSource.store()._array = newItems; // update store directly
        grid.refresh(); // refresh grid

        // Close modal
        bootstrap.Modal.getInstance(document.getElementById("deleteTicketModal")).hide();

        // Show toast
        const toast = new bootstrap.Toast(document.getElementById("deleteToast"));
        toast.show();
    });
});
