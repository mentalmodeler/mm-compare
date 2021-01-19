import {Fragment, useContext} from 'react';
import {AppContext} from '../App/App';
import {getMargin} from '../../utils';

import './Overlay.css';

function Overlay({children, className = ''}) {
    const {state, setState} = useContext(AppContext);
    
    return (
        <div className={`Overlay ${className}`}>
            <button className="Overlay__close btn btn-ghost" onClick={() => setState({mode: 'files'})}>
                <span>{'Close'}</span>
            </button>
            <div className="Overlay__bg"/>
            <div className="Overlay__body">
                <div className="Overlay__content">{children}</div>
            </div>
        </div>
    );
}

export default Overlay;
