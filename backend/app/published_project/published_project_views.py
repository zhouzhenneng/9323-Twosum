from . import published_project_bp
from ..models import Project, Project_Status
import base64

def parseProjectStatusCode(status_code):
    if status_code == Project_Status.Recruiting:
        return 'Recruiting'
    elif status_code == Project_Status.InProgress:
        return 'InProgress'
    elif status_code == Project_Status.Finished:
        return 'Finished'


@published_project_bp.route('/published_project', methods=['GET'])
def get_published_projects():
    result=[]
    for each_project in Project.query.filter_by(status=Project_Status.Recruiting).all():
        result.append({
            'project_id':each_project.id,
            'owner_id': each_project.owner_id,
            'owner': each_project.owner.first_name + " " + each_project.owner.last_name,
            'title': each_project.title,
            'category': each_project.category,
            'start_date': each_project.start_date.strftime('%Y-%m-%d'),
            'end_date': each_project.end_date.strftime('%Y-%m-%d'),
            'location': each_project.location,
            'description': each_project.description,
            'requirement': each_project.requirement,
            'video_link': each_project.video_link,
            'company': each_project.company,
            'created_time': each_project.created_time.strftime('%Y-%m-%d'),
            "status": parseProjectStatusCode(each_project.status),
            "picture": (base64.b64encode(each_project.picture)).decode() if each_project.picture else None,
        })

    return {'published_projects':result},200



@published_project_bp.route('/published_project/<int:project_id>',methods=['GET'])
def get_detail_of_a_published_project(project_id):
    target_project=Project.query.filter_by(id=project_id).first()
    if target_project is None: return {'error':'invalid input'},400

    result={
        'project_id':target_project.id,
        'owner_id': target_project.owner_id,
        'owner': target_project.owner.first_name + " " + target_project.owner.last_name,
        'title': target_project.title,
        'category': target_project.category,
        'start_date': target_project.start_date.strftime('%Y-%m-%d'),
        'end_date': target_project.end_date.strftime('%Y-%m-%d'),
        'location': target_project.location,
        'description': target_project.description,
        'requirement': target_project.requirement,
        'video_link': target_project.video_link,
        'company': target_project.company,
        'created_time': target_project.created_time.strftime('%Y-%m-%d'),
        "status": parseProjectStatusCode(target_project.status),
        "picture": (base64.b64encode(target_project.picture)).decode() if target_project.picture else None
    }

    return {'project_detail':result},200
