import './Model.css';

function Model({json}) {

    const author = json.info.author;

    return (
        <div className="model">
            <span className="model__author">
                {author && author != "" ? author : "author"}
            </span>
            <div className="model__card"></div>
            <input type="radio" className="model__canonical" name="model"/>
            <label>Canonical</label>
        </div>
    );
}

export default Model;
