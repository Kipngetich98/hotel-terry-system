from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel


class OrderItemBase(BaseModel):
    menu_item_id: int
    quantity: int
    price: float
    customization: Optional[Dict[str, Any]] = None
    notes: Optional[str] = None


class OrderItemCreate(OrderItemBase):
    pass


class OrderItemUpdate(OrderItemBase):
    menu_item_id: Optional[int] = None
    quantity: Optional[int] = None
    price: Optional[float] = None
    customization: Optional[Dict[str, Any]] = None
    notes: Optional[str] = None


class OrderItemInDBBase(OrderItemBase):
    id: int
    order_id: int
    
    class Config:
        orm_mode = True


class OrderItem(OrderItemInDBBase):
    pass


class OrderItemInDB(OrderItemInDBBase):
    pass


class OrderBase(BaseModel):
    table_number: Optional[str] = None
    customer_name: Optional[str] = None
    status: str = "pending"  # pending, preparing, ready, completed, cancelled
    payment_status: str = "pending"  # pending, paid, refunded
    payment_method: Optional[str] = None
    total_amount: float
    notes: Optional[str] = None


class OrderCreate(OrderBase):
    items: List[OrderItemCreate]


class OrderUpdate(OrderBase):
    table_number: Optional[str] = None
    customer_name: Optional[str] = None
    status: Optional[str] = None
    payment_status: Optional[str] = None
    payment_method: Optional[str] = None
    total_amount: Optional[float] = None
    notes: Optional[str] = None


class OrderInDBBase(OrderBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True


class Order(OrderInDBBase):
    items: List[OrderItem] = []


class OrderInDB(OrderInDBBase):
    pass
