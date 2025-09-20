import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

function ModalPortal({ children }) {
  if (typeof window === 'undefined') return null;
  return createPortal(children, document.body);
}

ModalPortal.propTypes = {
  children: PropTypes.node.isRequired
};

export default ModalPortal;