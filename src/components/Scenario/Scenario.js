import {Fragment, useContext} from 'react';
import {AppContext} from '../App/App';
import {getMargin, getDataId, getConcept} from '../../utils';
import Overlay from '../Overlay/Overlay';
import './Scenario.css';

function Scenario() {
    const {state, dispatch} = useContext(AppContext);
    const {scenario} = state
    const {concepts} = scenario || {concepts: []};
    const dispatchChange = (id, concept) => dispatch({
        action: {
            type: 'updateScenario',
            id,
            concept,
        },
    });
    const changeSelected = (e) => {
        const id = getDataId(e);
        dispatchChange(
            id,
            {
                ...getConcept(id, concepts),
                selected: e.target.checked
            },
        );
    }
    const changeAdjustment = (e) => {
        const id = getDataId(e);
        dispatchChange(
            id,
            {
                ...getConcept(id, concepts),
                influence: e.target.value
            },
        );
    }
    const changeExpectedChange = (e) => {
        const id = getDataId(e);
        dispatchChange(
            id,
            {
                ...getConcept(id, concepts),
                expectedChange: e.target.value
            },
        );
    }
    const changePoints = (e) => {
        
    }
    const pointsKeyDown = (e) => {
        
    }
    return (
        <Overlay>    
            <div className="Scenario__title h2 weight-300">{'Scenario'}</div>
            <div className="Scenario__rows">
                <div className="Scenario__row Scenario__row--header">
                    <div className="Scenario__col Scenario__col--include"></div>
                    <div className="Scenario__col Scenario__col--component">{'Concept'}</div>
                    <div className="Scenario__col Scenario__col--adjust">{'+ / –'}</div>
                    <div className="Scenario__col Scenario__col--expected-change">{'Expected change'}</div>
                    <div className="Scenario__col Scenario__col--points">{'Points'}</div>
                </div>
                {scenario.concepts.map(({name, id, selected, influence, expectedChange, points}, index) => {
                    name = index % 2 === 0
                        ? `${name} ${name} ${name} ${name} ${name} ${name}`
                        : name;
                    const changeExpected = parseInt(expectedChange, 10) !== 0;
                    const hasInfluence = parseInt(influence, 10) !== 0;
                    const useDisableTextStyle = hasInfluence || !selected;
                    console.log('hasInfluence:', hasInfluence);
                    return (
                        <div
                            className={`Scenario__row${useDisableTextStyle ? ' Scenario__row--disabled-text' : ''}`}
                            key={`scenario-row-${index}`}
                        >
                            <div className="Scenario__col Scenario__col--include no-padding">
                                {!hasInfluence && (
                                    <label className="Scenario__include-label">
                                        <input
                                            type="checkbox"
                                            id={`scenario-selected-${id}`}
                                            data-id={id}
                                            checked={selected}
                                            onChange={changeSelected}
                                        />
                                    </label>
                                )}
                            </div>
                            <div className="Scenario__col Scenario__col--component">{name}</div>
                            <div className="Scenario__col Scenario__col--adjust no-padding">
                                {selected && !changeExpected && (
                                    <select
                                        value={influence}
                                        className="Scenario__select"
                                        id={`scenario-adjust-${id}`}
                                        data-id={id}
                                        onChange={changeAdjustment}
                                    >
                                        <option value="1">{'+'}</option>
                                        <option value="0">{''}</option>
                                        <option value="-1">{'–'}</option>
                                    </select>
                                )}
                            </div>
                            <div className="Scenario__col Scenario__col--expected-change no-padding">
                                {selected && !hasInfluence && (
                                    <select
                                        value={expectedChange}
                                        className="Scenario__select"
                                        id={`scenario-expect-change-${id}`}
                                        data-id={id}
                                        onChange={changeExpectedChange}
                                    >
                                        <option value="1">{'Increase'}</option>
                                        <option value="0">{''}</option>
                                        <option value="-1">{'Decrease'}</option>
                                    </select>
                                )}
                            </div>
                            <div className="Scenario__col Scenario__col--points">
                                {selected && !hasInfluence && (
                                    <input 
                                        type="text" 
                                        className="Scenario__input-points input"
                                        placeholder={changeExpected ? 'Enter points' : ''}
                                        id={`scenario-points-${id}`}
                                        data-id={id}
                                        value={changeExpected ? points : ''}
                                        disabled={!changeExpected}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Overlay>
    );
}

export default Scenario;
