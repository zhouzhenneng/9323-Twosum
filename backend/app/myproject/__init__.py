from flask import Blueprint

myproject_bp = Blueprint('myproject', __name__)

from . import myproject_views