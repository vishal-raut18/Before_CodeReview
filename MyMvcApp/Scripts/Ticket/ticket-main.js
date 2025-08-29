let ticketdata = [];
let ticketGridInstance = null;

let unassignedFilterActive = false;
let applyfiter = false;
let originalSelectedColumns = [];


// ---------------- Global Data Arrays ---------------- //
const ownerUsers = [
    { Name: "John Smith", Email: "john@example.com", UserType: "Admin", Role: "Support" },
    { Name: "Alice Johnson", Email: "alice@example.com", UserType: "User", Role: "Support" },
    { Name: "David Lee", Email: "david@example.com", UserType: "Super Admin", Role: "Manager" },
    { Name: "Rahul Verma", Email: "rahul.verma@example.com", UserType: "Admin", Role: "Support" },
    { Name: "Priya Mehta", Email: "priya.mehta@example.com", UserType: "User", Role: "Manager" },
    { Name: "Arjun Desai", Email: "arjun.desai@example.com", UserType: "Super Admin", Role: "Support" }
];

const assigneeUsers = [
    { Name: "John Smith", Email: "john.smith@example.com", UserType: "Admin", Role: "Support" },
    { Name: "Alice Johnson", Email: "alice.j@example.com", UserType: "User", Role: "Support" },
    { Name: "David Lee", Email: "david.lee@example.com", UserType: "Super Admin", Role: "Manager" },
    { Name: "Rahul Verma", Email: "rahul.verma@example.com", UserType: "Admin", Role: "Support" },
    { Name: "Priya Mehta", Email: "priya.mehta@example.com", UserType: "User", Role: "Manager" },
    { Name: "Arjun Desai", Email: "arjun.desai@example.com", UserType: "Super Admin", Role: "Support" }
];

