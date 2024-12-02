import {SVGProps} from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Medicine{
  id: string;
  medicine: string;
  dosage: string;
  doctor: string;
  status: string;
}