const OrganizationElement = {
    computerName: {
        listId: 'computerList',
        buttonId: 'computerNameBtn',
        selectedTextId: 'selectedComputerName',
        dropdownId: 'computerNameDropdown'
    },
    group: {
        listId: 'groupList',
        buttonId: 'groupBtn',
        selectedTextId: 'selectedGroup',
        dropdownId: 'groupDropdown'
    },
    tags: {
        listId: 'tagsList',
        buttonId: 'tagsBtn',
        selectedTextId: 'selectedTags',
        dropdownId: 'tagsDropdown'
    },
    policy: {
        listId: 'policyList',
        buttonId: 'policyBtn',
        selectedTextId: 'selectedPolicy',
        dropdownId: 'policyDropdown'
    }
};

const TicketFilterElement = {
    ticketSource: {
        listId: 'ticketSourceList',
        buttonId: 'ticketSourceBtn',
        selectedTextId: 'selectedTicketSource',
        dropdownId: 'ticketSourceDropdown'
    },
    // If you add more filters like priority, etc., add here:
     ticketPriority: {
        listId: 'ticketPriorityList',
        buttonId: 'ticketPriorityBtn',
        selectedTextId: 'selectedTicketPriority',
        dropdownId: 'ticketPriorityDropdown'
     }
};


const TicketAssignedElement = {
    myTickets: {
        buttonId: null, // handled manually
        elementId: 'myTicketsBtn', // ID of the button
        isStandaloneButton: true
    },
    assignedTo: {
        listId: 'assignedToList',
        buttonId: 'assignedToBtn',
        selectedTextId: 'selectedAssignedTo',
        dropdownId: 'assignedToDropdown'
    },
    ticketOwner: {
        listId: 'ticketOwnerList',
        buttonId: 'ticketOwnerBtn',
        selectedTextId: 'selectedTicketOwner',
        dropdownId: 'ticketOwnerDropdown'
    }
};


function clearOtherDropdowns(activeKey, configObject, getDefaultTextFn) {
    Object.keys(configObject).forEach(key => {
        if (key !== activeKey) {
            const config = configObject[key];

            // Deselect standalone button like My Tickets
            if (config.isStandaloneButton && config.elementId) {
                const btn = document.getElementById(config.elementId);
                if (btn) {
                    btn.classList.remove('selected');
                }
                return;
            }

            // Clear checkboxes
            if (config.listId) {
                const listElement = document.getElementById(config.listId);
                if (listElement) {
                    const checkboxes = listElement.querySelectorAll('input[type="checkbox"]');
                    checkboxes.forEach(cb => cb.checked = false);
                }
            }

            // Remove selected class
            if (config.buttonId) {
                const btn = document.getElementById(config.buttonId);
                if (btn) {
                    btn.classList.remove('selected');
                }
            }

            // Reset text
            if (config.selectedTextId) {
                const textEl = document.getElementById(config.selectedTextId);
                if (textEl) {
                    textEl.textContent = getDefaultTextFn(key);
                }
            }
        }
    });
}



function getDefaultText(dropdownKey) {
    const defaultTexts = {
        computerName: 'Computer Name',
        group: 'Group',
        tags: 'Tags',
        policy: 'Policy'
    };
    return defaultTexts[dropdownKey] || '';
}

function getTicketFilterDefaultText(dropdownKey) {
    const defaultTexts = {
        ticketSource: 'Ticket Source',
        ticketPriority: 'Ticket Priority'
    };
    return defaultTexts[dropdownKey] || '';
}

function getTicketAssignedDefaultText(dropdownKey) {
    const defaultTexts = {
        myTickets: 'My Tickets',
        assignedTo: 'Assigned To',
        ticketOwner: 'Ticket Owner'
    };
    return defaultTexts[dropdownKey] || '';
}



function handleCheckboxChange(event, key, configObject, getDefaultTextFn) {
    const checkbox = event.target;

    if (checkbox.checked) {
        clearOtherDropdowns(key, configObject, getDefaultTextFn);

        const currentButton = document.getElementById(configObject[key].buttonId);
        if (currentButton) {
            currentButton.classList.add('selected');
        }

    } else {
        const listElement = document.getElementById(configObject[key].listId);
        const hasChecked = listElement.querySelectorAll('input[type="checkbox"]:checked').length > 0;

        if (!hasChecked) {
            const btn = document.getElementById(configObject[key].buttonId);
            if (btn) {
                btn.classList.remove('selected');
            }

            const textEl = document.getElementById(configObject[key].selectedTextId);
            if (textEl) {
                textEl.textContent = getDefaultTextFn(key);
            }
        }
    }
}


// Function to initialize dropdown listeners
function initializeDropdownListeners(configObject, getDefaultTextFn) {
    Object.keys(configObject).forEach(key => {
        const config = configObject[key];
        if (config.listId) {
            const listElement = document.getElementById(config.listId);
            if (listElement) {
                listElement.addEventListener('change', function (event) {
                    if (event.target.type === 'checkbox') {
                        handleCheckboxChange(event, key, configObject, getDefaultTextFn);
                    }
                });
            }
        }
    });
}



// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    initializeDropdownListeners(OrganizationElement, getDefaultText);
    initializeDropdownListeners(TicketFilterElement, getTicketFilterDefaultText);
    initializeDropdownListeners(TicketAssignedElement, getTicketAssignedDefaultText);

});

// Alternative: If you need to call this after dynamic content is loaded
// Call this function after your dropdowns are populated with data
function reinitializeDropdowns() {
    initializeDropdownListenersForOrganization(OrganizationElement);
}




document.getElementById('myTicketsBtn').addEventListener('click', function () {
    const isSelected = this.classList.contains('selected');

    if (isSelected) {
        this.classList.remove('selected');
    } else {
        clearOtherDropdowns('myTickets', TicketAssignedElement, getTicketAssignedDefaultText);
        this.classList.add('selected');
    }
});


document.addEventListener('DOMContentLoaded', function () {

    const dropdownButtons = document.querySelectorAll('#filterModal .filter-button');

    dropdownButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.stopPropagation();
            const dropdownId = this.id.replace('Btn', 'Dropdown');
            const dropdown = document.getElementById(dropdownId);
            const isVisible = dropdown.classList.contains('show');
            document.querySelectorAll('#filterModal .dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
            if (!isVisible) {
                dropdown.classList.add('show');
            }
        });
    });

    document.addEventListener('click', function (event) {
        if (!event.target.closest('.filter-button') && !event.target.closest('.dropdown-menu')) {
            document.querySelectorAll('#filterModal .dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const dropdowns = [
        { buttonId: "computerNameBtn", dropdownId: "computerNameDropdown" },
        { buttonId: "groupBtn", dropdownId: "groupDropdown" },
        { buttonId: "tagsBtn", dropdownId: "tagsDropdown" },
        { buttonId: "policyBtn", dropdownId: "policyDropdown" },
    ];

    function closeAllDropdowns() {
        dropdowns.forEach(({ dropdownId }) => {
            const dropdown = document.getElementById(dropdownId);
            dropdown.classList.remove("show");
        });
    }

    dropdowns.forEach(({ buttonId, dropdownId }) => {
        const button = document.getElementById(buttonId);
        const dropdown = document.getElementById(dropdownId);

        button.addEventListener("click", function (event) {
            event.stopPropagation();

            const isAlreadyOpen = dropdown.classList.contains("show");

            closeAllDropdowns();
            if (!isAlreadyOpen) {
                dropdown.classList.add("show");
            }
        });
    });

    document.addEventListener("click", function () {
        closeAllDropdowns();
    });
});
