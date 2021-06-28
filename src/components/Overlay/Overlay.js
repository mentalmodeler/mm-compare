import {useContext} from 'react';
import {AppContext} from '../App/App';

import './Overlay.css';

function Overlay({children, className = ''}) {
    const {setState} = useContext(AppContext);
    
    return (
        <div className={`Overlay ${className}`}>
            {/* <div className="header">
                <div className="header__primary">
                    <div className={"logo"}>
                        <div className="logo-inner">
                            <span>{'MentalModeler'}</span><span>{'COMPARE'}</span>
                        </div>
                    </div>
                </div>
            </div> */}
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
