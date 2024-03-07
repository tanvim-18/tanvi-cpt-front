from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///highscores.db'
db = SQLAlchemy(app)

class HighScore(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {'id': self.id, 'user_id': self.user_id, 'score': self.score, 'timestamp': self.timestamp}

def add_highscore(user_id, score):
    new_highscore = HighScore(user_id=user_id, score=score)
    db.session.add(new_highscore)
    db.session.commit()

def update_highscore(user_id, new_score):
    existing_highscore = HighScore.query.filter_by(user_id=user_id).first()

    if existing_highscore:
        if new_score > existing_highscore.score:
            existing_highscore.score = new_score
            existing_highscore.timestamp = datetime.utcnow()
            db.session.commit()

def update_highscore(user_id, new_score):
    highscore = HighScore(user_id=user_id, score=new_score)
    db.session.add(highscore)
    db.session.commit()

def update_highscore(user_id, new_score):
    if new_score > 100:
        print(f"Congratulations, {user_id}! You achieved a high score of {new_score}.")
    else:
        print(f"Nice try, {user_id}. Your score of {new_score} is good, keep playing!")


@app.route('/api/highscores', methods=['GET', 'POST'])
def highscores():
    if request.method == 'GET':
        highscores = HighScore.query.order_by(HighScore.score.desc()).limit(10).all()
        highscores_data = [score.to_dict() for score in highscores]
        return jsonify(highscores_data)

    elif request.method == 'POST':
        data = request.get_json()
        user_id = data.get('user_id')
        score = data.get('score')

        if not user_id or not score:
            return jsonify({'message': 'Invalid data. Both user_id and score are required.'}), 400

        new_highscore = HighScore(user_id=user_id, score=score)
        db.session.add(new_highscore)
        db.session.commit()

        return jsonify({'message': 'Highscore added successfully.', 'highscore': new_highscore.to_dict()}), 201

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)


    