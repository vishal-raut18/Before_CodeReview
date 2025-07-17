
$(document).ready(function () {

  
    if (!$("#modalContext").length) {
        $("body").append('<input type="hidden" id="modalContext" value="new">');
    }

  
    
    const users = [
        { Name: "John Smith", Email: "john@example.com", UserType: "Admin", Role: "Support" },
        { Name: "Alice Johnson", Email: "alice@example.com", UserType: "User", Role: "Support" },
        { Name: "David Lee", Email: "david@example.com", UserType: "Super Admin", Role: "Manager" },
        { Name: "Rahul Verma", Email: "rahul.verma@example.com", UserType: "Admin", Role: "Support" },
        { Name: "Priya Mehta", Email: "priya.mehta@example.com", UserType: "User", Role: "Manager" },
        { Name: "Arjun Desai", Email: "arjun.desai@example.com", UserType: "Super Admin", Role: "Support" }

    ];

    
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
            useNative: true },
        columns: [
            { dataField: "Name", caption: "Name" },
            { dataField: "Email", caption: "Email" },
            { dataField: "UserType", caption: "User Type" },
            { dataField: "Role", caption: "Role" }
        ]
    }).dxDataGrid("instance");

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

            $("#assignOwnerModal").modal("hide");

         
            setTimeout(() => {
                if ($("#modalContext").val() === "edit") {
                    $("#editTicketModal").modal("show");
                } else {
                    $("#newTicketModal").modal("show");
                }
            }, 300);
        } else {
            alert("Please select a user to assign as Owner.");
        }
    });
});
