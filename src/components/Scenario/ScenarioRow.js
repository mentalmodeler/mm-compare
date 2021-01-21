import {useContext} from 'react';
import {AppContext} from '../App/App';
import {getDataId, getConcept} from '../../utils';
import './Scenario.css';

function ScenarioRow({concept, index}) {
    const {dispatch} = useContext(AppContext);
    let {name, id, selected, influence, expectedChange, points} = concept;
    // name = index % 2 === 0 ? `${name} ${name} ${name} ${name} ${name} ${name}` : name;
    const hasInfluence = parseInt(influence, 10) !== 0;
    const useDisableTextStyle = hasInfluence || !selected;
    
    const dispatchChange = (concept) => dispatch({action: {type: 'updateScenario', id, concept}});
    const changeSelected = (e) => dispatchChange({...concept, selected: !selected});
    const changeAdjustment = (e) => dispatchChange({...concept, influence: e.target.value});
    const pointsChange = (e) => dispatchChange({...concept, points: e.target.value});
    const pointsKeyDown = (e) => !['-', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key) && e.preventDefault();
    const pointsBlur = (e) => {
        let value = parseInt(e.target.value, 10);
        if (isNaN(value)) {
            value = 0;
        }
        if (value !== points) {
            dispatchChange({...concept, points: value});
        }        
    }
    
    return (
        <div
            className={`Scenario__row${useDisableTextStyle ? ' Scenario__row--disabled-text' : ''}`}
            key={`scenario-row-${index}`}
        >
            <div className="Scenario__col Scenario__col--include no-padding">
                {!hasInfluence && (
                    <label className="Scenario__include-label">
                        <button
                            className={`Scenario__include-checkbox${selected ? ' Scenario__include-checkbox--selected': ''}`}
                            id={`scenario-selected-${id}`}
                            onClick={changeSelected}
                        />
                    </label>
                )}
            </div>
            <div className="Scenario__col Scenario__col--component">{name}</div>
            <div className="Scenario__col Scenario__col--adjust no-padding">
                {selected && !points && (
                    <select
                        value={influence}
                        className="Scenario__select"
                        id={`scenario-adjust-${id}`}
                        onChange={changeAdjustment}
                    >
                        <option value="1">{'+'}</option>
                        <option value="0">{''}</option>
                        <option value="-1">{'–'}</option>
                    </select>
                )}
            </div>
            <div className="Scenario__col Scenario__col--points">
                {selected && !hasInfluence && (
                    <input 
                        type="text" 
                        className="Scenario__input-points input"
                        id={`scenario-points-${id}`}
                        value={points}
                        onKeyDown={pointsKeyDown}
                        onChange={pointsChange}
                        onBlur={pointsBlur}
                    />
                )}
            </div>
        </div>
    );
}

export default ScenarioRow;
