from typing import Optional, List
from pydantic import BaseModel, HttpUrl


class MenuItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category_id: int
    image_url: Optional[HttpUrl] = None
    is_available: bool = True
    preparation_time: Optional[int] = None  # in minutes
    station: Optional[str] = None  # e.g., "grill", "fryer", "cold prep"
    popularity: Optional[int] = None  # 1-100 scale
    customization_options: Optional[dict] = None


class MenuItemCreate(MenuItemBase):
    pass


class MenuItemUpdate(MenuItemBase):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category_id: Optional[int] = None
    image_url: Optional[HttpUrl] = None
    is_available: Optional[bool] = None
    preparation_time: Optional[int] = None
    station: Optional[str] = None
    popularity: Optional[int] = None
    customization_options: Optional[dict] = None


class MenuItemInDBBase(MenuItemBase):
    id: int
    
    class Config:
        orm_mode = True


class MenuItem(MenuItemInDBBase):
    pass


class MenuItemInDB(MenuItemInDBBase):
    pass
