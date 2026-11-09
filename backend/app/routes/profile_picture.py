from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from supabase import Client

from app.config.security import get_current_user
from app.database.database_client import get_supabase_for_user
from app.services.access import get_patient_scope, enforce_patient_scope
from app.utils.service_helpers import handle_service_errors, ok

# Resolve to backend project root / PROFILE_PICTURES.
PROFILE_PICTURE_ROOT = (
    Path(__file__).resolve().parents[2] / "PROFILE_PICTURES"
).resolve()

ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
}

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

profile_picture_router = APIRouter(
    prefix="/profile-picture",
    tags=["Profile Picture"],
    dependencies=[Depends(get_current_user)],
)


@profile_picture_router.post("/upload", status_code=201)
async def upload_profile_picture(
    file: UploadFile = File(...),
    scope: str | None = Depends(get_patient_scope),
    supabase: Client = Depends(get_supabase_for_user),
):
    if scope is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Patient account required",
        )

    content = await file.read(MAX_FILE_SIZE + 1)
    await file.close()

    if not content:
        raise HTTPException(status_code=400, detail="File cannot be empty")

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File exceeds the 5 MB limit")

    import magic
    detected_type = magic.from_buffer(content, mime=True)
    extension = ALLOWED_IMAGE_TYPES.get(detected_type)

    if extension is None:
        raise HTTPException(
            status_code=415,
            detail="Unsupported image type. Use JPEG, PNG, WebP, or GIF.",
        )

    # Remove any existing profile picture for this patient
    for old_ext in ALLOWED_IMAGE_TYPES.values():
        old_path = (PROFILE_PICTURE_ROOT / f"{scope}{old_ext}").resolve()
        if old_path.is_file() and old_path.is_relative_to(PROFILE_PICTURE_ROOT):
            old_path.unlink(missing_ok=True)

    relative_path = f"{scope}{extension}"
    destination = (PROFILE_PICTURE_ROOT / relative_path).resolve()

    if not destination.is_relative_to(PROFILE_PICTURE_ROOT):
        raise HTTPException(status_code=400, detail="Invalid storage path")

    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(content)

    return ok(
        data={"path": relative_path},
        message="Profile picture uploaded successfully",
    )


@profile_picture_router.get("/me")
def get_my_profile_picture(
    scope: str | None = Depends(get_patient_scope),
    supabase: Client = Depends(get_supabase_for_user),
):
    if scope is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Patient account required",
        )

    for ext in ALLOWED_IMAGE_TYPES.values():
        path = (PROFILE_PICTURE_ROOT / f"{scope}{ext}").resolve()
        if path.is_file() and path.is_relative_to(PROFILE_PICTURE_ROOT):
            return FileResponse(
                path=path,
                media_type=f"image/{ext.lstrip('.').replace('jpg', 'jpeg')}",
                headers={"Cache-Control": "no-cache"},
            )

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="No profile picture found",
    )