from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class TransactionBase(BaseModel):
    amount: float
    transaction_type: str  # "income", "expense"
    category: str  # e.g., "sales", "salary", "rent", "utilities"
    description: Optional[str] = None
    payment_method: Optional[str] = None  # "cash", "mpesa", "card", "bank"
    reference_number: Optional[str] = None  # e.g., order ID, invoice number
    related_entity_id: Optional[int] = None  # e.g., order_id, supplier_id


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(TransactionBase):
    amount: Optional[float] = None
    transaction_type: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    payment_method: Optional[str] = None
    reference_number: Optional[str] = None
    related_entity_id: Optional[int] = None


class TransactionInDBBase(TransactionBase):
    id: int
    created_at: datetime
    updated_at: datetime
    created_by_id: int
    
    class Config:
        orm_mode = True


class Transaction(TransactionInDBBase):
    pass


class TransactionInDB(TransactionInDBBase):
    pass
