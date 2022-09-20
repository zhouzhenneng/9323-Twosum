from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from itsdangerous.serializer import Serializer
from flask import current_app
from datetime import datetime


class Role(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(64), unique=True)
    users = db.relationship('User', backref='role', lazy='dynamic')

    def __repr__(self):
        return '<roles %r>' % self.role_name


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), unique=True, index=True)
    first_name = db.Column(db.String(32), index=True)
    last_name = db.Column(db.String(32), index=True)
    gender = db.Column(db.String(16), nullable=True)
    password_hash = db.Column(db.String(128))
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
    phone_num = db.Column(db.String(32), nullable=True)
    avatar = db.Column(db.LargeBinary, nullable=True)

    # example: UNSW,USYD
    education = db.Column(db.String(32), nullable=True)
    # example: Microsoft，Google
    # for students this column can be Null
    company = db.Column(db.String(32), nullable=True)
    bio = db.Column(db.String(128), nullable=True)
    # user's focused domain, e.g.,CS，Accounting，Graphics design
    domain = db.Column(db.String(32), nullable=True)

    # only mentor can be a project's'owner
    # mentor doesn't have to be a owner already, he can own zero projects
    projects = db.relationship('Project', backref='owner', lazy='dynamic')

    # only students can have applications
    # a student doesn't have to make a application already, he can apply zero projects
    applicants = db.relationship('Application', backref='applicant', lazy='dynamic',
                                 foreign_keys='Application.student_id')
    project_mentors = db.relationship('Application', backref='project_mentor', lazy='dynamic',
                                      foreign_keys='Application.project_mentor_id')

    sended_messages = db.relationship('Message', backref='sender', lazy='dynamic', \
                                      foreign_keys='Message.sender_id')
    received_messages = db.relationship('Message', backref='receiver', lazy='dynamic', \
                                        foreign_keys='Message.receiver_id')

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_auth_token(self):
        s = Serializer(current_app.config['SECRET_KEY'])
        return s.dumps(self.id)

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except:
            return None
        return data

    def __repr__(self):
        return '<users %r>' % self.first_name


class Project_Status:
    Recruiting = 1
    InProgress = 2
    Finished = 3


class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)

    owner_id = db.Column(db.String(32), db.ForeignKey('users.id'))
    title = db.Column(db.String(32), nullable=False)
    category = db.Column(db.String(32), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)

    location = db.Column(db.String(64), nullable=True)
    description = db.Column(db.String(256), nullable=True)
    requirement = db.Column(db.String(256), nullable=True)
    video_link = db.Column(db.String(256), nullable=True)
    company = db.Column(db.String(64), nullable=True)

    created_time = db.Column(db.DateTime, default=datetime.now)

    status = db.Column(db.Integer, default=Project_Status.Recruiting)

    applications = db.relationship('Application', backref='project', lazy='dynamic')

    published_time = db.Column(db.DateTime, nullable=True)

    is_active = db.Column(db.Boolean, default=True)

    picture = db.Column(db.LargeBinary, nullable=True)

    def __repr__(self):
        return '<projects %r>' % self.id


class Application_Status:
    Pending = 1  # applied, no result yet
    Accepted = 2  # accepted by the mentor
    Rejected = 3  # rejected by the mentor, or project go offline before a decision is made
    Cancelled = 4  # withdraw by students


# The default cascade behavior when an object is deleted is to set the foreign key
# in any related objects that link to it to a null value.
class Application(db.Model):
    __tablename__ = 'applications'
    id = db.Column(db.Integer, primary_key=True)

    student_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    project_mentor_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))

    status = db.Column(db.Integer, default=Application_Status.Pending)
    application_time = db.Column(db.DateTime, default=datetime.now)
    self_intro = db.Column(db.String(512), nullable=True)

    accepted_time = db.Column(db.DateTime, default=None)
    rating = db.Column(db.Integer, nullable=True)  # 0 ~ 5
    comments = db.Column(db.String(512), nullable=True)

    def __repr__(self):
        return f'<applications {self.id} applied by student {self.student_id} for project {self.project_id}>'


class Message(db.Model):
    __tablename__ = 'messages'
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), index=True)
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'), index=True)
    message = db.Column(db.String(256), nullable=False)
    sent_time = db.Column(db.DateTime, default=datetime.now)

    def __repr__(self):
        return '<messages %r>' % self.id
