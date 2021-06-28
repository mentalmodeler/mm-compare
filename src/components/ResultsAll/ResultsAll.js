import {Fragment, useContext} from 'react';
import {AppContext} from '../App/App';
import Overlay from '../Overlay/Overlay';
import XLSX from 'xlsx';
import './ResultsAll.css';

/* results schema
{
    numNodes,
    numRelationships: numLinks,
    numDrivers: drivers.length,
    numReceivers: receivers.length,
    numOrdinay: ordinay.length,
    density: round(numLinks / getPossibleNumberOfConnections(concepts), precision),
    relationshipsPerNode: numLinks / numNodes,
    complexity: receivers.length > 0 && drivers.length > 0 ? receivers.length / drivers.length: 0,
    drivers,
    driversRanked: rank({concepts, indegree: false}).slice(0, 5),
    receiversRanked: rank({concepts, outdegree: false}).slice(0, 5),
    centralityRanked: rank({concepts}).slice(0, 8),
}
*/

function ResultAll() {
    const {state, setState} = useContext(AppContext);
    const {results, modelsJSON, columnsShown, showConfigureColumns} = state;
    const roundingPlaces = 2;
    const columnsAll = [
        {title: '# Nodes', key: 'numNodes', display: ({numNodes}) => numNodes},
        {title: '# Linkages', key: 'numRelationships', display: ({numRelationships}) => numRelationships},
        {title: '# Drivers', key: 'numDrivers', display: ({numDrivers}) => numDrivers},
        {title: '# Receivers', key: 'numReceivers', display: ({numReceivers}) => numReceivers},
        {title: '# Ordinary', key: 'numOrdinay', display: ({numOrdinary}) => numOrdinary},
        {title: 'Density', key: 'density', display: ({density}) => density.toFixed(roundingPlaces)},
        {title: 'Linkages/Node', key: 'relationshipsPerNode', display: ({relationshipsPerNode}) => relationshipsPerNode.toFixed(roundingPlaces)},
        {
            title: 'Drivers',
            key: 'drivers', 
            display: ({drivers}) => (<ul>{drivers.map(({name}, index) => (<li key={`concept-${index}`}>{name}</li>))}</ul>),
            // display: ({drivers}) => drivers.map(({name}) => name).join(', ')
        },
        {
            title: '8 most central concepts',
            key: 'centralityRanked', 
            display: ({centralityRanked}) => (<ol>{centralityRanked.map(({name, centrality}, index) => (<li key={`concept-${index}`}>{name}<i>{` (${centrality.toFixed(roundingPlaces)})`}</i></li>))}</ol>)
            // display: ({centralityRanked}) => centralityRanked.map(({name, centrality}) => `${name} (${centrality.toFixed(roundingPlaces)})`).join(', ')
        },
        {
            title: 'Top 5 drivers',
            key: 'driversRanked', 
            display: ({driversRanked}) => (<ol>{driversRanked.map(({name, outdegree}, index) => (<li key={`concept-${index}`}>{name}<i>{` (${outdegree.toFixed(roundingPlaces)})`}</i></li>))}</ol>)
            // display: ({driversRanked}) => driversRanked.map(({name, outdegree}) => `${name} (${outdegree.toFixed(roundingPlaces)})`).join(', ')
        },
        {
            title: 'Top 5 receivers',
            key: 'receiversRanked', 
            display: ({receiversRanked}) => (<ol>{receiversRanked.map(({name, indegree}, index) => (<li key={`concept-${index}`}>{name}<i>{` (${indegree.toFixed(roundingPlaces)})`}</i></li>))}</ol>)
            // display: ({receiversRanked}) => receiversRanked.map(({name, indegree}) => `${name} (${indegree.toFixed(roundingPlaces)})`).join(', ')
        },
        {title: <>{'% matching'}<br/>{'components'}</>, key: 'conceptsCorrect', display: ({nodes}) => `${Math.round((nodes.present.length / (nodes.present.length + nodes.missing.length) * 100))}%`},
        {title: <>{'# non-matching'}<br/>{'components'}</>, key: 'conceptsIncorrect', display: ({nodes}) => nodes.extra.length},
        {title: <>{'% matching'}<br/>{'linkages'}</>, key: 'linkagesCorrect', display: ({relationships}) => `${Math.round((relationships.correctlySigned.length / (relationships.incorrectlySigned.length + relationships.incorrectlySigned.length + relationships.missing.length) * 100))}%`},
        {title: <>{'# non-matching'}<br/>{'linkages'}</>, key: 'linkagesIncorrect', display: ({relationships}) => relationships.missing.length + relationships.incorrectlySigned.length},
    ];
    const columns = columnsAll.filter((column) => columnsShown[column.key]);
    
    const exportXLSX = () => {
        const refModel = modelsJSON.find((model) => model.id === state.canonicalId);
        const {info} = refModel || {info: {}};
        const {name} = info;
        const modelName = name && (name !== "" && name !== "Model") ? name : refModel.filename;
        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${('0' + (now.getMonth()+1)).slice(-2)}-${('0' + now.getDate()).slice(-2)}`;
        const filename = `${modelName.replace(/ /g, "_")}_comparison_results_${formattedDate}.xlsx`;
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.table_to_sheet(document.getElementsByClassName('ResultsAll__table')[0]);

        // We can only write out a worksheet name of a max length of 31 characters.
        // So, only take the model name's substring of the first 23 characters (31 - length of ' Results') 
        XLSX.utils.book_append_sheet(workbook, worksheet, `${modelName.substring(0, 23)} Results`);
        XLSX.writeFile(workbook, filename);
    }
    
    return (
        <Overlay className="ResultsAll">
            <button
                className="ResultsAll__configure btn btn-ghost"
                onClick={() => 
                    setState({showConfigureColumns: !showConfigureColumns})
                }
            >
                <span>{'Configure columns'}</span>
            </button>
            {showConfigureColumns && (
                <ul className="ResultsAll__configure-dialog">
                    {columnsAll.map(({key, title}, i) =>
                        <li className="ResultsAll__configure-item" key={`item-${i}`}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={columnsShown[key]}
                                    onChange={() => 
                                        setState({
                                            columnsShown: {
                                                ...columnsShown,
                                                [key]: !columnsShown[key]
                                            }
                                        })
                                    }
                                />
                                {title}
                            </label>
                        </li>    
                    )}
                </ul>
            )}
            <button className="ResultsAll__export-xlsx btn btn-ghost" onClick={exportXLSX}>
                <span>{'Export to xlsx'}</span>
            </button>
            <table className="ResultsAll__table">
                <tbody className="ResultsAll__table-body">
                    {Object.keys(results).map((id, index) => {
                        const model = modelsJSON.find((model) => model.id === id);
                        const author = (model && model.info && model.info.author) || id;
                        
                        return (
                            <Fragment key={`result-${index}`}>
                                <tr className="ResultsAll__table-head">
                                    <th/>
                                    {columns.map(({title}, index) => (
                                        <th key={`th-${index}`}>{title}</th>
                                    ))}
                                </tr>
                                <tr>
                                    <th className="th-author">{author}</th>
                                    {columns.map(({display}, index) => (
                                        <td key={`td-${id}-${index}`}>{display(results[id])}</td>
                                    ))}
                                </tr>
                            </Fragment>
                        )
                    })}
                </tbody>
            </table>
        </Overlay>
    );
}

export default ResultAll;
