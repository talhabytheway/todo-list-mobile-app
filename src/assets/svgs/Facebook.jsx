import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';
import ratios from '../../constants/ratios';

const Facebook = () => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={ratios.widthPixel(28)}
    height={ratios.widthPixel(28)}
    viewBox="0 0 28 28"
    fill="none">
    <G clipPath="url(#a)">
      <Path fill="#FFECD0" d="M0 0h27v27H0z" />
      <Path
        fill="#395185"
        d="M25.51 27A1.49 1.49 0 0 0 27 25.51V1.49A1.49 1.49 0 0 0 25.51 0H1.49A1.49 1.49 0 0 0 0 1.49v24.02C0 26.333.667 27 1.49 27h24.02"
      />
      <Path
        fill="#FFECD0"
        d="M18.63 27V16.544h3.51l.525-4.075H18.63V9.869c0-1.18.327-1.984 2.019-1.984h2.158V4.238c-.374-.05-1.654-.161-3.144-.161-3.112 0-5.241 1.899-5.241 5.386v3.005h-3.519v4.075h3.519V27h4.207"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h27v27H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default Facebook;
