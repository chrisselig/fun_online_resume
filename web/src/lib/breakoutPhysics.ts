export interface Brick {
  x: number;
  y: number;
  alive: boolean;
  label: string;
}

/** Lay out a grid of bricks across the canvas width, cycling through `labels`. */
export function buildBricks(
  labels: string[],
  cols: number,
  rows: number,
  canvasW: number,
  brickW: number,
  brickH: number,
  gap: number,
  topOffset: number,
): Brick[] {
  const totalW = cols * brickW + (cols - 1) * gap;
  const startX = (canvasW - totalW) / 2;
  const bricks: Brick[] = [];
  let labelIdx = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      bricks.push({
        x: startX + col * (brickW + gap),
        y: topOffset + row * (brickH + gap),
        alive: true,
        label: labels[labelIdx % labels.length],
      });
      labelIdx++;
    }
  }
  return bricks;
}

/**
 * Reflect the ball off the paddle. Hit position relative to paddle center
 * (-1 = far left edge, 0 = center, 1 = far right edge) steers the rebound
 * angle, so where you catch the ball actually matters — not just a flat
 * vertical bounce.
 */
export function reflectOffPaddle(
  ballX: number,
  paddleX: number,
  paddleW: number,
  speed: number,
): { vx: number; vy: number } {
  const relative = (ballX - (paddleX + paddleW / 2)) / (paddleW / 2);
  const clamped = Math.max(-1, Math.min(1, relative));
  const angle = clamped * (Math.PI / 3); // up to 60 degrees off vertical
  return {
    vx: speed * Math.sin(angle),
    vy: -Math.abs(speed * Math.cos(angle)),
  };
}
