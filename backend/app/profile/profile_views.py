from . import profile_bp
from flask import request,g
from .. import db
from ..models import Application, Project_Status, User
import base64


@profile_bp.route('/profile/self',methods=["GET", "POST"])
def profile():
    curr_user=g.curr_user

    if request.method=='GET':
        result= {'id':curr_user.id,
                 'email': curr_user.email, 'first_name': curr_user.first_name, 'last_name': curr_user.last_name,
                 'gender': curr_user.gender, 'phone_num': curr_user.phone_num, 'education': curr_user.education,
                 'company': curr_user.company, 'bio': curr_user.bio, 'domain': curr_user.domain,
                 'is_student': True if curr_user.role.role_name == 'student' else False,
                 'avatar':(base64.b64encode(curr_user.avatar)).decode() if curr_user.avatar is not None else None}
        return {'profile':result}, 200

    elif request.method == 'POST':
        #email is not editable, others can
        info_to_update = request.get_json()

        if info_to_update.get('email'):
            return {'error:':'cannot change email'},400

        if info_to_update.get('first_name'):
            curr_user.first_name = info_to_update['first_name']
        if info_to_update.get('last_name'):
            curr_user.last_name = info_to_update['last_name']
        if info_to_update.get('gender'):
            curr_user.gender = info_to_update['gender']
        if info_to_update.get('password'):
            curr_user.password = info_to_update['password']
        if info_to_update.get('avatar'):
            curr_user.avatar = info_to_update['avatar']
        if info_to_update.get('phone_num'):
            curr_user.phone_num = info_to_update['phone_num']
        if info_to_update.get('education'):
            curr_user.education = info_to_update['education']
        if info_to_update.get('company'):
            curr_user.company = info_to_update['company']
        if info_to_update.get('bio'):
            curr_user.bio = info_to_update['bio']
        if info_to_update.get('domain'):
            curr_user.domain = info_to_update['domain']
        if info_to_update.get('avatar'):
            curr_user.avatar = base64.b64decode(info_to_update['avatar'])

        try:
            db.session.add(curr_user)
            db.session.commit()
        except:
            return {'error':'internal error'},400
        return {}, 200



@profile_bp.route('/profile/<int:user_id>',methods=["GET"])
def view_other_profile(user_id):
    curr_user=g.curr_user
    print(user_id)
    print(curr_user.id)
    if user_id==curr_user.id:
        return profile()
    
    target_user=User.query.filter_by(id=user_id).first()
    if target_user==None: return {'error':'no such user'},404
    
    result={
        'first_name':target_user.first_name,
        'last_name':target_user.last_name,
        'gender':target_user.gender,
        'phone_num':target_user.phone_num,
        'education':target_user.education,
        'company':target_user.company,
        'bio':target_user.bio,
        'domain':target_user.domain,
        'avatar':(base64.b64encode(target_user.avatar)).decode() if target_user.avatar is not None else None,
        'is_student':True if target_user.role.role_name=='student' else False
    }

    return {'profile':result},200


@profile_bp.route('/profile/<int:user_id>/reviews',methods=["GET"])
def get_reviews_of_mentor(user_id):
    target_mentor=User.query.filter_by(id=user_id).first()
    if target_mentor==None: return {'error':'no such user'},400
    if target_mentor.role.role_name=='student': return {'error':'user is not a mentor'},400

    result=[]

    from ..models import Application_Status
    import base64
    for each_project in target_mentor.projects:
        if each_project.status==Project_Status.Finished:
            accepted_applications=Application.query.filter_by(project=each_project,\
                status=Application_Status.Accepted).all()
            for each_accepted_application in accepted_applications:
                if each_accepted_application.comments!=None and each_accepted_application.rating!=None:
                    result.append({
                        'reviewer_id':each_accepted_application.applicant.id,
                        'reviewer_name':each_accepted_application.applicant.first_name+" "+\
                            each_accepted_application.applicant.last_name,
                        'reviewer_avatar':(base64.b64encode(each_accepted_application.applicant.avatar)).decode() \
                            if each_accepted_application.applicant.avatar else None,
                        'rating':each_accepted_application.rating,
                        'comments':each_accepted_application.comments,
                        'review_project':each_accepted_application.project.title
                    })
    
    return {'reviews':result},200
