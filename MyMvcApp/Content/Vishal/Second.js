$(document).ready(function () {


    console.log("[DEBUG] Document ready, setting up event bindings...");

    // Set current user
    window.currentUserName = "John Smith (Support)";
    console.log(`[DEBUG] Current user: ${window.currentUserName}`);

    // ----- mapping from grid field names to your dropdown DOM IDs (fixes camelCase issues) -----
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


    // Restore dropdown selections when modal opens
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
           
            Object.values(fieldToListId).forEach(listId => updateDropdownLabel(listId, $(listId).prev('.filter-button')));
            return;
        }

        // Flatten nested DevExtreme filter array into pairs: [field, value]
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

        // Re-check boxes that match filter values
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

        // Update labels for all known lists (so buttons show first + ... and tooltip)
        Object.values(fieldToListId).forEach(listId => updateDropdownLabel(listId, $(listId).prev('.filter-button')));
    });

    // Bind Apply Filters button
    $('#applyFiltersBtn, .apply-filters').off('click').on('click', function (e) {
        e.preventDefault();
        console.log("[DEBUG] Apply Filters button clicked");
        applyFiltersToGrid();
    });

    // Bind Clear All Filters button
    $('#clearAllFiltersBtn, .clear-all-filters').off('click').on('click', function (e) {
        e.preventDefault();
        console.log("[DEBUG] Clear All Filters button clicked");
        clearAllFilters();
    });

    // delegated: Watch all dropdown checkboxes for change (works if DOM is re-rendered)
    $(document).on('change', '.dropdown-menu input[type="checkbox"]', function () {
        const $menu = $(this).closest('.dropdown-menu');
        const listId = $menu.attr('id') ? `#${$menu.attr('id')}` : null;
        const $btn = $menu.prev('.filter-button');
        if (listId) updateDropdownLabel(listId, $btn);
    });






    console.log("[DEBUG] Event bindings complete.");
});

// Utility to get selected checkbox values from a container
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

// New: Update dropdown button label + tooltip (robust & defensive)
function updateDropdownLabel(containerId, $btn) {
    const $container = $(containerId);
    if ($container.length === 0) {
        console.warn(`[WARN] updateDropdownLabel: container not found: ${containerId}`);
        return;
    }

    // resolve $btn if not provided
    if (!$btn || !$btn.length) {
        $btn = $container.prev('.filter-button');
    }
    if (!$btn || !$btn.length) {
        console.warn(`[WARN] updateDropdownLabel: button not found for ${containerId}`);
        return;
    }

    const selected = getSelectedValues(containerId);
    const $labelSpan = $btn.find('span');
    if ($labelSpan.length === 0) {
        // fallback: use button text
        if (selected.length === 0) {
            const defaultText = ($btn.attr('id') || '').replace('Btn', '').replace(/([A-Z])/g, ' $1').trim();
            $btn.text(defaultText || 'Filter');
            $btn.removeAttr('title');
            return;
        } else {
            const displayText = selected.length > 1 ? `${selected[0]} ...` : selected[0];
            $btn.text(displayText);
            $btn.attr('title', selected.join(', '));
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
        const displayText = selected.length > 1 ? `${selected[0]} ...` : selected[0];
        $labelSpan.text(displayText);
        $btn.attr('title', selected.join(', '));
    }
}

// Get grid instance safely
function getTicketGridInstance() {
    const instance = $("#ticketGrid").dxDataGrid("instance");
    if (!instance) {
        console.error("[ERROR] ticketGridInstance not found. Make sure the grid container ID is correct.");
    }
    return instance;
}

// Apply filters to grid (keeps your original logic intact)
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

    // Button Filters
    $('.selectable-button.selected').each(function () {
        const label = $(this).text().trim();

        if (label === "Open") {
            filters.push(['Status', '=', 'Open']);
        }
        else if (label === "In Progress") {
            filters.push(['Status', '=', 'In Progress']);
        }
        else if (label === "Active") {
            filters.push([
                ['Status', '=', 'Open'],
                'or',
                ['Status', '=', 'In Progress']
            ]);
        }
        else if (label === "Closed") {
            filters.push(['Status', '=', 'Closed']);
        }
        else if (["Online", "Offline"].includes(label)) {
            filters.push(['ComputerStatus', '=', label]);
        }
        else if (label === "My Tickets") {
            filters.push(['Owner', '=', currentUserName]);
        }
    });

    // Combine filters
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

    // filter bridge
    $("#filterModal .dropdown-menu").each(function () {
        const $menu = $(this);
        const selectedValues = $menu.find("input[type='checkbox']:checked").map(function () {
            return $(this).val();
        }).get();

        if (selectedValues.length > 0) {
            anyFilterApplied = true;
        }
    });

    // Check selectable buttons inside filter modal
    $("#filterModal .selectable-button.selected").each(function () {
        anyFilterApplied = true;
    });

    // Show or hide Filter Badge
    if (anyFilterApplied) {
        $("#selectionBadgeFilter").removeClass("d-none");
    } else {
        $("#selectionBadgeFilter").addClass("d-none");
    }

    updateFilterButtonStyle();

    $('#filterModal').modal('hide');
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

    // Uncheck checkboxes only inside filter modal
    $filterContainer.find('.dropdown-menu input[type="checkbox"]')
        .prop('checked', false)
        .trigger('change');

    // Reset dropdown button labels only inside filter modal
    $filterContainer.find('.dropdown-menu').each(function () {
        const $btn = $(this).prev('.filter-button');
        if ($btn.length) {
            const $labelSpan = $btn.find('span');
            let defaultText = ($btn.attr('id') || '')
                .replace('Btn', '')
                .replace(/([A-Z])/g, ' $1')
                .trim();

            // Capitalize first letter
            defaultText = defaultText.charAt(0).toUpperCase() + defaultText.slice(1);

            $labelSpan.text(defaultText || 'Filter');
            $btn.removeClass('selected').removeAttr('title');
        }
    });

    // Reset other UI elements inside filter modal
    $filterContainer.find('.selectable-button').removeClass('selected');
    $filterContainer.find('.search-box').val('').trigger('input');
    $filterContainer.find('.dropdown-menu').hide();
    $("#selectionBadgeFilter").addClass("d-none");

    updateFilterButtonStyle();
    console.log("[DEBUG] --- CLEAR ALL FILTERS END ---");
}


//filter count 

function updateFilterButtonStyle() {
    let totalFilters = 0;


    $("#filterModal .dropdown-menu").each(function () {
        const selectedValues = $(this).find("input[type='checkbox']:checked").length;
        totalFilters += selectedValues;
    });

   
    totalFilters += $("#filterModal .selectable-button.selected").length;

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

