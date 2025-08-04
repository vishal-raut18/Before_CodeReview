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
                columnFixing: {
                    enabled: true
                },

                rowAlternationEnabled: true,
                hoverStateEnabled: true, // For hover effect
                focusedRowEnabled: true,
                onRowClick: function (e) {
                    // Only respond if the clicked target is within the specific cell (e.g., with class "selectable-cell")
                    if (!e.event.target.closest(".selectable-cell")) {
                        return;
                    }

                    const grid = e.component;
                    const key = e.key;

                    if (grid.isRowSelected(key)) {
                        grid.deselectRows([key]);
                    } else {
                        grid.selectRows([key], true);
                    }
                }
,
                columnAutoWidth: true,
                width: "100%",
                height: "100%",
                scrolling: {
                    mode: "virtual",
                    useNative: false, // ✅ Required for fixed columns to work
                    scrollByContent: true,
                    scrollByThumb: true,
                    showScrollbar: "always"
                },
                rowAlternationEnabled: true,
                showBorders: true,
                paging: {
                    pageSize: 25
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
                    {
                        type: "selection", width: 39, cssClass: "circle-checkbox", fixed: true,
                        fixedPosition: "left"},
                    {
                        dataField: "Computer", caption: `Tickets (${data.length})`, width: 200, cssClass: "selectable-cell", fixed: true,
                        fixedPosition: "left"
                    },
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
                    { dataField: "LastModified", caption: "Last Modified On", width: 130 },
                    { dataField: "LastModifiedBy", caption: "Last Modified By", width: 130 },
                    { dataField: "Source", width: 100 },
                    { dataField: "Priority", width: 100 }


                    // ... rest of your description column etc.
                ],
                onContentReady: function (e) {
                    const rowCount = e.component.totalCount(); 
                    e.component.columnOption("Computer", "caption", `Tickets (${rowCount})`);
                },

                onSelectionChanged: function (e) {
                    const selectedCount = e.selectedRowKeys.length;

                    const badge = document.getElementById("selectionBadge");
                    const countSpan = document.getElementById("selectedCount");

                    if (selectedCount > 0) {
                        countSpan.textContent = selectedCount;
                        badge.classList.remove("d-none");
                    } else {
                        badge.classList.add("d-none");
                    }
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


