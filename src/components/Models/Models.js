import './Models.css';
import Model from './Model';

function Models({modelsJSON}) {
    return (
        <div className="models">
            {modelsJSON.map((json, i) => (
                <Model key={i} json={json} />
            ))}
        </div>
    );
}

export default Models;
