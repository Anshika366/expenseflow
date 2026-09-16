import re
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from app.database import users_col
from app.schemas import UserSignupModel, UserLoginModel, UpdatePasswordModel, UserResponseModel, TokenResponseModel
from app.security import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/signup", response_model=TokenResponseModel, status_code=status.HTTP_201_CREATED)
async def signup(payload: UserSignupModel):
    clean_email = payload.email.lower().strip()
    existing = await users_col.find_one({"email": {"$regex": f"^{re.escape(clean_email)}$", "$options": "i"}})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered. Please login.")
    
    hashed_pwd = hash_password(payload.password)
    user_doc = {
        "name": payload.name.strip(),
        "email": clean_email,
        "password_hash": hashed_pwd,
        "created_at": datetime.utcnow().isoformat()
    }
    result = await users_col.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    access_token = create_access_token({"sub": clean_email, "id": user_id})
    user_data = UserResponseModel(id=user_id, name=payload.name.strip(), email=clean_email)
    return {"access_token": access_token, "token_type": "bearer", "user": user_data}

@router.post("/login", response_model=TokenResponseModel)
async def login(payload: UserLoginModel):
    clean_email = payload.email.lower().strip()
    user = await users_col.find_one({"email": {"$regex": f"^{re.escape(clean_email)}$", "$options": "i"}})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=400, detail="Invalid email or password credentials.")
    
    user_id = str(user["_id"])
    access_token = create_access_token({"sub": clean_email, "id": user_id})
    user_data = UserResponseModel(id=user_id, name=user.get("name", ""), email=clean_email)
    return {"access_token": access_token, "token_type": "bearer", "user": user_data}

@router.get("/me", response_model=UserResponseModel)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponseModel(
        id=str(current_user["_id"]),
        name=current_user.get("name", ""),
        email=current_user.get("email", "")
    )

@router.post("/reset-password")
async def update_password(payload: UpdatePasswordModel):
    clean_email = payload.email.lower().strip()
    user = await users_col.find_one({"email": {"$regex": f"^{re.escape(clean_email)}$", "$options": "i"}})
    if not user:
        raise HTTPException(status_code=404, detail="No account found with this email address.")
    
    hashed_pwd = hash_password(payload.new_password)
    await users_col.update_one(
        {"_id": user["_id"]},
        {"$set": {"password_hash": hashed_pwd}}
    )
    return {"message": "Password updated successfully. Please log in."}
