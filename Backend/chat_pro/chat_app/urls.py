from django.urls import path
from . import views

urlpatterns=[
    path('reg_user/', view=views.create_user),
    path('update_user/', view=views.upd_user),
    path('delete_user/', view=views.del_user),
    path('show_user/', view=views.get_user),
    path('login/', view=views.login_user),
    path("refresh/", views.refresh_access_token),
    path("chat/create/", views.create_chat),
    path("chat/<int:chat_id>/add/", views.add_member),
    path("chat/<int:chat_id>/history/", views.chat_history),
    path("chat/<int:chat_id>/send/", views.send_message),

]