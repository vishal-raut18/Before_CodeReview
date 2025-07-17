$(function () {
    const tickets = [
        {
            TicketName: "Computer-101",
            Group: "IT",
            Tags: "Hardware",
            TicketID: "TK-000001",
            Status: "Open",
            Owner: "Vishal",
            AssignedTo: "John (Support)",
            Username: "Demo User",
            Email: "demo@example.com",
            Description: "Static description goes here.",
            Notes: "Testing note",
            CreatedAt: "2025-07-04",
            LastModified: "2025-07-04",
            Source: "Manual",
            Priority: "P1"
        },
        {
            TicketName: "Computer-102",
            Group: "HR",
            Tags: "Software",
            TicketID: "TK-000002",
            Status: "In Progress",
            Owner: "Sneha",
            AssignedTo: "Anjali (Admin)",
            Username: "Static User 2",
            Email: "static2@example.com",
            Description: "Static row 2 description.",
            Notes: "Note 2",
            CreatedAt: "2025-07-04",
            LastModified: "2025-07-04",
            Source: "Web",
            Priority: "P2"
        }
    ];

    $("#ticketGrid").dxDataGrid({
        dataSource: tickets,
        showBorders: true,
        selection: {
            mode: "multiple",
            showCheckBoxesMode: "always"
        },


        columns: [
            {
                caption: "Ticket",
                dataField: "TicketName",
                width: 120
            },
            {
                caption: "Group",
                dataField: "Group",
                width: 100
            },
            {
                caption: "Tags",
                dataField: "Tags",
                width: 90
            },
            {
                caption: "Ticket ID",
                dataField: "TicketID",
                width: 110
            },
            {
                caption: "Status",
                dataField: "Status",
                width: 120
            },
            {
                caption: "Owner",
                dataField: "Owner",
                width: 120
            },
            {
                caption: "Assigned To",
                dataField: "AssignedTo",
                width: 130
            },
            {
                caption: "User Name",
                dataField: "Username",
                width: 120
            },
            {
                caption: "User Email",
                dataField: "Email",
                width: 160
            },
            {
                caption: "Description",
                dataField: "Description",
                width: 180,
                cellTemplate: function (container, options) {
                    $("<div>")
                        .addClass("text-truncate")
                        .css({ "max-width": "160px" })
                        .attr("title", options.value)
                        .text(options.value)
                        .appendTo(container);
                }
            },
            {
                caption: "Notes",
                dataField: "Notes",
                width: 120
            },
            {
                caption: "Date Added",
                dataField: "CreatedAt",
                width: 110
            },
            {
                caption: "Last Modified",
                dataField: "LastModified",
                width: 130
            },
            {
                caption: "Source",
                dataField: "Source",
                width: 90
            },
            {
                caption: "Priority",
                dataField: "Priority",
                width: 100
            }
        ],
        paging: {
            pageSize: 5
        },
        pager: {
            
        },
        onSelectionChanged: function (e) {
            let count = e.selectedRowsData.length;
            $("#rowCountIndicator").text(count + " row(s) selected").fadeIn();
            if (count === 0) $("#rowCountIndicator").fadeOut();
        }
    });
});
