from flask import Flask, render_template, session, url_for, redirect, request, jsonify
from boggle import Boggle

app = Flask(__name__)
app.secret_key = 'Tatooine'

boggle_game = Boggle()
words = boggle_game.words


@app.route('/board')
def make_board():
    board = boggle_game.make_board()
    session['board'] = board
    return render_template('board.html', board=board)


@app.route('/check_guess', methods=['POST'])
def check_guess():
    guess = request.form.get('guess')
    if guess not in words:
        return jsonify({"result": "not-a-word"})
    if not boggle_game.check_valid_word(guess, session['board']):
        return jsonify({"result": "not-on-board"})

    # Update score and display it
    score = session.get('score', 0)
    score += len(guess)
    session['score'] = score
    return jsonify({"result": "ok", "score": score})


@app.route("/score", methods=["POST"])
def score():
    score = request.json.get("score")
    session["games_played"] = session.get("games_played", 0) + 1
    highest_score = session.get("highest_score", 0)
    if score > highest_score:
        session["highest_score"] = score
        highest_score = score
    return jsonify(games_played=session["games_played"], highest_score=highest_score)
