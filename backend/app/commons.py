from flask import request,g
from .models import User


def before_request_check_token():
    try:
        request_token=request.headers.get('token')
        user_id=User.verify_auth_token(request_token)
        if user_id is None:
            g.curr_user=None
            return

        curr_user=User.query.filter_by(id=user_id).first()

        g.curr_user=curr_user
        return True
    except:
        g.curr_user=None
        return False