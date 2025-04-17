from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship

from app.db.base_class import Base

import enum

class TransactionType(str, enum.Enum):
    SALE = "sale"
    EXPENSE = "expense"
    PURCHASE = "purchase"
    REFUND = "refund"
    OTHER = "other"

class Transaction(Base):
    id = Column(Integer, primary_key=True, index=True)
    transaction_number = Column(String, unique=True, index=True, nullable=False)
    type = Column(Enum(TransactionType), nullable=False)
    amount = Column(Float, nullable=False)
    description = Column(String, nullable=True)
    payment_method = Column(String, nullable=True)
    reference_number = Column(String, nullable=True)  # For M-Pesa, card transactions
    created_at = Column(DateTime, default=datetime.utcnow)
    order_id = Column(Integer, ForeignKey("order.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    
    order = relationship("Order", back_populates="transactions")
    created_by = relationship("User", back_populates="transactions")
