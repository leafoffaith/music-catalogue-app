import { useState, useEffect } from "react"
import { getTopTracks } from "../spotify"
import { catchErrors, getErrors } from '../utils'
import { SectionWrapper, TrackList, TimeRangeButtons } from "../components"

const TopTracks = () => {


    //State
    const [topTracks, setTopTracks] = useState(null);
    const [activeRange, setActiveRange] = useState('short');

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await getTopTracks(`${activeRange}_term`);
            setTopTracks(data);
        };

        //errors
        catchErrors(fetchData());
    }, [activeRange]);

    //active range as dependency


    return (
        <div>
            {/* This is a test to see if top tracks works */}
            <main>
                {/* Main for padding */}
                <SectionWrapper title="Top Tracks" breadcrumb={true}>
                    <TimeRangeButtons
                        activeRange={activeRange}
                        setActiveRange={setActiveRange}
                    />

                    {/* Not sure how this syntax works */}
                    {topTracks && topTracks.items && (
                    <TrackList tracks={topTracks.items} />
                    )}
                </SectionWrapper>
            </main>
        </div>
    )

}

export default TopTracks