// ---------------- Main Document Ready ---------------- //
$(document).ready(function () {





    if (!$("#modalContext").length) {
        $("body").append('<input type="hidden" id="modalContext" value="new">');
    }

    // ---------------- Owner Modal ---------------- //
    const ownerGrid = $("#assignToGrid").dxDataGrid({
        dataSource: ownerUsers,
        width: "100%",
        selection: { mode: "single" },
        paging: { pageSize: 10 },
        pager: { visible: true, showInfo: true, showNavigationButtons: true },
        scrolling: { mode: "standard", useNative: true },
        columns: [
            { dataField: "Name", caption: "Name" },
            { dataField: "Email", caption: "Email" },
            { dataField: "UserType", caption: "User Type" },
            { dataField: "Role", caption: "Role" }
        ]
    }).dxDataGrid("instance");

    $("#searchBox").on("input", function () {
        const query = $(this).val().toLowerCase();
        const filtered = ownerUsers.filter(user =>
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
            const formatted = `${selected[0].Name} (${selected[0].Role})`;
            context === "edit" ? $("#editOwner").val(formatted) : $("#ownerInput").val(formatted);
            ownerGrid.clearSelection();
            $("#searchBox").val("");
            ownerGrid.option("dataSource", ownerUsers);
            $('#filterToggle').prop('checked', false);
            bootstrap.Modal.getInstance(document.getElementById("assignOwnerModal")).hide();

            setTimeout(() => {
                const modal = context === "edit" ? "editTicketModal" : "newTicketModal";
                bootstrap.Modal.getOrCreateInstance(document.getElementById(modal)).show();
            }, 300);
        } else {
            alert("Please select a user to assign as Owner.");
        }
    });

    $("#closeAssignOwnerX").click(function () {
        bootstrap.Modal.getInstance(document.getElementById("assignOwnerModal"))?.hide();
    });

    $('#assignOwnerModal').on('hidden.bs.modal', function () {
        ownerGrid.clearSelection();
        $("#searchBox").val("");
        ownerGrid.option("dataSource", ownerUsers);
        $('#filterToggle').prop('checked', false);
        const modal = $("#modalContext").val() === "edit" ? "editTicketModal" : "newTicketModal";
        bootstrap.Modal.getOrCreateInstance(document.getElementById(modal)).show();
    });

    $('#assignOwnerModal').on('shown.bs.modal', function () {
        $('body').addClass('modal-open');
        preselectOwnerGridRow(ownerGrid);
    });

    // ---------------- Assignee Modal ---------------- //
    const assigneeGrid = $("#assignGridAssignee").dxDataGrid({
        dataSource: assigneeUsers,
        width: "100%",
        selection: { mode: "single" },
        paging: { pageSize: 10 },
        pager: { visible: true, showInfo: true, showNavigationButtons: true },
        scrolling: { mode: "standard", showScrollbar: "always" },
        columns: [
            { dataField: "Name", caption: "Name" },
            { dataField: "Email", caption: "Email" },
            { dataField: "UserType", caption: "User Type" },
            { dataField: "Role", caption: "Role" }
        ]
    }).dxDataGrid("instance");

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
            const formatted = `${selected[0].Name} (${selected[0].Role})`;
            context === "edit" ? $("#editAssignedTo").val(formatted) : $("#assignedToInput").val(formatted);
            bootstrap.Modal.getInstance(document.getElementById("assignToModal"))?.hide();

            setTimeout(() => {
                const modal = context === "edit" ? "editTicketModal" : "newTicketModal";
                bootstrap.Modal.getOrCreateInstance(document.getElementById(modal)).show();
            }, 300);
        } else {
            alert("Please select a user to assign.");
        }
    });

    $('#assignToModal').on('hidden.bs.modal', function () {
        $("#searchAssignee").val("");
        assigneeGrid.option("dataSource", assigneeUsers);
        assigneeGrid.clearSelection();
        $('#filterToggle').prop('checked', false);
        const modal = $("#modalContext").val() === "edit" ? "editTicketModal" : "newTicketModal";
        bootstrap.Modal.getOrCreateInstance(document.getElementById(modal)).show();
    });

    $('#assignToModal').on('shown.bs.modal', function () {
        preselectAssigneeRow(assigneeGrid);
    });

    window.createDescriptionCell = function (container, options) {
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
                    <div class="popup-arrow-left"></div>
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
    };




    //--------- Ticket-grid.js ----------------------

    fetchTicketData(initializeTicketGrid);


    //------------ New Ticket JS---------



    $('#newTicketForm').validate({
        rules: {
            Description: { required: true, minlength: 1 }
        },
        messages: {
            Description: "This field is required."
        },
        errorClass: 'text-danger small',

        submitHandler: function (form, e) {
            e.preventDefault();

            const newTicket = {
                Computer: $('[name="Computer"]').val() === "No Computer Selected" ? "" : $('[name="Computer"]').val(),
                Group: "Testing",
                Tags: "",
                TicketID: "TK-" + Math.floor(100000 + Math.random() * 900000),
                Status: "Open",
                Owner: $('[name="Owner"]').val(),
                AssignedTo: $('[name="AssignedTo"]').val(),
                Username: "New User",
                Email: $('[name="Email"]').val(),
                Description: $('[name="Description"]').val(),
                Notes: "",
                CreatedAt: new Date().toISOString(),
                LastModified: new Date().toISOString(),
                LastModifiedBy: "vishalr@alohatechnology.com",
                Source: "Manual",
                Priority: $('[name="Priority"]').val(),
                ComputerStatus: "Offline",
                Policy: "Semi-Automati"
            };

            // Send to server
            $.ajax({
                url: '/Ticket/SaveTicket',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(newTicket),
                success: function (response) {
                    if (response.success) {

                        newTicket.ID = response.id;
                        ticketData.unshift(newTicket);
                        ticketGridInstance.option("dataSource", ticketData);
                        ticketGridInstance.refresh();

                        showSuccessToast();
                        const modal = bootstrap.Modal.getInstance(document.getElementById("newTicketModal"));
                        if (modal) modal.hide();
                        $('#newTicketForm')[0].reset();
                    } else {
                        alert("Error saving ticket: " + response.message);
                    }
                },
                error: function () {
                    alert("Failed to save ticket. Please try again.");
                }
            });
        }
    });



    //--------- Edit Ticket js -------------------


    // On Edit button click
    $(document).on("click", ".edit-ticket-action", function (e) {
        e.preventDefault();

        const selected = ticketGridInstance.getSelectedRowsData();

        if (selected.length === 0) {
            alert("Please select a ticket to edit.");
            return;
        }

        const ticket = selected[0];

        // Fill modal fields
        if (ticket.Computer && ticket.Computer.trim() !== "") {
            $("#editComputerReadonly").val(ticket.Computer).show();
            $("#editComputerDropdown").hide();
        } else {
            $("#editComputerReadonly").hide();
            $("#editComputerDropdown").val("").show();
        }

        $("#editStatus").val(ticket.Status || "");
        $("#editOwner").val(ticket.Owner || "");
        $("#editAssignedTo").val(ticket.AssignedTo || "");
        $("#editDescription").val(ticket.Description || "");
        $("#editEmail").val(ticket.Email || "");
        $("#editPriority").val(ticket.Priority || "");

        // Store ID and TicketID in modal for later
        $("#editTicketModal").data("TicketID", ticket.TicketID);
        $("#editTicketModal").data("ID", ticket.ID);
        $("#modalContext").val("edit");

        bootstrap.Modal.getOrCreateInstance(document.getElementById("editTicketModal")).show();
    });

    // On Update (Save) button click
    $(document).on("click", "#updateTicketBtn", function () {
        const id = $("#editTicketModal").data("ID");
        const ticketId = $("#editTicketModal").data("TicketID");

        const updatedData = {
            ID: id,
            TicketID: ticketId,
            Computer: $("#editComputerReadonly").is(":visible")
                ? $("#editComputerReadonly").val()
                : $("#editComputerDropdown").val(),
            Status: $("#editStatus").val(),
            Owner: $("#editOwner").val(),
            AssignedTo: $("#editAssignedTo").val(),
            Description: $("#editDescription").val(),
            Email: $("#editEmail").val(),
            Priority: $("#editPriority").val()
        };


        $.ajax({
            url: '/Ticket/UpdateTicket',
            type: 'POST',
            data: updatedData,
            success: function () {

                const index = ticketData.findIndex(t => t.ID === id);
                if (index !== -1) {
                    Object.assign(ticketData[index], updatedData);
                }

                ticketGridInstance.option("dataSource", ticketData);
                ticketGridInstance.refresh();
                ticketGridInstance.clearSelection();


                bootstrap.Modal.getInstance(document.getElementById("editTicketModal")).hide();
                showSuccessToast();
            },
            error: function () {
                alert("Error updating ticket.");
            }
        });

        $("#modalContext").val("new");
    });


    //----------- Delete-ticket.js-----------------



    let selectedTicketIDs = [];


    $(document).on("click", ".delete-ticket-action", function (e) {
        e.preventDefault();

        if (!ticketGridInstance) {
            alert("Grid not initialized.");
            return;
        }

        const selectedRows = ticketGridInstance.getSelectedRowsData();
        if (selectedRows.length === 0) {
            alert("Please select at least one row to delete.");
            return;
        }


        selectedTicketIDs = selectedRows.map(row => row.TicketID);
        console.log("Selected TicketIDs for delete:", selectedTicketIDs);


        const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("deleteTicketModal"));
        modal.show();
    });


    $("#confirmDeleteBtn").on("click", function () {
        if (!selectedTicketIDs.length) {
            alert("No tickets selected.");
            return;
        }


        $.ajax({
            type: "POST",
            url: "/Ticket/Delete",
            traditional: true,
            data: { id: selectedTicketIDs },
            success: function (response) {
                if (response.success) {

                    ticketData = ticketData.filter(item => !selectedTicketIDs.includes(item.TicketID));

                    ticketGridInstance.option("dataSource", ticketData);
                    ticketGridInstance.refresh();
                    ticketGridInstance.clearSelection();
                    bootstrap.Modal.getInstance(document.getElementById("deleteTicketModal")).hide();
                    new bootstrap.Toast(document.getElementById("deleteToast")).show();

                    selectedTicketIDs = [];
                } else {
                    alert("Delete failed: " + (response.message || "Unknown error"));
                }
            },
            error: function (err) {
                alert("Error deleting tickets: " + err.responseText);
            }
        });
    });


    // ---------- View-ticket.js---------

    $(document).on("click", ".view-ticket-action", function (e) {
        e.preventDefault();

        const gridInstance = $("#ticketGrid").dxDataGrid("instance");

        if (!gridInstance) {
            alert("Grid not found.");
            return;
        }

        const selectedRows = gridInstance.getSelectedRowsData();
        if (!selectedRows || selectedRows.length === 0) {
            alert("Please select a ticket to view.");
            return;
        }

        const data = selectedRows[0];

        // Fill modal fields from selected row
        $("#viewTicketId").text(data.TicketID || "-");
        $("#viewComputer").text(data.Computer || "-");
        $("#viewStatus").text(data.Status || "-");
        $("#viewDescription").text(data.Description || "-");
        $("#viewFiles").text(data.FilesUploaded || "");
        $("#viewYourEmail").text(data.Email || "-");
        $("#viewEmail").text(data.NotifyUser || "vishalralohatechnology@gmail.com");
        $("#viewAssignedTo").text(data.AssignedTo || "-");
        $("#viewSource").text(data.Source || "Manual");
        $("#viewPriority").text(data.Priority || "-");

        // Open View Ticket Modal
        const viewModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("viewTicketModal"));
        viewModal.show();
    });
    $(document).on("click", "#viewEditBtn", function () {
        $("#viewTicketModal").modal("hide");
        $(".edit-ticket-action").trigger("click");
    });
    $(document).on("click", "#viewCloseTicketBtn", function () {
        $("#viewTicketModal").modal("hide");
        $(".change-status-closed").trigger("click");
    });


    //---------View-history.js -----------

    $(document).on("click", ".view-history-action", function (e) {
        e.preventDefault();

        const grid = $("#ticketGrid").dxDataGrid("instance");
        if (!grid) return alert("Ticket grid not found.");

        const selectedRows = grid.getSelectedRowsData();
        if (selectedRows.length === 0) return alert("Please select a row to view history.");

        const ticket = selectedRows[0];
        const ticketId = ticket.TicketID;


        $("#historyTicketId").text(ticketId || "-");
        $("#historyComputer").text(ticket.Computer || "-");
        $("#historyStatus").text(ticket.Status || "-");
        $("#historyDescription").text(ticket.Description || "-");
        $("#historyFiles").text(ticket.Files || "No File Uploaded");
        $("#historyOwner").text(ticket.Owner || "-");
        $("#historyAssignedTo").text(ticket.AssignedTo || "-");

        $("#historyNotifyUser").text(ticket.Email || "-");
        $("#historySource").text(ticket.Source || "Manual");
        $("#historyPriority").text(ticket.Priority || "-");


        $("#historyActionContainer").empty();


        $.getJSON('/Ticket/GetHistory', { ticketId: ticketId }, function (historyList) {
            console.log("History data received:", historyList);

            if (!historyList || historyList.length === 0) {
                $("#historyActionContainer").append('<p>No history found.</p>');
                return;
            }

            historyList.forEach(function (history, index) {

                let date;
                if (index === 0) {
                    date = new Date(ticket.CreatedDate || history.actionDate);
                } else {
                    date = new Date(history.actionDate);
                }
                let formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

                let cardHtml = '';

                if (index === 0) {

                    let curr = safeParseJSON(history.newValues) || {};



                    cardHtml = `
                              <div class="rounded shadow-sm mb-3" style="background-color: #f9f9f9; border: 1px solid #ddd; padding: 10px;">
                                <div class="d-flex justify-content-between align-items-center" style="background-color: #e6f8d3; padding: 6px 12px; border-bottom: 1px solid #ccc; margin: -10px -10px 0 -10px;">
                                  <strong>${history.actionType} By:</strong> <span class="text-dark ms-1">vishalr@alohatechnologydev.com</span>
                                  <div class="text-muted small">${formattedDate}</div>
                                </div>
                                <div class="p-2">
                                  ${renderMainDetails(curr)}
                                </div>
                              </div>
                            `;

                } else {

                    cardHtml = `
                        <div class="rounded shadow-sm mb-3" style="background-color: #f9f9f9; border: 1px solid #ddd; padding: 10px;">
                            <div class="d-flex justify-content-between align-items-center" style="background-color: #94cbf6; padding: 6px 12px; border-bottom: 1px solid #ccc;margin: -10px -10px 0 -10px; ">
                                <strong >${history.actionType} By:</strong> <span class="text-dark ms-1">vishalr@alohatechnologydev.com</span>
                                <div class="text-muted small">${formattedDate}</div>
                            </div>
                            <div class="p-2">
                                ${renderUpdatedFields(history)}
                            </div>
                        </div>
                    `;
                }

                $("#historyActionContainer").append(cardHtml);
            });
        }).fail(function () {
            $("#historyActionContainer").append('<p>Error loading history.</p>');
        });


        const historyModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("viewHistoryModal"));
        historyModal.show();
    });


    // --------- Actiondropdown js------
    $(".change-status-open").on("click", function () {
        updateTicketStatus("Open", "toastOpen", "bg-success");

    });

    $(".change-status-inprogress").on("click", function () {
        updateTicketStatus("In Progress", "toastProgress", "bg-warning");
    });

    $(".change-status-closed").on("click", function (e) {
        e.preventDefault();

        const grid = $("#ticketGrid").dxDataGrid("instance");
        if (!grid) return;

        const selectedRows = grid.getSelectedRowsData();
        if (selectedRows.length === 0) {
            alert("Please select at least one ticket.");
            isCloseAllowed = false;
            return;
        }

        isCloseAllowed = true;
        $("#closeTicketModal").modal("show");
    });

    $("#confirmCloseTicket").on("click", function () {
        if (!isCloseAllowed) {
            alert("No ticket selected.");
            return;
        }

        updateTicketStatus("Closed", "toastClosed", "bg-primary");
        $("#closeTicketModal").modal("hide");

        isCloseAllowed = false;
    });


    $("#customSearch").on("input", function () {
        const query = $(this).val().toLowerCase();
        $("#ticketGrid").dxDataGrid("instance").searchByText(query);
    });


 // ============================ 2 nd Task JS ===================
 // =============================================================


 
    $('#filterModal').on('show.bs.modal', function () {
        populateDropdown('#computerList', '#selectedComputerName', '#computerNameBtn', 'Computer');
        populateDropdown('#groupList', '#selectedGroup', '#groupBtn', 'Group');
        populateDropdown('#tagsList', '#selectedTags', '#tagsBtn', 'Tags');
        populateDropdown('#policyList', '#selectedPolicy', '#policyBtn', 'Policy');
        populateDropdown('#assignedToList', '#selectedAssignedTo', '#assignedToBtn', 'AssignedTo');
        populateDropdown('#ticketOwnerList', '#selectedTicketOwner', '#ticketOwnerBtn', 'Owner');
        populateDropdown('#ticketSourceList', '#selectedTicketSource', '#ticketSourceBtn', 'Source');
        populateDropdown('#ticketPriorityList', '#selectedTicketPriority', '#ticketPriorityBtn', 'Priority');
    });

    
    setupDropdown('#computerNameBtn', '#computerNameDropdown', '#computerSearch', '#clearComputerSearch', '#computerList');
    setupDropdown('#groupBtn', '#groupDropdown', '#groupSearch', '#clearGroupSearch', '#groupList');
    setupDropdown('#tagsBtn', '#tagsDropdown', '#tagsSearch', '#clearTagsSearch', '#tagsList');
    setupDropdown('#policyBtn', '#policyDropdown', '#policySearch', '#clearPolicySearch', '#policyList');
    setupDropdown('#assignedToBtn', '#assignedToDropdown', '#assignedToSearch', '#clearAssignedToSearch', '#assignedToList');
    setupDropdown('#ticketOwnerBtn', '#ticketOwnerDropdown', '#ticketOwnerSearch', '#clearTicketOwnerSearch', '#ticketOwnerList');
    setupDropdown('#ticketSourceBtn', '#ticketSourceDropdown', '#ticketSourceSearch', '#clearTicketSourceSearch', '#ticketSourceList');
    setupDropdown('#ticketPriorityBtn', '#ticketPriorityDropdown', '#ticketPrioritySearch', '#clearTicketPrioritySearch', '#ticketPriorityList');

    $('.selectable-button').on('click', function () {

        $('#statusList').on('click', '.selectable-button', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            } else {
                $('#statusList .selectable-button').removeClass('selected');
                $(this).addClass('selected');
            }
        });

       
        $('#computerStatusList').on('click', '.selectable-button', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            } else {
                $('#computerStatusList .selectable-button').removeClass('selected');
                $(this).addClass('selected');
            }
        });

    });

    $("#filterModal #filterToggle").on("change", function () {
        let isViewMode = $(this).is(":checked");
        $("#filterModal")
            .find("button")
            .not("#filterToggle,.btn-close")
            .prop("disabled", isViewMode);


        if (isViewMode) {
            $("#filterModal").find("input, select, textarea").addClass("bg-light text-muted");
        } else {
            $("#filterModal").find("input, select, textarea").removeClass("bg-light text-muted");
        }
    });

  //++++++++++++++++++ 2nd.js +++++++++++++++++++++++++++++

    window.currentUserName = "John Smith (Support)";
    console.log(`[DEBUG] Current user: ${window.currentUserName}`);
    disableFilterButtons();
    const fieldToListId = {
        Computer: '#computerList',
        Group: '#groupList',
        Tags: '#tagsList',
        Policy: '#policyList',
        AssignedTo: '#assignedToList',
        Owner: '#ticketOwnerList',
        Source: '#ticketSourceList',
        Priority: '#ticketPriorityList',
        ComputerStatus: '#computerStatusList',
        Status: '#statusList'
    };

    $('#filterModal').on('show.bs.modal', function () {
        console.log("[DEBUG] Restoring selections from current grid filter...");

        const gridInstance = getTicketGridInstance();
        $('.dropdown-menu input[type="checkbox"]').prop('checked', false);

        if (!gridInstance) {
            console.warn("[DEBUG] No grid instance found; updating labels from DOM");
            Object.values(fieldToListId).forEach(listId => updateDropdownLabel(listId, $(listId).prev('.filter-button')));
            return;
        }

        let currentFilter = null;
        try {
            currentFilter = (typeof gridInstance.getCombinedFilter === 'function') ? gridInstance.getCombinedFilter(true) : gridInstance.option && gridInstance.option('filter');
        } catch (ex) {
            console.warn("[DEBUG] Error reading grid filter:", ex);
            currentFilter = null;
        }
        console.log("[DEBUG] Current grid filter:", currentFilter);

        if (!currentFilter) {
            $('.selected').removeClass('selected');
            clearAllFilters()
            Object.values(fieldToListId).forEach(listId => updateDropdownLabel(listId, $(listId).prev('.filter-button')));
            return;
        }

        function flattenFilter(filter) {
            const out = [];
            if (!filter) return out;
            if (Array.isArray(filter)) {

                if (typeof filter[0] === 'string' && filter.length >= 3) {
                    out.push([filter[0], filter[2]]);
                } else {

                    filter.forEach(item => {
                        if (item === 'and' || item === 'or') return;
                        out.push(...flattenFilter(item));
                    });
                }
            }
            return out;
        }

        const flatFilters = flattenFilter(currentFilter);
        console.log("[DEBUG] Flattened filter array:", flatFilters);
        flatFilters.forEach(([field, value]) => {
            const listId = fieldToListId[field] || (`#${field.charAt(0).toLowerCase() + field.slice(1)}List`);
            if (!listId) return;
            const $checkbox = $(`${listId} input[type="checkbox"][value="${value}"]`);
            if ($checkbox.length) {
                $checkbox.prop('checked', true);
            } else {
                console.debug(`[DEBUG] No checkbox found for ${listId} value="${value}"`);
            }
        });
        Object.values(fieldToListId).forEach(listId => updateDropdownLabel(listId, $(listId).prev('.filter-button')));
    });

   
    $('#applyFiltersBtn, .apply-filters').off('click').on('click', function (e) {
        e.preventDefault();
        console.log("[DEBUG] Apply Filters button clicked");
        applyfiter = true;
        applyFiltersToGrid();

    });

   
    $('#clearAllFiltersBtn, .clear-all-filters').off('click').on('click', function (e) {
        e.preventDefault();
        console.log("[DEBUG] Clear All Filters button clicked");
        clearAllFilters();
        applyfiter = false;
        $("#filterModal").modal("hide");
    });

    
    $(document).on('change', '.dropdown-menu input[type="checkbox"]', function () {
        const $menu = $(this).closest('.dropdown-menu');
        const listId = $menu.attr('id') ? `#${$menu.attr('id')}` : null;
        const $btn = $menu.prev('.filter-button');
        if (listId) updateDropdownLabel(listId, $btn);
    });
    console.log("[DEBUG] Event bindings complete.");



 //++++++++++++++++++++++ newIncomingJs +++++++++++++++++++++++++

    $("#ticketReportDropdown .dropdown-item").on("click", function (e) {
        e.preventDefault();

        const filterValue = $(this).data("filter");
        const filterText = $(this).text();
        $("#ticketReportDropdown .dropdown-item").removeClass("selected");
        $(this).addClass("selected");

        if (filterValue === "All") {
           
            $("#ticketReportLabel").text("Incoming Tickets Report");
            $("#selectionBadgeFilter").addClass("d-none");
            $("#ticketReportBridgeText").text("");
            $("#ticketReportBadge").hide();
            unassignedFilterActive = false;
            clearAllFilters();
        }
        else if (filterValue === "Unassigned") {
            unassignedFilterActive = true;
            $("#ticketReportLabel").text(filterText);
            $("#ticketReportBridgeText").text(filterText);
            $("#selectionBadgeFilter").removeClass("d-none");
            $("#ticketReportBadge").show();
            clearAllFiltersAndModalSelections();
            $('#unassigned-AssignedTo').prop('checked', true);
            $('#unassigned-AssignedTo').trigger('change');
            $('#selectedAssignedTo').text('Unassigned');
            $('#assignedToBtn').attr('title', 'Unassigned');
            $('#assignedToBtn').addClass('selected');
            const gridInstance = getTicketGridInstance();
            if (gridInstance && typeof gridInstance.filter === "function") {
                gridInstance.clearFilter();
                gridInstance.filter(["AssignedTo", "=", ""]);
            }
            const $filterBtn = $("button[data-bs-target='#filterModal']");
            $filterBtn.css({
                backgroundColor: "#d0e7ff",
                borderRadius: "4px"
            });
            $filterBtn.html(`<i class="bi bi-funnel-fill me-1"></i> Filters / ${1}`);
           
        }
        else {
            $("#ticketReportLabel").text(filterText);
            $("#ticketReportBridgeText").text(filterText);
            $("#selectionBadgeFilter").removeClass("d-none");
            $("#ticketReportBadge").show();
            clearAllFiltersAndModalSelections();
            if (filterValue === "Active") {
                $("#filterModal .selectable-button").filter(function () {
                    return $(this).text().trim() === "Active";
                }).addClass("selected");
            } else if (filterValue === "Closed") {
                $("#filterModal .selectable-button").filter(function () {
                    return $(this).text().trim() === "Closed";
                }).addClass("selected");
            } else if (filterValue === "MyTicket") {
                $("#filterModal .selectable-button").filter(function () {
                    return $(this).text().trim() === "My Tickets";
                }).addClass("selected");
            }
            applyFiltersToGrid();
        }
    });

  //+++++++++++++++++++++++ ColumnChooser js (below js)+++++++++++++++++++++++++

    $(document).on("click", ".selectable-button.selected", function (e) {
        updateFilterButtonStates();
    });





});




