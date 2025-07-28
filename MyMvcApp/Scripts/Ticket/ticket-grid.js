$(function () {
    $.ajax({
        url: '/Ticket/GetTickets',
        method: 'GET',
        success: function (data) {
            // Now we pass `data` to the grid directly
            window.ticketGridInstance = $("#ticketGrid").dxDataGrid({
                dataSource: data,
                keyExpr: "ID",
                selection: {
                    mode: "multiple",
                    showCheckBoxesMode: "always"
                },
                columnAutoWidth: true,
                width: "100%",
                scrolling: {
                    mode: "standard",
                    showScrollbar: "always"
                },
                rowAlternationEnabled: true,
                showBorders: true,
                paging: {
                    pageSize: 15
                },
                pager: {
                    visible: true,
                    showInfo: true,
                    showNavigationButtons: true,

                },
                searchPanel: {
                    visible: false,
                    placeholder: "Search tickets..."
                },
                // ... your existing configuration ...
                columns: [
                    { type: "selection", width: 39, cssClass: "circle-checkbox" },
                    { dataField: "Computer", caption: `Ticket (${data.length})`, width: 180 },
                    { dataField: "Group", caption: "Groups", width: 120 },
                    { dataField: "Tags", width: 100 },
                    { dataField: "TicketID", caption: "Ticket ID", width: 110 },
                    {
                        dataField: "Status", caption: "Ticket Status", width: 130,
                        cellTemplate: function (container, options) {
                            const status = options.data.Status;
                            let color = status === "Open" ? "#88db2f" : (status === "Closed" ? "#6c757d" : "#0091FF");
                            $("<span>")
                                .addClass("fw-semibold")
                                .css("color", color)
                                .text(status)
                                .appendTo(container);
                        }
                    },
                    { dataField: "Owner", width: 180 },
                    { dataField: "AssignedTo", width: 180 },
                    { dataField: "Username", caption: "Username (Windows)", width: 230 },
                    { dataField: "Email", caption: "User Email", width: 230 },
                    {
                        dataField: "Description", caption: "Description", width: 200,
                        cellTemplate: window.createDescriptionCell // use external function
                    },

                    { dataField: "Notes", width: 120 },
                    { dataField: "CreatedAt", caption: "Date Added", width: 130 },
                    { dataField: "LastModified", caption: "Last Modified", width: 130 },
                    { dataField: "Source", width: 100 },
                    { dataField: "Priority", width: 100 }


                    // ... rest of your description column etc.
                ],
                onContentReady: function (e) {
                    const rowCount = e.component.totalCount(); // total rows visible in grid
                    e.component.columnOption("Computer", "caption", `Ticket (${rowCount})`);
                },

            });

            // Search hook
            $("#customSearch").on("input", function () {
                const query = $(this).val().toLowerCase();
                $("#ticketGrid").dxDataGrid("instance").searchByText(query);
            });
        },
        error: function () {
            alert("Failed to load ticket data.");
        }
    });
});
