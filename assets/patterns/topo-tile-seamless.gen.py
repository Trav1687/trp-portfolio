"""
Seamless topo tile for the mobile topo backgrounds.

Two things have to hold at once:

1. Seamless in Y. The field is smoothed with mode="wrap" (periodic) and
   then explicitly closed by appending row 0 as the final row, so y=H
   reproduces y=0 exactly. Without that close, wrap makes the last row
   ADJACENT to the first, not equal to it, and the join still steps.

2. The river has to obey the terrain. A watercourse follows a valley
   floor; it cannot cross a ridge. An earlier version drew the river on an
   arbitrary sine centreline and cut a trough along it, which left it
   visibly running over high ground wherever the underlying field happened
   to peak. Here the path is DERIVED from the field by a minimum-cost
   descent (the seam-carving recurrence: each row picks the cheapest of
   the three cells above it), so it naturally threads the low ground.
   The trough is then cut along that path, reinforcing a valley that is
   already there rather than fighting the terrain.
"""
import numpy as np
from scipy.ndimage import gaussian_filter
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt

W, H = 829.44, 900.0
NX, NY = 300, 330
SLATE, ORANGE = "#4f5d75", "#fca311"
rng = np.random.default_rng(11)

# --- terrain, periodic in both axes ------------------------------------
f  = gaussian_filter(rng.standard_normal((NY, NX)), sigma=32, mode="wrap")
f += 0.22 * gaussian_filter(rng.standard_normal((NY, NX)), sigma=13, mode="wrap")
wy = gaussian_filter(rng.standard_normal((NY, NX)), sigma=12, mode="wrap")
wx = gaussian_filter(rng.standard_normal((NY, NX)), sigma=12, mode="wrap")
wx /= np.abs(wx).max(); wy /= np.abs(wy).max()
yy, xx = np.mgrid[0:NY, 0:NX]
f = f[np.mod((yy + wy * 11).astype(int), NY), np.mod((xx + wx * 11).astype(int), NX)]
f = (f - f.min()) / np.ptp(f)

# --- lowest route down the terrain -------------------------------------
# Bias the cost toward the middle third so the river stays roughly where
# the desktop segments put it, without overriding the terrain itself.
bias = 0.35 * ((np.arange(NX) / NX - 0.335) ** 2) / 0.11
cost = f + bias[None, :]

acc = cost[0].copy()
back = np.zeros((NY, NX), dtype=int)
for r in range(1, NY):
    left  = np.roll(acc, 1);  left[0]   = np.inf
    right = np.roll(acc, -1); right[-1] = np.inf
    stack = np.vstack([left, acc, right])
    choice = np.argmin(stack, axis=0)
    acc = cost[r] + stack[choice, np.arange(NX)]
    back[r] = np.arange(NX) + (choice - 1)

path = np.zeros(NY, dtype=int)
path[-1] = int(np.argmin(acc))
for r in range(NY - 1, 0, -1):
    path[r - 1] = np.clip(back[r][path[r]], 0, NX - 1)

# Close the loop: nudge the path so its two ends meet, spread over the
# whole height so no single point kinks.
drift = path[-1] - path[0]
path = path - (drift * np.arange(NY) / (NY - 1)).astype(int)
# Heavier smoothing than the descent needs: the raw seam moves in whole
# grid columns, and fill_betweenx joining those integer steps with straight
# segments gave the river a beaded, scalloped edge. sigma 14 keeps the
# route the descent found while removing the staircase.
path = np.clip(gaussian_filter(path.astype(float), sigma=14, mode="wrap"), 6, NX - 7)

# --- cut the valley along that path ------------------------------------
gx = np.linspace(0, W, NX)
cx_grid = path / (NX - 1) * W
dist = np.abs(gx[None, :] - cx_grid[:, None])
f = f - 0.55 * np.exp(-(dist ** 2) / (2 * 52.0 ** 2))
f = (f - f.min()) / np.ptp(f)

f = np.vstack([f, f[0:1]])
y = np.linspace(0, H, NY + 1)

# Interrupt the contours at the watercourse. On a real map the lines are
# broken where a river runs, not drawn across it; leaving them visible
# under a 50% translucent band read as the topography crossing the water.
# Masking the field inside the corridor means no contour is generated
# there at all, so the lines stop cleanly at each bank.
#
# RIVER_HALF is the drawn half-width; the mask is slightly wider so the
# lines terminate just outside the band rather than touching its edge.
RIVER_HALF = 9.0
MASK_HALF = RIVER_HALF + 2.5
cx_closed = np.concatenate([cx_grid, cx_grid[0:1]])
dist_closed = np.abs(gx[None, :] - cx_closed[:, None])
f = np.ma.masked_where(dist_closed < MASK_HALF, f)

fig = plt.figure(figsize=(W / 72, H / 72), dpi=72)
ax = fig.add_axes([0, 0, 1, 1]); ax.set_axis_off()
ax.set_xlim(0, W); ax.set_ylim(0, H); ax.invert_yaxis()
cs = ax.contour(gx, y, f, levels=18, colors=SLATE, linewidths=1.1, alpha=0.55)

# river drawn on the same derived path, so it sits in the valley floor
# Resample the centreline to 4x the grid resolution before filling, so the
# banks are drawn as a smooth curve rather than as one polygon edge per
# grid row. np.interp with period=NY keeps the wrap intact.
fine_y = np.linspace(0, NY, NY * 4, endpoint=False)
fine_cx = np.interp(fine_y, np.arange(NY), cx_grid, period=NY)
ry = fine_y / NY * H
ax.fill_betweenx(ry, fine_cx - RIVER_HALF, fine_cx + RIVER_HALF,
                 color=SLATE, alpha=0.5, linewidth=0)

for lvl_i in range(2, 17, 3):
    label = f"{int(320 + cs.levels[lvl_i] * 640):d}"
    for _ in range(3):
        ax.text(rng.uniform(0.06, 0.94) * W, rng.uniform(0.15, 0.85) * H,
                label, color=ORANGE, alpha=0.55, fontsize=7.5,
                ha="center", va="center", fontweight="bold")

fig.savefig("topo-tile-raw.svg", format="svg", transparent=True)
print(f"  path x range: {path.min()/NX*100:.1f}% to {path.max()/NX*100:.1f}%")
print(f"  path ends: y=0 at {path[0]/NX*100:.2f}%, y=H at {path[-1]/NX*100:.2f}%")