//------------- fetch data---------
function fetchTicketData(callback) {
    $.get('/Ticket/GetTickets')
        .done(function (response) {
            if (Array.isArray(response)) {
                ticketData = response;
            } else {
                ticketData = [];
            }
            if (typeof callback === 'function') {
                callback();
            }
        })
        .fail(function (error) {
            console.error("Error fetching tickets:", error);
            ticketData = [];
            if (typeof callback === 'function') {
                callback();
            }
        });
}


function initializeTicketGrid() {
    ticketGridInstance = $("#ticketGrid").dxDataGrid({

        dataSource: ticketData,
        keyExpr: "ID",
        selection: {
            mode: "multiple",
            showCheckBoxesMode: "always"
        },
        columnFixing: { enabled: true },
        rowAlternationEnabled: true,
        hoverStateEnabled: true,
        focusedRowEnabled: true,
        columnAutoWidth: true,

        width: "100%",
        height: "100%",
        scrolling: {
            mode: "virtual",
            useNative: false,
            scrollByContent: true,
            scrollByThumb: true,
            showScrollbar: "always"
        },
        showBorders: true,
        paging: { pageSize: 25 },
        pager: {
            visible: true,
            showInfo: true,
            showNavigationButtons: true
        },
        searchPanel: {
            visible: false,
            placeholder: "Search tickets..."
        },
        onContentReady: function (e) {
            updateTicketCaption(e.component);
        },
        onOptionChanged: function (e) {

            if (e.name === "filterValue" || e.name === "filter") {
                updateTicketCaption(e.component);
            }
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
        onRowClick: function (e) {
            if (!e.event.target.closest(".selectable-cell")) return;

            const grid = e.component;
            const key = e.key;

            if (grid.isRowSelected(key)) {
                grid.deselectRows([key]);
            } else {
                grid.selectRows([key], true);
            }
        },

        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField === "Computer") {
                const status = e.data.ComputerStatus;

                if (status === "Online") {
                    e.cellElement.addClass("status-online");
                } else if (status === "Offline") {
                    e.cellElement.addClass("status-offline");
                }
            }
        },

        columns: [
            { type: "selection", width: 39, cssClass: "circle-checkbox", fixed: true, fixedPosition: "left" },
            { dataField: "Computer", caption: `Tickets (${ticketData.length})`, width: 200, cssClass: "selectable-cell", fixed: true, fixedPosition: "left" },
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
                cellTemplate: window.createDescriptionCell
            },
            { dataField: "Notes", width: 120 },
            { dataField: "CreatedAt", caption: "Date Added", width: 130 },
            { dataField: "LastModified", caption: "Last Modified On", width: 130 },
            { dataField: "LastModifiedBy", caption: "Last Modified By", width: 130 },
            { dataField: "Source", width: 100 },
            { dataField: "Priority", width: 100 },

            { dataField: "ComputerStatus", width: 150 },
            { dataField: "Policy", width: 150 }


        ]
    }).dxDataGrid("instance");
}

