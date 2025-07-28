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
