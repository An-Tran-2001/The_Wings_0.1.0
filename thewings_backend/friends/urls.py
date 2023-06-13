from django.urls import path
from thewings_backend.friends.views import (
    friend_request_view,
    friend_view,
    user_request_friend_view,
    user_block_friend_view,
    block_friend_view,
    unblock_friend_view
 )

 
app_name = 'friends' 

urlpatterns = [
    path('friends_request/', view=friend_request_view, name='friends'),
    path('friends/', view=friend_view, name='friends'),
    path('user_request_friend/', view=user_request_friend_view, name='user_request_friend'),
    path('user_block_friend/', view=user_block_friend_view, name='user_block_friend'),
    path('block_friend/', view=block_friend_view, name='block_friend'),
    path('unblock_friend/<int:id>', view=unblock_friend_view, name='user_block_friend'),
]