//ticket COunt When Fiter is Apply

function updateTicketCaption(gridComponent) {
    const totalCount = ticketData.length;
    const visibleCount = gridComponent.totalCount();

    let caption;
    if (visibleCount === totalCount) {

        caption = `Tickets (${totalCount})`;
    } else {

        caption = `Tickets (${visibleCount} of ${totalCount})`;
    }

    gridComponent.columnOption("Computer", "caption", caption);
}

// ---------Main grid Search----------
function bindSearchHandler() {
    $("#customSearch").on("input", function () {
        const query = $(this).val().toLowerCase();
        $("#ticketGrid").dxDataGrid("instance").searchByText(query);
    });
}


// ---------------- Preselect Grid Rows ---------------- //
function preselectOwnerGridRow(ownerGrid) {
    const context = $("#modalContext").val();
    let selectedText = context === "edit" ? $("#editOwner").val().trim() : $("#ownerInput").val().trim();
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

function preselectAssigneeRow(assigneeGrid) {
    const context = $("#modalContext").val();
    let selectedText = context === "edit" ? $("#editAssignedTo").val().trim() : $("#assignedToInput").val().trim();
    if (!selectedText) return;

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



// New Ticket Below Containt


const descField = document.getElementById('descriptionField');
const descCount = document.getElementById('descCount');
const descError = document.getElementById('descError');
const maxLength = 1000;

descField.addEventListener('input', () => {
    const currentLength = descField.value.length;
    descCount.textContent = currentLength;

    if (currentLength > maxLength) {
        descField.classList.add('is-invalid');
        descError.classList.remove('d-none');
        descCount.classList.remove('text-muted');
        descCount.classList.add('text-danger');
    } else {
        descField.classList.remove('is-invalid');
        descError.classList.add('d-none');
        descCount.classList.add('text-muted');
        descCount.classList.remove('text-danger');
    }
});



// History-ticket js Function

function safeParseJSON(jsonStr) {
    if (!jsonStr) return null;
    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        console.warn("Failed to parse JSON:", e);
        return null;
    }
}


function renderMainDetails(curr) {
    const details = [
        { label: "Status", value: curr.Status },
        { label: "Description", value: curr.Description },
        { label: "Owner", value: curr.Owner },
        { label: "Assigned To", value: curr.AssignedTo },
        { label: "Priority", value: curr.Priority },
    ];

    let html = '<div style="display: flex; flex-direction: column; gap: 6px;">';

    details.forEach(({ label, value }) => {
        html += `
            <div style="display: flex; align-items: center;">
                <div style="min-width: 110px; font-weight: bold;">${label}:</div>
                <div>${value || '-'}</div>
            </div>
        `;
    });

    html += '</div>';

    return html;
}


function renderUpdatedFields(history) {
    let curr = safeParseJSON(history.newValues) || {};

    if (!history.changedFields) {
        return '<em>No changes details.</em>';
    }

    let fields = history.changedFields.split(',').map(f => f.trim());
    let html = '';

    fields.forEach(field => {
        let newVal = curr[field] !== undefined ? curr[field] : '-';
        html += `
            <div style="display: flex; align-items: center; margin-bottom: 6px;">
                <div style="min-width: 110px; font-weight: normal; color: black;">${field}:</div>
                <div style="color: black;">${newVal}</div>
            </div>
        `;
    });

    return html || '<em>No changes details.</em>';
}



// ------------- Action Dropdown Js ----------------


// Generic update function
function updateTicketStatus(newStatus, toastId, colorClass) {
    const grid = $("#ticketGrid").dxDataGrid("instance");

    if (!grid) return;

    const selectedRows = grid.getSelectedRowsData();
    if (selectedRows.length === 0) {
        alert("Please select at least one ticket.");
        return;
    }

    const ticketIds = selectedRows.map(r => r.ID);

    $.ajax({
        type: "POST",
        url: "/Ticket/UpdateTicketStatus",
        contentType: "application/json",
        data: JSON.stringify({
            ids: ticketIds,
            newStatus: newStatus
        }),
        success: function () {

            const dataSource = grid.option("dataSource");
            ticketIds.forEach(id => {
                const index = dataSource.findIndex(item => item.ID === id);
                if (index !== -1) dataSource[index].Status = newStatus;
            });
            grid.refresh();

            const toastEl = document.getElementById(toastId);
            if (toastEl) {
                const bsToast = new bootstrap.Toast(toastEl);
                bsToast.show();
            }
        },
        error: function () {
            alert("Failed to update ticket status.");
        }
    });
}


//Handeler i creared

// Separate function definition
function handleDeleteTicketClick(e) {
    e.preventDefault();

    const grid = $("#ticketGrid").dxDataGrid("instance");
    if (!grid) {
        alert("Grid not found");
        return;
    }

    const selectedRows = grid.getSelectedRowsData();
    if (selectedRows.length === 0) {
        alert("Please select at least one row to delete.");
        return;
    }

    selectedTicketIDs = selectedRows.map(row => row.TicketID); // Collect all selected IDs
    console.log("Selected TicketIDs for delete:", selectedTicketIDs);

    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("deleteTicketModal"));
    modal.show();
}

