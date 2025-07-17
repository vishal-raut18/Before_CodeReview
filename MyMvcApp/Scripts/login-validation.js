$(document).ready(function () {
    $("form").submit(function () {
        let username = $("#Username").val().trim();
        let password = $("#Password").val().trim();

        if (username === "" || password === "") {
            alert("Please fill in all fields.");
            return false;
        }

        return true;
    });
});
