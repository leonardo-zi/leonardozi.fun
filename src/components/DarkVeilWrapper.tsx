import type { ComponentType } from "react";
// @ts-expect-error shadcn generates a local JSX module without declarations
import DarkVeilImpl from "./DarkVeil.jsx";

export interface DarkVeilProps {
  hueShift?: number;
  noiseIntensity?: number;
  scanlineIntensity?: number;
  speed?: number;
  scanlineFrequency?: number;
  warpAmount?: number;
  resolutionScale?: number;
}

const DarkVeil = DarkVeilImpl as ComponentType<DarkVeilProps>;

export default DarkVeil;