//-----resetNote-----------
document.addEventListener("DOMContentLoaded", function () {
    const closeTicketModal = document.getElementById("closeTicketModal");
    const sendEmailCheckbox = document.getElementById("sendEmailCheckbox");
    const closeNotes = document.getElementById("closeNotes");
    const notesCharCount = document.getElementById("notesCharCount");

    closeTicketModal.addEventListener('hidden.bs.modal', function () {

        sendEmailCheckbox.checked = false;

        closeNotes.value = '';


        notesCharCount.textContent = '0';
    });


    closeNotes.addEventListener('input', function () {
        notesCharCount.textContent = closeNotes.value.length;
    });


});




// ============================ 2 nd Task JS  Functions ===================
// =============================================================


function getUniqueValuesFromData(field) {
    const values = [...new Set(ticketData.map(item => item[field]).filter(Boolean))];

    if (field === "Priority") {
        return values.sort().reverse();
    }

    return values.sort();
}

function populateDropdown(listId, selectedId, btnId, dataField) {
    let uniqueValues = getUniqueValuesFromData(dataField);
    let $list = $(listId);
    $list.empty();
    if (listId === '#assignedToList') {
        $list.append(`
            <div class="form-check" style="border-bottom:0.8px solid #D3D3D3;">
                <input class="form-check-input" type="checkbox" value="" id="unassigned-${dataField}">
                <label class="form-check-label w-100 dropdown-label mb-2 mt-1" title="Unassigned" for="unassigned-${dataField}">Unassigned</label>
            </div>
        `);
    }
    uniqueValues.forEach(name => {
        if (name === "" || name === null || name === undefined) {
            return;
        }
        let idSafe = name.replace(/\s+/g, '-');
        $list.append(`
            <div class="form-check" style="border-bottom:0.8px solid #D3D3D3;">
                <input class="form-check-input" type="checkbox" value="${name}" id="${idSafe}-${dataField}">
                <label class="form-check-label w-100 dropdown-label mb-2 mt-1" title="${name}" for="${idSafe}-${dataField}">${name}</label>
            </div>
        `);
    });
    $(`${listId} input[type="checkbox"]`).on('change', function () {
        let selected = [];
        $(`${listId} input[type="checkbox"]`).each(function () {
            const label = $(this).next('label');
            if ($(this).is(':checked')) {
                label.css('background-color', '#e9f5ff');
                selected.push($(this).val());
            } else {
                label.css('background-color', '');
            }
        });
        console.log('Selected values:', selected);
        let displayText;
        if (selected.length === 0) {
            displayText = $(btnId).text();
        } else {
            const displaySelected = selected.map(item => {
                console.log('Processing item:', `"${item}"`);
                return item === "" ? "Unassigned" : item;
            });
            console.log('Display selected:', displaySelected);
            displayText = displaySelected.join(', ');
        }
        console.log('Final display text:', `"${displayText}"`);
        $(selectedId).text(displayText);
        $(btnId).attr('title', displayText); 
        $(btnId).toggleClass('selected', selected.length > 0);
        updateFilterButtonStates();
    });
}

function setupDropdown(btnId, dropdownId, searchId, clearId, listClass) {
    $(btnId).on('click', function (e) {
        e.stopPropagation();
        $("#filterModal .dropdown-menu").not(dropdownId).hide();
        $(dropdownId).toggle();
    });
    $(document).on('click', function () {
        $("#filterModal .dropdown-menu").hide();
    });

    $(dropdownId).on('click', function (e) {
        e.stopPropagation(); 
    });

    $(searchId).on('input', function () {
        const search = $(this).val().toLowerCase();
        $(`${dropdownId} .form-check`).each(function () {
            const label = $(this).text().toLowerCase();
            $(this).toggle(label.includes(search));
        });
    });

    $(clearId).on('click', function () {
        $(searchId).val('').trigger('input').focus();
    });
}

//++++++++++++++++++++ 2nd.js Function +++++++++++++++

function getSelectedValues(containerId) {
    console.log(`[DEBUG] Checking selected checkboxes in: ${containerId}`);
    const selected = [];
    $(`${containerId} input[type="checkbox"]:checked`).each(function () {
        const val = $(this).val();
        console.log(`[DEBUG] Found selected value in ${containerId}:`, val);
        selected.push(val);
    });
    console.log(`[DEBUG] Final selected values for ${containerId}:`, selected);
    return selected;
}

