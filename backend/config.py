import os
from dotenv import load_dotenv
from sqlalchemy import URL


# Get the backend folder path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


# Load .env file
load_dotenv(os.path.join(BASE_DIR, ".env"))


class Config:

    # =====================================================
    # MySQL SETTINGS
    # =====================================================

    DB_HOST = os.getenv("DB_HOST", "localhost")

    DB_PORT = int(
        os.getenv("DB_PORT", "3306")
    )

    DB_USER = os.getenv(
        "DB_USER",
        "root"
    )

    DB_PASSWORD = os.getenv(
        "DB_PASSWORD",
        ""
    )

    DB_NAME = os.getenv(
        "DB_NAME",
        "hire_deliver_db"
    )


    # =====================================================
    # ADMIN SETTINGS
    # =====================================================

    ADMIN_EMAIL = os.getenv(
        "ADMIN_EMAIL"
    )

    ADMIN_PASSWORD = os.getenv(
        "ADMIN_PASSWORD"
    )


    # =====================================================
    # SQLALCHEMY DATABASE CONNECTION
    # =====================================================

    SQLALCHEMY_DATABASE_URI = URL.create(
        drivername="mysql+pymysql",
        username=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False