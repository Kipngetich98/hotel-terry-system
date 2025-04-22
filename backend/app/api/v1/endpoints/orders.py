from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("/", response_model=List[schemas.Order])
def read_orders(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve orders.
    """
    orders = crud.order.get_multi(db, skip=skip, limit=limit)
    return orders


@router.post("/", response_model=schemas.Order)
def create_order(
    *,
    db: Session = Depends(deps.get_db),
    order_in: schemas.OrderCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new order.
    """
    order = crud.order.create_with_items(db=db, obj_in=order_in)
    return order


@router.put("/{id}", response_model=schemas.Order)
def update_order(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    order_in: schemas.OrderUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update an order.
    """
    order = crud.order.get(db=db, id=id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order = crud.order.update(db=db, db_obj=order, obj_in=order_in)
    return order


@router.get("/{id}", response_model=schemas.Order)
def read_order(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get order by ID.
    """
    order = crud.order.get(db=db, id=id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.delete("/{id}", response_model=schemas.Order)
def delete_order(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Delete an order.
    """
    order = crud.order.get(db=db, id=id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order = crud.order.remove(db=db, id=id)
    return order


@router.put("/{id}/status", response_model=schemas.Order)
def update_order_status(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    status: str,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update order status.
    """
    order = crud.order.get(db=db, id=id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    valid_statuses = ["pending", "preparing", "ready", "completed", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}")
    
    order = crud.order.update(db=db, db_obj=order, obj_in={"status": status})
    return order


@router.put("/{id}/payment", response_model=schemas.Order)
def update_payment_status(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    payment_status: str,
    payment_method: str = None,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update payment status.
    """
    order = crud.order.get(db=db, id=id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    valid_statuses = ["pending", "paid", "refunded"]
    if payment_status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid payment status. Must be one of: {', '.join(valid_statuses)}")
    
    update_data = {"payment_status": payment_status}
    if payment_method:
        update_data["payment_method"] = payment_method
    
    order = crud.order.update(db=db, db_obj=order, obj_in=update_data)
    return order
