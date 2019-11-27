import React, { useEffect, useRef } from 'react';
import {useDispatch} from 'react-redux';
import { clearForm } from '../../../store/actions';
import PropTypes from 'prop-types';
import './StickySubmitBlock.scss';

const StickySubmitBlock = ({ sentinelRef, onSubmit }) => {
  const dispatch = useDispatch();
  const stickyEl = useRef(null);

  useEffect(() => {
    intObserver.observe(stickyEl.current);
  }, []);

  const options = {
    root: sentinelRef,
    threshold: 1.0,
  };

  const callback = function(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio === 1) {
        entry.target.classList.remove('--sticky');
      } else if (window.scrollY < entry.target.offsetTop) {
        entry.target.classList.add('--sticky');
      }
    });
  };

  const handleClick = e => {
    onSubmit(e);
  };

  const handleClearForm = e => {
    dispatch(clearForm());
    window.scrollTo(0, 0);
    window.location.reload();
  }

  const intObserver = new IntersectionObserver(callback, options);

  return (
    <div id="stickyAnchor" ref={stickyEl} className="sticky-block__anchor">
      <div className="sticky-block">
        <button
          type="submit"
          className="btn-submit faux-btn-submit"
          onClick={handleClick}
        >
          Find Trials
        </button>
        <button
          type="button"
          className="btn-submit clear-form"
          onClick={handleClearForm}
        >
          Clear Form
        </button>
      </div>
    </div>
  );
};

StickySubmitBlock.propTypes = {
  sentinelRef: PropTypes.node,
  onSubmit: PropTypes.func,
};

StickySubmitBlock.defaultProps = {
  onSubmit: () => {},
};

export default StickySubmitBlock;
