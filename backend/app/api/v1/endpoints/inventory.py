from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("/", response_model=List[schemas.InventoryItem])
def read_inventory_items(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve inventory items.
    """
    inventory_items = crud.inventory_item.get_multi(db, skip=skip, limit=limit)
    return inventory_items


@router.post("/", response_model=schemas.InventoryItem)
def create_inventory_item(
    *,
    db: Session = Depends(deps.get_db),
    item_in: schemas.InventoryItemCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new inventory item.
    """
    inventory_item = crud.inventory_item.create(db=db, obj_in=item_in)
    return inventory_item


@router.put("/{id}", response_model=schemas.InventoryItem)
def update_inventory_item(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    item_in: schemas.InventoryItemUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update an inventory item.
    """
    inventory_item = crud.inventory_item.get(db=db, id=id)
    if not inventory_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    inventory_item = crud.inventory_item.update(db=db, db_obj=inventory_item, obj_in=item_in)
    return inventory_item


@router.get("/{id}", response_model=schemas.InventoryItem)
def read_inventory_item(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get inventory item by ID.
    """
    inventory_item = crud.inventory_item.get(db=db, id=id)
    if not inventory_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return inventory_item


@router.delete("/{id}", response_model=schemas.InventoryItem)
def delete_inventory_item(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Delete an inventory item.
    """
    inventory_item = crud.inventory_item.get(db=db, id=id)
    if not inventory_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    inventory_item = crud.inventory_item.remove(db=db, id=id)
    return inventory_item


@router.put("/{id}/adjust", response_model=schemas.InventoryItem)
def adjust_inventory(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    quantity_change: float,
    reason: str,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Adjust inventory quantity.
    """
    inventory_item = crud.inventory_item.get(db=db, id=id)
    if not inventory_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    new_quantity = inventory_item.quantity + quantity_change
    if new_quantity < 0:
        raise HTTPException(status_code=400, detail="Adjustment would result in negative inventory")
    
    inventory_item = crud.inventory_item.update(db=db, db_obj=inventory_item, obj_in={"quantity": new_quantity})
    
    
    return inventory_item
