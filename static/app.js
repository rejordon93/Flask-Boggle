$(document).ready(function () {
  // Keep track of highest score
  var highestScore = 0;

  $("#guess-form").on("submit", function (event) {
    event.preventDefault();
    var guess = $("#guess-input").val();
    $.post("/check_guess", { guess: guess }, function (response) {
      if (response.result === "ok") {
        var score = response.score;
        var currentScore = parseInt($("#score").text());
        var newScore = currentScore + score;
        $("#result").text("Valid word! Your score is " + newScore + ".");
        $("#score").text(newScore);
        if (newScore > highestScore) {
          highestScore = newScore;
          $("#highest-score").text(highestScore);
        }
      } else if (response.result === "not-a-word") {
        $("#result").text("Not a valid word.");
      } else if (response.result === "not-on-board") {
        $("#result").text("Word not found on the board.");
      }
    });
  });

  // Timer code omitted for brevity

  $("#game-form").on("submit", function (event) {
    event.preventDefault();
    // Game over, send score to server
    var score = parseInt($("#score").text());
    axios
      .post("/score", { score: score })
      .then(function (response) {
        $("#games-played").text(response.data.games_played);
        if (response.data.highest_score > highestScore) {
          highestScore = response.data.highest_score;
          $("#highest-score").text(highestScore);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  });
});
