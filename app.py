from flask import Flask, render_template, redirect, url_for
from flask_bootstrap import Bootstrap
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField
from wtforms.validators import InputRequired, Email, Length

from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user

from flask_migrate import Migrate

import os

basedir = os.path.abspath(os.path.dirname(__file__))

#SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URI') or \'sqlite:///' + os.path.join(basedir, 'database.db')

SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:admin@localhost:5432/dashboard_flask1'

app = Flask(__name__)
app.config['SECRET_KEY'] = "questaèlachiavesegreta"
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI

Bootstrap(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class User(UserMixin, db.Model):
    
    __tablename__ = 'user'
    
    id = db.Column(db.Integer, nullable=False, primary_key=True)
    username = db.Column(db.String(15), nullable=False, unique=True)
    email = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(80), nullable=False)
    isadmin = db.Column(db.Integer, nullable=False)
    
    def __init__(self, username, email, password, isadmin):
        self.username = username
        self.email = email
        self.password = password
        self.isadmin = isadmin
    
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class LoginForm(FlaskForm):
    username = StringField('username', validators=[
                           InputRequired(), Length(min=4, max=15)])
    password = PasswordField('password', validators=[
                             InputRequired(), Length(min=8, max=80)])
    remember = BooleanField('remember me')


class RegisterForm(FlaskForm):
    email = StringField('email', validators=[InputRequired(), Email(message='Invalid email'), Length(min=4, max=50)])
    username = StringField('username', validators=[
                           InputRequired(), Length(min=4, max=15)])
    password = PasswordField('password', validators=[
                             InputRequired(), Length(min=8, max=80)])


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()

    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user:
            if check_password_hash(user.password, form.password.data):
                login_user(user, remember=form.remember.data)
                return redirect(url_for('dashboard'))
        error = 'Username o password errati!'
        return render_template('login.html', error=error, form=form)
    return render_template('login.html', form=form)


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    form = RegisterForm()
    
    if form.validate_on_submit():
        hashed_password = generate_password_hash(form.password.data, method='sha256')
        new_user = User(username=form.username.data, email=form.email.data, password=hashed_password, isadmin=0)
        db.session.add(new_user)
        db.session.commit()
        
        return redirect(url_for('dashboard'))
    
    return render_template('signup.html', form=form)


@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', name=current_user.username)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.username,
                           email=current_user.email, admin = current_user.isadmin)
    
@app.route('/settings')
@login_required
def settings():
    users_in_db = User.query.filter().all()
    
    return render_template('settings.html', users=users_in_db)

if __name__ == '__main__':
    app.run(debug=True)