function updateDropdownLabel(containerId, $btn) {
    const $container = $(containerId);
    if ($container.length === 0) {
        console.warn(`[WARN] updateDropdownLabel: container not found: ${containerId}`);
        return;
    }
    if (!$btn || !$btn.length) {
        $btn = $container.prev('.filter-button');
    }
    if (!$btn || !$btn.length) {
        console.warn(`[WARN] updateDropdownLabel: button not found for ${containerId}`);
        return;
    }
    const selected = getSelectedValues(containerId);
    const displaySelected = selected.map(item => item === "" ? "Unassigned" : item);
    const $labelSpan = $btn.find('span');
    if ($labelSpan.length === 0) {
        if (selected.length === 0) {
            const defaultText = ($btn.attr('id') || '').replace('Btn', '').replace(/([A-Z])/g, ' $1').trim();
            $btn.text(defaultText || 'Filter');
            $btn.removeAttr('title');
            return;
        } else {
            const displayText = displaySelected.length > 1 ? `${displaySelected[0]} ...` : displaySelected[0];
            $btn.text(displayText);
            $btn.attr('title', displaySelected.join(', '));
            return;
        }
    }
    if (selected.length === 0) {
        const defaultText = ($btn.attr('id') || '')
            .replace('Btn', '')
            .replace(/([A-Z])/g, ' $1')
            .trim();
        $labelSpan.text(defaultText || 'Filter');
        $btn.removeAttr('title');
    } else {
        const displayText = displaySelected.length > 1 ? `${displaySelected[0]} ...` : displaySelected[0];
        $labelSpan.text(displayText);
        $btn.attr('title', displaySelected.join(', '));
    }
}

function getTicketGridInstance() {
    const instance = ticketGridInstance;
    if (!instance) {
        console.error("[ERROR] ticketGridInstance not found. Make sure the grid container ID is correct.");
    }
    return instance;
}

function applyFiltersToGrid() {

    console.clear();
    console.log("[DEBUG] --- APPLY FILTERS START ---");

    let filters = [];
    let anyFilterApplied = false;

    const dropdownFilters = {
        Computer: getSelectedValues('#computerList'),
        Group: getSelectedValues('#groupList'),
        Tags: getSelectedValues('#tagsList'),
        Policy: getSelectedValues('#policyList'),
        AssignedTo: getSelectedValues('#assignedToList'),
        Owner: getSelectedValues('#ticketOwnerList'),
        Source: getSelectedValues('#ticketSourceList'),
        Priority: getSelectedValues('#ticketPriorityList')
    };

    for (const key in dropdownFilters) {
        const values = dropdownFilters[key];
        if (!values || values.length === 0) continue;

        if (values.length === 1) {
            filters.push([key, "=", values[0]]);
        } else {
            let orGroup = [];
            values.forEach((v, idx) => {
                if (idx > 0) orGroup.push("or");
                orGroup.push([key, "=", v]);
            });
            filters.push(orGroup);
        }
    }

   
    const selectedButtons = [];
    $('.selectable-button.selected').each(function () {
        selectedButtons.push($(this).text().trim());

    });

    console.log("[DEBUG] Selected buttons:", selectedButtons);

    if (selectedButtons.length > 0) {
        const statusButtons = [];
        const computerStatusButtons = [];
        const myTicketsSelected = selectedButtons.includes("My Tickets");
        selectedButtons.forEach(label => {
            if (["Open", "In Progress", "Closed"].includes(label)) {
                statusButtons.push(label);
            } else if (["Active"].includes(label)) {
                statusButtons.push("Open", "In Progress");
            } else if (["Online", "Offline"].includes(label)) {
                computerStatusButtons.push(label);
            }
            
        });

        const uniqueStatusButtons = [...new Set(statusButtons)];
        const uniqueComputerStatusButtons = [...new Set(computerStatusButtons)];

        console.log("[DEBUG] Status buttons:", uniqueStatusButtons);
        console.log("[DEBUG] Computer status buttons:", uniqueComputerStatusButtons);
        console.log("[DEBUG] My Tickets selected:", myTicketsSelected);
        if (uniqueStatusButtons.length > 0) {
            if (uniqueStatusButtons.length === 1) {
                filters.push(['Status', '=', uniqueStatusButtons[0]]);
            } else {
                let statusOrGroup = [];
                uniqueStatusButtons.forEach((status, idx) => {
                    if (idx > 0) statusOrGroup.push("or");
                    statusOrGroup.push(['Status', '=', status]);
                });
                filters.push(statusOrGroup);
            }
        }

        if (uniqueComputerStatusButtons.length > 0) {
            if (uniqueComputerStatusButtons.length === 1) {
                filters.push(['ComputerStatus', '=', uniqueComputerStatusButtons[0]]);
            } else {
                let computerStatusOrGroup = [];
                uniqueComputerStatusButtons.forEach((status, idx) => {
                    if (idx > 0) computerStatusOrGroup.push("or");
                    computerStatusOrGroup.push(['ComputerStatus', '=', status]);
                });
                filters.push(computerStatusOrGroup);
            }
        }

        if (myTicketsSelected) {
         
            const myTicketsFilter = [
                ['Owner', '=', currentUserName],
                'or',
                ['AssignedTo', '=', currentUserName]
            ];
            filters.push(myTicketsFilter);
        }
    }
    if (unassignedFilterActive) {
        filters.push(['AssignedTo', '=', ""]);
    }

    let finalFilter = null;
    if (filters.length === 1) {
        finalFilter = filters[0];
    } else if (filters.length > 1) {
        let andGroup = [];
        filters.forEach((f, idx) => {
            if (idx > 0) andGroup.push("and");
            andGroup.push(f);
        });
        finalFilter = andGroup;
    }

    console.log("[DEBUG] Final Filter Object:", JSON.stringify(finalFilter, null, 2));


    const gridInstance = getTicketGridInstance();
    if (gridInstance && typeof gridInstance.filter === "function") {
        gridInstance.clearFilter();
        if (finalFilter) {
            gridInstance.filter(finalFilter);
        }
    } else {
        console.error("[ERROR] Grid instance missing or no filter() method");
    }


    $("#filterModal .dropdown-menu").each(function () {
        const $menu = $(this);
        const selectedValues = $menu.find("input[type='checkbox']:checked").map(function () {
            return $(this).val();
        }).get();

        if (selectedValues.length > 0) {
            anyFilterApplied = true;
        }
    });

   
    $("#filterModal .selectable-button.selected").each(function () {
        anyFilterApplied = true;

    });


    if (anyFilterApplied) {
        $("#selectionBadgeFilter").removeClass("d-none");
    } else {
        $("#selectionBadgeFilter").addClass("d-none");
    }
    updateFilterButtonStyle()
    enableDisableFilterButtons()

    $('#filterModal').modal('hide');
 
    (function syncFilterDropdownFromModal() {
        let singleSelection = null;

        const selectedButtons = $("#filterModal .selectable-button.selected");
        const selectedCheckboxes = $("#filterModal input[type='checkbox']:checked");

        if (selectedButtons.length === 1 && selectedCheckboxes.length === 0) {
            const text = selectedButtons.text().trim();
            if (["Active", "Closed", "My Tickets"].includes(text)) {
                singleSelection = text;
            }
        }

        if (selectedCheckboxes.length === 1 && selectedButtons.length === 0) {
            const id = selectedCheckboxes.first().attr("id");
            if (id === "unassigned-AssignedTo") {
                singleSelection = "Unassigned";
            }
        }

        if (singleSelection) {
            $("#ticketReportDropdown .dropdown-item").removeClass("selected");
            $("#ticketReportDropdown .dropdown-item").each(function () {
                const $item = $(this);
                const itemValue = $item.data("filter");

                if (itemValue === singleSelection.replace(/\s/g, "")) {
                    $item.addClass("selected");
                }
            });

            $("#ticketReportLabel").text(singleSelection + "");
            $("#ticketReportBridgeText").text(singleSelection);
            $("#selectionBadgeFilter").removeClass("d-none");
            $("#ticketReportBadge").show();
        } else {
           
            $("#ticketReportDropdown .dropdown-item").removeClass("selected");
        }
    })();

    console.log("[DEBUG] --- APPLY FILTERS END ---");

}

