import {useContext} from 'react';
import {AppContext} from '../App/App';
import Overlay from '../Overlay/Overlay';
import ScenarioRow from './ScenarioRow';
import './Scenario.css';

function Scenario() {
    const {state} = useContext(AppContext);
    const {scenario} = state
    const {concepts} = scenario || {concepts: []};
    
    return (
        <Overlay>    
            <div className="Scenario__title h2 weight-300">{'Scenario'}</div>
            <div className="Scenario__rows">
                <div className="Scenario__row Scenario__row--header">
                    <div className="Scenario__col Scenario__col--include"></div>
                    <div className="Scenario__col Scenario__col--component">{'Concept'}</div>
                    <div className="Scenario__col Scenario__col--adjust">{'+ / –'}</div>
                    <div className="Scenario__col Scenario__col--points">{'Points'}</div>
                </div>
                {concepts.map((concept, index) => (
                    <ScenarioRow concept={concept} index={index} key={`scenario-row-${index}`}/>
                ))}
            </div>
        </Overlay>
    );
}

export default Scenario;
