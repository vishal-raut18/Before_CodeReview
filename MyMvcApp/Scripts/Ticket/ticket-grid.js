$(function () {
    
    const ticketData = [
        {
            ID: 1, Computer: "Computer-01", Group: "Default", Tags: "", TicketID: "TK-000001", Status: "Open",
            Owner: "Abhi (Super Admin)", AssignedTo: "Chetan (Admin)", Username: "alohauser",
            Email: "abhi@aloha.com", Description: "Training ticket description goes here", Notes: "Testing notes",
            CreatedAt: "2024-07-01", LastModified: "2024-07-04", Source: "Manual", Priority: "P1"
        },
        {
            ID: 2, Computer: "Computer-02", Group: "Development", Tags: "", TicketID: "TK-000002", Status: "Closed",
            Owner: "Sneha (Dev)", AssignedTo: "Vishal (QA)", Username: "devuser",
            Email: "sneha@aloha.com", Description: "Second ticket description content", Notes: "Important",
            CreatedAt: "2024-07-02", LastModified: "2024-07-04", Source: "Web", Priority: "P2"
        }
    ];

    window.ticketGridInstance = $("#ticketGrid").dxDataGrid({
        dataSource: ticketData,
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
            pageSize: 10
        },
        pager: {
            visible: true,
            showInfo: true,
            showNavigationButtons :true,
            
        },
        searchPanel: {
            visible: false,
            placeholder: "Search tickets..."
        },
        columns: [
            { type: "selection", width: 39, cssClass: "circle-checkbox"  },
            { dataField: "Computer", caption: "Ticket (0)", width: 180 },
            { dataField: "Group", width: 120 },
            { dataField: "Tags", width: 100 },
            { dataField: "TicketID", caption: "Ticket ID", width: 110 },
            {
                dataField: "Status", caption: "Ticket Status", width: 130,
                cellTemplate: function (container, options) {
                    const status = options.data.Status;
                    let color = "";

                    if (status === "Open") {
                        color = "#88db2f";
                    } else if (status === "Closed") {
                        color = "#6c757d";
                    } else {
                        color = "#0091FF";
                    }

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
                cellTemplate: function (container, options) {
                    const description = options.data.Description;

                    const shortText = $("<span>")
                        .addClass("text-truncate d-inline-block")
                        .css({
                            "max-width": "130px",
                            "white-space": "nowrap",
                            "overflow": "hidden",
                            "text-overflow": "ellipsis",
                            "color": "#000"
                        })
                        .text(description);

                    const infoBtn = $("<button>")
                        .addClass("btn btn-link p-0 ms-1 open-description-popup")
                        .attr("title", "View Full Description")
                        .html('<i class="bi bi-info-circle-fill" style="color: #0091FF; font-size: 14px;"></i>')
                        .on("click", function (e) {
                            $(".custom-desc-popup").remove(); // remove any existing popup

                            const popup = $(`
                    <div class="custom-desc-popup border rounded-3 shadow-sm px-3 py-2 bg-white"
                         style="position: absolute; z-index: 9999; min-width: 260px; font-family: 'Open Sans','Segoe UI';">
                        <div class="fw-semibold text-dark mb-1" style="font-size: 13px;">Description</div>
                        <div class="text-dark" style="font-size: 12px; color:#696969 !important">${description}</div>
                        <div class="popup-arrow-left"></div> <!-- Arrow element -->
                    </div>
                `);

                            $("body").append(popup);

                            const offset = $(this).offset();
                            popup.css({
                                position: "absolute",
                                zIndex: 9999,
                                background: "#fff",
                                padding: "12px 16px",
                                border: "1px solid #ddd",
                                borderRadius: "6px",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                                width: "260px",
                                minHeight: "80px",  
                                fontSize: "13px",
                                fontFamily: "'Open Sans', 'Segoe UI'", 
                                lineHeight: "1.5",
                                color: "#000",
                                top: offset.top - 28,
                                left: offset.left - 270
                            });


                           
                            $(document).on("mousedown.descPopup", function (event) {
                                if (!popup.is(event.target) && popup.has(event.target).length === 0) {
                                    popup.remove();
                                    $(document).off("mousedown.descPopup");
                                }
                            });
                        });

                    $("<div>")
                        .addClass("d-flex align-items-center justify-content-between")
                        .css("max-width", "160px")
                        .append(shortText)
                        .append(infoBtn)
                        .appendTo(container);
                }
            }
,
            { dataField: "Notes", width: 120 },
            { dataField: "CreatedAt", caption: "Date Added", width: 130 },
            { dataField: "LastModified", caption: "Last Modified", width: 130 },
            { dataField: "Source", width: 100 },
            { dataField: "Priority", width: 100 }
        ],
        onSelectionChanged: function (e) {
            const selectedCount = e.selectedRowKeys.length;
            e.component.columnOption(1, "caption", `Ticket (${selectedCount})`);
        }
    }).dxDataGrid("instance");

    // Custom search filter logic
    $("#customSearch").on("input", function () {
        const query = $(this).val().toLowerCase();
        $("#ticketGrid").dxDataGrid("instance").searchByText(query);
    });


});

