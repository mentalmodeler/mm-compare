import {useContext} from 'react';
import classnames from 'classnames';

import {AppContext} from '../App/App';

import './Models.css';

function Models() {
    const {state, setState, dispatch} = useContext(AppContext);
    const {modelsJSON, canonicalId, results = {}} = state;
    console.log('modelsJSON:', modelsJSON);
    return (
        <div className="models">
            {modelsJSON.map((json, i) => {
                const {info, id} = json || {info: {}};
                const {author, date, name} = info;
                const result = results[id];
                return (
                    <div className="model-wrapper" key={`model-${i}`}>
                        <div className="model">
                            <div className="model__info">
                                <div className="model__author">
                                    {author || '[Author]'}
                                </div>
                                <div className="model__name">
                                    {name || '[Name]'}
                                </div>
                                <div className="model__date">
                                    {date ? new Intl.DateTimeFormat('en-US', {year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format(new Date(date)) : '[Date]'}
                                </div>
                            </div>
                            {result && (
                                <div className="model__score">
                                    <div className="model__score-value">
                                        {`Score: ${result.score}`}
                                    </div>
                                    <div className="model__score-result">
                                        <button
                                            className="link-btn"
                                            onClick={() => setState({
                                                mode: 'result',
                                                viewResultId: id
                                            })}
                                        >
                                            {'View result'}
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="model__controls">
                                <button
                                    className={classnames('canonical-btn', {
                                        'canonical-btn--selected': id === canonicalId
                                    })}
                                    onClick={() => setState({canonicalId: id})}
                                >
                                    <span>{'Reference'}</span>
                                </button>
                                <button
                                    className="link-btn"
                                    onClick={() => dispatch({
                                        action: {
                                            type: 'removeModel',
                                            id: id
                                        }
                                    })}
                                >
                                    {'Remove'}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Models;