// Clear all filters
function clearAllFilters() {

    console.log("[DEBUG] --- CLEAR ALL FILTERS START ---");

    const gridInstance = getTicketGridInstance();
    if (gridInstance && typeof gridInstance.clearFilter === 'function') {
        gridInstance.clearFilter();
    }

    const $filterContainer = $('#filterModal');
    $filterContainer.find('.dropdown-menu input[type="checkbox"]')
        .prop('checked', false)
        .trigger('change');
    $filterContainer.find('.dropdown-menu').each(function () {
        const $btn = $(this).prev('.filter-button');
        if ($btn.length) {
            const $labelSpan = $btn.find('span');
            let defaultText = ($btn.attr('id') || '')
                .replace('Btn', '')
                .replace(/([A-Z])/g, ' $1')
                .trim();
            defaultText = defaultText.charAt(0).toUpperCase() + defaultText.slice(1);

            $labelSpan.text(defaultText || 'Filter');
            $btn.removeClass('selected').removeAttr('title');

        }
    });
    $("#ticketReportLabel").text("Incoming Ticket Report");
    $filterContainer.find('.selectable-button').removeClass('selected');
    $filterContainer.find('.search-box').val('').trigger('input');
    $filterContainer.find('.dropdown-menu').hide();
    $("#selectionBadgeFilter").addClass("d-none");
    unassignedFilterActive = false;
    updateFilterButtonStyle();
    disableFilterButtons();
    console.log("[DEBUG] --- CLEAR ALL FILTERS END ---");
}


function updateFilterButtonStyle(extraCount = 0) {
    let totalFilters = 0;
    $("#filterModal .dropdown-menu").each(function () {
        totalFilters += $(this).find("input[type='checkbox']:checked").length > 0;
    });
    totalFilters += $("#filterModal .selectable-button.selected").length;
    totalFilters += extraCount;
    if (unassignedFilterActive) totalFilters++;

    const $filterBtn = $("button[data-bs-target='#filterModal']");

    if (totalFilters > 0) {
        $filterBtn.css({
            backgroundColor: "#d0e7ff",
            borderRadius: "4px"
        });
        $filterBtn.html(`<i class="bi bi-funnel-fill me-1"></i> Filters / ${totalFilters}`);
    } else {
        $filterBtn.css({ backgroundColor: "", borderRadius: "" });
        $filterBtn.html(`<i class="bi bi-funnel-fill me-1"></i> Filters`);
    }
}

// +++++++++++++++ New Incoming Js Function ++++++++++++++


function clearAllFiltersAndModalSelections() {
    $('#filterModal input[type="checkbox"]').prop('checked', false);
    $('#selectedAssignedTo').text('Assigned To');
    $('#assignedToBtn').removeClass('selected').attr('title', '');

    $('#selectedPriority').text('Priority');
    $('#priorityBtn').removeClass('selected').attr('title', '');

    $('#selectedStatus').text('Status');
    $('#statusBtn').removeClass('selected').attr('title', '');

    $('#selectedRequestType').text('Request Type');
    $('#requestTypeBtn').removeClass('selected').attr('title', '');
    $("#filterModal .selectable-button").removeClass("selected");
    $('#filterModal .form-check-label').css('background-color', '');
    enableDisableFilterButtons()
    unassignedFilterActive = false;
}

function clearTicketReportBridge() {
    $("#selectionBadgeFilter").addClass("d-none");
    $("#ticketReportLabel").text("Incoming Ticket Report");
    $("#ticketReportDropdown .dropdown-item").removeClass("selected");
    resetTicketReportFilter();
    updateFilterButtonStyleIncoming();
}

function resetTicketReportFilter() {
    ticketGridInstance.clearFilter();
}

//+++++++++++++++ column chosser .js ++++++++++++++++



