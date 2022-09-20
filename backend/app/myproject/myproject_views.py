from . import myproject_bp
from flask import request, g
from .. import db
from ..models import Application, Application_Status, Project, Project_Status, User
from datetime import datetime
import base64


def parseProjectStatusCode(status_code):
    if status_code == Project_Status.Recruiting:
        return 'Recruiting'
    elif status_code == Project_Status.InProgress:
        return 'In Progress'
    elif status_code == Project_Status.Finished:
        return 'Finished'


@myproject_bp.route('/myproject', methods=['GET'])
def myproject():
    curr_user = g.curr_user
    my_projects = []

    for each_project in Project.query.filter_by(owner=curr_user, is_active=True).all():
        result = {
            "id": each_project.id,
            "owner": curr_user.first_name + " " + curr_user.last_name,
            "title": each_project.title,
            "category": each_project.category,
            "start_date": each_project.start_date.strftime('%Y-%m-%d'),
            "end_date": each_project.end_date.strftime('%Y-%m-%d'),
            "description": each_project.description,
            "video_link": each_project.video_link,
            "status": parseProjectStatusCode(each_project.status),
            "requirement":each_project.requirement,
            "company":each_project.company
        }

        my_projects.append(result)

    return {"my_projects": my_projects}, 200


@myproject_bp.route('/myproject/create', methods=['POST'])
def create_project():
    curr_user = g.curr_user
    request_data = request.get_json()
    if curr_user.role.role_name == 'student':
        return {'error': 'you are not a mentor'}, 400

    try:
        new_project = Project(
            owner=curr_user,
            title=request_data.get('title'),
            category=request_data.get('category'),
            start_date=datetime.strptime(request_data.get('start_date'), '%Y-%m-%d').date(),
            end_date=datetime.strptime(request_data.get('end_date'), '%Y-%m-%d').date(),
            location=request_data.get('location'),
            description=request_data.get('description'),
            requirement=request_data.get('requirement'),
            video_link=request_data.get('video_link'),
            company=request_data.get('company'),
            # a newly created project's state is by default Recruiting
            picture=base64.b64decode(request_data.get('picture')) if request_data.get('picture') else None
        )
        db.session.add(new_project)
        db.session.commit()
    except:
        return {'error': 'db internal error'}, 400

    new_project_id = Project.query.all()[-1].id

    return {'new_project_id': new_project_id}, 200



@myproject_bp.route('/myproject/<int:project_id>', methods=['GET', 'POST'])
def get_project_detail(project_id):
    curr_user = g.curr_user
    target_project = Project.query.filter_by(id=project_id).first()
    if target_project == None:
        return {'error': 'project not found'}, 400

    if target_project.owner != curr_user:
        return {'error': 'you are not owner of this project'}, 400

    if request.method == 'GET':
        result = {
            'owner': target_project.owner.first_name + " " + target_project.owner.last_name,
            'title': target_project.title,
            'category': target_project.category,
            'start_date': target_project.start_date.strftime('%Y-%m-%d'),
            'end_date': target_project.end_date.strftime('%Y-%m-%d'),
            'location': target_project.location,
            'description': target_project.description,
            'requirement': target_project.requirement,
            'video_link': target_project.video_link,
            'created_time': target_project.created_time.strftime('%Y-%m-%d'),
            "status": parseProjectStatusCode(target_project.status),
            "picture": (base64.b64encode(target_project.picture)).decode() if target_project.picture else None,
            "company": target_project.company
        }

        from ..myapplication.myapplication_views import parseApplicationStatusCode
        applications=[]
        for each_application in target_project.applications:
            if each_application.status!=Application_Status.Cancelled:
                applications.append({
                    'application_id':each_application.id,
                    'applicant_id':each_application.student_id,
                    'applicant_name':each_application.applicant.first_name+" "+each_application.applicant.last_name,
                    "applicant_avatar":(base64.b64encode(each_application.applicant.avatar)).decode() if each_application.applicant.avatar is not None else None,
                    'apply_time':each_application.application_time,
                    'status':parseApplicationStatusCode[each_application.status],
                    #applicant_intro is the applicant's self introduction
                    'applicant_intro':each_application.self_intro,
                    'title':target_project.title,
                })
        
        result['applications']=applications

        return {"project_detail": result}, 200

    elif request.method == 'POST':
        info_to_update = request.get_json()

        if info_to_update.get('title'):
            target_project.title = info_to_update['title']
        if info_to_update.get('category'):
            target_project.category = info_to_update['category']
        if info_to_update.get('start_date'):
            target_project.start_date = datetime.strptime(info_to_update['start_date'], '%Y-%m-%d').date()
        if info_to_update.get('end_date'):
            target_project.end_date = datetime.strptime(info_to_update['end_date'], '%Y-%m-%d').date()
        if info_to_update.get('location'):
            target_project.location = info_to_update['location']
        if info_to_update.get('description'):
            target_project.description = info_to_update['description']
        if info_to_update.get('requirement'):
            target_project.requirement = info_to_update['requirement']
        if info_to_update.get('video_link'):
            target_project.video_link = info_to_update['video_link']
        if info_to_update.get('company'):
            target_project.company = info_to_update['company']
        
        if "picture" in info_to_update and info_to_update.get('picture'):
            target_project.picture = base64.b64decode(info_to_update['picture'])
        elif "picture" in info_to_update:
            target_project.picture = None

        try:
            db.session.add(target_project)
            db.session.commit()
        except:
            return {'error': 'db internal error'}, 400

        return {}, 200


