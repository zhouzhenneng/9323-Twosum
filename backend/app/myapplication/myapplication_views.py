from . import myapplication_bp
from ..models import Application, Application_Status, Project, Project_Status, User
from flask import g, request
from .. import db
from datetime import datetime

parseApplicationStatusCode = {1: 'Pending', 2: 'Accepted', 3: 'Rejected', 4: 'Cancelled'}
parseProjectStatusCode = {1: 'Recruiting', 2: 'InProgress', 3: 'Finished'}


@myapplication_bp.route('/myapplication', methods=['GET'])
def myapplication():
    curr_user = g.curr_user
    my_applications = []
    if not Application.query.filter_by(applicant=curr_user).all():
        return {'message': "there's no application at the moment"}, 200
    try:
        for each_application in Application.query.filter_by(applicant=curr_user).all():
            target_project = Project.query.get(each_application.project_id)
            result = {
                "id": each_application.id,
                "applicant": curr_user.first_name + " " + curr_user.last_name,
                "project_id": each_application.project_id,
                "project_title": target_project.title,
                "project_owner": target_project.owner.first_name + " " + target_project.owner.last_name,
                "mentor_email": target_project.owner.email,
                "project_category": target_project.category,
                "accepted_time": each_application.accepted_time,
                "application_time": each_application.application_time,
                "application_status": parseApplicationStatusCode[each_application.status],
                "project_status": parseProjectStatusCode[target_project.status],
                "rating": each_application.rating,
                "comments": each_application.comments
            }
            my_applications.append(result)
    except BaseException as e:
        #print(e)
        pass
    finally:
        return {"my_applications": my_applications}, 200


@myapplication_bp.route('/myapplication/new/<int:project_id>', methods=['POST'])
def apply_new_project(project_id):
    target_project = Project.query.get(project_id)
    request_data = request.get_json()
    curr_user = g.curr_user

    if target_project is None:
        return {'error': 'project not found'}, 400
    elif Application.query.filter_by(student_id=curr_user.id, project_id=target_project.id).first() is not None:
        return {'error': 'you have already applied for this project'}, 400
    elif curr_user.role.role_name == 'mentor':
        return {'error': 'mentor cannot apply for project'}, 400
    elif target_project.status != Project_Status.Recruiting:
        return {'error': 'project is not recruiting at the moment'}, 400
    else:
        try:
            new_application = Application(
                applicant=curr_user,
                project=target_project,
                project_mentor=target_project.owner,
                status=Application_Status.Pending,
                application_time=datetime.now(),
                self_intro=request_data.get('self_intro')
            )
            db.session.add(new_application)
            db.session.commit()
            new_application_id = Application.query.all()[-1].id
            return {'new_application_id': new_application_id}, 200
        except:
            return {'error': 'db internal error'}, 400


@myapplication_bp.route('/myapplication/cancel/<int:project_id>', methods=['PUT'])
def cancel_existing_application(project_id):
    target_project = Project.query.get(project_id)
    curr_user = g.curr_user
    target_application = Application.query.filter_by(student_id=curr_user.id, project_id=target_project.id).first()
    if target_project is None:
        return {'error': 'project not found'}, 400
    elif target_application is None:
        return {'error': 'you did not apply for this project before'}, 400
    elif parseApplicationStatusCode[target_application.status] != 'Pending':
        return {'error': 'you can not cancel application now'}, 400
    else:
        try:
            target_application.status = Application_Status.Cancelled
            db.session.add(target_application)
            db.session.commit()
            return {}, 200
        except:
            return {'error': 'db internal error'}, 400


@myapplication_bp.route('/myapplication/feedback/<int:application_id>', methods=['PUT'])
def application_feedback(application_id):
    curr_user=g.curr_user

    target_application = Application.query.filter_by(id=application_id,applicant=curr_user).first()
    if target_application is None:
        return {'error': 'application not found'}, 400

    target_project = Project.query.filter_by(id=target_application.project_id).first()
    target_mentor = User.query.filter_by(id=target_application.project_mentor_id).first()
    student = g.curr_user
    request_data = request.get_json()
    if student.id != target_application.student_id or target_application.status != Application_Status.Accepted:
        return {'error': 'you are not the student participating in this project'}, 400
    if target_project.status != Project_Status.Finished:
        return {'error': 'can only leave feedback when project is finished'}, 400
    if not request_data.get('rating'):
        return {'error': 'the rating cannot be empty'}, 400
    if request_data.get('rating') < 0 or request_data.get('rating') > 5:
        return {'error': 'invalid rating'}, 400
   
    try:
        target_application.rating = request_data.get('rating')
        target_application.comments = request_data.get('comments')
        db.session.add(target_application)
        db.session.commit()
        #print(f"rating is {request_data.get('rating')} and comment is {request_data.get('comments')}")
        return {
                    'success': f'student {student.first_name} {student.last_name} leave a feedback for mentor {target_mentor.first_name} {target_mentor.last_name}'}, 200
    except:
        return {'error': 'db internal error'}, 400
