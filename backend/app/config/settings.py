import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY")

    IS_PROD = os.getenv("IS_PROD", "false").lower() == "true"

    LOCAL_FRONTEND_URL = os.getenv("LOCAL_FRONTEND_URL")
    PROD_FRONTEND_URL = os.getenv("PROD_FRONTEND_URL")

    @classmethod
    def frontend_url(cls) -> str:
        url = (
            cls.PROD_FRONTEND_URL
            if cls.IS_PROD
            else cls.LOCAL_FRONTEND_URL
        )

        if not url:
            raise ValueError(
                "Frontend URL is missing"
            )

        return url

    @classmethod
    def validate(cls):
        if not cls.SUPABASE_URL:
            raise ValueError("SUPABASE_URL is missing")

        if not cls.SUPABASE_KEY:
            raise ValueError("SUPABASE_KEY is missing")

        cls.frontend_url()


Config.validate()