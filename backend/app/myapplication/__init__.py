from flask import Blueprint

myapplication_bp = Blueprint('myapplication', __name__)

from . import myapplication_views