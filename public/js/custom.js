// A $( document ).ready() block.
$(document).ready(function () {
  console.log("ready!");
  $('#resetPassword').click(function (params) {
    var password = $('#password').val();
    var token = $('#token').val();
    var confirmPassword = $('#confirm-password').val();
    if (!password) {
      alert("Please enter password");
      return;
    }

    if (password !== confirmPassword) {
      alert("Password Don't match");
      return;
    }

    var json = {};
    json.password = password;

    $.ajax({
        method: "POST",
        url: "/public/users/reset/"+token,
        data: json
    })
    .done(function (msg) {
        alert("Password has been updated successfully.");
        $('#confirm-password').val('');
        $('#password').val('');
    });
  })
});
