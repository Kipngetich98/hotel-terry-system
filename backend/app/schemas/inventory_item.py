from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class InventoryItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    quantity: float
    unit: str  # e.g., kg, liters, pieces
    unit_price: float
    supplier_id: Optional[int] = None
    minimum_threshold: Optional[float] = None
    category: Optional[str] = None  # e.g., "meat", "vegetables", "dairy"


class InventoryItemCreate(InventoryItemBase):
    pass


class InventoryItemUpdate(InventoryItemBase):
    name: Optional[str] = None
    description: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    unit_price: Optional[float] = None
    supplier_id: Optional[int] = None
    minimum_threshold: Optional[float] = None
    category: Optional[str] = None


class InventoryItemInDBBase(InventoryItemBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True


class InventoryItem(InventoryItemInDBBase):
    pass


class InventoryItemInDB(InventoryItemInDBBase):
    pass
