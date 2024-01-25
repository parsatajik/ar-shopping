import React from "react";

const Sidebar = () => {
  return (
    <>
      <div className="lg:hidden flex justify-end p-2">
        <button
          type="button"
          className="p-2 inline-flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-gray-700 dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          data-hs-overlay="#sidebar-mini"
          aria-controls="sidebar-mini"
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Toggle Navigation</span>
          <svg
            className="flex-shrink-0 w-4 h-4"
            width="16"
            height="16"
            fill="black"
            viewBox="0 0 16 16"
          > 
            <path
              fillRule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
            />
          </svg>
        </button>
      </div>
      <div
        id="sidebar-mini"
        className="hs-overlay hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 start-0 bottom-0 z-[60] w-20 bg-white border-e border-gray-200 lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500 dark:bg-gray-800 dark:border-gray-700"
      >
        <div className="flex flex-col justify-center items-center gap-y-2 py-4">
          <div className="mb-4">
            <a className="flex-none" href="/">
              <svg
                width="35"
                height="35"
                viewBox="0 0 175 129"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_2525_341)">
                  <path
                    d="M28.5299 125.9C21.2699 114.84 17.0399 101.64 17.0399 87.4498C17.0399 48.6898 48.5699 17.1598 87.3299 17.1598C126.09 17.1598 157.62 48.6898 157.62 87.4498C157.62 101.63 153.38 114.84 146.13 125.9H165.81C171.52 114.29 174.74 101.24 174.74 87.4498C174.74 39.2498 135.53 0.0498047 87.3399 0.0498047C39.1499 0.0498047 -0.0600586 39.2598 -0.0600586 87.4498C-0.0600586 101.24 3.15994 114.29 8.86994 125.9H28.5299Z"
                    fill="#4A4AF4"
                  />
                  <path
                    d="M88.5098 45.9199C75.7098 45.9199 60.9798 51.9499 52.9798 58.3299L60.2798 73.6999C66.6898 67.8299 77.0598 62.8199 86.4098 62.8199C95.2998 62.8199 100.2 65.7899 100.2 71.7799C100.2 75.8099 96.9398 78.0799 90.7998 78.6399C67.7398 80.7599 49.8198 87.9599 49.8198 105.66C49.8198 119.7 59.9398 128.18 76.5898 128.18C87.7298 128.18 96.4798 121.99 101.2 113.82V125.89H121.96V75.2999C121.97 54.4099 107.44 45.9199 88.5098 45.9199ZM82.4498 111.96C75.7198 111.96 72.0298 109.08 72.0298 104.35C72.0298 94.4899 84.0798 92.1099 99.7698 92.1099C99.7698 102.43 92.8598 111.96 82.4498 111.96Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2525_341">
                    <rect width="174.82" height="128.16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </a>
          </div>
          <div className="hs-tooltip inline-block [--placement:right]">
            <button
              type="button"
              onClick={() => (window.location.pathname = "/")}
              className="hs-tooltip-toggle w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            >
              <svg
                className="flex-shrink-0 w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span
                className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap dark:bg-neutral-700"
                role="tooltip"
              >
                Home
              </span>
            </button>
          </div>

          <div className="hs-tooltip inline-block [--placement:right]">
            <button
              type="button"
              onClick={() => (window.location.pathname = "/about-us")}
              className="hs-tooltip-toggle w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            >
              <svg
                className="flex-shrink-0 w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span
                className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap dark:bg-neutral-700"
                role="tooltip"
              >
                Users
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
