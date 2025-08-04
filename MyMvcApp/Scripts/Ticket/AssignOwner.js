$(document).ready(function () {

    // Modal context hidden input if not exists
    if (!$("#modalContext").length) {
        $("body").append('<input type="hidden" id="modalContext" value="new">');
    }

    // Static user list
    const users = [
        { Name: "John Smith", Email: "john@example.com", UserType: "Admin", Role: "Support" },
        { Name: "Alice Johnson", Email: "alice@example.com", UserType: "User", Role: "Support" },
        { Name: "David Lee", Email: "david@example.com", UserType: "Super Admin", Role: "Manager" },
        { Name: "Rahul Verma", Email: "rahul.verma@example.com", UserType: "Admin", Role: "Support" },
        { Name: "Priya Mehta", Email: "priya.mehta@example.com", UserType: "User", Role: "Manager" },
        { Name: "Arjun Desai", Email: "arjun.desai@example.com", UserType: "Super Admin", Role: "Support" }
    ];

    // DevExtreme Grid init
    const ownerGrid = $("#assignToGrid").dxDataGrid({
        dataSource: users,
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
            useNative: true
        },
        columns: [
            { dataField: "Name", caption: "Name" },
            { dataField: "Email", caption: "Email" },
            { dataField: "UserType", caption: "User Type" },
            { dataField: "Role", caption: "Role" }
        ]
    }).dxDataGrid("instance");

    // Search filter
    $("#searchBox").on("input", function () {
        const query = $(this).val().toLowerCase();
        const filtered = users.filter(user =>
            user.Name.toLowerCase().includes(query) ||
            user.Email.toLowerCase().includes(query) ||
            user.UserType.toLowerCase().includes(query) ||
            user.Role.toLowerCase().includes(query)
        );
        ownerGrid.option("dataSource", filtered);
    });

    // Assign Owner button
    $("#assignOwnerBtn").click(function () {
        const selected = ownerGrid.getSelectedRowsData();
        const context = $("#modalContext").val();

        if (selected.length > 0) {
            const user = selected[0];
            const formatted = `${user.Name} (${user.Role})`;

            if (context === "edit") {
                $("#editOwner").val(formatted);
            } else {
                $("#ownerInput").val(formatted);
            }

            ownerGrid.clearSelection();                         // Clear selected row
            $("#searchBox").val("");                            // Clear search box
            ownerGrid.option("dataSource", users);              // Reset full list
            $('#filterToggle').prop('checked', false);

            // Hide submodal manually
            const assignOwnerModal = bootstrap.Modal.getInstance(document.getElementById("assignOwnerModal"));
            if (assignOwnerModal) assignOwnerModal.hide();

            // Show parent modal again based on context
            setTimeout(() => {
                if (context === "edit") {
                    bootstrap.Modal.getOrCreateInstance(document.getElementById("editTicketModal")).show();
                } else {
                    bootstrap.Modal.getOrCreateInstance(document.getElementById("newTicketModal")).show();
                }
            }, 300);
        } else {
            alert("Please select a user to assign as Owner.");
        }
    });

    // ✅ Handle ❌ button close for Assign Owner
    $("#closeAssignOwnerX").click(function () {
        const assignOwnerModal = bootstrap.Modal.getInstance(document.getElementById("assignOwnerModal"));
        if (assignOwnerModal) assignOwnerModal.hide();
    });

    // ✅ When submodal is hidden (e.g., ESC key), return to correct parent modal
    $('#assignOwnerModal').on('hidden.bs.modal', function () {
        const context = $("#modalContext").val();

        // Clear selection and reset toggle
        if (ownerGrid) {
            ownerGrid.clearSelection();
            $("#searchBox").val("");
            ownerGrid.option("dataSource", users);
        }

        $('#filterToggle').prop('checked', false); // ✅ Reset toggle on close

        // Show correct parent modal
        if (context === "edit") {
            bootstrap.Modal.getOrCreateInstance(document.getElementById("editTicketModal")).show();
        } else {
            bootstrap.Modal.getOrCreateInstance(document.getElementById("newTicketModal")).show();
        }
    });

    // ✅ When submodal is shown: re-apply modal stacking + preselect row if needed
    $('#assignOwnerModal').on('shown.bs.modal', function () {
        $('body').addClass('modal-open');
        preselectOwnerGridRow(); 
    });

   
    function preselectOwnerGridRow() {
        const context = $("#modalContext").val();
        let selectedText = "";

        if (context === "edit") {
            selectedText = $("#editOwner").val().trim();
        } else {
            selectedText = $("#ownerInput").val().trim();
        }

        if (!selectedText) return;

        
        const match = selectedText.match(/^(.*?) \((.*?)\)$/);
        if (!match) return;

        const name = match[1];
        const role = match[2];

        const gridData = ownerGrid.getDataSource().items();

        const matchedUser = gridData.find(user => user.Name === name && user.Role === role);
        if (matchedUser) {
            ownerGrid.selectRowsByIndexes([gridData.indexOf(matchedUser)]);
        }
    }

});
