from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "SkillSync API"
    DATABASE_URL: str

    # Automatically load from the .env file at the root
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()