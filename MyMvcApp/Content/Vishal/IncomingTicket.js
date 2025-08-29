$(document).ready(function () {
    $("#ticketReportDropdown .dropdown-item").on("click", function (e) {
        e.preventDefault();

        const filterValue = $(this).data("filter");
        const filterText = $(this).text();

        
        $("#ticketReportLabel").text(filterText);
        $("#ticketReportDropdown .dropdown-item").removeClass("selected");
        $(this).addClass("selected");
        $("#ticketReportBridgeText").text(filterText);
        $("#ticketReportBridge").removeClass("d-none");
        applyTicketReportFilter(filterValue);
        updateFilterButtonStyleIncoming();
    });

    
    $("#ticketReportBadge").on("click", function () {
        $("#ticketReportLabel").text("Incoming Ticket Report");
        $("#ticketReportDropdown .dropdown-item").removeClass("selected");
        $(this).hide();
        resetTicketReportFilter();
        updateFilterButtonStyleIncoming();
    });
});

function clearTicketReportBridge() {
   
    $("#ticketReportBridge").addClass("d-none");
    $("#ticketReportLabel").text("Incoming Ticket Report");
    $("#ticketReportDropdown .dropdown-item").removeClass("selected");
    resetTicketReportFilter();
    updateFilterButtonStyleIncoming();
  
}

function applyTicketReportFilter(type) {
    switch (type) {
        case "All":
            ticketGridInstance.clearFilter();
            break;
        case "Active":
            ticketGridInstance.filter([
                ["Status", "=", "Open"],
                "or",
                ["Status", "=", "In Progress"]
            ]);
            break;
        case "Closed":
            ticketGridInstance.filter(["Status", "=", "Closed"]);
            break;
        case "MyTicket":
            ticketGridInstance.filter(["Owner", "=", currentUserName]);
            break;
        case "Unassigned":
            ticketGridInstance.filter(["AssignedTo", "=", ""]);
            break;
    }
}

function resetTicketReportFilter() {
    ticketGridInstance.clearFilter();
 
}



function updateFilterButtonStyleIncoming() {
    let totalFilters = 0;

  
   
    totalFilters += $("#ticketReportDropdown .dropdown-item.selected").length;

    const $filterBtn = $("button[data-bs-target='#filterModal']");

    if (totalFilters > 0) {
        $filterBtn.css({
            backgroundColor: "#d0e7ff",
            borderRadius: "4px"
        });
        $filterBtn.html(`<i class="bi bi-funnel-fill me-1"></i> Filters / ${totalFilters}`);
    } else {
        $filterBtn.css({
            backgroundColor: "",
            borderRadius: ""
        });
        $filterBtn.html(`<i class="bi bi-funnel-fill me-1"></i> Filters`);
    }
}

