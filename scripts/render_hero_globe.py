import os
import sys
import math
import numpy as np
import torch
from PIL import Image
import imageio.v3 as iio

def main():
    print("Initializing Enhanced 1080p 10-Second Looping Hero Globe Renderer...")
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using compute device: {device}")

    # Video specifications
    W, H = 1920, 1080
    FPS = 30
    DURATION_SEC = 10
    TOTAL_FRAMES = FPS * DURATION_SEC  # 300 frames

    # Globe geometry matching design/globe.png
    cx, cy = 960.0, 1110.0
    R = 825.0

    # Load base Earth night map
    tex_path = "scratch/earth_night_map.jpg"
    if not os.path.exists(tex_path):
        raise FileNotFoundError(f"Texture map not found at {tex_path}")
    
    tex_img = Image.open(tex_path).convert("RGB")
    tex_w, tex_h = tex_img.size
    tex_np = np.array(tex_img, dtype=np.float32) / 255.0
    tex_tensor = torch.tensor(tex_np, device=device).permute(2, 0, 1).unsqueeze(0)  # [1, 3, H, W]

    # Precompute pixel grid
    y_coords, x_coords = torch.meshgrid(
        torch.arange(H, device=device, dtype=torch.float32),
        torch.arange(W, device=device, dtype=torch.float32),
        indexing='ij'
    )

    dx = (x_coords - cx) / R
    dy = (y_coords - cy) / R
    r2 = dx**2 + dy**2
    mask = r2 <= 1.0

    # 3D points on unit sphere
    Z = torch.sqrt(torch.clamp(1.0 - r2, min=0.0))
    X = dx
    Y = dy

    # Axial tilt (~18.5 degrees for optimal view of both northern & tropical continents)
    tilt = math.radians(18.5)
    cos_t = math.cos(tilt)
    sin_t = math.sin(tilt)

    # Coordinates after axial tilt:
    # Rotate around X-axis
    Y_t = Y * cos_t - Z * sin_t
    Z_t = Y * sin_t + Z * cos_t
    X_t = X

    # Latitude
    lat = torch.asin(torch.clamp(-Y_t, -1.0, 1.0))
    v = (lat + (math.pi / 2.0)) / math.pi
    grid_y = 1.0 - 2.0 * v

    # Longitude base
    lon_base = torch.atan2(X_t, Z_t)

    # Precompute static background: stars & vertical aurora pillars
    print("Generating cosmic background elements...")
    np.random.seed(42)
    num_stars = 240
    star_x = np.random.uniform(20, W - 20, num_stars)
    star_y = np.random.uniform(15, cy - R + 120, num_stars)
    star_brightness = np.random.uniform(0.35, 1.0, num_stars)
    star_phase = np.random.uniform(0, 2 * math.pi, num_stars)
    star_speed = np.random.uniform(1.0, 3.0, num_stars)

    # Vertical light pillars / auroras (exact match to globe.png & landing_page_ref.png)
    pillar_bg = torch.zeros((H, W, 3), device=device, dtype=torch.float32)
    pillar_configs = [
        (380, 80, 0.28, (0.2, 0.45, 0.95)),
        (680, 120, 0.45, (0.35, 0.7, 1.0)),
        (960, 200, 0.70, (0.45, 0.85, 1.0)),  # central major aurora beam
        (1240, 120, 0.45, (0.35, 0.65, 1.0)),
        (1540, 80, 0.28, (0.2, 0.4, 0.95)),
    ]
    for px, pw, intensity, col in pillar_configs:
        pillar_x_diff = torch.abs(x_coords - px) / pw
        pillar_shape = torch.exp(-pillar_x_diff**2 * 1.4)
        # Fade vertically from upper sky down toward horizon
        vert_fade = torch.clamp((y_coords - 40.0) / 480.0, 0.0, 1.0) * torch.clamp((820.0 - y_coords) / 380.0, 0.0, 1.0)
        p_intensity = pillar_shape * vert_fade * intensity
        pillar_bg[:, :, 0] += p_intensity * col[0]
        pillar_bg[:, :, 1] += p_intensity * col[1]
        pillar_bg[:, :, 2] += p_intensity * col[2]

    # Atmospheric Rim Glow mask
    dist_from_rim = torch.abs(torch.sqrt(r2) - 1.0)
    rim_inner = torch.exp(-dist_from_rim * 45.0) * mask.float()
    rim_outer = torch.exp(-dist_from_rim * 16.0) * (~mask).float()
    rim_halo = torch.exp(-dist_from_rim * 6.0) * (~mask).float()

    # Corona hotspot near apex (the eclipse / sunburst flare)
    apex_x, apex_y = 960.0, cy - R + 20.0
    dist_apex = torch.sqrt((x_coords - apex_x)**2 + (y_coords - apex_y)**2)
    corona_flare = torch.exp(-dist_apex / 60.0)
    corona_wide = torch.exp(-dist_apex / 200.0)
    corona_core = torch.exp(-dist_apex / 18.0)

    # Key tech hub network nodes (lat, lon degrees)
    tech_nodes = [
        ("San Francisco", 37.77, -122.41),
        ("New York", 40.71, -74.00),
        ("London", 51.50, -0.12),
        ("Frankfurt", 50.11, 8.68),
        ("Dubai", 25.20, 55.27),
        ("Bengaluru", 12.97, 77.59),
        ("Singapore", 1.35, 103.82),
        ("Tokyo", 35.67, 139.65),
        ("Sydney", -33.86, 151.20),
        ("Sao Paulo", -23.55, -46.63),
    ]

    # Convert nodes to 3D sphere coordinates
    node_coords = []
    for name, n_lat, n_lon in tech_nodes:
        phi = math.radians(n_lat)
        lam = math.radians(n_lon)
        # Unit sphere: Y points up, X points right, Z points forward
        nx = math.cos(phi) * math.sin(lam)
        ny = math.sin(phi)
        nz = math.cos(phi) * math.cos(lam)
        node_coords.append((name, nx, ny, nz))

    # Network connections (Awwwards-style great circles)
    network_arcs = [
        (0, 1), # SF -> NY
        (1, 2), # NY -> London
        (2, 3), # London -> Frankfurt
        (3, 4), # Frankfurt -> Dubai
        (4, 5), # Dubai -> Bengaluru
        (5, 6), # Bengaluru -> Singapore
        (6, 7), # Singapore -> Tokyo
        (7, 0), # Tokyo -> SF (Pacific trans-continental)
        (0, 9), # SF -> Sao Paulo
        (9, 1), # Sao Paulo -> NY
    ]

    out_video_path = "frontend/public/videos/hero-globe.mp4"
    print(f"Rendering {TOTAL_FRAMES} frames into {out_video_path}...")

    frames = []

    for f_idx in range(TOTAL_FRAMES):
        if f_idx % 30 == 0:
            print(f"Progress: frame {f_idx}/{TOTAL_FRAMES} ({(f_idx/TOTAL_FRAMES)*100:.1f}%)")
        
        # Current rotation angle theta (0 to 2*pi)
        theta = (2.0 * math.pi * f_idx) / TOTAL_FRAMES
        cos_rot = math.cos(theta)
        sin_rot = math.sin(theta)

        # Longitude with rotation
        lon = (lon_base + theta) % (2.0 * math.pi)
        u = lon / (2.0 * math.pi)
        grid_x = 2.0 * u - 1.0

        grid = torch.stack([grid_x, grid_y], dim=-1).unsqueeze(0)  # [1, H, W, 2]

        # Sample texture using bi-linear interpolation
        sampled = torch.nn.functional.grid_sample(
            tex_tensor, grid, mode='bilinear', padding_mode='reflection', align_corners=False
        )[0].permute(1, 2, 0)  # [H, W, 3]

        # Color grading to sci-fi cyber cyan / celestial sapphire
        lum = 0.299 * sampled[:, :, 0] + 0.587 * sampled[:, :, 1] + 0.114 * sampled[:, :, 2]
        
        # High contrast night city lights with cyan-electric punch
        city_r = lum * 0.30 + (lum**1.8) * 0.35
        city_g = lum * 0.78 + (lum**1.5) * 0.35
        city_b = lum * 1.45 + (lum**1.2) * 0.50

        # City lights colored tensor
        city_rgb = torch.stack([city_r, city_g, city_b], dim=-1)
        
        # Base ocean subtle deep blue + city lights inside earth mask
        ocean_blue = torch.tensor([0.004, 0.012, 0.038], device=device)
        frame_rgb = torch.where(mask.unsqueeze(-1), ocean_blue + city_rgb, torch.zeros_like(sampled))

        # Add celestial vertical auroral pillars
        frame_rgb += pillar_bg * 0.95

        # Add breathing corona flare at apex
        pulse = 0.92 + 0.08 * math.sin((2.0 * math.pi * f_idx / FPS) * 0.8)
        corona_c = torch.tensor([0.45, 0.82, 1.0], device=device) * pulse
        frame_rgb += corona_core.unsqueeze(-1) * torch.tensor([1.0, 1.0, 1.0], device=device) * 1.8 * pulse
        frame_rgb += corona_flare.unsqueeze(-1) * corona_c * 1.4
        frame_rgb += corona_wide.unsqueeze(-1) * torch.tensor([0.18, 0.40, 0.85], device=device) * 0.75

        # Atmospheric Horizon Rim Glow (multi-layer)
        frame_rgb += rim_inner.unsqueeze(-1) * torch.tensor([0.30, 0.72, 1.0], device=device) * 1.55
        frame_rgb += rim_outer.unsqueeze(-1) * torch.tensor([0.18, 0.50, 0.90], device=device) * 1.10
        frame_rgb += rim_halo.unsqueeze(-1) * torch.tensor([0.06, 0.18, 0.45], device=device) * 0.50

        # Render Stars with twinkle
        star_canvas = np.zeros((H, W, 3), dtype=np.float32)
        for s_i in range(num_stars):
            twinkle = 0.4 + 0.6 * math.sin(star_phase[s_i] + (2 * math.pi * f_idx / TOTAL_FRAMES) * star_speed[s_i])
            b = star_brightness[s_i] * twinkle
            sx = int(star_x[s_i])
            sy = int(star_y[s_i])
            if 0 <= sx < W and 0 <= sy < H:
                star_canvas[sy, sx] = [b * 0.85, b * 0.95, b]
                if sy + 1 < H:
                    star_canvas[sy + 1, sx] = [b * 0.35, b * 0.45, b * 0.55]
                if sx + 1 < W:
                    star_canvas[sy, sx + 1] = [b * 0.35, b * 0.45, b * 0.55]

        frame_rgb += torch.tensor(star_canvas, device=device)

        # Tech network nodes & glowing arcs
        for arc_idx, (arc_src, arc_dst) in enumerate(network_arcs):
            s_name, sx, sy, sz = node_coords[arc_src]
            d_name, dx_n, dy_n, dz_n = node_coords[arc_dst]

            # Rotate nodes by theta around Y-axis, then apply tilt
            rx_s = sx * cos_rot + sz * sin_rot
            rz_s = -sx * sin_rot + sz * cos_rot
            ry_s = sy

            rx_d = dx_n * cos_rot + dz_n * sin_rot
            rz_d = -dx_n * sin_rot + dz_n * cos_rot
            ry_d = dy_n

            # Apply axial tilt (around X-axis)
            rx_s_t = rx_s
            ry_s_t = ry_s * cos_t - rz_s * sin_t
            rz_s_t = ry_s * sin_t + rz_s * cos_t

            rx_d_t = rx_d
            ry_d_t = ry_d * cos_t - rz_d * sin_t
            rz_d_t = ry_d * sin_t + rz_d * cos_t

            # Only draw if at least one node is facing camera
            if rz_s_t > -0.15 or rz_d_t > -0.15:
                # Interpolate great circle arc with 45 steps
                steps = 45
                pulse_phase = ((f_idx / 30.0) * 1.6 + arc_idx * 0.18) % 1.0

                for st in range(steps):
                    t_arc = st / float(steps)
                    v_interp = (1.0 - t_arc) * np.array([rx_s_t, ry_s_t, rz_s_t]) + t_arc * np.array([rx_d_t, ry_d_t, rz_d_t])
                    v_len = np.linalg.norm(v_interp)
                    if v_len > 0:
                        arc_lift = 1.0 + 0.048 * math.sin(t_arc * math.pi)
                        v_arc = (v_interp / v_len) * arc_lift

                        if v_arc[2] > 0.02:  # visible on front side
                            px = int(cx + v_arc[0] * R)
                            py = int(cy + v_arc[1] * R)

                            if 1 <= px < W - 1 and 1 <= py < H - 1:
                                dist_to_pulse = abs(t_arc - pulse_phase)
                                if dist_to_pulse < 0.06:
                                    pulse_glow = (1.0 - dist_to_pulse / 0.06) * 2.4
                                    pulse_col = torch.tensor([0.5 * pulse_glow, 0.9 * pulse_glow, 1.0 * pulse_glow], device=device)
                                    frame_rgb[py, px] += pulse_col
                                    frame_rgb[py + 1, px] += pulse_col * 0.4
                                    frame_rgb[py, px + 1] += pulse_col * 0.4
                                    frame_rgb[py - 1, px] += pulse_col * 0.4
                                    frame_rgb[py, px - 1] += pulse_col * 0.4
                                else:
                                    arc_col = torch.tensor([0.12, 0.42, 0.85], device=device)
                                    frame_rgb[py, px] += arc_col
                                    frame_rgb[py + 1, px] += arc_col * 0.25
                                    frame_rgb[py, px + 1] += arc_col * 0.25

        # Tech node beacon rings
        for name, nx, ny, nz in node_coords:
            rx = nx * cos_rot + nz * sin_rot
            rz = -nx * sin_rot + nz * cos_rot
            ry = ny

            rx_t = rx
            ry_t = ry * cos_t - rz * sin_t
            rz_t = ry * sin_t + rz * cos_t

            if rz_t > 0.05:  # facing viewer
                px = int(cx + rx_t * R)
                py = int(cy + ry_t * R)
                beacon_pulse = 0.6 + 0.4 * math.sin(2.0 * math.pi * f_idx / 20.0 + nx * 5.0)

                for dy_off in range(-3, 4):
                    for dx_off in range(-3, 4):
                        bx = px + dx_off
                        by = py + dy_off
                        if 0 <= bx < W and 0 <= by < H:
                            dist = math.sqrt(dx_off**2 + dy_off**2)
                            if dist <= 3.0:
                                ring_weight = (3.0 - dist) / 3.0
                                frame_rgb[by, bx] += torch.tensor([0.4, 0.85, 1.0], device=device) * beacon_pulse * ring_weight * 1.5

        # Clamp and convert to uint8 frame
        frame_clamped = torch.clamp(frame_rgb * 255.0, 0.0, 255.0).to(torch.uint8).cpu().numpy()
        frames.append(frame_clamped)

    print("Encoding frames into 1080p MP4 (macro_block_size=1)...")
    iio.imwrite(
        out_video_path,
        frames,
        fps=FPS,
        codec="libx264",
        pixelformat="yuv420p",
        macro_block_size=1
    )

    file_size_mb = os.path.getsize(out_video_path) / (1024 * 1024)
    print(f"Successfully generated {out_video_path}! Size: {file_size_mb:.2f} MB")

if __name__ == "__main__":
    main()
