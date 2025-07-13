import React, { useEffect, useState } from "react";
import AboutView from "../views/AboutView";

const About = () => {
    const [data, setData] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/about")
            .then(res => res.json())
            .then(json => setData(json.message));
    }, []);

    return <AboutView content={data} />;
};

export default About;
