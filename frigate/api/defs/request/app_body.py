from typing import Any, Dict, Optional

from pydantic import BaseModel


class AppConfigSetBody(BaseModel):
    requires_restart: int = 1
    update_topic: str | None = None
    config_data: Optional[Dict[str, Any]] = None


class AppPutPasswordBody(BaseModel):
    password: str


class AppPostUsersBody(BaseModel):
    username: str
    password: str
    role: Optional[str] = "viewer"


class AppPostLoginBody(BaseModel):
    user: str
    password: str


class AppPutRoleBody(BaseModel):
    role: str


class AppPutNotificationScheduleBody(BaseModel):
    enabled: bool
    quiet_hours: Dict[str, str]  # {"start": "22:00", "end": "08:00"}
    timezone: str
