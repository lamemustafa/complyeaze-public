export function createVisualHitTestEvidence(rectGroups, viewport) {
  return rectGroups.map((rects) => {
    const intersections = [];
    const points = rects.flatMap((rect) => {
      if (
        ![rect.bottom, rect.height, rect.left, rect.right, rect.top, rect.width].every(Number.isFinite) ||
        rect.width === 0 ||
        rect.height === 0 ||
        rect.bottom < 0 ||
        rect.top > viewport.height
      ) {
        return [];
      }

      const left = Math.max(rect.left, 0);
      const right = Math.min(rect.right, viewport.width);
      const top = Math.max(rect.top, 0);
      const bottom = Math.min(rect.bottom, viewport.height);
      const width = right - left;
      const height = bottom - top;
      if (width <= 0 || height <= 0) return [];

      intersections.push({ bottom, height, left, right, top, width });
      if (width < 1 || height < 1) return [];

      const insetX = Math.min(8, width / 4);
      const insetY = Math.min(8, height / 4);
      const xs = [left + insetX, left + width / 2, right - insetX];
      const ys = [top + insetY, top + height / 2, bottom - insetY];
      return xs
        .flatMap((x) => ys.map((y) => [clampInside(x, viewport.width), clampInside(y, viewport.height)]))
        .filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
    });

    return { intersections, points, rects };
  });
}

function clampInside(value, viewportSize) {
  return Math.min(Math.max(value, 0.5), viewportSize - 0.5);
}

export function assertVisualGeometryFixtures() {
  const viewport = { height: 844, width: 390 };
  const [subpixelEdge, visibleHeading, offscreen, fractional, clampedEdge] = createVisualHitTestEvidence(
    [
      [{ bottom: 844.5, height: 40, left: 14, right: 300, top: 843.5, width: 286 }],
      [{ bottom: 180, height: 48, left: 14, right: 300, top: 132, width: 286 }],
      [{ bottom: 900, height: 40, left: 14, right: 300, top: 860, width: 286 }],
      [{ bottom: 843.75, height: 24.5, left: 13.25, right: 389.75, top: 819.25, width: 376.5 }],
      [{ bottom: 845, height: 2, left: 14, right: 300, top: 843, width: 286 }],
    ],
    viewport,
  );

  assert(
    subpixelEdge.points.length === 0,
    `subpixel viewport contact produced ${subpixelEdge.points.length} hit-test points`,
  );
  assert(visibleHeading.points.length === 9, "visible heading must produce nine hit-test points");
  assert(offscreen.points.length === 0, "off-screen content must not produce hit-test points");
  assert(
    fractional.points.every(
      ([x, y]) =>
        Number.isFinite(x) &&
        Number.isFinite(y) &&
        x > 0 &&
        x < viewport.width &&
        y > 0 &&
        y < viewport.height,
    ),
    "fractional hit-test points must remain finite and strictly inside the viewport",
  );
  assert(
    Math.max(...clampedEdge.points.map(([, y]) => y)) === viewport.height - 0.5,
    "viewport-edge points must be clamped a half pixel inside the viewport",
  );
}

function assert(condition, message) {
  if (!condition) throw new Error(`Visual geometry fixture failed: ${message}`);
}
