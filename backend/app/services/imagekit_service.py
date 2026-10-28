import os
from pathlib import Path
from typing import Optional, Dict, Any
from app.config import settings

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
        Upload an image or video to ImageKit.
        If credentials are not yet configured, gracefully save locally as fallback.
        """
        if self.is_configured:
            try:
                from imagekitio import ImageKit
                ik = ImageKit(private_key=self.private_key)
                
                # Upload using ImageKit 3.x SDK
                response = ik.files.upload(
                    file=file_bytes,
                    file_name=file_name,
                    folder=f"/{folder.strip('/')}",
                    is_private_file=is_private_file,
                    use_unique_file_name=True
                )
                
                # Extract file details
                file_id = getattr(response, "file_id", getattr(response, "fileId", ""))
                url = getattr(response, "url", "")
                thumbnail_url = getattr(response, "thumbnail_url", getattr(response, "thumbnailUrl", url))
                
                return {
                    "success": True,
                    "storage": "imagekit",
                    "file_id": file_id,
                    "url": url,
                    "thumbnail_url": thumbnail_url,
                    "name": file_name,
                }
            except Exception as e:
                print(f"[ImageKit Upload Error]: {e}")
                # Fall back to local storage if API call fails
        
        # Local Upload Fallback
        upload_dir = Path("uploads") / folder
        upload_dir.mkdir(parents=True, exist_ok=True)
        local_path = upload_dir / file_name
        
        with open(local_path, "wb") as f:
            f.write(file_bytes)

        return {
            "success": True,
            "storage": "local",
            "file_id": f"local_{file_name}",
            "url": f"/uploads/{folder}/{file_name}",
            "thumbnail_url": f"/uploads/{folder}/{file_name}",
            "name": file_name,
            "note": "Uploaded to local storage. Add ImageKit keys in backend/.env for live cloud CDN delivery."
        }

imagekit_service = ImageKitService()
