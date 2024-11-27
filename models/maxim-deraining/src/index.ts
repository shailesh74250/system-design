import { NAME, VERSION, } from './constants.generated';
import { getMaximDefinition, } from '../../../packages/shared/src/maxim/maxim';

export default getMaximDefinition({
  path: 'models/model.json',
  name: NAME,
  version: VERSION,
  meta: {
    dataset: 'Rain13k',
    quantization: null,
  },
  divisibilityFactor: 64,
});
