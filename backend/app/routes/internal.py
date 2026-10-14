from fastapi import APIRouter, Depends

from app.config.security import require_staff
from app.services.staff import clock_out_all_staff as clock_out_all_staff_service


internal_router = APIRouter(
    prefix="/internal",
    tags=["Internal"],
)


@internal_router.post(
    "/emergency/clock-out-all",
    dependencies=[Depends(require_staff)],
)
def emergency_clock_out_all():
    """Manual emergency clock-out: end the duty day for all staff.

    Staff-JWT guarded (staff are the system admins). Normal clearing
    is owned by the Postgres 5pm cron; this exists for stuck flags
    and other emergencies. Returns how many rows flipped.
    """
    return clock_out_all_staff_service()
