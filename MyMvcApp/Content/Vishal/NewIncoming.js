$(document).ready(function () {
    $("#ticketReportDropdown .dropdown-item").on("click", function (e) {
        e.preventDefault();

        const filterValue = $(this).data("filter");
        const filterText = $(this).text();

        // Reset selection
        $("#ticketReportDropdown .dropdown-item").removeClass("selected");
        $(this).addClass("selected");

        if (filterValue === "All") {
            // Reset everything
            $("#ticketReportLabel").text("Incoming Tickets Report");
            $("#selectionBadgeFilter").addClass("d-none");
            $("#ticketReportBridgeText").text("");
            $("#ticketReportBadge").hide();
            unassignedFilterActive = false;
            clearAllFilters();
        }
        else if (filterValue === "Unassigned") {
            unassignedFilterActive = true;
            // Special case: only dropdown has this
            $("#ticketReportLabel").text(filterText);
            $("#ticketReportBridgeText").text(filterText);
            $("#selectionBadgeFilter").removeClass("d-none");
            $("#ticketReportBadge").show();

            // CLEAR ALL PREVIOUS FILTERS FIRST
            clearAllFiltersAndModalSelections();

            // Check the Unassigned checkbox and trigger change event
            $('#unassigned-AssignedTo').prop('checked', true);
            $('#unassigned-AssignedTo').trigger('change');

            // Manual fallback for display text
            $('#selectedAssignedTo').text('Unassigned');
            $('#assignedToBtn').attr('title', 'Unassigned');
            $('#assignedToBtn').addClass('selected');

            // Directly filter grid
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
            // Force filter button style to show count = 1
           // updateFilterButtonStyle(1);
        }
        else {
            // Normal case: map dropdown to modal filters
            $("#ticketReportLabel").text(filterText);
            $("#ticketReportBridgeText").text(filterText);
            $("#selectionBadgeFilter").removeClass("d-none");
            $("#ticketReportBadge").show();

            // CLEAR ALL PREVIOUS FILTERS AND MODAL SELECTIONS FIRST
            clearAllFiltersAndModalSelections();

            // Now sync with the selected modal filter
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

            // Apply the unified filter logic
            applyFiltersToGrid();
        }
    });
});

// New comprehensive clear function
function clearAllFiltersAndModalSelections() {
    // Clear all checkboxes in filter dropdowns
    $('#filterModal input[type="checkbox"]').prop('checked', false);

    // Clear all dropdown selections and reset display text
    $('#selectedAssignedTo').text('Assigned To');
    $('#assignedToBtn').removeClass('selected').attr('title', '');

    $('#selectedPriority').text('Priority');
    $('#priorityBtn').removeClass('selected').attr('title', '');

    $('#selectedStatus').text('Status');
    $('#statusBtn').removeClass('selected').attr('title', '');

    $('#selectedRequestType').text('Request Type');
    $('#requestTypeBtn').removeClass('selected').attr('title', '');

    // Clear all selectable buttons in modal
    $("#filterModal .selectable-button").removeClass("selected");

    // Remove background styling from checkbox labels
    $('#filterModal .form-check-label').css('background-color', '');
    enableDisableFilterButtons()
    // Reset any other filter states
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