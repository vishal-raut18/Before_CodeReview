$(document).ready(function () {

    // Add modal context input if not already present
    if (!$("#modalContext").length) {
        $("body").append('<input type="hidden" id="modalContext" value="new">');
    }

    // Sample data for assignee users
    const assigneeUsers = [
        { Name: "John Smith", Email: "john.smith@example.com", UserType: "Admin", Role: "Support" },
        { Name: "Alice Johnson", Email: "alice.j@example.com", UserType: "User", Role: "Support" },
        { Name: "David Lee", Email: "david.lee@example.com", UserType: "Super Admin", Role: "Manager" },
        { Name: "Rahul Verma", Email: "rahul.verma@example.com", UserType: "Admin", Role: "Support" },
        { Name: "Priya Mehta", Email: "priya.mehta@example.com", UserType: "User", Role: "Manager" },
        { Name: "Arjun Desai", Email: "arjun.desai@example.com", UserType: "Super Admin", Role: "Support" }
    ];

    // Initialize the DevExtreme DataGrid
    const assigneeGrid = $("#assignGridAssignee").dxDataGrid({
        dataSource: assigneeUsers,
        width: "100%",
        selection: { mode: "single" },
        paging: { pageSize: 10 },
        pager: {
            visible: true,
            showInfo: true,
            showNavigationButtons: true
        },
        scrolling: {
            mode: "standard",
            showScrollbar: "always"
        },
        columns: [
            { dataField: "Name", caption: "Name" },
            { dataField: "Email", caption: "Email" },
            { dataField: "UserType", caption: "User Type" },
            { dataField: "Role", caption: "Role" }
        ]
    }).dxDataGrid("instance");

    // Live search filter
    $("#searchAssignee").on("input", function () {
        const query = $(this).val().toLowerCase();
        const filtered = assigneeUsers.filter(user =>
            user.Name.toLowerCase().includes(query) ||
            user.Email.toLowerCase().includes(query) ||
            user.UserType.toLowerCase().includes(query) ||
            user.Role.toLowerCase().includes(query)
        );
        assigneeGrid.option("dataSource", filtered);
    });

    // Assign selected user
    $("#assignToBtn").click(function () {
        const selected = assigneeGrid.getSelectedRowsData();
        const context = $("#modalContext").val();

        if (selected.length > 0) {
            const user = selected[0];
            const formatted = `${user.Name} (${user.Role})`;

            if (context === "edit") {
                $("#editAssignedTo").val(formatted);
            } else {
                $("#assignedToInput").val(formatted);
            }

            $("#assignToModal").modal("hide");

            // Show back the parent modal
            setTimeout(() => {
                if ($("#modalContext").val() === "edit") {
                    $("#editTicketModal").modal("show");
                } else {
                    $("#newTicketModal").modal("show");
                }
            }, 300);
        } else {
            alert("Please select a user to assign.");
        }
    });


    $('#assignToModal').on('hidden.bs.modal', function () {
        const context = $("#modalContext").val();

        // Reset search field and data
        $("#searchAssignee").val("");
        assigneeGrid.option("dataSource", assigneeUsers);
        assigneeGrid.clearSelection();

        // Reset toggle if exists
        $('#filterToggle').prop('checked', false);

        // Reopen parent modal
        if (context === "edit") {
            bootstrap.Modal.getOrCreateInstance(document.getElementById("editTicketModal")).show();
        } else {
            bootstrap.Modal.getOrCreateInstance(document.getElementById("newTicketModal")).show();
        }
    });

    
    $('#assignToModal').on('shown.bs.modal', function () {
        preselectAssigneeRow();
    });

    
    function preselectAssigneeRow() {
        const context = $("#modalContext").val();
        let selectedText = "";

        if (context === "edit") {
            selectedText = $("#editAssignedTo").val().trim();
        } else {
            selectedText = $("#assignedToInput").val().trim();
        }

        if (!selectedText) return;

        // Extract Name and Role from format: "Name (Role)"
        const match = selectedText.match(/^(.*?) \((.*?)\)$/);
        if (!match) return;

        const name = match[1];
        const role = match[2];

        const gridData = assigneeGrid.getDataSource().items();

        const matchedUser = gridData.find(user => user.Name === name && user.Role === role);
        if (matchedUser) {
            assigneeGrid.selectRowsByIndexes([gridData.indexOf(matchedUser)]);
        }
    }

});
