$(function() {

  var userName = "chris";
  var num = 0;

  var socketMsg = io.connect("/realist");

  socketMsg.on("item added", function(user, newText, checked, id) {
    var checkClass = (checked) ? "status checked" : "status";
    var checkIcon = (checked) ? "&#10003;" : "&#10066;";
    num += 1;
    $("#list").append("<tr data-id="+id+"><td>"+num+"</td><td>"+newText+"</td><td class="+checkClass+">"+checkIcon+"</td></tr>");
  });

  $("#sendButton").click(function() {
    socketMsg.emit("add item", { "user":userName, "text":$("#itemText").val(), "checked":false });
    $("#itemText").val("");
  });

  $("#itemText").on("keydown", function(e) {
    if (e.keyCode == 13) {
      $("#sendButton").click();
      return false;
    }
    return true;
  });

  $("#list").on("click", ".status", function() {
    console.log("d");
    var $_this = $(this);
    if ($_this.hasClass("checked")) {
      $_this.removeClass("checked");
      $_this.html("&#10066;");
      socketMsg.emit("check item", {"user":userName, "id":$_this.closest("tr").data("id"), "checked":false });
    } else {
      $_this.addClass("checked");
      $_this.html("&#10003;");
      socketMsg.emit("check item", {"user":userName, "id":$_this.closest("tr").data("id"), "checked":true });
    }
  });

});