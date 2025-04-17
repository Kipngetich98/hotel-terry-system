from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base_class import Base


class InventoryItem(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    unit = Column(String, nullable=False)  # e.g., kg, liter, piece
    quantity = Column(Float, default=0.0)
    minimum_threshold = Column(Float, default=10.0)
    cost_per_unit = Column(Float, nullable=False)
    supplier_id = Column(Integer, ForeignKey("supplier.id"), nullable=True)
    expiry_date = Column(DateTime, nullable=True)
    last_restocked = Column(DateTime, default=datetime.utcnow)
    
    supplier = relationship("Supplier", back_populates="inventory_items")
