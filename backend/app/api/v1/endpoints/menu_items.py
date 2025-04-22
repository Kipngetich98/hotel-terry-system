from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("/", response_model=List[schemas.MenuItem])
def read_menu_items(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve menu items.
    """
    menu_items = crud.menu_item.get_multi(db, skip=skip, limit=limit)
    return menu_items


@router.post("/", response_model=schemas.MenuItem)
def create_menu_item(
    *,
    db: Session = Depends(deps.get_db),
    item_in: schemas.MenuItemCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Create new menu item.
    """
    menu_item = crud.menu_item.create(db=db, obj_in=item_in)
    return menu_item


@router.put("/{id}", response_model=schemas.MenuItem)
def update_menu_item(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    item_in: schemas.MenuItemUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Update a menu item.
    """
    menu_item = crud.menu_item.get(db=db, id=id)
    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    menu_item = crud.menu_item.update(db=db, db_obj=menu_item, obj_in=item_in)
    return menu_item


@router.get("/{id}", response_model=schemas.MenuItem)
def read_menu_item(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get menu item by ID.
    """
    menu_item = crud.menu_item.get(db=db, id=id)
    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return menu_item


@router.delete("/{id}", response_model=schemas.MenuItem)
def delete_menu_item(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Delete a menu item.
    """
    menu_item = crud.menu_item.get(db=db, id=id)
    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    menu_item = crud.menu_item.remove(db=db, id=id)
    return menu_item


@router.post("/{id}/upload-image")
async def upload_menu_item_image(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    file: UploadFile = File(...),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Upload an image for a menu item.
    """
    menu_item = crud.menu_item.get(db=db, id=id)
    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    
    
    return {"filename": file.filename, "menu_item_id": id}
