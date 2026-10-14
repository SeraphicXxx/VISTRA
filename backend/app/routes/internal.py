from fastapi import APIRouter, Depends

from app.config.security import require_cron_secret
from app.services.staff import clock_out_all_staff as clock_out_all_staff_service


internal_router = APIRouter(
    prefix="/internal",
    tags=["Internal"],
)


@internal_router.post(
    "/cron/clock-out",
    dependencies=[Depends(require_cron_secret)],
)
def cron_clock_out():
    """5pm trigger: end the duty day for all active staff.

    Machine-to-machine only (X-Cron-Secret). This is the sole code
    path that sets STAFF.is_active back to False.
    """
    return clock_out_all_staff_service()
