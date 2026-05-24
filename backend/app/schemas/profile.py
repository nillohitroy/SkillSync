from pydantic import BaseModel
from typing import Optional

class ProfileUpdatePayload(BaseModel):
    full_name: Optional[str] = None
    profile_data: Optional[dict] = None