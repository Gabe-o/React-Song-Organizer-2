import '../styles/track.css'

function Track(track) {

    // Handles toggleing between collapsed and expanded for each track element 
    const toggleCollapsible = (event) => {
        event.stopPropagation();

        event.currentTarget.parentElement.className.includes("active") ? event.currentTarget.parentElement.className = "collapsible" : event.currentTarget.parentElement.className += " active";
        var content = event.currentTarget.parentElement.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        }
        else {
            content.style.display = "block";
        }
    }

    // Handles search query for youtube to "hopefully" find track
    const openYoutube = async (event) => {
        window.open(`https://www.youtube.com/results?search_query=${track.artistName}+${track.trackTitle}`, '_blank', 'noopener,noreferrer');
    }

    //returns track information
    return (
        <div>
            <button type="button" className="collapsible">
                <ul onClick={openYoutube}>
                    <li id="trackID"><span>{track.trackID}</span></li>
                </ul>
                <ul onClick={toggleCollapsible}>
                    <li id="trackTitle">{track.trackTitle}</li>
                    <li id="artistName">{track.artistName}</li>
                    <li id="trackDuration">{track.trackDuration}</li>
                </ul>
            </button>
            <div className="content">
                <ul>
                    <li id="albumID">Album ID: {track.albumID}</li>
                    <li id="albumName">Album: {track.albumName}</li>
                    <li id="artistID">Artist ID: {track.artistID}</li>
                    <li id="artistName">Artist: {track.artistName}</li>
                    <li id="trackGenres">Genres: {track.trackGenres}</li>
                    <li id="trackTags">Tags: {track.trackTags}</li>
                    <li id="trackDateCreated">Created: {track.trackDateCreated}</li>
                    <li id="trackDateRecorded">Recorded: {track.trackDateRecorded}</li>
                </ul>
            </div>
        </div >
    );
}

export default Track;