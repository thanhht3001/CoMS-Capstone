import React, { useEffect } from "react";
import { Icon } from '@iconify/react';
import "../css/_schedules.css";

function Schedules() {

    useEffect(() => {
    }, []);

    return (
        <div className="schedules">
            <div className="intro-x">
                <h2>
                    Schedules
                </h2>
                <a href=""> <Icon icon="lucide:plus" className="icon" /> Add New Schedules </a>
            </div>
            <div>
                <div className="intro-x">
                    <div>
                        <div>
                            <Icon icon="lucide:chevron-left" className="icon" />
                            <div>April</div>
                            <Icon icon="lucide:chevron-right" className="icon" />
                        </div>
                        <div>
                            <div>Su</div>
                            <div>Mo</div>
                            <div>Tu</div>
                            <div>We</div>
                            <div>Th</div>
                            <div>Fr</div>
                            <div>Sa</div>
                            <div>29</div>
                            <div>30</div>
                            <div>31</div>
                            <div>1</div>
                            <div>2</div>
                            <div>3</div>
                            <div>4</div>
                            <div>5</div>
                            <div className="bg-success/20 dark:bg-success/30">6</div>
                            <div>7</div>
                            <div>8</div>
                            <div>9</div>
                            <div>10</div>
                            <div>11</div>
                            <div>12</div>
                            <div>13</div>
                            <div>14</div>
                            <div>15</div>
                            <div>16</div>
                            <div>17</div>
                            <div>18</div>
                            <div>19</div>
                            <div>20</div>
                            <div>21</div>
                            <div>22</div>
                            <div className="dark:bg-pending/30">23</div>
                            <div>24</div>
                            <div>25</div>
                            <div>26</div>
                            <div className="dark:bg-primary/50">27</div>
                            <div>28</div>
                            <div>29</div>
                            <div>30</div>
                            <div>1</div>
                            <div>2</div>
                            <div>3</div>
                            <div>4</div>
                            <div>5</div>
                            <div>6</div>
                            <div>7</div>
                            <div>8</div>
                            <div>9</div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <div></div>
                            <span>UI/UX Workshop</span> <span class="">23th</span>
                        </div>
                        <div>
                            <div></div>
                            <span>VueJs Frontend Development</span> <span class="font-medium xl:ml-auto">10th</span>
                        </div>
                        <div>
                            <div></div>
                            <span>Laravel Rest API</span> <span class="font-medium xl:ml-auto">31th</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Schedules;