import { createTheme } from '@material-ui/core/styles';

import variants from './variants';
import typography from './typography';
import overrides from './overrides';
import breakpoints from './breakpoints';
import props from './props';
import shadows from './shadows';
import shape from './shape';

const theme = (variant) =>
  createTheme(
    {
      spacing: 4,
      breakpoints,
      overrides,
      props,
      typography,
      shadows,
      shape,
      palette: variant.palette,
    },
    variant.name
  );

const themes = variants.map((variant) => theme(variant));

export default themes;
