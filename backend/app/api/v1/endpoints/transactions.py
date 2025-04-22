from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("/", response_model=List[schemas.Transaction])
def read_transactions(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve transactions.
    """
    transactions = crud.transaction.get_multi(db, skip=skip, limit=limit)
    return transactions


@router.post("/", response_model=schemas.Transaction)
def create_transaction(
    *,
    db: Session = Depends(deps.get_db),
    transaction_in: schemas.TransactionCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new transaction.
    """
    transaction_in_data = transaction_in.dict()
    transaction_in_data["created_by_id"] = current_user.id
    transaction = crud.transaction.create(db=db, obj_in=transaction_in_data)
    return transaction


@router.put("/{id}", response_model=schemas.Transaction)
def update_transaction(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    transaction_in: schemas.TransactionUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update a transaction.
    """
    transaction = crud.transaction.get(db=db, id=id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    if not crud.user.is_superuser(current_user) and transaction.created_by_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    transaction = crud.transaction.update(db=db, db_obj=transaction, obj_in=transaction_in)
    return transaction


@router.get("/{id}", response_model=schemas.Transaction)
def read_transaction(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get transaction by ID.
    """
    transaction = crud.transaction.get(db=db, id=id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction


@router.delete("/{id}", response_model=schemas.Transaction)
def delete_transaction(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Delete a transaction.
    """
    transaction = crud.transaction.get(db=db, id=id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    transaction = crud.transaction.remove(db=db, id=id)
    return transaction
