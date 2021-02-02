from flask import Flask, render_template, redirect, url_for, request, jsonify
from flask_bootstrap import Bootstrap
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField
from wtforms.validators import InputRequired, Email, Length

from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user

from flask_migrate import Migrate

from flask_fontawesome import FontAwesome
from datetime import date, datetime

import os
import json

import pandas as pd

from tools.get_last_data import get_last_data
from tools.get_last_regioni import get_last_regioni
from tools.get_andamento_regioni_storico import get_andamento_regioni_storico
from tools.get_andamento_regioni_storico import get_andamento_regioni_storico_giorno
from tools.get_andamento_nazionale import get_andamento_nazionale
from tools.get_region_vaccine_last import get_region_vaccine_last

basedir = os.path.abspath(os.path.dirname(__file__))

#SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URI') or \'sqlite:///' + os.path.join(basedir, 'database.db')

SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:admin@localhost:5432/dashboard_flask1'

app = Flask(__name__)
app.config['SECRET_KEY'] = "questaèlachiavesegreta"
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI

fa = FontAwesome(app)
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
    email = StringField('Email', validators=[InputRequired(), Email(message='Invalid email'), Length(min=4, max=50)])
    username = StringField('Username', validators=[
                           InputRequired(), Length(min=4, max=15)])
    password = PasswordField('Password', validators=[
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


@app.route('/dashboard', methods=['GET', 'POST'])
@login_required
def dashboard():
    last_data = get_last_data()
    update = last_data['data'][0]
    total_positive = last_data['totale_positivi_test_molecolare'][0]
    ricoverati_con_sintomi = last_data['ricoverati_con_sintomi'][0]
    terapia_intensiva = last_data['terapia_intensiva'][0]
    isolamento_domiciliare = last_data['isolamento_domiciliare'][0]
    totale_positivi_test_molecolare = last_data["totale_positivi_test_molecolare"][0]
    totale_positivi_test_antigenico_rapido = last_data["totale_positivi_test_antigenico_rapido"][0]
    tamponi_test_molecolare = last_data["tamponi_test_molecolare"][0]
    tamponi_test_antigenico_rapido = last_data["tamponi_test_antigenico_rapido"][0]
    deceduti = last_data["deceduti"][0]
    
    
    if request.method == 'POST':
        giorno = request.form.get("data", None)
    else:
        giorno = str(date.today())
        
        
    andamento_regioni_storico_giorno = get_andamento_regioni_storico_giorno(giorno); #è un json
        
    regioni = get_last_regioni() #è un json
    regioni_vaccini = get_region_vaccine_last() #è un json
    
    try:
        totale_vaccinati = (sum(map(lambda x: int(x['dosi_somministrate']), json.loads(regioni_vaccini))) / 2 )
    except:
        totale_vaccinati = 1
    
    andamento_nazionale = get_andamento_nazionale()
    return render_template('dashboard.html', name=current_user.username, total_positive = total_positive, update=update,
                           ricoverati_con_sintomi=ricoverati_con_sintomi, terapia_intensiva=terapia_intensiva,
                           totale_positivi_test_molecolare = totale_positivi_test_molecolare, 
                           totale_positivi_test_antigenico_rapido = totale_positivi_test_antigenico_rapido,
                           tamponi_test_molecolare = tamponi_test_molecolare,
                           tamponi_test_antigenico_rapido = tamponi_test_antigenico_rapido,
                           isolamento_domiciliare = isolamento_domiciliare,
                           deceduti = deceduti,
                           regioni=regioni,
                           andamento_regioni_storico_giorno = andamento_regioni_storico_giorno,
                           giorno = giorno,
                           regioni_vaccini = regioni_vaccini,
                           totale_vaccinati = totale_vaccinati,
                           andamento_nazionale = andamento_nazionale)
    
@app.route('/regioni', methods=['GET', 'POST'])
@login_required
def regioni():
    last_data = get_last_data()
    update = last_data['data'][0]
    total_positive = last_data['totale_positivi_test_molecolare'][0]
    ricoverati_con_sintomi = last_data['ricoverati_con_sintomi'][0]
    terapia_intensiva = last_data['terapia_intensiva'][0]
    isolamento_domiciliare = last_data['isolamento_domiciliare'][0]
    totale_positivi_test_molecolare = last_data["totale_positivi_test_molecolare"][0]
    totale_positivi_test_antigenico_rapido = last_data["totale_positivi_test_antigenico_rapido"][0]
    tamponi_test_molecolare = last_data["tamponi_test_molecolare"][0]
    tamponi_test_antigenico_rapido = last_data["tamponi_test_antigenico_rapido"][0]
    deceduti = last_data["deceduti"][0]
    
    
    if request.method == 'POST':
        giorno = request.form['giorno'] 
        print(giorno)
        try:
            andamento_regioni_storico_giorno = get_andamento_regioni_storico_giorno(giorno)
            return andamento_regioni_storico_giorno
        except:
            andamento_regioni_storico_giorno = 1
            return andamento_regioni_storico_giorno
    else:
        giorno = str(date.today())     
        
        
    andamento_regioni_storico_giorno = get_andamento_regioni_storico_giorno(giorno); #è un json
        
    regioni = get_last_regioni() #è un json
    regioni_vaccini = get_region_vaccine_last() #è un json
    
    try:
        totale_vaccinati = (sum(map(lambda x: int(x['dosi_somministrate']), json.loads(regioni_vaccini))) / 2 )
    except:
        totale_vaccinati = 1

    
    andamento_nazionale = get_andamento_nazionale()
    return render_template('regioni.html', name=current_user.username, total_positive = total_positive, update=update,
                           ricoverati_con_sintomi=ricoverati_con_sintomi, terapia_intensiva=terapia_intensiva,
                           totale_positivi_test_molecolare = totale_positivi_test_molecolare, 
                           totale_positivi_test_antigenico_rapido = totale_positivi_test_antigenico_rapido,
                           tamponi_test_molecolare = tamponi_test_molecolare,
                           tamponi_test_antigenico_rapido = tamponi_test_antigenico_rapido,
                           isolamento_domiciliare = isolamento_domiciliare,
                           deceduti = deceduti,
                           regioni=regioni,
                           andamento_regioni_storico_giorno = andamento_regioni_storico_giorno,
                           giorno = giorno,
                           regioni_vaccini = regioni_vaccini,
                           totale_vaccinati = totale_vaccinati,
                           andamento_nazionale = andamento_nazionale)

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
    
@app.route('/settings', methods=['GET', 'POST'])
@login_required
def settings():
    users_in_db = User.query.filter().all()
    
    form = RegisterForm()

    if form.validate_on_submit():
        hashed_password = generate_password_hash(form.password.data, method='sha256')
        new_user = User(username=form.username.data, email=form.email.data, password=hashed_password, isadmin=1)
        db.session.add(new_user)
        db.session.commit()
        
        return redirect(url_for('settings'))
    
    return render_template('settings.html', users=users_in_db, form=form)


if __name__ == '__main__':
    app.run(debug=True)
