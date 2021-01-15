import {useContext} from 'react';
import {AppContext} from '../App/App';
import {getMargin} from '../../utils';

import './Result.css';

const Concept = ({name}) => <div className="result__concept">{name}</div>

function Result() {
    const {state, setState} = useContext(AppContext);
    const {results, modelsJSON, viewResultId} = state;
    const model = modelsJSON.find((model) => model.id === viewResultId);
    const result = results[viewResultId];
    console.log('result:', result);
    const {score, nodes, relationships} = result;
    const {info,} = model || {info: {}};
    const {author, date, name} = info;
    const sectionSpacer = 22;
    return (
        <div className="result-wrapper" onClick={() => setState({mode: 'files'})}>
            <div className="result-bg"/>
            <div className="result-body">
                <div className="result-content">
                    <div style={getMargin(null, 12)} className="result__author weight-300 h3 capitalize">{author || '[Author]'}</div>
                    <div className="result__name weight-500 capitalize">{name || '[Name]'}</div>
                    <div style={getMargin(null, 12)}className="result__date italic">{date ? new Intl.DateTimeFormat('en-US', {year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format(new Date(date)) : '[Date]'}</div>
                    <div style={getMargin(null, 32)} className="result__author weight-500">{`Score: ${score}`}</div>
                    <div style={getMargin(null, 12)} className="result__date uppercase weight-600 font-gray h3">{'LINKAGES'}</div>
                    <div style={getMargin(null, 8)} className="result__date weight-300 h4">{'Missing'}</div>
                    <div style={getMargin(null, 12)} className="result__concepts">
                        {nodes.missing.map(({name, id}) => <Concept name={name} />)}
                    </div>
                    <div style={getMargin(null, 12)} className="result__date uppercase weight-600 font-gray h3">{'Concepts'}</div>
                    <div style={getMargin(null, 8)} className="result__date weight-300 h4">{'Missing'}</div>
                    <div style={getMargin(null, 12)} className="result__concepts">
                        {nodes.missing.map(({name, id}) => <Concept name={name} />)}
                    </div>
                    <div style={getMargin(null, 8)} className="result__date weight-300 h4">{'Extra'}</div>
                    <div style={getMargin(null, 12)} className="result__concepts">
                        {nodes.extra.map(({name, id}) => <Concept name={name} />)}
                    </div>
                    <div style={getMargin(null, 8)} className="result__date weight-300 h4">{'Present'}</div>
                    <div style={getMargin(null, 12)} className="result__concepts">
                        {nodes.present.map(({name, id}) => <Concept name={name} />)}
                    </div>
                    
                </div>
            </div>
        </div>
    );
}

export default Result;
