import React, { useEffect } from "react";
import "../css/_company-location.css";

function OfficialCompany() {

    useEffect(() => {
    }, []);

    return (
        <div className="official-company-part">
            <div className="intro-y">
                <h2>
                    Official Company
                </h2>
                {/* <div class="sm:ml-auto mt-3 sm:mt-0 relative text-slate-500">
                    <i data-lucide="map-pin" class="w-4 h-4 z-10 absolute my-auto inset-y-0 ml-3 left-0"></i>
                    <input type="text" class="form-control sm:w-56 box pl-10" placeholder="Filter by city" />
                </div> */}
            </div>
            <div className="intro-y box">
                {/* <div>Click the marker to see location details.</div> */}
                <div data-center="-6.2425342, 106.8626478" data-sources="/dist/json/location.json">
                    <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.4396208602957!2d105.81084867499911!3d20.975007689623066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ad8c336813a3%3A0x31df6386d40de20a!2zQ8O0bmcgdHkgY-G7lSBwaOG6p24gSGlTb2Z0IFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1697394176500!5m2!1svi!2s" 
                    className="location" style={{ border: "0" }} allowfullscreen="" loading="lazy" 
                    referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
            </div>
        </div>
    );
}

export default OfficialCompany;