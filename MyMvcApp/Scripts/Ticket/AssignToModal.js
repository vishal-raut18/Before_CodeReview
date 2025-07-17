

$(document).ready(function () {
  
    //  Ensure modalContext is present
    if (!$("#modalContext").length) {
        $("body").append('<input type="hidden" id="modalContext" value="new">');
    }

    
    const assigneeUsers = [
        { Name: "John Smith", Email: "john.smith@example.com", UserType: "Admin", Role: "Support" },
        { Name: "Alice Johnson", Email: "alice.j@example.com", UserType: "User", Role: "Support" },
        { Name: "David Lee", Email: "david.lee@example.com", UserType: "Super Admin", Role: "Manager" },

        { Name: "Rahul Verma", Email: "rahul.verma@example.com", UserType: "Admin", Role: "Support" },
        { Name: "Priya Mehta", Email: "priya.mehta@example.com", UserType: "User", Role: "Manager" },
        { Name: "Arjun Desai", Email: "arjun.desai@example.com", UserType: "Super Admin", Role: "Support" }

        
       
      

    ];

    // ✅ DevExtreme Grid Setup
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

    //  Search Assignee Input
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
});
