let allTicketData = [];

function populateFilterOptions(ticketData) {
    const computerNames = [...new Set(ticketData.map(t => t.Computer))];
    const priorities = [...new Set(ticketData.map(t => t.Priority))];

    $("#filterComputerName").empty();
    $("#filterPriority").empty();

    computerNames.forEach(name => {
        $("#filterComputerName").append(`<option value="${name}">${name}</option>`);
    });

    priorities.forEach(p => {
        $("#filterPriority").append(`<option value="${p}">${p}</option>`);
    });
}

$(document).on("click", ".status-btn", function () {
    $(this).toggleClass("btn-outline-secondary btn-primary");
});

$("#applyFilters").on("click", function () {
    const selectedComputers = $("#filterComputerName").val() || [];
    const selectedPriority = $("#filterPriority").val() || [];
    const selectedStatus = $(".status-btn.btn-primary").map(function () {
        return $(this).data("value");
    }).get();

    const filtered = allTicketData.filter(t => {
        const computerMatch = selectedComputers.length === 0 || selectedComputers.includes(t.Computer);
        const priorityMatch = selectedPriority.length === 0 || selectedPriority.includes(t.Priority);
        const statusMatch = selectedStatus.length === 0 || selectedStatus.includes(t.Status);
        return computerMatch && priorityMatch && statusMatch;
    });

    $("#ticketGrid").dxDataGrid("instance").option("dataSource", filtered);
});

$("#clearFilters").on("click", function () {
    $("#filterComputerName").val([]);
    $("#filterPriority").val([]);
    $(".status-btn").removeClass("btn-primary").addClass("btn-outline-secondary");

    $("#ticketGrid").dxDataGrid("instance").option("dataSource", allTicketData);
});


