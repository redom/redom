import { html } from '../html';
import _getEl from './_getEl';

export default parent => typeof parent === 'string' ? html(parent) : _getEl(parent);
