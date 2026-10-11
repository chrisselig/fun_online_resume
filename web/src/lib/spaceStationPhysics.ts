export interface Body {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
}

export interface Bounds {
  width: number;
  height: number;
}

export interface Vector {
  x: number;
  y: number;
}

const DAMPING = 0.6;
const DRAG = 0.995;

/** Advances one body by dt under a gravity vector, bouncing (with damping) off the bounds walls. */
export function stepBody(body: Body, gravity: Vector, bounds: Bounds, dt: number): Body {
  let vx = (body.vx + gravity.x * dt) * DRAG;
  let vy = (body.vy + gravity.y * dt) * DRAG;
  let x = body.x + vx * dt;
  let y = body.y + vy * dt;

  const maxX = Math.max(0, bounds.width - body.w);
  const maxY = Math.max(0, bounds.height - body.h);

  if (x < 0) {
    x = 0;
    vx = Math.abs(vx) * DAMPING;
  } else if (x > maxX) {
    x = maxX;
    vx = -Math.abs(vx) * DAMPING;
  }

  if (y < 0) {
    y = 0;
    vy = Math.abs(vy) * DAMPING;
  } else if (y > maxY) {
    y = maxY;
    vy = -Math.abs(vy) * DAMPING;
  }

  return { ...body, x, y, vx, vy };
}
