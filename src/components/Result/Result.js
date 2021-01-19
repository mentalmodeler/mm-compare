import {Fragment, useContext} from 'react';
import {AppContext} from '../App/App';
import {getMargin} from '../../utils';
import Overlay from '../Overlay/Overlay';
import './Result.css';

const Concept = ({name}) => <div className="result__concept">{name}</div>
const Linkage = ({fromNode, toNode, relationship}) => {
    let sign = 'affects'
    if (relationship.influence !== '0') {
        sign = relationship.influence > 0
            ? 'increases'
            : 'decreases';
    }
    return <div className="result__linkage">
        {fromNode.name || '[Missing fromNode]'}
        <div className="result__linkage-sign">
            <svg focusable="false" data-id="SVG_ARROW_RIGHT__24" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12" stroke="#fff"/></g></svg>
            <span>{sign}</span>
            <svg focusable="false" data-id="SVG_ARROW_RIGHT__24" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round"><path d="M15.7 7l5 5-5 5M20.8 12H3.2"></path></g></svg>
        </div>
        {toNode.name || '[Missing toNode]'}
    </div>
};

const getPointsTitle = (title, collection, affect) => 
    collection.length > 0
        ? <Fragment><span>{title}</span><span className="results__points-line-item">{`${affect}${collection.length} point${collection.length > 1 ? 's' : ''}`}</span></Fragment>
        : title;

function Result() {
    const {state, setState} = useContext(AppContext);
    const {results, modelsJSON, viewResultId} = state;
    const model = modelsJSON.find((model) => model.id === viewResultId);
    const result = results[viewResultId];
    const {score, nodes, relationships} = result;
    const {extra: extraNodes, missing: missingNodes, present: presentNodes} = nodes;
    const {extra: extraRelationships, missing: missingRelationships, incorrectlySigned: incorrectlySignedRelationships, correctlySigned: correctlySignedRelationships} = relationships;
    const {info,} = model || {info: {}};
    const {author, date, name} = info;
    const relationshipCollections = [
        {title: getPointsTitle(`Missing (${missingRelationships.length})`, missingRelationships, '-'), collection: missingRelationships},
        {title: getPointsTitle(`Extra (${extraRelationships.length})`, extraRelationships, '-'), collection: extraRelationships},
        {title: `Incorrectly signed (${incorrectlySignedRelationships.length})`, collection: incorrectlySignedRelationships},
        {title: getPointsTitle(`Correctly signed (${correctlySignedRelationships.length})`, correctlySignedRelationships, '+'), collection: correctlySignedRelationships},
    ];
    const nodeCollections = [
        {title: `Missing (${missingNodes.length})`, collection: missingNodes},
        {title: `Extra (${extraNodes.length})`, collection: extraNodes},
        {title: `Present (${presentNodes.length})`, collection: presentNodes},
    ];
    
    return (
        <Overlay>    
            <div style={getMargin(null, 12)} className="result__author weight-300 h3 capitalize">{author || '[Author]'}</div>
            <div className="result__name weight-500 capitalize">{name || '[Name]'}</div>
            <div style={getMargin(null, 12)} className="result__date italic">{date ? new Intl.DateTimeFormat('en-US', {year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format(new Date(date)) : '[Date]'}</div>
            <div style={getMargin(null, 32)} className="font-blue h2 italic weight-300">{`SCORE: ${score}`}</div>
            <div className="result__category uppercase weight-600 font-blue h3">{'LINKAGES'}</div>
            {relationshipCollections.map(({title, collection}, i) => (
                <Fragment key={`collection-${i}`}>
                    <div className="result__group-title weight-300">{title}</div>
                    <div className="result__linkages">
                        {collection.map((data, i) => <Linkage {...data} key={`linkage-${i}`}/>)}
                    </div>
                </Fragment>
            ))}
            <div className="result__category uppercase weight-600 font-blue h3">{'Concepts'}</div>
            {nodeCollections.map(({title, collection}, i) => (
                <Fragment key={`collection-${i}`}>
                    <div className="result__group-title weight-300">{title}</div>
                    <div className="result__concepts">
                        {collection.map(({name, id}, i) => <Concept name={name} key={`linkage-${i}`}/>)}
                    </div>
                </Fragment>
            ))}
        </Overlay>
    );
}

export default Result;