document.addEventListener("DOMContentLoaded", function () {

    const selected = document.getElementById("selectedColumns");
    const generalColumns = document.getElementById("generalColumns");
    const otherColumns = document.getElementById("otherColumns");
    const userColumns = document.getElementById("userColumns");
    const dropPlaceholder = document.getElementById("dropPlaceholder");


    const applyBtn = document.getElementById("columnChooserApplyBtn");
    const resetBtn = document.getElementById("columnChooserResetBtn");


    let initialSelectedState = [];

    function getCurrentSelectedState() {
        return Array.from(selected.children)
            .filter(c => !c.id || c.id !== 'dropPlaceholder')
            .map(c => c.textContent.trim());
    }

    function checkForChanges() {
        const currentState = getCurrentSelectedState();
        const isChanged = JSON.stringify(currentState) !== JSON.stringify(initialSelectedState);
        setButtonState(isChanged, isChanged);
    }

    function setButtonState(applyEnabled, resetEnabled) {
        applyBtn.disabled = !applyEnabled;
        resetBtn.disabled = !resetEnabled;

        applyBtn.classList.toggle("disabled", !applyEnabled);
        resetBtn.classList.toggle("disabled", !resetEnabled);
    }

    const columnCategories = {
        general: [" Policy", "Groups", "Tags", "Date Added", "Last Modified on", "Last Modified by"],
        other: ["Ticket Status", "Description", "Notes", "Source", "Priority", "Ticket ID"],
        user: ["Owner", "Assigned To", "Username(Windows)", "User Email"]
    };

    function hasSelectedColumns() {
        const actualItems = Array.from(selected.children).filter(child =>
            !child.id || child.id !== 'dropPlaceholder'
        );
        return actualItems.length > 0;
    }

    function createColumnItem(col, category = null, originalIndex = null) {
        const div = document.createElement("div");
        div.textContent = col;
        div.className = "column-item";
        if (category) {
            div.setAttribute('data-original-category', category);
        }
        if (originalIndex !== null) {
            div.setAttribute('data-original-index', originalIndex);
        }
        return div;
    }

    function getOriginalCategory(columnName) {
        for (const [category, columns] of Object.entries(columnCategories)) {
            if (columns.includes(columnName)) {
                return category;
            }
        }
        return 'general';
    }

    function getOriginalIndex(columnName) {
        for (const [category, columns] of Object.entries(columnCategories)) {
            const index = columns.indexOf(columnName);
            if (index !== -1) {
                return index;
            }
        }
        return 0;
    }

    function returnToOriginalPosition(columnElement) {
        const columnName = columnElement.textContent;
        const originalCategory = getOriginalCategory(columnName);
        const originalIndex = getOriginalIndex(columnName);

        let targetContainer;
        switch (originalCategory) {
            case 'general':
                targetContainer = generalColumns;
                break;
            case 'other':
                targetContainer = otherColumns;
                break;
            case 'user':
                targetContainer = userColumns;
                break;
            default:
                targetContainer = generalColumns;
        }

        columnElement.classList.remove("selected-column");

        const existingItems = Array.from(targetContainer.children);
        let insertPosition = 0;

        for (let i = 0; i < existingItems.length; i++) {
            const existingColumnName = existingItems[i].textContent;
            const existingOriginalIndex = getOriginalIndex(existingColumnName);

            if (originalIndex < existingOriginalIndex) {
                insertPosition = i;
                break;
            }
            insertPosition = i + 1;
        }

        if (insertPosition >= targetContainer.children.length) {
            targetContainer.appendChild(columnElement);
        } else {
            targetContainer.insertBefore(columnElement, targetContainer.children[insertPosition]);
        }
    }

    function populateCategories() {
        generalColumns.innerHTML = "";
        otherColumns.innerHTML = "";
        userColumns.innerHTML = "";
        selected.innerHTML = "";

        selected.appendChild(dropPlaceholder);

        columnCategories.general.forEach((col, index) => {
            if (col.trim() === "Policy") {
                generalColumns.appendChild(createColumnItem(col, 'general', index));
            } else {
                const item = createColumnItem(col, 'general', index);
                item.classList.add("selected-column");
                selected.appendChild(item);
            }
        });

        columnCategories.other.forEach((col, index) => {
            const item = createColumnItem(col, 'other', index);
            item.classList.add("selected-column");
            selected.appendChild(item);
        });

        columnCategories.user.forEach((col, index) => {
            const item = createColumnItem(col, 'user', index);
            item.classList.add("selected-column");
            selected.appendChild(item);
        });

        updatePlaceholder();
        initialSelectedState = getCurrentSelectedState();
        setButtonState(false, false);
    }

    populateCategories();

    const sortableOptions = {
        group: "columns",
        animation: 150,
        onStart: function (evt) {
            if (evt.from !== selected) {
                selected.classList.add('drag-over');
                console.log("[DEBUG] Drag started - showing placeholder");
            }
        },
        onEnd: function (evt) {
            selected.classList.remove('drag-over');
            console.log("[DEBUG] Drag ended - hiding placeholder");

            if (evt.from === selected && (evt.to === generalColumns || evt.to === otherColumns || evt.to === userColumns)) {
                evt.item.remove();
                returnToOriginalPosition(evt.item);
                updatePlaceholder();
                console.log("[DEBUG] Column moved out of selected area");
                checkForChanges();
            }
        },
        onAdd: function (evt) {
            if (evt.to === selected) {
                evt.item.classList.add("selected-column");
                updatePlaceholder();
                console.log("[DEBUG] Column added to selected area");
                checkForChanges();
            }
        },
        onRemove: function (evt) {
            if (evt.from === selected) {
                evt.item.classList.remove("selected-column");
                returnToOriginalPosition(evt.item);
                updatePlaceholder();
                console.log("[DEBUG] Column removed from selected area");
                checkForChanges();
            }
        }
    };

    const availableColumnsOptions = {
        group: "columns",
        animation: 150,
        onStart: function (evt) {
            selected.classList.add('drag-over');
            console.log("[DEBUG] Drag started from available - showing placeholder");
        },
        onEnd: function (evt) {
            selected.classList.remove('drag-over');
            console.log("[DEBUG] Drag ended from available - hiding placeholder");
        },
        onAdd: function (evt) {
            if (evt.from === selected) {
                evt.item.remove();
                returnToOriginalPosition(evt.item);
                updatePlaceholder();
                console.log("[DEBUG] Column returned to available area");
                checkForChanges();
            }
        }
    };

    Sortable.create(selected, sortableOptions);
    Sortable.create(generalColumns, availableColumnsOptions);
    Sortable.create(otherColumns, availableColumnsOptions);
    Sortable.create(userColumns, availableColumnsOptions);


    const columnMap = {
        "Policy": "Policy",
        "Groups": "Group",
        "Tags": "Tags",
        "Date Added": "CreatedAt",
        "Last Modified on": "LastModified",
        "Last Modified by": "LastModifiedBy",
        "Ticket Status": "Status",
        "Description": "Description",
        "Notes": "Notes",
        "Source": "Source",
        "Priority": "Priority",
        "Ticket ID": "TicketID",
        "Owner": "Owner",
        "Assigned To": "AssignedTo",
        "Username(Windows)": "Username",
        "User Email": "Email"
    };

    applyBtn.addEventListener("click", function (e) {
        if (this.disabled || this.classList.contains('disabled')) {
            e.preventDefault();
            console.log("[DEBUG] Apply button clicked but is disabled");
            return;
        }

        console.log("[DEBUG] Apply button clicked - processing columns");

        const selectedCols = Array.from(selected.children)
            .filter(c => !c.id || c.id !== 'dropPlaceholder')
            .map(c => c.textContent.trim());

        const fixedColumns = [
            { type: "selection", width: 39, cssClass: "circle-checkbox", fixed: true, fixedPosition: "left" },
            { dataField: "Computer", caption: `Tickets (${ticketData.length})`, width: 400, cssClass: "selectable-cell", fixed: true, fixedPosition: "left" }
        ];

        const dynamicCols = selectedCols.map(name => {
            const fieldName = columnMap[name] || name;

            if (fieldName === "Status") {
                return {
                    dataField: "Status",
                    caption: name,
                    width: 130,
                    cellTemplate: function (container, options) {
                        const status = options.data.Status;
                        let color = status === "Open" ? "#88db2f" :
                            (status === "Closed" ? "#6c757d" : "#0091FF");
                        $("<span>")
                            .addClass("fw-semibold")
                            .css("color", color)
                            .text(status)
                            .appendTo(container);
                    }
                };
            }
            if (fieldName === "Description") {
                return {
                    dataField: "Description",
                    caption: name,
                    width: 200,
                    cellTemplate: window.createDescriptionCell
                };
            }

            return { dataField: fieldName, caption: name, width: 150 };
        });

        const allColumns = [...fixedColumns, ...dynamicCols];

        ticketGridInstance.option("columns", allColumns);
        initialSelectedState = getCurrentSelectedState();
        setButtonState(false, true); 

        bootstrap.Modal.getInstance(document.getElementById("columnChooserModal")).hide();
    });

    resetBtn.addEventListener("click", function (e) {
        if (this.disabled || this.classList.contains('disabled')) {
            e.preventDefault();
            console.log("[DEBUG] Reset button clicked but is disabled");
            return;
        }

        console.log("[DEBUG] Reset button clicked - resetting columns");
        populateCategories();
        initializeTicketGrid();

        const modalEl = document.getElementById("columnChooserModal");
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
        setButtonState(false, false);
    });

    document.getElementById("columnchosserCloseBtn").addEventListener("click", function () {
        console.log("[DEBUG] Close button clicked - resetting columns");
        populateCategories();
    });

    function updatePlaceholder() {
        const actualItems = Array.from(selected.children).filter(child =>
            !child.id || child.id !== 'dropPlaceholder'
        );
        console.log(`[DEBUG] Selected columns count: ${actualItems.length}`);
    }

    const columnChooserModal = document.getElementById("columnChooserModal");
    if (columnChooserModal) {
        columnChooserModal.addEventListener('show.bs.modal', function () {
            console.log("[DEBUG] Column chooser modal opened, checking current state");
        });
    }
});


function disableFilterButtons() {
    $('#applyFiltersBtn, .apply-filters').addClass('disabled').prop('disabled', true);
    $('#clearAllFiltersBtn, .clear-all-filters').addClass('disabled').prop('disabled', true);
    console.log("[DEBUG] Filter buttons disabled");
}


function enableFilterButtons() {
    $('#applyFiltersBtn, .apply-filters').removeClass('disabled').prop('disabled', false);
    $('#clearAllFiltersBtn, .clear-all-filters').removeClass('disabled').prop('disabled', false);
    console.log("[DEBUG] Filter buttons enabled");
}


function enableDisableFilterButtons() {
    $('#applyFiltersBtn, .apply-filters').removeClass('disabled').prop('disabled', true);
    $('#clearAllFiltersBtn, .clear-all-filters').removeClass('disabled').prop('disabled', false);
    console.log("[DEBUG] Filter buttons enabled");
}


function hasActiveFilters() {
    const hasDropdownSelections = $('.dropdown-menu input[type="checkbox"]:checked').length > 0;
    const hasButtonSelections = $('.selectable-button.selected').length > 0;
    const hasSearchText = $('.search-box').filter(function () {
        return $(this).val().trim() !== '';
    }).length > 0;

    console.log("[DEBUG] Filter check - Dropdowns:", hasDropdownSelections, "Buttons:", hasButtonSelections, "Search:", hasSearchText);

    return hasDropdownSelections || hasButtonSelections || hasSearchText;
}

function updateFilterButtonStates() {
    if (hasActiveFilters()) {
        enableFilterButtons();
    } else {
        disableFilterButtons();
    }
}


function setupFilterMonitoring() {
    $(document).on('change', '.dropdown-menu input[type="checkbox"]', function () {
        console.log("[DEBUG] Dropdown checkbox changed");
        updateFilterButtonStates();
    });
    $(document).on('click', '.selectable-button', function () {
        console.log("[DEBUG] Selectable button clicked");
        setTimeout(updateFilterButtonStates, 10);
    });

    $(document).on('input keyup', '.search-box', function () {
        console.log("[DEBUG] Search box changed");
        updateFilterButtonStates();
    });
    $('#filterModal').on('show.bs.modal', function () {
        console.log("[DEBUG] Filter modal opened, checking current filter state");
        updateFilterButtonStates();
    });
}






