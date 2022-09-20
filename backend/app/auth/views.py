from . import auth_bp
from flask import request,g
from .. import db
from ..models import Role, User


@auth_bp.route('/register',methods=['POST'])
def register():
    print('Postman request /register: ',end='')
    print(request)
    new_user_info=request.get_json()
    print(new_user_info)

    #must provide username, email, password
    if new_user_info.get('first_name')==None or new_user_info.get('last_name')==None \
        or new_user_info.get('email')==None or new_user_info.get('password')==None \
        or new_user_info.get('domain')==None or new_user_info.get('role')==None:
        return {"error": "invalid input"},400

    #email must be unique
    if User.query.filter_by(email=new_user_info['email']).first()!=None:
        return {"error": "email has been registered"},400


    #role is determined during registration
    student=Role.query.filter_by(role_name='student').first()
    mentor=Role.query.filter_by(role_name='mentor').first()

    if new_user_info.get('role')=='student':
        new_user=User(
            first_name=new_user_info['first_name'],
            last_name=new_user_info['last_name'],
            email=new_user_info['email'],
            password=new_user_info['password'],
            role=student,
            domain=new_user_info['domain'],
            company=new_user_info.get('company'),
            education=new_user_info.get('education'),
        )
    else:
        new_user=User(
            first_name=new_user_info['first_name'],
            last_name=new_user_info['last_name'],
            email=new_user_info['email'],
            password=new_user_info['password'],
            role=mentor,
            domain=new_user_info['domain'],
            company=new_user_info.get('company'),
            education=new_user_info.get('education'),
        )

    try:
        db.session.add(new_user)
        db.session.commit()

    except:
        return {'error':'db internal error'},400

    new_user=User.query.filter_by(email=new_user_info['email']).first()

    token=new_user.generate_auth_token()
    new_user_id=new_user.id
    print(token)
    print(new_user_id)

    return {"token": token},200


@auth_bp.route('/login',methods=["POST"])
def login():
    print('Postman request /login: ',end='')
    print(request)
    user_info=request.get_json()
    print(user_info)
    
    #must provide email and password when logging in
    #if email does not exist, log in failed
    curr_user=User.query.filter_by(email=user_info.get('email')).first()
    if curr_user==None:
        return {"error": "invalid username"},400

    #if password is wrong, log in failed
    if curr_user.verify_password(user_info.get('password'))!=True:
        return {"error": "invalid password"},404

    #return token
    token=curr_user.generate_auth_token()

    result={"token": token}

    #also return role name
    result['is_student']=True if curr_user.role.role_name=='student' else False
        
    return result,200


@auth_bp.route('/logout',methods=["POST"])
def logout():
    return {},200

