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
    const {state} = useContext(AppContext);
    const {results, modelsJSON} = state;
    const roundingPlaces = 2;
    const columns = [
        {title: '# Nodes', display: ({numNodes}) => numNodes},
        {title: '# Linkages', display: ({numRelationships}) => numRelationships},
        {title: '# Drivers', display: ({numDrivers}) => numDrivers},
        {title: '# Receivers', display: ({numReceivers}) => numReceivers},
        {title: '# Ordinay', display: ({numOrdinay}) => numOrdinay},
        {title: 'Density', display: ({density}) => density.toFixed(roundingPlaces)},
        {title: 'Linkages/Node', display: ({relationshipsPerNode}) => relationshipsPerNode.toFixed(roundingPlaces)},
        {
            title: 'Drivers',
            display: ({drivers}) => (<ul>{drivers.map(({name}, index) => (<li key={`concept-${index}`}>{name}</li>))}</ul>),
            // display: ({drivers}) => drivers.map(({name}) => name).join(', ')
        },
        {
            title: '8 most central concepts',
            display: ({centralityRanked}) => (<ol>{centralityRanked.map(({name, centrality}, index) => (<li key={`concept-${index}`}>{name}<i>{` (${centrality.toFixed(roundingPlaces)})`}</i></li>))}</ol>)
            // display: ({centralityRanked}) => centralityRanked.map(({name, centrality}) => `${name} (${centrality.toFixed(roundingPlaces)})`).join(', ')
        },
        {
            title: 'Top 5 drivers',
            display: ({driversRanked}) => (<ol>{driversRanked.map(({name, outdegree}, index) => (<li key={`concept-${index}`}>{name}<i>{` (${outdegree.toFixed(roundingPlaces)})`}</i></li>))}</ol>)
            // display: ({driversRanked}) => driversRanked.map(({name, outdegree}) => `${name} (${outdegree.toFixed(roundingPlaces)})`).join(', ')
        },
        {
            title: 'Top 5 receivers',
            display: ({receiversRanked}) => (<ol>{receiversRanked.map(({name, indegree}, index) => (<li key={`concept-${index}`}>{name}<i>{` (${indegree.toFixed(roundingPlaces)})`}</i></li>))}</ol>)
            // display: ({receiversRanked}) => receiversRanked.map(({name, indegree}) => `${name} (${indegree.toFixed(roundingPlaces)})`).join(', ')
        },
        {title: '% correct concepts', display: () => '% correct concepts'},
        {title: '% incorrect concepts', display: () => '% incorrect concepts'},
        {title: '% correct linkages', display: () => '% correct linkages'},
        {title: '% incorrect linkages', display: () => '% incorrect linkages'},
    ];

    const exportXLSX = () => {
        const now = new Date();
        const formatted_date = `${now.getFullYear()}-${('0' + (now.getMonth()+1)).slice(-2)}-${('0' + now.getDate()).slice(-2)}`;
        const filename = `mm_comparison_results_${formatted_date}.xlsx`;
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.table_to_sheet(document.getElementsByClassName('ResultsAll__table')[0]);

        XLSX.utils.book_append_sheet(workbook, worksheet, `${formatted_date} Comparison Results`);
        XLSX.writeFile(workbook, filename);
    }

    return (
        <Overlay className="ResultsAll">
            <button className="ResultsAll__export-xlsx btn btn-ghost" onClick={exportXLSX}>
                <span>{'Export to xlsx'}</span>
            </button>
            <table className="ResultsAll__table">
                {/* <thead className="ResultsAll__table-head">
                    <tr>
                        <th></th>
                        {columns.map(({title}, index) => (
                            <th key={`th-${index}`}>{title}</th>
                        ))}
                    </tr>
                </thead> */}
                <tbody className="ResultsAll__table-body">
                    {Object.keys(results).map((id) => {
                        const model = modelsJSON.find((model) => model.id === id);
                        const author = (model && model.info && model.info.author) || id;
                        return (
                            <Fragment>
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
