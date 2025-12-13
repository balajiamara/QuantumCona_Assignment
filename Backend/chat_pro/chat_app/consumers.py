import json
import jwt
from channels.generic.websocket import AsyncWebsocketConsumer
from django.conf import settings
from chat_app.models import Chat, ChatMember, Message, Users
from utils.encryption import encrypt_message, decrypt_message
from asgiref.sync import sync_to_async

SECRETKEY = settings.SECRET_KEY


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.chat_id = self.scope["url_route"]["kwargs"]["chat_id"]
        self.room_group_name = f"chat_{self.chat_id}"

        # ---------------------------
        # JWT Authentication
        # ---------------------------
        token = self.scope["query_string"].decode().split("token=")[-1]

        try:
            payload = jwt.decode(token, SECRETKEY, algorithms=["HS256"])
            if payload.get("type") != "access":
                raise Exception("Invalid token type")

            self.user = await sync_to_async(Users.objects.get)(
                Userid=payload["userid"]
            )

        except Exception:
            await self.close()
            return

        # ---------------------------
        # Authorization (Membership)
        # ---------------------------
        is_member = await sync_to_async(ChatMember.objects.filter(
            chat_id=self.chat_id,
            user=self.user
        ).exists)()

        if not is_member:
            await self.close()
            return

        # Join room
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_text = data.get("message")

        # Encrypt message
        encrypted = encrypt_message(message_text)

        # Save message
        message = await sync_to_async(Message.objects.create)(
            chat_id=self.chat_id,
            sender=self.user,
            encrypted_text=encrypted
        )

        # Broadcast to room
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": encrypted,
                "sender": self.user.Username,
                "created_at": str(message.created_at),
            }
        )

    async def chat_message(self, event):
        # Decrypt before sending
        decrypted = decrypt_message(event["message"])

        await self.send(text_data=json.dumps({
            "message": decrypted,
            "sender": event["sender"],
            "created_at": event["created_at"],
        }))
