from . import message_bp
from ..models import Message, User
from flask import g, request
from .. import db
import base64


@message_bp.route('/messages/my_inbox/user_list', methods=['GET'])
def get_user_list():
    curr_user = g.curr_user
    if curr_user is None: return {'error':'invalid token'},400

    user_list=[]
    for each_received_message in Message.query.filter_by(receiver=curr_user).all():
        user_list.append({
            'user_id':each_received_message.sender_id,
            'user_name':each_received_message.sender.first_name+" "+each_received_message.sender.last_name,
            'avatar':(base64.b64encode(each_received_message.sender.avatar)).decode() if each_received_message.sender.avatar else None,
        })
    
    for each_sent_message in Message.query.filter_by(sender=curr_user).all():
        user_list.append({
            'user_id':each_sent_message.receiver_id,
            'user_name':each_sent_message.receiver.first_name+" "+each_sent_message.receiver.last_name,
            'avatar':(base64.b64encode(each_sent_message.receiver.avatar)).decode() if each_sent_message.receiver.avatar else None,
        })
    
    user_list=sorted(user_list,key=lambda k:(k['user_id']))
    
    result=[]

    previous_id=None
    for each_user in user_list:
        if each_user['user_id']==previous_id:
            continue
        else:
            previous_id=each_user['user_id']
            result.append(each_user)
    
    print('user list after remove repetition:',end='')
    print(result)


    return {'user_list':result},200



@message_bp.route('/messages/my_inbox/<int:user_id>', methods=['GET'])
def get_messages_from_a_sender(user_id):
    curr_user = g.curr_user
    if curr_user is None: return {'error':'invalid token'},400

    messages=[]
    for each_received_message in Message.query.filter_by(sender_id=user_id,receiver_id=curr_user.id).all():
        messages.append({
            'sender_id':each_received_message.sender_id,
            'sender_name':each_received_message.sender.first_name+" "+each_received_message.sender.last_name,
            'sender_avatar':(base64.b64encode(each_received_message.sender.avatar)).decode() \
                if each_received_message.sender.avatar is not None else None,
            'receiver_id':curr_user.id,
            'receiver_name':each_received_message.receiver.first_name+" "+each_received_message.receiver.last_name,
            'receiver_avatar':(base64.b64encode(each_received_message.receiver.avatar)).decode() \
                if each_received_message.receiver.avatar is not None else None,
            "sent_time":each_received_message.sent_time.strftime('%Y-%m-%d,%H-%M-%S'),
            "message":each_received_message.message
        })

    for each_sent_message in Message.query.filter_by(receiver_id=user_id,sender_id=curr_user.id).all():
        messages.append({
            'sender_id':curr_user.id,
            'sender_name':curr_user.first_name+" "+curr_user.last_name,
            'sender_avatar':(base64.b64encode(each_sent_message.sender.avatar)).decode() \
                if each_sent_message.sender.avatar is not None else None,
            'receiver_id':each_sent_message.receiver_id,
            'receiver_name':each_sent_message.receiver.first_name+" "+each_sent_message.receiver.last_name,
            'receiver_avatar':(base64.b64encode(each_sent_message.receiver.avatar)).decode() \
                if each_sent_message.receiver.avatar is not None else None,
            "sent_time":each_sent_message.sent_time.strftime('%Y-%m-%d,%H-%M-%S'),
            "message":each_sent_message.message
        })
    messages=sorted(messages,key=lambda k:(k['sent_time']))

    return {'messages':messages},200
    
    

@message_bp.route('/messages/new', methods=['POST'])
def send_new_message():
    curr_user = g.curr_user
    if curr_user is None: return {'error':'invalid token'},400

    request_data=request.get_json()

    receiver_id=request_data.get('receiver_id')
    message=request_data.get('message')
    if receiver_id is None or message is None: return {'error':'invalid input2'},400

    receiver=User.query.filter_by(id=receiver_id).first()
    if receiver is None: return {'error':'invalid receiver_id'},400
    if receiver==curr_user: return {'error':'cannot sent message to yourself'},400

    try:
        new_message=Message(sender=curr_user, receiver=receiver, message=message)
        db.session.add(new_message)
        db.session.commit()
    except:
        return {'error':'internal error'},400

    return {},200