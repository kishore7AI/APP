import os
import re
import uuid
from pathlib import Path
from typing import Optional, Dict, Any
from app.config import settings

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".webm", ".mov"}
MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024  # 50 MB

class ImageKitService:
    @property
    def private_key(self) -> str:
        return (os.getenv("IMAGEKIT_PRIVATE_KEY") or getattr(settings, "IMAGEKIT_PRIVATE_KEY", "")).strip()

    @property
    def public_key(self) -> str:
        return (os.getenv("IMAGEKIT_PUBLIC_KEY") or getattr(settings, "IMAGEKIT_PUBLIC_KEY", "")).strip()

    @property
    def url_endpoint(self) -> str:
        return (os.getenv("IMAGEKIT_URL_ENDPOINT") or getattr(settings, "IMAGEKIT_URL_ENDPOINT", "")).strip()

    @property
    def is_configured(self) -> bool:
        return bool(self.private_key and self.public_key and self.url_endpoint)

    def sanitize_folder(self, folder: str) -> str:
        """
        Sanitize folder path to prevent path traversal.
        Allows only alphanumeric characters, underscores, hyphens, and slashes.
        """
        folder = folder.replace("\\", "/").strip("/ ")
        # Remove any path traversal segments like '..'
        segments = [s for s in folder.split("/") if s and s != ".." and s != "."]
        clean_folder = "/".join(segments)
        clean_folder = re.sub(r"[^a-zA-Z0-9_\-/]", "", clean_folder)
        return clean_folder or "media"

    def sanitize_filename(self, file_name: str) -> str:
        """
        Sanitize filename to prevent directory traversal and overwrite attacks.
        Strips directory components and ensures a safe extension.
        """
        raw_name = Path(file_name).name
        ext = Path(raw_name).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            ext = ".png"  # fallback safe extension
        stem = Path(raw_name).stem
        clean_stem = re.sub(r"[^a-zA-Z0-9_\-]", "", stem)[:40] or "media"
        # Unique salt to prevent collision and overwrite
        unique_id = uuid.uuid4().hex[:8]
        return f"{clean_stem}_{unique_id}{ext}"

    def get_auth_parameters(self) -> Dict[str, Any]:
        """
        Generate authentication parameters (token, expire, signature)
        required for client-side uploads to ImageKit.
        """
        if not self.is_configured:
            return {
                "configured": False,
                "message": "ImageKit credentials are not configured in backend/.env",
                "public_key": self.public_key,
                "url_endpoint": self.url_endpoint,
            }

        try:
            from imagekitio import ImageKit
            ik = ImageKit(private_key=self.private_key)
            auth_params = ik.helper.get_authentication_parameters()
            return {
                "configured": True,
                "token": auth_params.get("token"),
                "expire": auth_params.get("expire"),
                "signature": auth_params.get("signature"),
                "public_key": self.public_key,
                "url_endpoint": self.url_endpoint,
            }
        except Exception as e:
            return {
                "configured": False,
                "error": str(e),
                "message": "Failed to generate ImageKit authentication parameters",
            }

    async def upload_file(
        self,
        file_bytes: bytes,
        file_name: str,
        folder: str = "courses",
        is_private_file: bool = False
    ) -> Dict[str, Any]:
        """
        Upload an image or video to ImageKit or fallback local directory.
        Strictly enforces file size limits, MIME extension restrictions, and path sanitization.
        """
        if len(file_bytes) > MAX_FILE_SIZE_BYTES:
            raise ValueError(f"File size exceeds maximum permitted limit ({MAX_FILE_SIZE_BYTES // (1024 * 1024)}MB).")

        safe_folder = self.sanitize_folder(folder)
        safe_name = self.sanitize_filename(file_name)

        if self.is_configured:
            try:
                from imagekitio import ImageKit
                ik = ImageKit(private_key=self.private_key)
                
                response = ik.files.upload(
                    file=file_bytes,
                    file_name=safe_name,
                    folder=f"/{safe_folder}",
                    is_private_file=is_private_file,
                    use_unique_file_name=True
                )
                
                file_id = getattr(response, "file_id", getattr(response, "fileId", ""))
                url = getattr(response, "url", "")
                thumbnail_url = getattr(response, "thumbnail_url", getattr(response, "thumbnailUrl", url))
                
                return {
                    "success": True,
                    "storage": "imagekit",
                    "file_id": file_id,
                    "url": url,
                    "thumbnail_url": thumbnail_url,
                    "name": safe_name,
                }
            except Exception as e:
                print(f"[ImageKit Upload Fallback]: {e}")
        
        # Local Upload Fallback with Path Traversal Boundary Check
        base_dir = Path("uploads").resolve()
        target_dir = (base_dir / safe_folder).resolve()
        
        # Security: Boundary check ensures path cannot escape 'uploads'
        if not str(target_dir).startswith(str(base_dir)):
            raise ValueError("Directory traversal attempt detected.")

        target_dir.mkdir(parents=True, exist_ok=True)
        local_path = (target_dir / safe_name).resolve()
        
        if not str(local_path).startswith(str(base_dir)):
            raise ValueError("Directory traversal attempt detected in filename.")
        
        with open(local_path, "wb") as f:
            f.write(file_bytes)

        return {
            "success": True,
            "storage": "local",
            "file_id": f"local_{safe_name}",
            "url": f"/uploads/{safe_folder}/{safe_name}",
            "thumbnail_url": f"/uploads/{safe_folder}/{safe_name}",
            "name": safe_name,
            "note": "Uploaded to local storage securely. Configure ImageKit credentials in backend/.env for CDN delivery."
        }

imagekit_service = ImageKitService()
