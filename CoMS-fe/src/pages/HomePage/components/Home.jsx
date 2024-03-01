import '../css/style.css';
import Comments from './Comments';
import GeneralReport from './GeneralReport';
import OfficialCompany from './OfficialCompany';
import RecentActivities from './RecentActivities';
import Schedules from './Schedules';
import WeeklyBest from './WeeklyBest';
import YourContracts from './YourContracts';

function Home() {
    return (
        <div>
            <div className="main">
                <div className="main-body">
                    <div className="main-content">
                        {/* <!-- BEGIN: General Report --> */}
                        <GeneralReport />
                        {/* <!-- END: General Report -->
                        <!-- BEGIN: Sales Report --> */}
                        {/* <div class="col-span-12 lg:col-span-6 mt-8">
                            <div class="intro-y block sm:flex items-center h-10">
                                <h2 class="text-lg font-medium truncate mr-5">
                                    Sales Report
                                </h2>
                                <div class="sm:ml-auto mt-3 sm:mt-0 relative text-slate-500">
                                    <i data-lucide="calendar" class="w-4 h-4 z-10 absolute my-auto inset-y-0 ml-3 left-0"></i>
                                    <input type="text" class="datepicker form-control sm:w-56 box pl-10" />
                                </div>
                            </div>
                            <div class="intro-y box p-5 mt-12 sm:mt-5">
                                <div class="flex flex-col md:flex-row md:items-center">
                                    <div class="flex">
                                        <div>
                                            <div class="text-primary dark:text-slate-300 text-lg xl:text-xl font-medium">$15,000</div>
                                            <div class="mt-0.5 text-slate-500">This Month</div>
                                        </div>
                                        <div class="w-px h-12 border border-r border-dashed border-slate-200 dark:border-darkmode-300 mx-4 xl:mx-5"></div>
                                        <div>
                                            <div class="text-slate-500 text-lg xl:text-xl font-medium">$10,000</div>
                                            <div class="mt-0.5 text-slate-500">Last Month</div>
                                        </div>
                                    </div>
                                    <div class="dropdown md:ml-auto mt-5 md:mt-0">
                                        <button class="dropdown-toggle btn btn-outline-secondary font-normal" aria-expanded="false" data-tw-toggle="dropdown"> Filter by Category <i data-lucide="chevron-down" class="w-4 h-4 ml-2"></i> </button>
                                        <div class="dropdown-menu w-40">
                                            <ul class="dropdown-content overflow-y-auto h-32">
                                                <li><a href="" class="dropdown-item">PC & Laptop</a></li>
                                                <li><a href="" class="dropdown-item">Smartphone</a></li>
                                                <li><a href="" class="dropdown-item">Electronic</a></li>
                                                <li><a href="" class="dropdown-item">Photography</a></li>
                                                <li><a href="" class="dropdown-item">Sport</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="report-chart">
                                    <div class="h-[275px]">
                                        <canvas id="report-line-chart" class="mt-6 -mb-6"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {/* <!-- END: Sales Report -->
                        <!-- BEGIN: Weekly Top Seller --> */}
                        {/* <div class="col-span-12 sm:col-span-6 lg:col-span-3 mt-8">
                            <div class="intro-y flex items-center h-10">
                                <h2 class="text-lg font-medium truncate mr-5">
                                    Weekly Top Seller
                                </h2>
                                <a href="" class="ml-auto text-primary truncate">Show More</a>
                            </div>
                            <div class="intro-y box p-5 mt-5">
                                <div class="mt-3">
                                    <div class="h-[213px]">
                                        <canvas id="report-pie-chart"></canvas>
                                    </div>
                                </div>
                                <div class="w-52 sm:w-auto mx-auto mt-8">
                                    <div class="flex items-center">
                                        <div class="w-2 h-2 bg-primary rounded-full mr-3"></div>
                                        <span class="truncate">17 - 30 Years old</span> <span class="font-medium ml-auto">62%</span>
                                    </div>
                                    <div class="flex items-center mt-4">
                                        <div class="w-2 h-2 bg-pending rounded-full mr-3"></div>
                                        <span class="truncate">31 - 50 Years old</span> <span class="font-medium ml-auto">33%</span>
                                    </div>
                                    <div class="flex items-center mt-4">
                                        <div class="w-2 h-2 bg-warning rounded-full mr-3"></div>
                                        <span class="truncate">= 50 Years old</span> <span class="font-medium ml-auto">10%</span>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {/* <!-- END: Weekly Top Seller -->
                        <!-- BEGIN: Sales Report --> */}
                        {/* <div class="col-span-12 sm:col-span-6 lg:col-span-3 mt-8">
                            <div class="intro-y flex items-center h-10">
                                <h2 class="text-lg font-medium truncate mr-5">
                                    Sales Report
                                </h2>
                                <a href="" class="ml-auto text-primary truncate">Show More</a>
                            </div>
                            <div class="intro-y box p-5 mt-5">
                                <div class="mt-3">
                                    <div class="h-[213px]">
                                        <canvas id="report-donut-chart"></canvas>
                                    </div>
                                </div>
                                <div class="w-52 sm:w-auto mx-auto mt-8">
                                    <div class="flex items-center">
                                        <div class="w-2 h-2 bg-primary rounded-full mr-3"></div>
                                        <span class="truncate">17 - 30 Years old</span> <span class="font-medium ml-auto">62%</span>
                                    </div>
                                    <div class="flex items-center mt-4">
                                        <div class="w-2 h-2 bg-pending rounded-full mr-3"></div>
                                        <span class="truncate">31 - 50 Years old</span> <span class="font-medium ml-auto">33%</span>
                                    </div>
                                    <div class="flex items-center mt-4">
                                        <div class="w-2 h-2 bg-warning rounded-full mr-3"></div>
                                        <span class="truncate"> = 50 Years old</span> <span class="font-medium ml-auto">10%</span>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {/* <!-- END: Sales Report -->
                        <!-- BEGIN: Official Store --> */}
                        {/* <OfficialCompany /> */}
                        {/* <!-- END: Official Store -->
                        <!-- BEGIN: Weekly Best Sellers --> */}
                        {/* <WeeklyBest /> */}
                        {/* <!-- END: Weekly Best Sellers -->
                        <!-- BEGIN: General Report --> */}
                        {/* <div class="col-span-12 grid grid-cols-12 gap-6 mt-8">
                            <div class="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
                                <div class="box p-5 zoom-in">
                                    <div class="flex items-center">
                                        <div class="w-2/4 flex-none">
                                            <div class="text-lg font-medium truncate">Target Sales</div>
                                            <div class="text-slate-500 mt-1">300 Sales</div>
                                        </div>
                                        <div class="flex-none ml-auto relative">
                                            <div class="w-[90px] h-[90px]">
                                                <canvas id="report-donut-chart-1"></canvas>
                                            </div>
                                            <div class="font-medium absolute w-full h-full flex items-center justify-center top-0 left-0">20%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
                                <div class="box p-5 zoom-in">
                                    <div class="flex">
                                        <div class="text-lg font-medium truncate mr-3">Social Media</div>
                                        <div class="py-1 px-2 flex items-center rounded-full text-xs bg-slate-100 dark:bg-darkmode-400 text-slate-500 cursor-pointer ml-auto truncate">320 Followers</div>
                                    </div>
                                    <div class="mt-1">
                                        <div class="h-[58px]">
                                            <canvas class="simple-line-chart-1 -ml-1"></canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
                                <div class="box p-5 zoom-in">
                                    <div class="flex items-center">
                                        <div class="w-2/4 flex-none">
                                            <div class="text-lg font-medium truncate">New Products</div>
                                            <div class="text-slate-500 mt-1">1450 Products</div>
                                        </div>
                                        <div class="flex-none ml-auto relative">
                                            <div class="w-[90px] h-[90px]">
                                                <canvas id="report-donut-chart-2"></canvas>
                                            </div>
                                            <div class="font-medium absolute w-full h-full flex items-center justify-center top-0 left-0">45%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
                                <div class="box p-5 zoom-in">
                                    <div class="flex">
                                        <div class="text-lg font-medium truncate mr-3">Posted Ads</div>
                                        <div class="py-1 px-2 flex items-center rounded-full text-xs bg-slate-100 dark:bg-darkmode-400 text-slate-500 cursor-pointer ml-auto truncate">180 Campaign</div>
                                    </div>
                                    <div class="mt-1">
                                        <div class="h-[58px]">
                                            <canvas class="simple-line-chart-1 -ml-1"></canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {/* <!-- END: General Report -->
                        <!-- BEGIN: Weekly Top Products --> */}
                        <YourContracts />
                        {/* <!-- END: Weekly Top Products --> */}
                    </div>
                </div>
                <div className="side-body">
                    <div className='side-content'>
                        <div className="side-content-body">
                            {/* <!-- BEGIN: Transactions --> */}
                            {/* <div class="col-span-12 md:col-span-6 xl:col-span-4 2xl:col-span-12 mt-3 2xl:mt-8">
                                <div class="intro-x flex items-center h-10">
                                    <h2 class="text-lg font-medium truncate mr-5">
                                        Transactions
                                    </h2>
                                </div>
                                <div class="mt-5">
                                    <div class="intro-x">
                                        <div class="box px-5 py-3 mb-3 flex items-center zoom-in">
                                            <div class="w-10 h-10 flex-none image-fit rounded-full overflow-hidden">
                                                {/* <img alt="Midone - HTML Admin Template" src="dist/images/profile-14.jpg"> 
                                            </div>
                                            <div class="ml-4 mr-auto">
                                                <div class="font-medium">Russell Crowe</div>
                                                <div class="text-slate-500 text-xs mt-0.5">3 June 2020</div>
                                            </div>
                                            <div class="text-success">+$36</div>
                                        </div>
                                    </div>
                                    <div class="intro-x">
                                        <div class="box px-5 py-3 mb-3 flex items-center zoom-in">
                                            <div class="w-10 h-10 flex-none image-fit rounded-full overflow-hidden">
                                                {/* <img alt="Midone - HTML Admin Template" src="dist/images/profile-11.jpg"> 
                                            </div>
                                            <div class="ml-4 mr-auto">
                                                <div class="font-medium">John Travolta</div>
                                                <div class="text-slate-500 text-xs mt-0.5">18 October 2022</div>
                                            </div>
                                            <div class="text-danger">-$179</div>
                                        </div>
                                    </div>
                                    <div class="intro-x">
                                        <div class="box px-5 py-3 mb-3 flex items-center zoom-in">
                                            <div class="w-10 h-10 flex-none image-fit rounded-full overflow-hidden">
                                                {/* <img alt="Midone - HTML Admin Template" src="dist/images/profile-11.jpg"> 
                                            </div>
                                            <div class="ml-4 mr-auto">
                                                <div class="font-medium">Tom Cruise</div>
                                                <div class="text-slate-500 text-xs mt-0.5">5 September 2020</div>
                                            </div>
                                            <div class="text-success">+$32</div>
                                        </div>
                                    </div>
                                    <div class="intro-x">
                                        <div class="box px-5 py-3 mb-3 flex items-center zoom-in">
                                            <div class="w-10 h-10 flex-none image-fit rounded-full overflow-hidden">
                                                {/* <img alt="Midone - HTML Admin Template" src="dist/images/profile-13.jpg"> 
                                            </div>
                                            <div class="ml-4 mr-auto">
                                                <div class="font-medium">Denzel Washington</div>
                                                <div class="text-slate-500 text-xs mt-0.5">21 May 2020</div>
                                            </div>
                                            <div class="text-success">+$36</div>
                                        </div>
                                    </div>
                                    <div class="intro-x">
                                        <div class="box px-5 py-3 mb-3 flex items-center zoom-in">
                                            <div class="w-10 h-10 flex-none image-fit rounded-full overflow-hidden">
                                                {/* <img alt="Midone - HTML Admin Template" src="dist/images/profile-14.jpg"> 
                                            </div>
                                            <div class="ml-4 mr-auto">
                                                <div class="font-medium">Al Pacino</div>
                                                <div class="text-slate-500 text-xs mt-0.5">6 February 2022</div>
                                            </div>
                                            <div class="text-success">+$56</div>
                                        </div>
                                    </div>
                                    <a href="" class="intro-x w-full block text-center rounded-md py-3 border border-dotted border-slate-400 dark:border-darkmode-300 text-slate-500">View More</a>
                                </div>
                            </div> */}
                            {/* <!-- END: Transactions --> */}
                            {/*<!-- BEGIN: Important Notes --> */}
                            <Comments />
                            {/* <!-- END: Important Notes -->*/}
                            {/*<!-- BEGIN: Recent Activities --> */}
                            <RecentActivities />
                            {/* <!-- END: Recent Activities -->*/}
                            
                            {/*<!-- BEGIN: Schedules --> */}
                            {/* <Schedules /> */}
                            {/* <!-- END: Schedules --> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;