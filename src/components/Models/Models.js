import './Models.css';
import {useContext} from 'react';
import {AppContext} from '../App/App';

function Models() {
    const {state, setState, dispatch} = useContext(AppContext);
    return (
        <div className="models">
            {state.modelsJSON.map((json, i) => (
                <div className="model">
                    <span className="model__author">
                        {json.info.author || "author"}
                    </span>
                    <div className="model__card"></div>
                    <label>
                        <input
                            type="radio"
                            className="model__canonical"
                            name="model"
                            onChange={() => setState({canonical: json.id})}
                        />
                        Canonical
                    </label>
                    <button
                        onClick={() => dispatch({
                            action: {
                                type: 'removeModel',
                                id: json.id
                            }
                        })}
                    >
                        {'Remove'}
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Models;
