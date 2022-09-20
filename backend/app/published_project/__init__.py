from flask import Blueprint

published_project_bp = Blueprint('published_project', __name__)

from . import published_project_views