@myproject_bp.route('/myproject/delete/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    curr_user = g.curr_user
    target_project = Project.query.filter_by(id=project_id).first()
    if target_project == None: return {'error': 'project not found'}
    if target_project.owner != curr_user: return {'error': 'you are not owner of this project'}

    try:
        target_project.is_active = False
        db.session.add(target_project)
        db.session.commit()
    except:
        return {'error': 'db internal error'}, 400

    return {}, 200



@myproject_bp.route('/myproject/start/<int:project_id>', methods=['PUT'])
def start_project(project_id):
    curr_user=g.curr_user
    target_project = Project.query.filter_by(id=project_id).first()
    if target_project == None: return {'error': 'project not found'}
    if target_project.owner != curr_user: return {'error': 'you are not owner of this project'}

    try:
        target_project.status=Project_Status.InProgress

        for each_application in target_project.applications:
            if each_application.status==Application_Status.Pending:
                each_application.status=Application_Status.Rejected
                db.session.add(each_application)

        db.session.add(target_project)
        db.session.commit()
    except:
        return {'error': 'db internal error'}, 400
    
    return {},200



@myproject_bp.route('/myproject/finish/<int:project_id>', methods=['PUT'])
def finish_project(project_id):
    curr_user=g.curr_user
    target_project = Project.query.filter_by(id=project_id).first()
    if target_project == None: return {'error': 'project not found'}
    if target_project.owner != curr_user: return {'error': 'you are not owner of this project'}

    try:
        target_project.status=Project_Status.Finished
        db.session.add(target_project)
        db.session.commit()
    except:
        return {'error': 'db internal error'}, 400
    
    return {},200



@myproject_bp.route('/myproject/<int:project_id>/applications_received', methods=['GET'])
def get_applications(project_id):
    curr_user = g.curr_user
    target_project = Project.query.filter_by(id=project_id).first()
    if target_project == None: return {'error': 'project not found'}
    if target_project.owner != curr_user: return {'error': 'you are not owner of this project'}

    from ..myapplication.myapplication_views import parseApplicationStatusCode
    result=[]
    for each_application in target_project.applications:
        if each_application.status!=Application_Status.Cancelled:
            applicant = User.query.get(each_application.student_id)
            result.append({
                'project_id': target_project.id,
                'application_id': each_application.id,
                'applicant_id': each_application.student_id,
                'applicant_name': applicant.first_name + " " + applicant.last_name,
                'apply_time': each_application.application_time,
                'status': parseApplicationStatusCode[each_application.status],
                'applicant_intro': each_application.self_intro
            })
    
    return {'applications_received':result},200



@myproject_bp.route('/myproject/accept/<int:application_id>', methods=['PUT'])
def accept_application(application_id):
    curr_user = g.curr_user
    target_application = Application.query.filter_by(id=application_id).first()
    if target_application is None:
        return {'error':'application not found'},400
    if target_application.project.owner!=curr_user:
        return {'error':'you are not owner of this project'},400
    if target_application.status!=Application_Status.Pending:
        return {'error':'this application is not in pending state'},400

    try:
        target_application.status=Application_Status.Accepted
        target_application.accepted_time = datetime.now()
        db.session.add(target_application)
        db.session.commit()
    except:
        return {'error':'internal error'},400

    return {},200


@myproject_bp.route('/myproject/reject/<int:application_id>', methods=['PUT'])
def reject_application(application_id):
    curr_user = g.curr_user
    target_application = Application.query.filter_by(id=application_id).first()
    if target_application is None:
        return {'error':'application not found'},400
    if target_application.project.owner!=curr_user:
        return {'error':'you are not owner of this project'},400
    if target_application.status!=Application_Status.Pending:
        return {'error':'this application is not in pending state'},400

    try:
        target_application.status=Application_Status.Rejected
        db.session.add(target_application)
        db.session.commit()
    except:
        return {'error':'internal error'},400

    return {},200



