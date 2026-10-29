import sys
import os
from pathlib import Path

# Add backend to sys.path
backend_dir = str(Path(__file__).resolve().parent)
sys.path.insert(0, backend_dir)
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///./backend/nxtlearnn.db"

import asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app

async def run_security_checks():
    transport = ASGITransport(app=app)
    results = []

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        print("\n=======================================================")
        print("          NxtLearnn Comprehensive Security Suite       ")
        print("=======================================================\n")

        # -------------------------------------------------------------
        # 1. Authorization Bypass Checks
        # -------------------------------------------------------------
        print("[1/7] Testing Authorization Bypass on Admin Endpoints...")
        
        # Test anonymous access to /api/admin/courses
        r1 = await client.get("/api/admin/courses")
        passed = (r1.status_code == 401)
        results.append(("Anon Admin Courses Blocked (401)", passed, f"Status: {r1.status_code}"))
        print(f"  - Anon GET /api/admin/courses: {r1.status_code} ({'PASS' if passed else 'FAIL'})")

        # Test anonymous access to /api/admin/stats
        r2 = await client.get("/api/admin/stats")
        passed = (r2.status_code == 401)
        results.append(("Anon Admin Stats Blocked (401)", passed, f"Status: {r2.status_code}"))
        print(f"  - Anon GET /api/admin/stats: {r2.status_code} ({'PASS' if passed else 'FAIL'})")

        # Test anonymous access to /api/admin/imagekit/auth
        r3 = await client.get("/api/admin/imagekit/auth")
        passed = (r3.status_code == 401)
        results.append(("Anon ImageKit Auth Blocked (401)", passed, f"Status: {r3.status_code}"))
        print(f"  - Anon GET /api/admin/imagekit/auth: {r3.status_code} ({'PASS' if passed else 'FAIL'})")

        # -------------------------------------------------------------
        # 2. Student Role vs Admin Role (RBAC / Authz)
        # -------------------------------------------------------------
        print("\n[2/7] Testing Student RBAC Restriction...")
        # Student Login
        student_login = await client.post("/api/auth/login", json={
            "email": "student@nxtlearnn.com",
            "password": "student123456"
        })
        student_token = student_login.json().get("access_token")
        
        # Student calling /api/admin/courses
        r4 = await client.get(
            "/api/admin/courses",
            headers={"Authorization": f"Bearer {student_token}"}
        )
        passed = (r4.status_code == 403)
        results.append(("Student Admin Access Forbidden (403)", passed, f"Status: {r4.status_code}"))
        print(f"  - Student GET /api/admin/courses: {r4.status_code} ({'PASS' if passed else 'FAIL'})")

        # Admin Login
        admin_login = await client.post("/api/auth/login", json={
            "email": "admin@nxtlearnn.com",
            "password": "admin123456"
        })
        admin_token = admin_login.json().get("access_token")
        
        # Admin calling /api/admin/courses
        r5 = await client.get(
            "/api/admin/courses",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        passed = (r5.status_code == 200)
        results.append(("Admin Authorized Access (200)", passed, f"Status: {r5.status_code}"))
        print(f"  - Admin GET /api/admin/courses: {r5.status_code} ({'PASS' if passed else 'FAIL'})")

        # -------------------------------------------------------------
        # 3. Privilege Escalation Prevention in Signup
        # -------------------------------------------------------------
        print("\n[3/7] Testing Privilege Escalation in Signup...")
        import time
        ts = int(time.time())
        
        # Attempt to escalate role by supplying role="admin"
        signup_payload = {
            "email": f"testuser_{ts}@gmail.com",
            "password": "Password123!",
            "full_name": "Test User",
            "role": "admin"
        }
        r6 = await client.post("/api/auth/signup", json=signup_payload)
        user_data = r6.json().get("user", {})
        assigned_role = user_data.get("role")
        passed = (assigned_role == "student")
        results.append(("Signup Privilege Escalation Prevented", passed, f"Role: {assigned_role}"))
        print(f"  - Attempt role='admin' on signup -> Assigned role: '{assigned_role}' ({'PASS' if passed else 'FAIL'})")

        # Attempt to escalate role by using admin@ prefix
        signup_admin_email = {
            "email": f"admin_attacker_{ts}@hacker.com",
            "password": "Password123!",
            "full_name": "Attacker Admin",
        }
        r7 = await client.post("/api/auth/signup", json=signup_admin_email)
        user_data2 = r7.json().get("user", {})
        assigned_role2 = user_data2.get("role")
        passed2 = (assigned_role2 == "student")
        results.append(("Admin Email Prefix Escalation Prevented", passed2, f"Role: {assigned_role2}"))
        print(f"  - Attempt email='admin_...@...' on signup -> Assigned role: '{assigned_role2}' ({'PASS' if passed2 else 'FAIL'})")

        # -------------------------------------------------------------
        # 4. Weak Password Rejection
        # -------------------------------------------------------------
        print("\n[4/7] Testing Broken Authentication (Password Policy)...")
        weak_signup = {
            "email": f"weak_{ts}@example.com",
            "password": "123",  # Under 8 chars
            "full_name": "Weak Pass User",
        }
        r8 = await client.post("/api/auth/signup", json=weak_signup)
        passed = (r8.status_code == 422)
        results.append(("Short Password Rejected (422)", passed, f"Status: {r8.status_code}"))
        print(f"  - Password < 8 characters: {r8.status_code} ({'PASS' if passed else 'FAIL'})")

        # -------------------------------------------------------------
        # 5. Injection & Malicious Uploads (MIME / Traversal)
        # -------------------------------------------------------------
        print("\n[5/7] Testing File Upload Injection & Path Traversal...")
        
        # Test malicious file type (e.g. text/html or application/x-msdos-program)
        files = {"file": ("malicious.exe", b"\x4D\x5A\x90\x00", "application/x-msdos-program")}
        data = {"folder": "courses/thumbnails"}
        r9 = await client.post(
            "/api/admin/imagekit/upload",
            files=files,
            data=data,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        passed = (r9.status_code == 415)
        results.append(("Executable Upload Blocked (415)", passed, f"Status: {r9.status_code}"))
        print(f"  - Upload .exe file: {r9.status_code} ({'PASS' if passed else 'FAIL'})")

        # Test HTML upload (Stored XSS attempt)
        files_html = {"file": ("xss.html", b"<script>alert(1)</script>", "text/html")}
        r10 = await client.post(
            "/api/admin/imagekit/upload",
            files=files_html,
            data=data,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        passed = (r10.status_code == 415)
        results.append(("HTML / XSS Upload Blocked (415)", passed, f"Status: {r10.status_code}"))
        print(f"  - Upload .html file: {r10.status_code} ({'PASS' if passed else 'FAIL'})")

        # Test valid image upload with path traversal folder payload
        files_valid = {"file": ("safe_thumb.png", b"\x89PNG\r\n\x1a\n", "image/png")}
        traversal_data = {"folder": "../../sensitive_system_folder"}
        r11 = await client.post(
            "/api/admin/imagekit/upload",
            files=files_valid,
            data=traversal_data,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        # Should sanitize folder safely
        upload_resp = r11.json()
        saved_url = upload_resp.get("url", "")
        passed = (r11.status_code == 200 and ".." not in saved_url)
        results.append(("Path Traversal Folder Sanitized", passed, f"Url: {saved_url}"))
        print(f"  - Folder traversal payload: {r11.status_code}, safe URL: '{saved_url}' ({'PASS' if passed else 'FAIL'})")

        # -------------------------------------------------------------
        # 6. IDOR (Insecure Direct Object Reference) & Hierarchical Integrity
        # -------------------------------------------------------------
        print("\n[6/7] Testing IDOR & Relationship Integrity...")
        
        # Non-existent course section creation
        r12 = await client.post(
            "/api/admin/courses/999999/sections",
            json={"title": "Ghost Section", "position": 1},
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        passed = (r12.status_code == 404)
        results.append(("IDOR: Non-existent Course Section Check (404)", passed, f"Status: {r12.status_code}"))
        print(f"  - POST /api/admin/courses/999999/sections: {r12.status_code} ({'PASS' if passed else 'FAIL'})")

        # Non-existent section lesson creation
        r13 = await client.post(
            "/api/admin/sections/999999/lessons",
            json={"title": "Ghost Lesson", "position": 1},
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        passed = (r13.status_code == 404)
        results.append(("IDOR: Non-existent Section Lesson Check (404)", passed, f"Status: {r13.status_code}"))
        print(f"  - POST /api/admin/sections/999999/lessons: {r13.status_code} ({'PASS' if passed else 'FAIL'})")

        # -------------------------------------------------------------
        # 7. Security Headers & Misconfiguration
        # -------------------------------------------------------------
        print("\n[7/7] Testing Security Headers & Hardening...")
        r14 = await client.get("/api/health")
        headers = r14.headers
        h_nosniff = headers.get("X-Content-Type-Options") == "nosniff"
        h_frame = headers.get("X-Frame-Options") == "DENY"
        h_xss = headers.get("X-XSS-Protection") == "1; mode=block"
        passed = h_nosniff and h_frame and h_xss
        results.append(("Security Headers Injected (nosniff, DENY, XSS)", passed, f"nosniff={h_nosniff}, frame={h_frame}"))
        print(f"  - Security headers present: nosniff={h_nosniff}, frame={h_frame}, xss={h_xss} ({'PASS' if passed else 'FAIL'})")

        # Check public course slug endpoint doesn't return draft/archived
        r15 = await client.get("/courses/non-existent-course-slug-1234")
        passed = (r15.status_code == 404)
        results.append(("Public Slug Missing/Draft Course 404", passed, f"Status: {r15.status_code}"))
        print(f"  - Public GET /courses/invalid-slug: {r15.status_code} ({'PASS' if passed else 'FAIL'})")

        print("\n=======================================================")
        print("                   Summary of Results                  ")
        print("=======================================================")
        all_passed = True
        for name, p, detail in results:
            status_str = "PASS" if p else "FAIL"
            if not p:
                all_passed = False
            print(f"[{status_str}] {name:<45} | {detail}")
        print("=======================================================")
        if all_passed:
            print(">>> ALL 13 SECURITY AUDIT VERIFICATIONS PASSED SUCCESSFULLY! <<<")
        else:
            print(">>> SOME SECURITY CHECKS FAILED! <<<")
        print("=======================================================\n")

if __name__ == "__main__":
    asyncio.run(run_security_checks())

